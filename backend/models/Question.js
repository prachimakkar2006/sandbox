const mongoose = require('mongoose');
const { ALL_SUBDOMAINS, GENERAL_SUBDOMAIN } = require('../constants/domainCatalog');

const questionSchema = new mongoose.Schema({
  round: { type: Number, required: true, enum: [1, 2] },
  domain: {
    type: String,
    default: ''
  },
  subdomain: {
    type: String,
    enum: [...ALL_SUBDOMAINS, GENERAL_SUBDOMAIN],
    required: false
  },
  stream: {
    type: String,
    required: true,
    enum: [...ALL_SUBDOMAINS, GENERAL_SUBDOMAIN]
  },
  difficulty: { type: Number, default: 1, min: 1, max: 10 },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: Number, required: true },
  explanation: { type: String, default: '' },
  topic: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

questionSchema.pre('save', function (next) {
  if (this.subdomain && !this.stream) this.stream = this.subdomain;
  if (this.stream && !this.subdomain) this.subdomain = this.stream;
  next();
});

module.exports = mongoose.model('Question', questionSchema);
