const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const { DOMAIN_CATALOG, normalizeAssessmentContext } = require('../constants/domainCatalog');

// GET /api/student/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { stream, tier, limit = 100 } = req.query;
    const filter = {};
    if (stream) filter.stream = stream;
    if (tier) filter.tier = tier;

    const students = await Student.find(filter)
      .select('name college stream tier scores badges roundsCompleted growthData state')
      .sort({ 'scores.overall': -1 })
      .limit(parseInt(limit));

    const leaderboard = students.map((s, idx) => ({
      rank: idx + 1,
      _id: s._id,
      name: s.name,
      college: s.college,
      stream: s.stream,
      tier: s.tier,
      state: s.state,
      overallScore: s.scores.overall,
      badges: s.badges,
      roundsCompleted: s.roundsCompleted.length,
      trend: s.growthData && s.growthData.length > 1
        ? (s.growthData[s.growthData.length - 1].score > s.growthData[s.growthData.length - 2].score ? 'up' : 'down')
        : 'neutral'
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/student/stats
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const certified = await Student.countDocuments({ 'roundsCompleted': { $all: [1, 2, 3, 4] } });
    const streamCounts = await Student.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ]);
    res.json({ totalStudents, certified, streamCounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/student/:id/update
router.put('/:id/update', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, college, year, tier, stream, state, domain, subdomain } = req.body;
    const assessmentContext = normalizeAssessmentContext({ domain, subdomain, stream });
    const update = {};
    if (name) update.name = name;
    if (college) update.college = college;
    if (year) update.year = year;
    if (tier) update.tier = tier;
    if (assessmentContext.domain) update.domain = assessmentContext.domain;
    if (assessmentContext.subdomain) update.subdomain = assessmentContext.subdomain;
    if (assessmentContext.stream) update.stream = assessmentContext.stream;
    if (state) update.state = state;

    const student = await Student.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/student/preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const { domain, subdomain } = req.body;
    const validDomain = DOMAIN_CATALOG.find((item) => item.name === domain);

    if (!validDomain) {
      return res.status(400).json({ message: 'Please choose a valid domain.' });
    }

    if (!validDomain.subdomains.includes(subdomain)) {
      return res.status(400).json({ message: 'Please choose a valid subdomain for that domain.' });
    }

    const student = await Student.findById(req.user._id);
    student.domain = domain;
    student.subdomain = subdomain;
    student.stream = subdomain;
    await student.save();

    const safeStudent = await Student.findById(req.user._id).select('-password');
    res.json(safeStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/student/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/student/:id/scores
router.get('/:id/scores', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('scores growthData badges roundsCompleted');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
