/**
 * A/B Testing Framework
 * Simple A/B testing implementation
 */

const AB_TESTS = {};

/**
 * Initialize A/B test
 */
export function initTest(testName, variants, weights = null) {
  if (!weights) {
    weights = variants.map(() => 1 / variants.length);
  }

  AB_TESTS[testName] = {
    variants,
    weights,
    assignments: new Map(),
  };
}

/**
 * Get variant for user
 */
export function getVariant(testName, userId) {
  const test = AB_TESTS[testName];
  if (!test) {
    console.warn(`Test "${testName}" not found`);
    return null;
  }

  // Check if user already assigned
  if (test.assignments.has(userId)) {
    return test.assignments.get(userId);
  }

  // Assign variant based on weights
  const variant = assignVariant(test.variants, test.weights);
  test.assignments.set(userId, variant);

  // Track assignment
  trackAssignment(testName, userId, variant);

  return variant;
}

/**
 * Assign variant based on weights
 */
function assignVariant(variants, weights) {
  const random = Math.random();
  let sum = 0;

  for (let i = 0; i < variants.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return variants[i];
    }
  }

  return variants[variants.length - 1];
}

/**
 * Track variant assignment
 */
async function trackAssignment(testName, userId, variant) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'ab_test_assignment',
        metadata: {
          testName,
          variant,
          userId,
        },
      }),
    });
  } catch (error) {
    console.error('Failed to track assignment:', error);
  }
}

/**
 * Track conversion
 */
export async function trackConversion(testName, userId, conversionType = 'default', value = 1) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'ab_test_conversion',
        metadata: {
          testName,
          userId,
          conversionType,
          value,
        },
      }),
    });
  } catch (error) {
    console.error('Failed to track conversion:', error);
  }
}

/**
 * Get test results
 */
export async function getTestResults(testName) {
  try {
    const response = await fetch(`/api/ab-testing/results?testName=${testName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get test results:', error);
    return null;
  }
}

/**
 * Hook for React components
 */
export function useABTest(testName, variants, userId) {
  const [variant, setVariant] = React.useState(null);

  React.useEffect(() => {
    if (!AB_TESTS[testName]) {
      initTest(testName, variants);
    }
    const assignedVariant = getVariant(testName, userId || 'anonymous');
    setVariant(assignedVariant);
  }, [testName, userId]);

  return variant;
}

/**
 * Predefined tests
 */
export const TESTS = {
  PRICING_DISPLAY: {
    name: 'pricing_display',
    variants: ['table', 'cards', 'comparison'],
  },
  CTA_COLOR: {
    name: 'cta_color',
    variants: ['blue', 'green', 'purple'],
  },
  GENERATION_FLOW: {
    name: 'generation_flow',
    variants: ['single_page', 'multi_step'],
  },
};

// Initialize predefined tests
if (typeof window !== 'undefined') {
  Object.values(TESTS).forEach(test => {
    initTest(test.name, test.variants);
  });
}
