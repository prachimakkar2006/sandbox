module.exports = {
  questions: {
    'Digital Marketing': [
      { question: 'What is the main goal of a conversion funnel in digital marketing?', options: ['To store design assets', 'To track how users move from awareness to action', 'To compress video ads', 'To assign office tasks'], correct: 1, topic: 'Funnels', difficulty: 2, explanation: 'Funnels help marketers understand where users drop off before conversion.' },
      { question: 'Which metric best indicates how often people click after seeing an ad?', options: ['CTR', 'CPA', 'LTV', 'Bounce rate'], correct: 0, topic: 'Performance Metrics', difficulty: 2, explanation: 'CTR measures clicks divided by impressions.' },
      { question: 'SEO primarily aims to improve:', options: ['Paid campaign billing', 'Visibility in organic search results', 'Warehouse operations', 'Video rendering speed'], correct: 1, topic: 'SEO', difficulty: 2, explanation: 'SEO increases discoverability in unpaid search results.' },
      { question: 'A/B testing is most useful for:', options: ['Archiving old posts', 'Comparing two variations to measure which performs better', 'Creating legal contracts', 'Writing database queries'], correct: 1, topic: 'Experimentation', difficulty: 3, explanation: 'A/B tests isolate a variable to compare performance across versions.' },
      { question: 'Which is the strongest reason to align ad messaging with the landing page?', options: ['To make the brand logo bigger', 'To reduce friction and improve conversion quality', 'To reduce video duration', 'To increase office productivity'], correct: 1, topic: 'Campaign Strategy', difficulty: 4, explanation: 'Message match improves relevance and helps users continue the journey confidently.' },
    ],
    'Finance': [
      { question: 'A balance sheet primarily shows:', options: ['Revenue over time', 'Assets, liabilities, and equity at a point in time', 'Employee satisfaction', 'Marketing reach'], correct: 1, topic: 'Financial Statements', difficulty: 2, explanation: 'The balance sheet is a snapshot of what a business owns and owes.' },
      { question: 'Which ratio is commonly used to measure short-term liquidity?', options: ['Current ratio', 'Debt-to-equity ratio', 'Gross margin', 'Asset turnover'], correct: 0, topic: 'Ratios', difficulty: 3, explanation: 'The current ratio compares current assets to current liabilities.' },
      { question: 'What is the main idea behind discounted cash flow analysis?', options: ['Counting only past profits', 'Estimating present value of future cash flows', 'Ignoring risk entirely', 'Tracking website traffic'], correct: 1, topic: 'Valuation', difficulty: 4, explanation: 'DCF values an asset by discounting future expected cash flows to today.' },
      { question: 'Forecasting revenue usually depends most on understanding:', options: ['Only logo design', 'Historical trends and business drivers', 'Printer settings', 'Social media comments only'], correct: 1, topic: 'Forecasting', difficulty: 3, explanation: 'Good forecasts connect historical data with actual business drivers and assumptions.' },
      { question: 'Why is working capital important in financial planning?', options: ['It replaces all profits', 'It reflects the business ability to manage short-term operations', 'It determines office rent only', 'It is only useful for investors'], correct: 1, topic: 'Financial Planning', difficulty: 4, explanation: 'Working capital shows whether a company can support day-to-day operations.' },
    ],
    'HR Management': [
      { question: 'What is the main purpose of a structured interview process?', options: ['To reduce legal and bias risk while comparing candidates consistently', 'To speed up payroll', 'To replace onboarding', 'To design office layouts'], correct: 0, topic: 'Recruitment', difficulty: 3, explanation: 'Structured interviews improve fairness and consistency across candidates.' },
      { question: 'Employee onboarding is most successful when it focuses on:', options: ['Only paperwork', 'Role clarity, tools, expectations, and integration into the team', 'Annual bonuses only', 'Brand colors'], correct: 1, topic: 'Onboarding', difficulty: 2, explanation: 'Strong onboarding helps new hires become effective and connected quickly.' },
      { question: 'What is a key benefit of regular performance feedback?', options: ['It guarantees promotions', 'It helps employees improve and align with expectations', 'It removes the need for managers', 'It replaces hiring'], correct: 1, topic: 'Performance Management', difficulty: 2, explanation: 'Frequent feedback reduces ambiguity and supports growth.' },
      { question: 'When handling workplace conflict, HR should first prioritize:', options: ['Ignoring the issue', 'Fair listening, documentation, and policy-aligned resolution', 'Public confrontation', 'Changing payroll cycles'], correct: 1, topic: 'Conflict Resolution', difficulty: 3, explanation: 'Conflict resolution should be fair, documented, and consistent with policy.' },
      { question: 'Why are clear HR policies important?', options: ['They increase app load speed', 'They create consistency, compliance, and clarity for employees', 'They replace managers', 'They reduce the need for training entirely'], correct: 1, topic: 'Policy', difficulty: 3, explanation: 'Policies help organizations act consistently and stay compliant.' },
    ],
    'Entrepreneurship': [
      { question: 'What is the first thing a founder should validate before scaling a new idea?', options: ['Office furniture', 'Whether the market has a real problem worth solving', 'The final logo animation', 'The legal company name only'], correct: 1, topic: 'Problem Validation', difficulty: 2, explanation: 'Entrepreneurship starts with validating a real customer problem.' },
      { question: 'A business model mainly explains:', options: ['How the company creates, delivers, and captures value', 'How to write JavaScript', 'How to export ad creatives', 'How to compress images'], correct: 0, topic: 'Business Models', difficulty: 2, explanation: 'A business model describes value creation, delivery, and monetization.' },
      { question: 'An MVP is best described as:', options: ['A fully polished final product', 'The smallest version of a product that can test a key assumption', 'A financial statement', 'A legal filing'], correct: 1, topic: 'MVP', difficulty: 2, explanation: 'MVPs help founders learn quickly with minimal effort.' },
      { question: 'Go-to-market strategy primarily focuses on:', options: ['Internal seating plans', 'How to reach and convert the initial target customer', 'Coding style conventions', 'Printer maintenance'], correct: 1, topic: 'Go-to-Market', difficulty: 3, explanation: 'A GTM strategy outlines channel, positioning, and sales/marketing approach.' },
      { question: 'Why do early-stage founders track unit economics?', options: ['To choose office wall colors', 'To understand whether growth is sustainable', 'To replace customer research', 'To avoid making sales'], correct: 1, topic: 'Unit Economics', difficulty: 4, explanation: 'Unit economics reveal whether the underlying model can scale sustainably.' },
    ],
  },
  round2Topics: {
    'Digital Marketing': 'Campaign strategy, audience targeting, SEO, SEM, content marketing, funnels, A/B testing, conversion metrics',
    'Finance': 'Financial statements, ratios, valuation basics, discounted cash flow, forecasting, budgeting, working capital, investment analysis',
    'HR Management': 'Recruitment, onboarding, performance feedback, conflict handling, HR policies, people operations, retention, compliance',
    'Entrepreneurship': 'Problem validation, MVPs, business models, go-to-market, customer discovery, unit economics, founder decisions, market testing',
  },
  round3Scenarios: {
    'Digital Marketing': [
      'A paid campaign is getting impressions but almost no conversions. Write an AI prompt to diagnose the issue and explain what you would check first.',
      'Your manager wants a 30-day content strategy for a new student product. Write the AI prompt you would use and explain your planning approach.',
      'An e-commerce brand wants to improve landing-page conversion rate before a sale. Write an AI prompt to help and explain how you would evaluate the results.',
    ],
    'Finance': [
      'A founder shares three years of financial statements and asks whether the company is healthy. Write an AI prompt to analyze them and explain your reasoning.',
      'You need to build a simple valuation view for a startup pitch deck. Write the AI prompt you would use and explain your approach.',
      'A team is overspending and leadership needs a revised budget plan. Write an AI prompt to support the analysis and explain how you would use it.',
    ],
    'HR Management': [
      'Employee attrition has increased over the last two quarters. Write an AI prompt to investigate possible causes and explain your HR approach.',
      'You need a structured interview guide for a campus hiring drive. Write an AI prompt to help create it and explain what good output looks like.',
      'A team conflict between two employees is affecting delivery. Write an AI prompt to prepare for resolution and explain your reasoning.',
    ],
    'Entrepreneurship': [
      'A founder has three possible startup ideas but limited time and money. Write an AI prompt to evaluate them and explain how you would decide.',
      'Your early MVP is getting signups but weak retention. Write an AI prompt to help diagnose the problem and explain your next steps.',
      'A startup needs a go-to-market plan for launching in college communities. Write an AI prompt to support planning and explain your strategy.',
    ],
  },
  round4InterviewQuestions: {
    'Digital Marketing': ['What is the difference between CTR and conversion rate?', 'How do you approach campaign optimization when results are weak?', 'Why is message match important between ad and landing page?', 'What makes A/B testing reliable?', 'How can AI help marketers without replacing judgment?'],
    'Finance': ['What does a balance sheet tell you?', 'Why is cash flow important in financial analysis?', 'How would you explain DCF in simple terms?', 'When can ratios be misleading without context?', 'How should finance professionals evaluate AI-generated analysis?'],
    'HR Management': ['Why is structured hiring important?', 'What makes onboarding effective?', 'How do you handle employee conflict fairly?', 'Why does regular feedback matter?', 'What risks do you see in using AI too casually in HR decisions?'],
    'Entrepreneurship': ['Why is problem validation important before scaling?', 'What makes an MVP useful?', 'How do you think about go-to-market strategy?', 'Why do unit economics matter for startups?', 'How can founders use AI without becoming over-dependent on it?'],
  },
  mentors: {
    'Digital Marketing': [{ name: 'Sakshi Bansal', title: 'Growth Marketing Lead', company: 'Zomato', expertise: ['Performance Marketing', 'SEO', 'Funnels'], bio: 'Leads digital growth campaigns and mentors students on campaign thinking, measurement, and experimentation.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Saturday', time: '10:00 AM – 11:00 AM IST' }, { day: 'Wednesday', time: '8:00 PM – 9:00 PM IST' }] }],
    'Finance': [{ name: 'Manav Khanna', title: 'Financial Analyst', company: 'Goldman Sachs', expertise: ['Valuation', 'Forecasting', 'Financial Modeling'], bio: 'Works on financial analysis and helps learners build stronger business and valuation fundamentals.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Sunday', time: '12:00 PM – 1:00 PM IST' }, { day: 'Thursday', time: '7:00 PM – 8:00 PM IST' }] }],
    'HR Management': [{ name: 'Pooja Sethi', title: 'HR Business Partner', company: 'Deloitte', expertise: ['Talent Acquisition', 'People Operations', 'Employee Relations'], bio: 'Mentors students on modern HR practice, hiring processes, and workplace communication.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Saturday', time: '5:00 PM – 6:00 PM IST' }, { day: 'Tuesday', time: '7:00 PM – 8:00 PM IST' }] }],
    'Entrepreneurship': [{ name: 'Yash Agarwal', title: 'Founder', company: 'SeedSpark', expertise: ['MVP Strategy', 'Go-to-Market', 'Startup Validation'], bio: 'Built and advised early-stage startups and mentors students on turning ideas into tested ventures.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Sunday', time: '4:00 PM – 5:00 PM IST' }, { day: 'Friday', time: '6:00 PM – 7:00 PM IST' }] }],
  },
};
