const mongoose = require('mongoose');

const candidateResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomAssessment', required: true },
  roundScores: {
    r1: { type: Number, default: 0 },
    r2: { type: Number, default: 0 },
    r3: { type: Number, default: 0 },
    r4: { type: Number, default: 0 }
  },
  overallScore: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  shortlisted: { type: Boolean, default: false },
  completedAt: { type: Date },
  roundDetails: {
    r1: { answers: [mongoose.Schema.Types.Mixed], feedback: String },
    r2: { answers: [mongoose.Schema.Types.Mixed], feedback: String },
    r3: { answers: [mongoose.Schema.Types.Mixed], feedback: String, videoUrl: String },
    r4: { answers: [mongoose.Schema.Types.Mixed], feedback: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('CandidateAssessmentResult', candidateResultSchema);
