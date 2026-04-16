const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Recruiter = require('../models/Recruiter');
const Student = require('../models/Student');
const CustomAssessment = require('../models/CustomAssessment');
const CandidateAssessmentResult = require('../models/CandidateAssessmentResult');
const { protectRecruiter } = require('../middleware/auth');
const sendShortlistEmail = require('../utils/sendShortlistEmail');
const sendAssessmentInviteEmail = require('../utils/sendAssessmentInviteEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── EXISTING: Email/Password Auth (unchanged) ───────────────────────────────

// POST /api/recruiter/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, designation } = req.body;
    const existing = await Recruiter.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const recruiter = await Recruiter.create({ name, email, password, company: { name: company }, designation });
    res.status(201).json({
      _id: recruiter._id,
      name: recruiter.name,
      email: recruiter.email,
      company: recruiter.company,
      designation: recruiter.designation,
      avatar: recruiter.avatar,
      onboardingComplete: recruiter.onboardingComplete,
      role: 'recruiter',
      token: generateToken(recruiter._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/recruiter/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter || !(await recruiter.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: recruiter._id,
      name: recruiter.name,
      email: recruiter.email,
      company: recruiter.company,
      designation: recruiter.designation,
      avatar: recruiter.avatar,
      onboardingComplete: recruiter.onboardingComplete,
      role: 'recruiter',
      token: generateToken(recruiter._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── NEW: Google OAuth for Recruiters ────────────────────────────────────────

// POST /api/recruiter/auth/google
router.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      if (!recruiter.googleId) {
        recruiter.googleId = googleId;
        recruiter.avatar = recruiter.avatar || picture;
        await recruiter.save();
      }
    } else {
      recruiter = await Recruiter.create({
        googleId,
        email,
        name,
        avatar: picture,
        password: null
      });
    }

    res.json({
      _id: recruiter._id,
      name: recruiter.name,
      email: recruiter.email,
      company: recruiter.company,
      designation: recruiter.designation,
      avatar: recruiter.avatar,
      onboardingComplete: recruiter.onboardingComplete,
      role: 'recruiter',
      token: generateToken(recruiter._id)
    });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed', error: error.message });
  }
});

// POST /api/recruiter/onboarding
router.post('/onboarding', protectRecruiter, async (req, res) => {
  try {
    const { companyName, industry, size, domains, roleTypes, linkedinUrl, designation } = req.body;
    // First unset company (in case it was stored as a plain string from old schema)
    await Recruiter.findByIdAndUpdate(req.recruiter._id, { $unset: { company: '' } }, { runValidators: false });

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.recruiter._id,
      {
        $set: {
          company: {
            name: companyName || '',
            industry: industry || '',
            size: size || '',
            domains: domains || [],
            roleTypes: roleTypes || [],
            linkedinUrl: linkedinUrl || ''
          },
          designation: designation || '',
          onboardingComplete: true
        }
      },
      { new: true, runValidators: false }
    ).select('-password');
    res.json(recruiter);
  } catch (error) {
    console.error('Onboarding error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

// GET /api/recruiter/dashboard
router.get('/dashboard', protectRecruiter, async (req, res) => {
  try {
    const recruiterId = req.recruiter._id;
    const assessments = await CustomAssessment.find({ recruiterId });
    const recruiter = await Recruiter.findById(recruiterId).select('savedStudents');
    const totalCandidates = await Student.countDocuments({});

    const results = await CandidateAssessmentResult.find({ recruiterId })
      .populate('studentId', 'name email stream scores college avatar')
      .populate('assessmentId', 'title domain')
      .sort({ createdAt: -1 })
      .limit(20);

    const shortlisted = recruiter?.savedStudents?.length || 0;
    const avgArr = await Student.aggregate([
      {
        $match: {
          'scores.overall': { $gt: 0 }
        }
      },
      { $group: { _id: null, avg: { $avg: '$scores.overall' } } }
    ]);
    const avgScore = avgArr[0]?.avg ? Math.round(avgArr[0].avg) : 0;

    const topPerformers = await Student.find({ 'scores.overall': { $gt: 0 } })
      .select('name email stream scores college avatar')
      .sort({ 'scores.overall': -1 })
      .limit(5);

    res.json({
      stats: {
        totalCandidates,
        assessmentsCreated: assessments.length,
        avgScore,
        shortlisted
      },
      recentActivity: results.slice(0, 10),
      topPerformers: topPerformers.map((student) => ({
        studentId: student,
        overallScore: student.scores?.overall || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── ASSESSMENTS ─────────────────────────────────────────────────────────────

// POST /api/recruiter/assessments
router.post('/assessments', protectRecruiter, async (req, res) => {
  try {
    const assessment = await CustomAssessment.create({
      ...req.body,
      recruiterId: req.recruiter._id
    });
    await Recruiter.findByIdAndUpdate(req.recruiter._id, {
      $push: { assessments: assessment._id }
    });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/recruiter/assessments
router.get('/assessments', protectRecruiter, async (req, res) => {
  try {
    const { status, sort = 'newest' } = req.query;
    const filter = { recruiterId: req.recruiter._id };
    if (status && status !== 'all') filter.status = status;

    const sortMap = {
      newest: { createdAt: -1 },
      candidates: { candidatesAttempted: -1 },
      score: { averageScore: -1 }
    };

    const assessments = await CustomAssessment.find(filter).sort(sortMap[sort] || sortMap.newest);
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recruiter/assessments/:id
router.get('/assessments/:id', protectRecruiter, async (req, res) => {
  try {
    const assessment = await CustomAssessment.findOne({ _id: req.params.id, recruiterId: req.recruiter._id });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/recruiter/assessments/:id
router.put('/assessments/:id', protectRecruiter, async (req, res) => {
  try {
    const assessment = await CustomAssessment.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.recruiter._id },
      req.body,
      { new: true }
    );
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/recruiter/assessments/:id
router.delete('/assessments/:id', protectRecruiter, async (req, res) => {
  try {
    const assessment = await CustomAssessment.findOneAndDelete({ _id: req.params.id, recruiterId: req.recruiter._id });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    await Recruiter.findByIdAndUpdate(req.recruiter._id, { $pull: { assessments: req.params.id } });
    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recruiter/assessments/:id/publish
router.post('/assessments/:id/publish', protectRecruiter, async (req, res) => {
  try {
    const shareableLink = `${process.env.CLIENT_URL}/assess/${req.params.id}`;
    const assessment = await CustomAssessment.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.recruiter._id },
      { status: 'active', shareableLink },
      { new: true }
    );
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    let emailSummary = null;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const recruiter = await Recruiter.findById(req.recruiter._id)
        .select('name email designation company savedStudents')
        .populate('savedStudents', 'name email');

      const students = recruiter?.savedStudents || [];

      if (students.length > 0) {
        const results = await Promise.allSettled(
          students.map((student) => sendAssessmentInviteEmail({ student, recruiter, assessment }))
        );

        const sent = results.filter((result) => result.status === 'fulfilled').length;
        const failed = results.length - sent;

        await CustomAssessment.findByIdAndUpdate(assessment._id, {
          $set: { candidatesShortlisted: students.length }
        });

        assessment.candidatesShortlisted = students.length;
        emailSummary = { sent, failed, shortlisted: students.length };
      } else {
        emailSummary = { sent: 0, failed: 0, shortlisted: 0 };
      }
    }

    res.json({
      ...assessment.toObject(),
      message: emailSummary
        ? emailSummary.shortlisted > 0
          ? `Assessment published. Auto-sent to ${emailSummary.sent} shortlisted student${emailSummary.sent !== 1 ? 's' : ''}${emailSummary.failed ? `, ${emailSummary.failed} failed` : ''}.`
          : 'Assessment published. No shortlisted students to email yet.'
        : 'Assessment published. Email auto-send skipped because mail is not configured.',
      emailSummary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recruiter/assessments/:id/email-shortlisted
router.post('/assessments/:id/email-shortlisted', protectRecruiter, async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ message: 'Email is not configured on the server.' });
    }

    const assessment = await CustomAssessment.findOne({
      _id: req.params.id,
      recruiterId: req.recruiter._id
    }).select('title targetRole shareableLink status');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (!assessment.shareableLink || assessment.status !== 'active') {
      return res.status(400).json({ message: 'Publish the assessment before emailing it to students.' });
    }

    const recruiter = await Recruiter.findById(req.recruiter._id)
      .select('name email designation company savedStudents')
      .populate('savedStudents', 'name email');

    const students = recruiter?.savedStudents || [];
    if (students.length === 0) {
      return res.status(400).json({ message: 'No shortlisted students found.' });
    }

    const results = await Promise.allSettled(
      students.map((student) => sendAssessmentInviteEmail({ student, recruiter, assessment }))
    );

    const sent = results.filter((result) => result.status === 'fulfilled').length;
    const failed = results.length - sent;

    if (sent === 0) {
      return res.status(500).json({ message: 'Could not send assessment emails.' });
    }

    await CustomAssessment.findByIdAndUpdate(assessment._id, {
      $set: { candidatesShortlisted: students.length }
    });

    res.json({
      message: failed > 0
        ? `Sent ${sent} assessment email${sent !== 1 ? 's' : ''}. ${failed} failed.`
        : `Sent assessment email${sent !== 1 ? 's' : ''} to ${sent} shortlisted student${sent !== 1 ? 's' : ''}.`,
      sent,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── TALENT POOL ─────────────────────────────────────────────────────────────

// GET /api/recruiter/talent-pool
router.get('/talent-pool', protectRecruiter, async (req, res) => {
  try {
    const { stream, minScore, maxScore, roundsCompleted, sort = 'score', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (stream) filter.stream = stream;
    if (minScore || maxScore) {
      filter['scores.overall'] = {};
      if (minScore) filter['scores.overall'].$gte = parseInt(minScore);
      if (maxScore) filter['scores.overall'].$lte = parseInt(maxScore);
    }
    if (roundsCompleted) filter.roundsCompleted = { $size: parseInt(roundsCompleted) };

    const sortMap = {
      score: { 'scores.overall': -1 },
      recent: { createdAt: -1 },
      name: { name: 1 }
    };

    const students = await Student.find(filter)
      .select('name email college year tier stream state scores badges roundsCompleted createdAt')
      .sort(sortMap[sort] || sortMap.score)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Student.countDocuments(filter);
    const savedStudents = req.recruiter.savedStudents.map(id => id.toString());

    const studentsWithSaved = students.map(s => ({
      ...s.toObject(),
      isSaved: savedStudents.includes(s._id.toString())
    }));

    res.json({ students: studentsWithSaved, total, pages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recruiter/talent-pool/:studentId
router.get('/talent-pool/:studentId', protectRecruiter, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const isSaved = req.recruiter.savedStudents.map(id => id.toString()).includes(req.params.studentId);
    res.json({ ...student.toObject(), isSaved });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── SHORTLIST ────────────────────────────────────────────────────────────────

// GET /api/recruiter/shortlist
router.get('/shortlist', protectRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter._id).populate(
      'savedStudents',
      'name email college year tier stream scores badges roundsCompleted'
    );
    res.json(recruiter.savedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recruiter/shortlist/:studentId
router.post('/shortlist/:studentId', protectRecruiter, async (req, res) => {
  try {
    await Recruiter.findByIdAndUpdate(req.recruiter._id, {
      $addToSet: { savedStudents: req.params.studentId }
    });
    res.json({ message: 'Student shortlisted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/recruiter/shortlist/:studentId
router.delete('/shortlist/:studentId', protectRecruiter, async (req, res) => {
  try {
    await Recruiter.findByIdAndUpdate(req.recruiter._id, {
      $pull: { savedStudents: req.params.studentId }
    });
    res.json({ message: 'Student removed from shortlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recruiter/shortlist/email
router.post('/shortlist/email', protectRecruiter, async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ message: 'Email is not configured on the server.' });
    }

    const recruiter = await Recruiter.findById(req.recruiter._id)
      .select('name email designation company savedStudents')
      .populate('savedStudents', 'name email');

    const students = recruiter?.savedStudents || [];
    if (students.length === 0) {
      return res.status(400).json({ message: 'No shortlisted students found.' });
    }

    const results = await Promise.allSettled(
      students.map((student) => sendShortlistEmail({ student, recruiter }))
    );

    const sent = results.filter((result) => result.status === 'fulfilled').length;
    const failed = results.length - sent;

    if (sent === 0) {
      return res.status(500).json({ message: 'Could not send shortlist emails.' });
    }

    res.json({
      message: failed > 0
        ? `Sent ${sent} shortlist email${sent !== 1 ? 's' : ''}. ${failed} failed.`
        : `Sent shortlist email${sent !== 1 ? 's' : ''} to ${sent} student${sent !== 1 ? 's' : ''}.`,
      sent,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

// GET /api/recruiter/analytics
router.get('/analytics', protectRecruiter, async (req, res) => {
  try {
    const recruiterId = req.recruiter._id;
    const results = await CandidateAssessmentResult.find({ recruiterId });

    // Score distribution
    const scoreRanges = [
      { label: '0-20', min: 0, max: 20 },
      { label: '21-40', min: 21, max: 40 },
      { label: '41-60', min: 41, max: 60 },
      { label: '61-80', min: 61, max: 80 },
      { label: '81-100', min: 81, max: 100 }
    ];
    const scoreDist = scoreRanges.map(r => ({
      range: r.label,
      count: results.filter(res => res.overallScore >= r.min && res.overallScore <= r.max).length
    }));

    // Domain breakdown from talent pool
    const domainBreakdown = await Student.aggregate([
      { $group: { _id: '$stream', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // Pass/fail
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;

    // Monthly trend (last 6 months)
    const now = new Date();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthResults = results.filter(r => r.createdAt >= d && r.createdAt < end);
      monthlyTrend.push({
        month: d.toLocaleString('default', { month: 'short' }),
        candidates: monthResults.length,
        avgScore: monthResults.length ? Math.round(monthResults.reduce((a, r) => a + r.overallScore, 0) / monthResults.length) : 0
      });
    }

    res.json({ scoreDist, domainBreakdown, passed, failed, total: results.length, monthlyTrend });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────

// PUT /api/recruiter/settings
router.put('/settings', protectRecruiter, async (req, res) => {
  try {
    const { companyName, industry, size, domains, roleTypes, linkedinUrl, designation } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.recruiter._id,
      {
        $set: {
          'company.name': companyName || '',
          'company.industry': industry || '',
          'company.size': size || '',
          'company.domains': domains || [],
          'company.roleTypes': roleTypes || [],
          'company.linkedinUrl': linkedinUrl || '',
          designation: designation || ''
        }
      },
      { new: true, runValidators: false }
    ).select('-password');
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── EXPORT ───────────────────────────────────────────────────────────────────

// GET /api/recruiter/export/shortlist
router.get('/export/shortlist', protectRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter._id).populate(
      'savedStudents',
      'name email college year tier stream scores badges roundsCompleted'
    );
    const headers = ['Name', 'Email', 'College', 'Stream', 'Tier', 'Overall Score', 'Rounds Completed', 'Badges'];
    const rows = recruiter.savedStudents.map(s => [
      s.name, s.email, s.college, s.stream, s.tier,
      s.scores?.overall || 0,
      s.roundsCompleted?.length || 0,
      s.badges?.join('; ') || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=shortlisted-candidates.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── EXISTING: Student list (unchanged) ──────────────────────────────────────

// GET /api/recruiter/students
router.get('/students', protectRecruiter, async (req, res) => {
  try {
    const { stream, tier, minScore, roundsCompleted, state, badge, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (stream) filter.stream = stream;
    if (tier) filter.tier = tier;
    if (state) filter.state = state;
    if (minScore) filter['scores.overall'] = { $gte: parseInt(minScore) };
    if (roundsCompleted) filter.roundsCompleted = { $size: parseInt(roundsCompleted) };
    if (badge) filter.badges = { $elemMatch: { $regex: badge, $options: 'i' } };

    const students = await Student.find(filter)
      .select('name email college year tier stream state scores badges roundsCompleted growthData createdAt')
      .sort({ 'scores.overall': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Student.countDocuments(filter);
    const certified = await Student.countDocuments({ ...filter, badges: { $elemMatch: { $regex: 'Certified', $options: 'i' } } });
    const tier2_3 = await Student.countDocuments({ ...filter, tier: { $in: ['Tier 2', 'Tier 3'] } });

    res.json({ students, total, certified, tier2_3, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recruiter/student/:id
router.get('/student/:id', protectRecruiter, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
