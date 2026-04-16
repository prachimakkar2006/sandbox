const express = require('express');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const BASE_SOURCE_QUESTIONS = require('../data/sourceQuestions');
const EXTRA_STREAM_CONTENT = require('../data/streamContent');

const router = express.Router();
const SOURCE_QUESTIONS = { ...BASE_SOURCE_QUESTIONS, ...EXTRA_STREAM_CONTENT.questions };

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY || 'missing-groq-key' });
const xaiClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY || '',
  baseURL: 'https://api.x.ai/v1',
});

const DAILY_FALLBACKS = {
  DSA: {
    question: 'Which data structure is the best fit for implementing browser back and forward navigation efficiently?',
    type: 'mcq',
    options: ['Queue', 'Stack', 'Heap', 'Trie'],
    correct: 'Stack',
    explanation: 'Stacks support last-in-first-out behavior, which matches undo and backtracking flows.',
  },
  'AI/ML': {
    question: 'A model performs extremely well on training data but poorly on unseen data. What is the most likely issue?',
    type: 'mcq',
    options: ['Underfitting', 'Overfitting', 'Label encoding', 'Feature scaling'],
    correct: 'Overfitting',
    explanation: 'Overfitting happens when a model memorizes training patterns and fails to generalize.',
  },
  'Web Dev': {
    question: 'A React page becomes slow when rendering a list of 2,000 items. What is the most effective first improvement?',
    type: 'mcq',
    options: ['Add more CSS classes', 'Use list virtualization', 'Increase image sizes', 'Disable caching'],
    correct: 'Use list virtualization',
    explanation: 'Virtualization renders only visible rows, cutting DOM work dramatically.',
  },
  'CS Fundamentals': {
    question: 'Which property of a database transaction guarantees that either all operations complete or none of them do?',
    type: 'mcq',
    options: ['Consistency', 'Durability', 'Atomicity', 'Isolation'],
    correct: 'Atomicity',
    explanation: 'Atomicity ensures all-or-nothing execution for a transaction.',
  },
  'Design Thinking': {
    question: 'A student app has high drop-off on the onboarding screen. What should the product team do first?',
    type: 'scenario',
    correct: 'Interview users to understand friction points before redesigning',
    explanation: 'Design thinking starts with empathy and evidence before solutioning.',
  },
  Business: {
    question: 'A startup has strong user growth but weak revenue. What metric should the founder examine first to improve monetization quality?',
    type: 'short-text',
    correct: 'conversion rate',
    explanation: 'Conversion rate shows how effectively active users are becoming paying customers.',
  },
  Wildcard: {
    question: 'A teammate says, "We should ship the AI feature now and fix mistakes later." What is the strongest response?',
    type: 'scenario',
    correct: 'Ship only after defining guardrails, validation, and a rollback plan',
    explanation: 'Responsible shipping balances speed with trust, safety, and reversibility.',
  },
};

const cache = {
  byKey: new Map(),
};

function getTodayRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function getTodayKey(now = new Date()) {
  const { start } = getTodayRange(now);
  return start.toISOString().slice(0, 10);
}

function getChallengeTrack(student) {
  return student?.subdomain || student?.stream || student?.domain || 'Wildcard';
}

function getFallbackTrack(track) {
  if (DAILY_FALLBACKS[track]) return track;
  if (SOURCE_QUESTIONS[track]?.length) return track;
  return 'Wildcard';
}

function extractJsonCandidate(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const objectStart = trimmed.indexOf('{');
  const objectEnd = trimmed.lastIndexOf('}');
  if (objectStart !== -1 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }

  return trimmed;
}

function safeJsonParse(text) {
  const candidate = extractJsonCandidate(text);
  if (!candidate) throw new Error('No JSON candidate found');
  return JSON.parse(candidate);
}

function normalizeChallengeType(type) {
  const normalized = String(type || '').trim().toLowerCase();
  if (['mcq', 'scenario', 'code-fix', 'short-text'].includes(normalized)) return normalized;
  if (normalized === 'code' || normalized === 'codefix') return 'code-fix';
  if (normalized === 'short' || normalized === 'text') return 'short-text';
  return 'mcq';
}

function normalizeGeneratedChallenge(raw, domain, fallback) {
  const type = normalizeChallengeType(raw?.type || fallback.type);
  const question = typeof raw?.question === 'string' && raw.question.trim()
    ? raw.question.trim()
    : fallback.question;
  const explanation = typeof raw?.explanation === 'string' && raw.explanation.trim()
    ? raw.explanation.trim()
    : fallback.explanation;

  const normalized = {
    domain,
    question,
    type,
    explanation,
    generatedAt: new Date(),
  };

  if (type === 'mcq') {
    const options = Array.isArray(raw?.options)
      ? raw.options.filter((option) => typeof option === 'string' && option.trim()).slice(0, 4)
      : [];
    const safeOptions = options.length === 4 ? options : fallback.options;
    const safeCorrect = typeof raw?.correct === 'string' && raw.correct.trim()
      ? raw.correct.trim()
      : fallback.correct;

    normalized.options = safeOptions;
    normalized.correct = safeCorrect;
    return normalized;
  }

  normalized.correct = typeof raw?.correct === 'string' && raw.correct.trim()
    ? raw.correct.trim()
    : fallback.correct;

  return normalized;
}

function buildStaticChallenge(track, now = new Date()) {
  const fallbackTrack = getFallbackTrack(track);
  const sourcePool = SOURCE_QUESTIONS[track] || SOURCE_QUESTIONS[fallbackTrack] || [];
  const fallback = DAILY_FALLBACKS[track] || DAILY_FALLBACKS[fallbackTrack] || DAILY_FALLBACKS.Wildcard;

  if (!sourcePool.length) {
    return normalizeGeneratedChallenge(fallback, track, fallback);
  }

  const keySeed = `${getTodayKey(now)}:${track}`;
  const index = [...keySeed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % sourcePool.length;
  const item = sourcePool[index];

  return normalizeGeneratedChallenge({
    question: item.question,
    type: 'mcq',
    options: item.options,
    correct: item.options?.[item.correct] ?? item.correct,
    explanation: item.explanation,
  }, track, fallback);
}

async function generateWithAI(track) {
  const prompt = `Generate 1 daily challenge question for eraAI students.
Today's domain: ${track}
Question type: randomly pick one from MCQ, scenario, code-fix, short-text
Difficulty: Medium

Rules:
- Keep it answerable in under 2 minutes.
- Make it specifically relevant to ${track} students.
- For MCQ, provide exactly 4 options.
- For non-MCQ, keep "correct" as a concise canonical answer or a pipe-separated list of accepted keywords.
- "question" may include a short code snippet when the type is code-fix.

Format response as strict JSON only:
{
  "question": "...",
  "type": "mcq" | "scenario" | "code-fix" | "short-text",
  "options": ["A", "B", "C", "D"],
  "correct": "A",
  "explanation": "..."
}
No preamble. No markdown. JSON only.`;

  if (process.env.XAI_API_KEY && !process.env.XAI_API_KEY.startsWith('xai-placeholder')) {
    const completion = await xaiClient.chat.completions.create({
      model: 'grok-3-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 700,
    });
    return completion.choices[0].message.content;
  }

  if (process.env.GROQ_API_KEY) {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 700,
    });
    return completion.choices[0].message.content;
  }

  throw new Error('No AI provider configured');
}

async function getDailyChallenge(track) {
  const now = new Date();
  const key = `${getTodayKey(now)}:${track}`;
  if (cache.byKey.has(key)) {
    return cache.byKey.get(key);
  }

  const fallback = buildStaticChallenge(track, now);
  let challenge = fallback;

  try {
    const aiText = await generateWithAI(track);
    const parsed = safeJsonParse(aiText);
    challenge = normalizeGeneratedChallenge(parsed, track, fallback);
  } catch (error) {
    console.error('Daily challenge generation failed, using fallback:', error.message);
  }

  challenge.generatedAt = challenge.generatedAt || now;
  cache.byKey.set(key, challenge);
  return challenge;
}

function normalizeAnswer(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s+#.-]/g, '');
}

function isCorrectAnswer(challenge, answer) {
  const submitted = normalizeAnswer(answer);
  if (!submitted) return false;

  if (challenge.type === 'mcq') {
    const accepted = [
      challenge.correct,
      ...((challenge.options || []).filter(Boolean)),
    ]
      .map((option, index) => {
        const label = String.fromCharCode(65 + index);
        return [normalizeAnswer(option), normalizeAnswer(label), normalizeAnswer(`${index}`)];
      })
      .flat();

    return accepted.includes(submitted) && (
      submitted === normalizeAnswer(challenge.correct) ||
      challenge.options.some((option, index) => {
        const isTarget =
          normalizeAnswer(option) === normalizeAnswer(challenge.correct) ||
          normalizeAnswer(String.fromCharCode(65 + index)) === normalizeAnswer(challenge.correct) ||
          normalizeAnswer(`${index}`) === normalizeAnswer(challenge.correct);
        return isTarget && accepted.includes(submitted);
      })
    );
  }

  const acceptedTokens = String(challenge.correct || '')
    .split('|')
    .map((item) => normalizeAnswer(item))
    .filter(Boolean);

  return acceptedTokens.some((token) => submitted === token || submitted.includes(token));
}

function getXpReward(challenge) {
  if (challenge.type === 'mcq') return 40;
  if (challenge.type === 'code-fix') return 60;
  return 50;
}

function getBadgeProgress(streak) {
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak + 7;
  const nextLabel = nextMilestone === 7 ? 'Week Warrior' : 'Streak Master';
  return {
    nextLabel,
    remaining: Math.max(nextMilestone - streak, 0),
  };
}

function toPublicChallengePayload(challenge) {
  const expiresAt = new Date(new Date(challenge.generatedAt || Date.now()).getTime() + (24 * 60 * 60 * 1000));
  return {
    domain: challenge.domain,
    question: challenge.question,
    type: challenge.type,
    options: challenge.type === 'mcq' ? challenge.options : undefined,
    explanation: undefined,
    expiresAt,
  };
}

router.get('/', protect, async (req, res) => {
  try {
    const now = new Date();
    const { start, end } = getTodayRange(now);
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const solvedToday = student.lastChallengeDate && student.lastChallengeDate >= start && student.lastChallengeDate < end;
    if (student.dailyChallengeSolvedToday !== solvedToday) {
      student.dailyChallengeSolvedToday = solvedToday;
      await student.save();
    }

    if (solvedToday) {
      return res.json({ alreadySolved: true });
    }

    const track = getChallengeTrack(student);
    const challenge = await getDailyChallenge(track);
    const solvedCount = await Student.countDocuments({
      lastChallengeDate: { $gte: start, $lt: end },
    });

    res.json({
      alreadySolved: false,
      streak: student.streak || student.jsstreak || 0,
      solverCount: solvedCount,
      ...toPublicChallengePayload(challenge),
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({ message: 'Failed to load daily challenge' });
  }
});

router.post('/submit', protect, async (req, res) => {
  try {
    const { answer } = req.body;
    const now = new Date();
    const { start, end } = getTodayRange(now);
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.lastChallengeDate && student.lastChallengeDate >= start && student.lastChallengeDate < end) {
      return res.status(400).json({ message: 'Daily challenge already solved today' });
    }

    const track = getChallengeTrack(student);
    const challenge = await getDailyChallenge(track);
    const correct = isCorrectAnswer(challenge, answer);

    if (!correct) {
      return res.status(200).json({
        correct: false,
        explanation: challenge.explanation,
        message: 'Not quite. You can try again until you solve today’s challenge.',
      });
    }

    const yesterday = new Date(start);
    yesterday.setDate(yesterday.getDate() - 1);
    const solvedYesterday = student.lastChallengeDate &&
      student.lastChallengeDate >= yesterday &&
      student.lastChallengeDate < start;

    const nextStreak = solvedYesterday ? (student.streak || 0) + 1 : 1;
    const xpEarned = getXpReward(challenge);
    const longestStreak = Math.max(student.longestStreak || 0, nextStreak);
    const badgeProgress = getBadgeProgress(nextStreak);

    student.streak = nextStreak;
    student.jsstreak = nextStreak;
    student.longestStreak = longestStreak;
    student.xp = (student.xp || 0) + xpEarned;
    student.lastChallengeDate = now;
    student.dailyChallengeSolvedToday = true;
    student.lastActive = now;
    await student.save();

    const solvedCount = await Student.countDocuments({
      lastChallengeDate: { $gte: start, $lt: end },
    });

    res.json({
      correct: true,
      xpEarned,
      streak: nextStreak,
      longestStreak,
      totalXp: student.xp,
      badgeProgress,
      solverCount: solvedCount,
      explanation: challenge.explanation,
      message: 'Challenge complete',
    });
  } catch (error) {
    console.error('Submit daily challenge error:', error);
    res.status(500).json({ message: 'Failed to submit daily challenge' });
  }
});

module.exports = router;
