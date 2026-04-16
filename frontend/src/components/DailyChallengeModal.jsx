import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { CheckCircle2, Clock3, Flame, Sparkles, Trophy, X } from 'lucide-react';

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getChallengeTitle(domain) {
  return domain === 'Wildcard' ? 'Maintain Your Streak' : `${domain} Daily Sprint`;
}

export default function DailyChallengeModal({ enabled, onSolved }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('teaser');
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!enabled) return undefined;

    let active = true;
    setFetching(true);

    axios.get('/api/daily-challenge')
      .then(({ data }) => {
        if (!active || data?.alreadySolved) return;
        setChallenge(data);
        setOpen(true);
        setPhase('teaser');
      })
      .catch((err) => {
        console.error('Daily challenge load failed:', err);
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!open || phase === 'result') return undefined;

    setCanClose(false);
    const timer = window.setTimeout(() => setCanClose(true), 3000);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  useEffect(() => {
    if (!challenge?.expiresAt || !open) return undefined;

    const update = () => {
      setTimeLeft(formatDuration(new Date(challenge.expiresAt).getTime() - Date.now()));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [challenge, open]);

  const challengeTitle = useMemo(
    () => getChallengeTitle(challenge?.domain),
    [challenge?.domain]
  );

  const closeModal = () => {
    if (!canClose) return;
    setOpen(false);
  };

  const startChallenge = () => {
    setAnswer('');
    setError('');
    setPhase('question');
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/daily-challenge/submit', { answer });
      if (data?.correct) {
        setResult(data);
        setPhase('result');
        setCanClose(true);
        if (onSolved) await onSolved();
        return;
      }

      setError(data?.message || 'That answer is not correct yet.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your answer.');
    } finally {
      setLoading(false);
    }
  };

  if (!enabled || fetching || !open || !challenge) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/25 px-4 py-6 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.24 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-cyan-100 bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(240,249,255,0.97))] text-slate-900 shadow-[0_28px_80px_rgba(14,116,144,0.18)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.2),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(236,254,255,0.2))]" />
          <div className="relative p-5 sm:p-7">
            {phase !== 'result' && canClose && (
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/85 p-2 text-slate-500 transition hover:bg-cyan-50 hover:text-slate-900"
                aria-label="Close daily challenge"
              >
                <X size={16} />
              </button>
            )}

            {phase === 'teaser' && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <motion.div
                    animate={challenge.streak > 0 ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-500 shadow-sm"
                  >
                    <Flame size={24} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-orange-500">
                      {challenge.streak > 0 ? `Day ${challenge.streak} Streak` : 'Start Your Streak'}
                    </p>
                    <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Don&apos;t break it.</h2>
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-100 bg-white/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">New Daily Challenge Is Live</p>
                  <p className="mt-3 text-2xl font-black text-slate-900">{challengeTitle}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Today&apos;s domain: <span className="font-semibold text-sky-700">{challenge.domain}</span>
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/95 p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock3 size={16} className="text-cyan-600" />
                        <span className="text-sm">Next challenge in</span>
                      </div>
                      <p className="mt-1 text-lg font-black text-slate-900">{timeLeft}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/95 p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Sparkles size={16} className="text-orange-500" />
                        <span className="text-sm">Solved today</span>
                      </div>
                      <p className="mt-1 text-lg font-black text-slate-900">{(challenge.solverCount || 0).toLocaleString()} students</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={startChallenge}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Start Challenge -&gt;
                  </button>
                  {canClose ? (
                    <button
                      onClick={closeModal}
                      className="rounded-2xl border border-cyan-100 bg-cyan-50/90 px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      Later
                    </button>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-3 text-sm font-semibold text-slate-500">
                      Close unlocks in 3s
                    </div>
                  )}
                </div>
              </div>
            )}

            {phase === 'question' && (
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-orange-500">
                  <Flame size={16} className="text-orange-500" />
                  <span>{challengeTitle}</span>
                </div>

                <div className="rounded-3xl border border-cyan-100 bg-white/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">{challenge.type.replace('-', ' ')}</p>
                  <div className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-800 sm:text-lg">
                    {challenge.question}
                  </div>

                  {challenge.type === 'mcq' ? (
                    <div className="mt-5 space-y-3">
                      {challenge.options?.map((option, index) => {
                        const optionLabel = String.fromCharCode(65 + index);
                        const selected = answer === option;
                        return (
                          <button
                            key={`${optionLabel}-${option}`}
                            type="button"
                            onClick={() => setAnswer(option)}
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                              selected
                                ? 'border-cyan-300 bg-cyan-50 text-slate-900 shadow-sm'
                                : 'border-slate-200 bg-slate-50/95 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/70'
                            }`}
                          >
                            <span className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                              selected
                                ? 'border-cyan-300 bg-white text-cyan-700'
                                : 'border-slate-200 bg-white text-cyan-600'
                            }`}>
                              {optionLabel}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={challenge.type === 'code-fix' ? 8 : 5}
                      className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 caret-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
                      placeholder={challenge.type === 'code-fix' ? 'Type the fix or corrected snippet...' : 'Write your answer here...'}
                    />
                  )}
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={submitAnswer}
                    disabled={loading || !answer.trim()}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Checking...' : 'Submit Answer'}
                  </button>
                  {canClose && (
                    <button
                      onClick={closeModal}
                      className="rounded-2xl border border-cyan-100 bg-cyan-50/90 px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                    >
                      Later
                    </button>
                  )}
                </div>
              </div>
            )}

            {phase === 'result' && result && (
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-500 shadow-sm">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">Challenge Complete</p>
                    <h2 className="text-2xl font-black text-slate-900">You kept the streak alive.</h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Flame size={16} />
                      <span className="text-sm">Streak</span>
                    </div>
                    <p className="mt-1 text-2xl font-black text-slate-900">{result.streak} Days</p>
                  </div>
                  <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-700">
                      <Trophy size={16} />
                      <span className="text-sm">XP Earned</span>
                    </div>
                    <p className="mt-1 text-2xl font-black text-slate-900">+{result.xpEarned} XP</p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-cyan-100 bg-white/82 p-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <p className="font-semibold text-slate-900">
                    {result.badgeProgress?.remaining || 0} more days to &quot;{result.badgeProgress?.nextLabel || 'Next Badge'}&quot;
                  </p>
                  {result.explanation && (
                    <p className="mt-2 text-slate-600">{result.explanation}</p>
                  )}
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
