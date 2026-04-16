module.exports = {
  questions: {
    'UI/UX': [
      { question: 'What is the main purpose of a user persona in UX design?', options: ['To define the app color palette', 'To represent a target user archetype based on research', 'To document API flows', 'To create animation guidelines'], correct: 1, topic: 'User Research', difficulty: 2, explanation: 'Personas synthesize user research into representative profiles that guide design decisions.' },
      { question: 'Which deliverable is most useful for mapping a user completing a task across multiple touchpoints?', options: ['Mood board', 'User journey map', 'Component library', 'Style tile'], correct: 1, topic: 'Journey Mapping', difficulty: 3, explanation: 'Journey maps capture user goals, steps, emotions, and touchpoints end to end.' },
      { question: 'What does a wireframe primarily help a design team validate?', options: ['Final brand visuals', 'Structural layout and information hierarchy', 'Production-ready motion design', 'Backend scalability'], correct: 1, topic: 'Wireframing', difficulty: 2, explanation: 'Wireframes focus on structure, layout, and hierarchy before visual polish.' },
      { question: 'Which accessibility principle is directly improved by sufficient color contrast?', options: ['Memorability', 'Perceivability', 'Scalability', 'Delight'], correct: 1, topic: 'Accessibility', difficulty: 3, explanation: 'Strong contrast helps content remain perceivable for users with low vision or color-vision deficiencies.' },
      { question: 'In usability testing, what is the most important reason to observe users completing realistic tasks?', options: ['To impress stakeholders', 'To uncover friction in actual workflows', 'To finalize typography', 'To reduce development costs automatically'], correct: 1, topic: 'Usability Testing', difficulty: 4, explanation: 'Realistic tasks reveal where users struggle in authentic scenarios.' },
    ],
    'Graphic Design': [
      { question: 'Which design principle is most closely related to arranging text so it is easy and pleasant to read?', options: ['Kerning', 'Typography', 'Masking', 'Rendering'], correct: 1, topic: 'Typography', difficulty: 2, explanation: 'Typography covers type selection, hierarchy, spacing, and readability.' },
      { question: 'What is the primary purpose of a brand style guide?', options: ['To define backend API standards', 'To keep visual communication consistent across materials', 'To replace all campaign briefs', 'To manage invoices'], correct: 1, topic: 'Brand Systems', difficulty: 2, explanation: 'Style guides ensure visual consistency in logos, colors, type, and usage rules.' },
      { question: 'When a poster uses one large headline, a medium subheading, and smaller body text, it is using:', options: ['Rasterization', 'Visual hierarchy', 'Compression', 'Cropping'], correct: 1, topic: 'Layout', difficulty: 2, explanation: 'Visual hierarchy helps viewers understand what to read first, second, and third.' },
      { question: 'Which color relationship usually creates the strongest contrast on a color wheel?', options: ['Analogous colors', 'Monochromatic colors', 'Complementary colors', 'Tinted colors'], correct: 2, topic: 'Color Theory', difficulty: 3, explanation: 'Complementary colors sit opposite each other and create strong visual contrast.' },
      { question: 'What is the best reason to use a grid system in editorial or campaign design?', options: ['It guarantees originality', 'It organizes alignment and spacing consistently', 'It removes the need for sketches', 'It automates printing'], correct: 1, topic: 'Composition', difficulty: 3, explanation: 'Grids create structure, consistency, and rhythm in layouts.' },
    ],
    'Product Design': [
      { question: 'What is the first thing a product designer should clarify before proposing a solution?', options: ['The final icon style', 'The problem and user need', 'The launch animation', 'The brand mascot'], correct: 1, topic: 'Problem Framing', difficulty: 2, explanation: 'Product design starts with understanding the user problem and desired outcome.' },
      { question: 'A user flow is most useful for showing:', options: ['Server health metrics', 'How a user moves from one step to another in a product', 'Final illustration styles', 'Hiring pipelines'], correct: 1, topic: 'User Flows', difficulty: 2, explanation: 'User flows represent paths and decision points inside a product experience.' },
      { question: 'What is a key advantage of using reusable components in a design system?', options: ['They remove the need for user research', 'They improve consistency and speed across screens', 'They guarantee higher conversion', 'They eliminate accessibility work'], correct: 1, topic: 'Design Systems', difficulty: 3, explanation: 'Reusable components make product interfaces more consistent and efficient to build.' },
      { question: 'Which method best helps validate whether a proposed interaction is understandable before development?', options: ['A financial audit', 'A clickable prototype test', 'A production deployment', 'A brand refresh'], correct: 1, topic: 'Interaction Design', difficulty: 3, explanation: 'Clickable prototypes let teams test flows and interactions before engineering effort.' },
      { question: 'When comparing two feature ideas, a product designer should prioritize:', options: ['The one with more screens', 'The one that best balances user value and business goals', 'The one with brighter colors', 'The one easiest to animate'], correct: 1, topic: 'Product Thinking', difficulty: 4, explanation: 'Strong product decisions align user impact with business outcomes and implementation reality.' },
    ],
    'Motion Design': [
      { question: 'What is the main purpose of a storyboard in motion design?', options: ['To compress exported files', 'To plan visual sequences shot by shot', 'To generate 3D meshes', 'To write CSS layouts'], correct: 1, topic: 'Storyboarding', difficulty: 2, explanation: 'Storyboards define the visual order and narrative flow before animation begins.' },
      { question: 'In animation, easing mainly affects:', options: ['Color palette', 'How motion accelerates and decelerates', 'Screen resolution', 'Export bitrate'], correct: 1, topic: 'Timing', difficulty: 2, explanation: 'Easing changes the speed curve of motion to make it feel natural or stylized.' },
      { question: 'Why are transitions important in explainer videos or UI motion?', options: ['They increase file size', 'They connect scenes and guide viewer attention', 'They replace all sound design', 'They reduce contrast issues'], correct: 1, topic: 'Transitions', difficulty: 3, explanation: 'Good transitions create continuity and direct focus between moments.' },
      { question: 'What does visual rhythm refer to in motion design?', options: ['The soundtrack only', 'The pacing and repetition of movement over time', 'The number of exported frames', 'The screen size ratio'], correct: 1, topic: 'Visual Rhythm', difficulty: 3, explanation: 'Visual rhythm comes from pacing, repetition, spacing, and timing in motion.' },
      { question: 'When animating interface feedback, the best motion usually feels:', options: ['Slow and decorative only', 'Purposeful, brief, and supportive of usability', 'Random and flashy', 'Completely invisible'], correct: 1, topic: 'UI Motion', difficulty: 4, explanation: 'Helpful interface motion should improve clarity without distracting the user.' },
    ],
  },
  round2Topics: {
    'UI/UX': 'User research, personas, journey mapping, information architecture, wireframes, usability testing, accessibility heuristics, interaction design',
    'Graphic Design': 'Typography, hierarchy, brand systems, composition, color theory, layout grids, campaign creatives, visual communication',
    'Product Design': 'Problem framing, user flows, prototyping, design systems, interaction design, usability tradeoffs, product thinking, feature prioritization',
    'Motion Design': 'Storyboarding, timing, easing, transitions, motion principles, visual rhythm, UI animation, tool-driven execution',
  },
  round3Scenarios: {
    'UI/UX': [
      'A mobile checkout flow has a high drop-off rate on the payment step. Write an AI prompt to help you diagnose the UX issue and explain your design process.',
      'Your product team needs a quick usability test plan for a new onboarding experience. Write the AI prompt you would use and explain what insights you want.',
      'A stakeholder wants to add more features to the homepage, making it visually crowded. Write an AI prompt to help prioritize the layout and explain your reasoning.',
    ],
    'Graphic Design': [
      'A brand campaign is not visually consistent across Instagram, posters, and email banners. Write an AI prompt to help standardize the visuals and explain your design approach.',
      'Your team needs a poster that communicates a social cause to a college audience. Write an AI prompt to explore direction and explain how you would judge the outputs.',
      'A client says the brochure feels cluttered and hard to read. Write an AI prompt to improve layout and typography, then explain your reasoning.',
    ],
    'Product Design': [
      'A SaaS dashboard confuses new users because key actions are hidden. Write an AI prompt to improve the experience and explain your product design thinking.',
      'You need to evaluate two competing feature concepts for a student app. Write an AI prompt to compare them and explain how you would decide.',
      'Your team must turn a rough idea into a testable prototype by tomorrow. Write an AI prompt to accelerate the process and explain the steps you would take.',
    ],
    'Motion Design': [
      'A product teaser video feels flat and lacks rhythm. Write an AI prompt to improve pacing and transitions and explain your motion design approach.',
      'You need to create onboarding animations that guide users without distracting them. Write the AI prompt you would use and explain your design reasoning.',
      'A client wants a motion style frame for a startup launch video with limited time. Write an AI prompt to speed up concepting and explain your workflow.',
    ],
  },
  round4InterviewQuestions: {
    'UI/UX': [
      'What is the difference between a user persona and a target audience segment?',
      'How would you identify the root cause of friction in a signup flow?',
      'What makes a usability test effective?',
      'How do you balance business goals with user needs?',
      'If AI suggests a design pattern that hurts accessibility, how would you respond?',
    ],
    'Graphic Design': [
      'How do typography and hierarchy influence readability?',
      'What makes a visual identity consistent across channels?',
      'How would you critique a cluttered poster layout?',
      'When would you choose bold contrast versus subtle harmony in a design?',
      'How should designers evaluate AI-generated visuals before using them in a campaign?',
    ],
    'Product Design': [
      'What is problem framing and why does it matter in product design?',
      'How do prototypes help reduce design risk?',
      'What makes a design system valuable to a growing product team?',
      'How would you defend one feature direction over another to stakeholders?',
      'How can AI help product designers without replacing critical judgment?',
    ],
    'Motion Design': [
      'What role does easing play in animation quality?',
      'How do you decide when motion is helpful versus distracting?',
      'Why is storyboarding important before animation begins?',
      'How would you improve visual rhythm in a sequence that feels dull?',
      'What risks do you see in relying too heavily on AI-generated motion ideas?',
    ],
  },
  mentors: {
    'UI/UX': [{ name: 'Aditi Rao', title: 'Senior UX Designer', company: 'Adobe', expertise: ['UX Research', 'User Flows', 'Accessibility'], bio: 'Designs user experiences for complex digital products and mentors early-career designers on research-driven UX.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Saturday', time: '11:00 AM – 12:00 PM IST' }, { day: 'Tuesday', time: '7:00 PM – 8:00 PM IST' }] }],
    'Graphic Design': [{ name: 'Rohan Malhotra', title: 'Brand Designer', company: 'Canva', expertise: ['Typography', 'Brand Systems', 'Campaign Design'], bio: 'Works on scalable visual systems and helps students build stronger portfolios in branding and communication design.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Sunday', time: '2:00 PM – 3:00 PM IST' }, { day: 'Thursday', time: '8:00 PM – 9:00 PM IST' }] }],
    'Product Design': [{ name: 'Neha Kulkarni', title: 'Product Designer', company: 'Swiggy', expertise: ['Design Systems', 'Product Thinking', 'Prototyping'], bio: 'Builds consumer product experiences and mentors students on solving product problems with clarity and structure.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Saturday', time: '4:00 PM – 5:00 PM IST' }, { day: 'Wednesday', time: '7:00 PM – 8:00 PM IST' }] }],
    'Motion Design': [{ name: 'Ishaan Dutta', title: 'Motion Designer', company: 'Byju’s', expertise: ['Storyboarding', 'UI Motion', 'Explainer Videos'], bio: 'Creates narrative and interface motion for digital products, with a strong focus on clarity and pacing.', meetLink: 'ZOOM_LINK_PLACEHOLDER', slots: [{ day: 'Sunday', time: '11:00 AM – 12:00 PM IST' }, { day: 'Friday', time: '6:00 PM – 7:00 PM IST' }] }],
  },
};
