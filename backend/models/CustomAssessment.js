const mongoose = require('mongoose');

const customAssessmentSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  title: { type: String, required: true },
  targetRole: { type: String, default: '' },
  domain: { type: String, enum: ['DSA', 'Web Dev', 'AI/ML', 'Data Science', 'System Design', 'General'], default: 'General' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  timeLimit: { type: Number, default: 60 },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  rounds: {
    round1: {
      enabled: { type: Boolean, default: true },
      questionCount: { type: Number, default: 10 },
      topics: [{ type: String }],
      difficultyDist: {
        easy: { type: Number, default: 30 },
        medium: { type: Number, default: 50 },
        hard: { type: Number, default: 20 }
      },
      timePerQuestion: { type: Number, default: 60 },
      useQuestionBank: { type: Boolean, default: true },
      customQuestions: [{ question: String, options: [String], correct: Number }]
    },
    round2: {
      enabled: { type: Boolean, default: true },
      questionCount: { type: Number, default: 3 },
      type: { type: String, enum: ['Technical', 'Behavioral', 'Mixed'], default: 'Mixed' },
      evaluationCriteria: [{ type: String }],
      customInstructions: { type: String, default: '' },
      customQuestions: [{ type: String }]
    },
    round3: {
      enabled: { type: Boolean, default: true },
      promptQuestions: { type: Number, default: 1 },
      scenario: { type: String, default: '' },
      videoEnabled: { type: Boolean, default: true },
      videoQuestion: { type: String, default: '' },
      recordingLimit: { type: Number, default: 60 },
      evaluationFocus: [{ type: String }],
      retakes: { type: Number, default: 1 }
    },
    round4: {
      enabled: { type: Boolean, default: false },
      type: { type: String, enum: ['Case Study', 'Live Coding', 'Extended Video', 'Custom Written'], default: 'Custom Written' },
      content: { type: String, default: '' },
      instructions: { type: String, default: '' },
      passingScore: { type: Number, default: 70 }
    }
  },
  weights: {
    r1: { type: Number, default: 25 },
    r2: { type: Number, default: 25 },
    r3: { type: Number, default: 25 },
    r4: { type: Number, default: 25 }
  },
  passingScore: { type: Number, default: 60 },
  autoShortlist: { type: Boolean, default: false },
  autoShortlistThreshold: { type: Number, default: 80 },
  autoSendResult: { type: Boolean, default: true },
  showScoresImmediately: { type: Boolean, default: true },
  candidateSettings: {
    access: { type: String, enum: ['open', 'invite', 'domain'], default: 'open' },
    inviteEmails: [{ type: String }],
    domainRestriction: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    maxAttempts: { type: Number, default: 1 }
  },
  antiCheating: {
    tabSwitch: { type: Boolean, default: true },
    tabSwitchLimit: { type: Number, default: 3 },
    fullscreen: { type: Boolean, default: false },
    randomizeQuestions: { type: Boolean, default: true },
    randomizeOptions: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['draft', 'active', 'closed'], default: 'draft' },
  shareableLink: { type: String, default: '' },
  candidatesAttempted: { type: Number, default: 0 },
  candidatesCompleted: { type: Number, default: 0 },
  candidatesShortlisted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CustomAssessment', customAssessmentSchema);
