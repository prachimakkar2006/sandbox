const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  avatar: { type: String, default: '' },
  company: {
    name: { type: String, default: '' },
    industry: { type: String, default: '' },
    size: { type: String, default: '' },
    domains: [{ type: String }],
    roleTypes: [{ type: String }],
    linkedinUrl: { type: String, default: '' }
  },
  designation: { type: String, default: '' },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomAssessment' }],
  savedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  onboardingComplete: { type: Boolean, default: false },
  role: { type: String, default: 'recruiter' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

recruiterSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

recruiterSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Recruiter', recruiterSchema);
