// All copy and structured content lives here, separate from the components
// that render it, so content can be edited without touching markup, and the
// same data can later be swapped for calls to a real backend.

export const nav = {
  brand: 'PROJECT NAME',
  links: [
    { label: 'How it works', href: '#journey' },
    { label: 'For Builders', href: '#builders' },
    { label: 'For Mentors', href: '#mentors' },
    { label: 'Opportunities', href: '#opportunities' },
    { label: 'About', href: '#founder' },
  ],
  primaryCta: { label: 'Start building', href: '#builders' },
  secondaryCta: { label: 'Explore opportunities', href: '#opportunities' },
};

export const journeySteps = [
  {
    key: 'idea',
    title: 'Idea',
    copy: 'Start with what you have.',
  },
  {
    key: 'learn',
    title: 'Learn',
    copy: "Understand what you don't know.",
  },
  {
    key: 'build',
    title: 'Build',
    copy: 'Turn the idea into a real project.',
  },
  {
    key: 'connect',
    title: 'Connect',
    copy: 'Find people who can help.',
  },
  {
    key: 'opportunity',
    title: 'Opportunity',
    copy: 'Discover relevant programs, resources, and possibilities.',
  },
  {
    key: 'fund',
    title: 'Fund',
    copy: 'Prepare for and eventually access appropriate funding.',
  },
  {
    key: 'launch',
    title: 'Launch',
    copy: 'Put the project into the world.',
  },
  {
    key: 'learn-again',
    title: 'Learn again',
    copy: 'Use failure and feedback as part of the journey.',
  },
];

export const roles = [
  {
    key: 'builder',
    title: 'Builder',
    need: 'Turn an idea into something real.',
    description:
      'Create a project, shape a roadmap, learn what you need to know, and move from a first idea toward something you can actually launch.',
    capabilities: [
      'Create a project and a roadmap',
      'Learn through structured guidance',
      'Ask questions and get help',
      'Discover relevant opportunities',
      'Connect with collaborators',
      'Eventually pursue appropriate funding',
    ],
  },
  {
    key: 'mentor',
    title: 'Mentor / Supporter',
    need: 'Use knowledge and experience to help others.',
    description:
      'Share what you know with people who are earlier in the journey than you are. Answer real questions, review real projects, and build a reputation through useful contributions.',
    capabilities: [
      'Create an expertise profile',
      'Answer questions from Builders',
      'Review projects and drafts',
      'Share resources and guidance',
      'Build reputation through contributions',
    ],
  },
  {
    key: 'collaborator',
    title: 'Collaborator',
    need: 'Find people to build with.',
    description:
      'Contribute skills to projects you believe in, look for a co-founder, or join a team that is building something you want to be part of.',
    capabilities: [
      'Create a skills profile',
      'Discover projects looking for help',
      'Connect directly with founders',
      'Seek out a co-founder',
      'Contribute to a project you care about',
    ],
  },
  {
    key: 'funder',
    title: 'Funder',
    need: 'Support promising or meaningful projects.',
    description:
      'Discover projects, review transparent information about their progress, follow them over time, and eventually support the ones you believe in through compliant infrastructure.',
    capabilities: [
      'Discover projects by stage and sector',
      'Review transparent project information',
      'Follow progress over time',
      'Eventually support projects through compliant channels',
    ],
  },
];

// Public discovery records are loaded from trusted sources or Supabase.
export const demoOpportunities = [];

export const opportunityFilters = {
  location: ['Global', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Middle East', 'Oceania'],
  stage: ['Idea', 'Prototype', 'Early revenue', 'Established'],
  type: ['Grant', 'Accelerator', 'Competition', 'Mentorship', 'Training', 'Fellowship', 'Funding'],
  sector: ['Technology', 'Fashion', 'Agriculture', 'Health', 'Creative', 'Other'],
  cost: ['Free', 'Paid', 'Application fee'],
};

export const demoMentors = [];

export const demoProject = null;

export const aiModules = [
  {
    key: 'coach',
    title: 'Project Coach',
    description: 'Helps a Builder understand what to do next, based on where their project actually stands.',
  },
  {
    key: 'tasks',
    title: 'Task Generator',
    description: 'Turns a goal into a short list of practical, doable tasks.',
  },
  {
    key: 'reviewer',
    title: 'Draft Reviewer',
    description: 'Reviews project descriptions, applications, and plans, and points out gaps.',
  },
  {
    key: 'explainer',
    title: 'Opportunity Explainer',
    description: 'Explains complicated eligibility requirements in plain language.',
  },
  {
    key: 'question-helper',
    title: 'Mentor Question Helper',
    description: 'Helps a Builder turn a vague worry into a specific, answerable question.',
  },
  {
    key: 'plan-assistant',
    title: 'Project Plan Assistant',
    description: 'Helps structure a loose idea into a plan with a problem, a solution, and next steps.',
  },
  {
    key: 'progress-summarizer',
    title: 'Progress Summarizer',
    description: 'Helps a Builder see what they have actually accomplished, and what comes next.',
  },
];

export const verificationStages = [
  {
    key: 'explorer',
    stage: 'Stage 1',
    title: 'Explorer',
    description: 'Basic account and contact verification.',
    access: ['Browse', 'Learn', 'Discover'],
  },
  {
    key: 'identity-verified',
    stage: 'Stage 2',
    title: 'Identity verified',
    description: 'Identity checked through an appropriate specialist provider.',
    access: ['Full profile', 'Project creation', 'Community participation'],
  },
  {
    key: 'project-verified',
    stage: 'Stage 3',
    title: 'Project verified',
    description: 'Additional checks on a specific project, where necessary.',
    access: ['Higher-trust project visibility'],
  },
  {
    key: 'business-verified',
    stage: 'Stage 4',
    title: 'Business verified',
    description: 'Registered organization information, where applicable.',
    access: ['Business-specific features'],
  },
  {
    key: 'financially-eligible',
    stage: 'Stage 5',
    title: 'Financially eligible',
    description: 'Identity plus the relevant payment and compliance checks for a specific financial activity.',
    access: ['Applicable financial activity, where lawful'],
  },
];

export const mvpIncluded = [
  'Landing page',
  'Account creation',
  'Country selection',
  'Role selection',
  'Identity verification architecture',
  'Project creation',
  'Builder workspace',
  'Opportunity discovery',
  'Basic community',
  'Feedback',
];

export const mvpExcluded = [
  'Proprietary wallet',
  'Holding money',
  'Investment products',
  'Complex crowdfunding',
  'Guaranteed outcomes',
];

export const roadmap = [
  {
    month: 'September 2026',
    title: 'Build + validate MVP',
    outputs: ['Working prototype', 'Onboarding', 'Project creation', 'Opportunities', 'Basic community', 'Feedback'],
  },
  {
    month: 'October 2026',
    title: 'Early-user testing',
    outputs: ['First users', 'Usability fixes', 'Clearer onboarding', 'Analytics', 'Prioritized backlog'],
  },
  {
    month: 'November 2026',
    title: 'Community depth',
    outputs: ['Mentor flows', 'Better profiles', 'Questions and help', 'Collaboration experiments'],
  },
  {
    month: 'December 2026',
    title: 'Opportunity engine',
    outputs: ['Better opportunity database', 'Country eligibility', 'Personalization', 'Trust signals'],
  },
  {
    month: 'January 2027',
    title: 'Funding readiness',
    outputs: ['Project readiness tools', 'Funding education', 'Legal and compliance design', 'Partner research'],
  },
  {
    month: 'February 2027',
    title: 'Funding pilot preparation',
    outputs: ['Pilot scope', 'Regulated payment and funding partners', 'Risk controls', 'Transparent terms'],
  },
];

export const businessModel = [
  'Optional premium Builder tools',
  'Paid expert and mentor services, with transparent platform fees',
  'Partnerships and sponsorships',
  'Business services for companies and organizations',
  'Fees on eligible financial transactions, where lawful',
  'Accelerator and incubator partnerships',
  'Premium analytics for organizations supporting founders',
  'Education and specialized programs',
];

export const principles = [
  'Start with what you have.',
  "Don't require success before access.",
  'Identity is not the same as business verification.',
  'Global by design.',
  'Collect the minimum. Protect the maximum.',
  'Explain the how.',
  'People can fail and try again.',
  'Community should create opportunity, not just engagement.',
  'Money requires trust, transparency, and compliance.',
  'Build what users prove they need.',
];

export const footerLinks = [
  { label: 'How it works', href: '#journey' },
  { label: 'Builders', href: '#builders' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'Collaborators', href: '#collaborators' },
  { label: 'Opportunities', href: '#opportunities' },
  { label: 'About', href: '#founder' },
  { label: 'Trust & Safety', href: '#trust' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];
