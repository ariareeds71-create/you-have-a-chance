const signalPatterns = [
  { signal: 'funding', terms: ['funding', 'grant', 'investor', 'money', 'capital'], recommendations: ['APPLY', 'MEET', 'LEARN'] },
  { signal: 'developer', terms: ['developer', 'engineer', 'technical', 'coding', 'build an app'], recommendations: ['MEET', 'ASK', 'LEARN'] },
  { signal: 'marketing', terms: ['marketing', 'customers', 'sales', 'brand', 'promotion'], recommendations: ['LEARN', 'WATCH', 'MEET'] },
  { signal: 'stuck', terms: ['stuck', "don't know where to start", 'confused', 'overwhelmed', 'lost'], recommendations: ['BUILD', 'ASK', 'LEARN'] },
  { signal: 'idea', terms: ['idea', 'business', 'startup', 'project'], recommendations: ['BUILD', 'LEARN', 'ASK'] },
];

const learningPaths = {
  ai: ['Understand AI', 'Learn the tools', 'Identify a problem', 'Validate the idea', 'Build an MVP', 'Find customers', 'Market the product', 'Scale'],
  business: ['Clarify the problem', 'Understand the customer', 'Choose a business model', 'Validate demand', 'Create a first offer', 'Find customers', 'Measure what works'],
  marketing: ['Define your audience', 'Shape your message', 'Choose one channel', 'Create useful content', 'Test an offer', 'Review results', 'Improve consistently'],
};

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s']/g, ' ');
}

export function interpretRequest(request = '') {
  const normalizedRequest = normalize(request);
  const matchedSignals = signalPatterns.filter((pattern) => pattern.terms.some((term) => normalizedRequest.includes(term)));
  const signals = matchedSignals.map((pattern) => pattern.signal);
  const recommendationTypes = [...new Set(matchedSignals.flatMap((pattern) => pattern.recommendations))];
  const tone = signals.includes('stuck') ? 'uncertain' : signals.includes('idea') ? 'ambitious' : 'curious';

  return {
    signals,
    tone,
    recommendationTypes: recommendationTypes.length ? recommendationTypes : ['LEARN', 'BUILD', 'ASK'],
    needsDirection: signals.includes('stuck') || signals.length === 0,
    safetyNote: 'C.A.N. uses this only to improve practical recommendations. It is not a medical or psychological assessment.',
  };
}

export function createLearningPath(request = '') {
  const normalizedRequest = normalize(request);
  const pathKey = normalizedRequest.includes('ai') || normalizedRequest.includes('artificial intelligence')
    ? 'ai'
    : normalizedRequest.includes('market') || normalizedRequest.includes('sales')
      ? 'marketing'
      : 'business';

  return {
    title: pathKey === 'ai' ? 'Start an AI business' : pathKey === 'marketing' ? 'Learn practical marketing' : 'Turn an idea into a first offer',
    steps: learningPaths[pathKey].map((title, index) => ({ number: String(index + 1).padStart(2, '0'), title })),
    nextStep: learningPaths[pathKey][0],
  };
}

export function getRecommendations(request = '', context = {}) {
  const interpretation = interpretRequest(request);
  const recommendations = interpretation.recommendationTypes.map((type) => ({
    type,
    title: type === 'LEARN' ? 'Learn one relevant concept' : type === 'WATCH' ? 'Watch a trusted educational resource' : type === 'MEET' ? 'Meet someone with relevant experience' : type === 'BUILD' ? 'Define the smallest useful next step' : 'Ask the community for a focused response',
    reason: context.goal ? `Connected to your goal: ${context.goal}` : 'Based on what you shared',
  }));

  return { interpretation, recommendations: recommendations.slice(0, 3), path: createLearningPath(request) };
}
