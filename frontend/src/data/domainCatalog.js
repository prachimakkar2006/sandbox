import {
  Binary,
  BrainCircuit,
  Code2,
  Database,
  Shield,
  Cloud,
  Palette,
  PenTool,
  Layers3,
  Clapperboard,
  Briefcase,
  LineChart,
  Users,
  Rocket,
  FlaskConical,
  HeartPulse,
  Sigma,
  Atom,
  PenSquare,
  Newspaper,
  Scale,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export const DOMAIN_THEME = {
  primary: '#2563EB',
  background: '#FFFFFF',
  text: '#1E293B',
  grey: '#64748B',
  border: '#E2E8F0',
  softBlue: '#F0F7FF',
};

export const DOMAIN_CATALOG = [
  {
    slug: 'engineering',
    name: 'Engineering',
    emoji: '⚙️',
    accent: '#EFF6FF',
    description: 'Build assessments around engineering problem-solving and software depth.',
    subdomains: [
      {
        name: 'DSA',
        icon: Binary,
        difficulty: '⭐⭐⭐ Intermediate',
        avgCompletionTime: '2.5 hours',
        summary: 'Data Structures & Algorithms',
        topics: ['Arrays, Linked Lists, Trees', 'Sorting & Searching algorithms', 'Dynamic Programming', 'Graph algorithms'],
      },
      {
        name: 'AI/ML',
        icon: BrainCircuit,
        difficulty: '⭐⭐⭐ Intermediate',
        avgCompletionTime: '2.5 hours',
        summary: 'Artificial Intelligence & Machine Learning',
        topics: ['Model training and evaluation', 'Neural networks and transformers', 'Feature engineering basics', 'Applied ML problem solving'],
      },
      {
        name: 'Web Dev',
        icon: Code2,
        difficulty: '⭐⭐ Intermediate',
        avgCompletionTime: '2.25 hours',
        summary: 'Web Development',
        topics: ['Frontend architecture', 'APIs and backend integration', 'Performance and debugging', 'Security and accessibility'],
      },
      {
        name: 'CS Fundamentals',
        icon: Database,
        difficulty: '⭐⭐⭐ Intermediate',
        avgCompletionTime: '2.25 hours',
        summary: 'Computer Science Fundamentals',
        topics: ['Operating systems concepts', 'DBMS and SQL reasoning', 'Computer networks', 'Core systems thinking'],
      },
    ],
  },
  {
    slug: 'design',
    name: 'Design',
    emoji: '🎨',
    accent: '#F5F3FF',
    description: 'Creative, product, and visual communication specializations.',
    subdomains: [
      { name: 'UI/UX', icon: Palette, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'User Interface & User Experience', topics: ['User research and journeys', 'Wireframes and flows', 'Accessibility heuristics', 'Design rationale'] },
      { name: 'Graphic Design', icon: PenTool, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Graphic Design', topics: ['Typography and layout', 'Brand visual systems', 'Color and composition', 'Campaign creatives'] },
      { name: 'Product Design', icon: Layers3, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Product Design', topics: ['Problem framing', 'Interaction design', 'Design systems thinking', 'Usability tradeoffs'] },
      { name: 'Motion Design', icon: Clapperboard, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Motion Design', topics: ['Storyboarding', 'Transitions and timing', 'Visual rhythm', 'Tool-driven execution'] },
    ],
  },
  {
    slug: 'business',
    name: 'Business (BBA)',
    emoji: '💼',
    accent: '#F0FDF4',
    description: 'Business, growth, and operations-focused assessment paths.',
    subdomains: [
      { name: 'Digital Marketing', icon: LineChart, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Digital Marketing', topics: ['Campaign strategy', 'Performance metrics', 'SEO and content', 'Funnel optimization'] },
      { name: 'Finance', icon: Briefcase, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Finance', topics: ['Financial analysis', 'Ratios and valuation basics', 'Planning and forecasting', 'Business decision-making'] },
      { name: 'HR Management', icon: Users, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Human Resource Management', topics: ['Talent acquisition', 'People operations', 'Conflict handling', 'Policy interpretation'] },
      { name: 'Entrepreneurship', icon: Rocket, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Entrepreneurship', topics: ['Market validation', 'Business models', 'Go-to-market thinking', 'Founder decision-making'] },
    ],
  },
  {
    slug: 'data-cloud',
    name: 'Data & Cloud',
    emoji: '☁️',
    accent: '#ECFEFF',
    description: 'Data systems, cloud platforms, and infrastructure domains.',
    subdomains: [
      { name: 'Data Science', icon: LineChart, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.5 hours', summary: 'Data Science', topics: ['Statistics and analysis', 'Model selection', 'Feature reasoning', 'Insight communication'] },
      { name: 'Cybersecurity', icon: Shield, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Cybersecurity', topics: ['Threat modeling', 'Network and app security', 'Vulnerability analysis', 'Security operations'] },
      { name: 'Cloud Computing', icon: Cloud, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.5 hours', summary: 'Cloud Computing', topics: ['Cloud architecture', 'Scalability and reliability', 'Compute and storage tradeoffs', 'Deployment workflows'] },
      { name: 'Databases', icon: Database, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Databases', topics: ['Query design', 'Indexing and normalization', 'Transactions and consistency', 'Data modeling'] },
    ],
  },
  {
    slug: 'science-healthcare',
    name: 'Science & Healthcare',
    emoji: '🔬',
    accent: '#FFF7ED',
    description: 'Scientific reasoning, quantitative analysis, and healthcare AI.',
    subdomains: [
      { name: 'Healthcare AI', icon: HeartPulse, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.5 hours', summary: 'Healthcare AI', topics: ['Clinical use cases', 'Ethics and safety', 'Healthcare data reasoning', 'Decision support workflows'] },
      { name: 'Environmental Science', icon: FlaskConical, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Environmental Science', topics: ['Sustainability metrics', 'Climate data reading', 'Ecological systems', 'Impact interpretation'] },
      { name: 'Physics', icon: Atom, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Physics', topics: ['Mechanics and systems', 'Conceptual problem solving', 'Model-based reasoning', 'Quantitative analysis'] },
      { name: 'Mathematics', icon: Sigma, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Mathematics', topics: ['Algebraic reasoning', 'Probability and statistics', 'Discrete thinking', 'Applied problem solving'] },
    ],
  },
  {
    slug: 'arts-humanities',
    name: 'Arts & Humanities',
    emoji: '✍️',
    accent: '#FFF1F2',
    description: 'Communication, policy, writing, and teaching-oriented paths.',
    subdomains: [
      { name: 'Creative Writing', icon: PenSquare, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Creative Writing', topics: ['Narrative voice', 'Structure and pacing', 'Prompt-based ideation', 'Editing choices'] },
      { name: 'Journalism', icon: Newspaper, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Journalism', topics: ['Reporting judgment', 'Fact-based writing', 'Ethics and verification', 'Audience clarity'] },
      { name: 'Law & Policy', icon: Scale, difficulty: '⭐⭐⭐ Intermediate', avgCompletionTime: '2.25 hours', summary: 'Law & Policy', topics: ['Policy interpretation', 'Argument structure', 'Case-based reasoning', 'Ethics and public impact'] },
      { name: 'Education', icon: GraduationCap, difficulty: '⭐⭐ Intermediate', avgCompletionTime: '2.0 hours', summary: 'Education', topics: ['Learning design', 'Assessment strategy', 'Student-centered communication', 'Instruction planning'] },
    ],
  },
];

export const DOMAIN_STATS = {
  totalDomains: DOMAIN_CATALOG.length,
  totalSubdomains: DOMAIN_CATALOG.reduce((sum, domain) => sum + domain.subdomains.length, 0),
  totalStudentsLabel: '38,000+',
};

export const getDomainBySlug = (slug) => DOMAIN_CATALOG.find((domain) => domain.slug === slug);

export const getDomainByName = (name) => DOMAIN_CATALOG.find((domain) => domain.name === name);

export const getSubdomainMeta = (subdomainName) => {
  for (const domain of DOMAIN_CATALOG) {
    const subdomain = domain.subdomains.find((item) => item.name === subdomainName);
    if (subdomain) {
      return { domain, subdomain };
    }
  }
  return null;
};

export const getPreselectRoute = (domainSlug) => `/select-subdomain/${domainSlug}`;

export const homeDomainCards = DOMAIN_CATALOG.map((domain) => ({
  ...domain,
  ctaIcon: ArrowRight,
}));
