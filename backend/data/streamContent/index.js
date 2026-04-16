const design = require('./design');
const business = require('./business');
const dataCloud = require('./dataCloud');
const scienceHealthcare = require('./scienceHealthcare');
const artsHumanities = require('./artsHumanities');

const groups = [design, business, dataCloud, scienceHealthcare, artsHumanities];

module.exports = groups.reduce((acc, group) => ({
  questions: { ...acc.questions, ...group.questions },
  round2Topics: { ...acc.round2Topics, ...group.round2Topics },
  round3Scenarios: { ...acc.round3Scenarios, ...group.round3Scenarios },
  round4InterviewQuestions: { ...acc.round4InterviewQuestions, ...group.round4InterviewQuestions },
  mentors: { ...acc.mentors, ...group.mentors },
}), {
  questions: {},
  round2Topics: {},
  round3Scenarios: {},
  round4InterviewQuestions: {},
  mentors: {},
});
