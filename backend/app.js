require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');

const app = express();
let dbInitialized = false;

if (!dbInitialized) {
  connectDB();
  dbInitialized = true;
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP',
  validate: { xForwardedForHeader: false }
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sandbox-ehby.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/api/', limiter);

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/daily-challenge', require('./routes/dailyChallenge'));
app.use('/api/recruiter', require('./routes/recruiter'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'eraAI API is running', version: '1.0.0' });
});

const frontendBuild = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuild) && !process.env.VERCEL) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
