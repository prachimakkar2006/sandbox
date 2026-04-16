const DOMAIN_CATALOG = [
  {
    slug: 'engineering',
    name: 'Engineering',
    subdomains: ['DSA', 'AI/ML', 'Web Dev', 'CS Fundamentals'],
  },
  {
    slug: 'design',
    name: 'Design',
    subdomains: ['UI/UX', 'Graphic Design', 'Product Design', 'Motion Design'],
  },
  {
    slug: 'business',
    name: 'Business (BBA)',
    subdomains: ['Digital Marketing', 'Finance', 'HR Management', 'Entrepreneurship'],
  },
  {
    slug: 'data-cloud',
    name: 'Data & Cloud',
    subdomains: ['Data Science', 'Cybersecurity', 'Cloud Computing', 'Databases'],
  },
  {
    slug: 'science-healthcare',
    name: 'Science & Healthcare',
    subdomains: ['Healthcare AI', 'Environmental Science', 'Physics', 'Mathematics'],
  },
  {
    slug: 'arts-humanities',
    name: 'Arts & Humanities',
    subdomains: ['Creative Writing', 'Journalism', 'Law & Policy', 'Education'],
  },
];

const ALL_SUBDOMAINS = DOMAIN_CATALOG.flatMap((domain) => domain.subdomains);

const GENERAL_SUBDOMAIN = 'General';

function findDomainBySubdomain(subdomain) {
  return DOMAIN_CATALOG.find((domain) => domain.subdomains.includes(subdomain));
}

function normalizeAssessmentContext({ domain, subdomain, stream }) {
  const resolvedSubdomain = subdomain || stream || '';
  const matchedDomain = findDomainBySubdomain(resolvedSubdomain);

  return {
    domain: domain || matchedDomain?.name || '',
    subdomain: resolvedSubdomain,
    stream: resolvedSubdomain,
  };
}

module.exports = {
  DOMAIN_CATALOG,
  ALL_SUBDOMAINS,
  GENERAL_SUBDOMAIN,
  findDomainBySubdomain,
  normalizeAssessmentContext,
};
