import { describe, expect, test } from 'vitest';
import { toScoreResult } from '../src/scoring.js';
import type { FeatureVector } from '../src/types.js';

function mkFeatures(): FeatureVector {
  return {
    linguistic: { genericPhraseHits: 0, specificityScore: 0.8, clarityScore: 0.8 },
    code: {
      changedFiles: 3,
      additions: 50,
      deletions: 10,
      diffSizeScore: 0.8,
      impactHeuristicScore: 0.8
    },
    context: { repoStructureAlignmentScore: 0.8, issueLinkScore: 1.0 },
    behavioral: { accountAgeDays: 400 }
  };
}

describe('impact scoring penalties', () => {
  test('applies low impact signals', () => {
    const baseline = toScoreResult({ features: mkFeatures() });
    const penalized = toScoreResult({
      features: mkFeatures(),
      llm: {
        score: 0.8,
        type: 'specific',
        issues: [],
        suggestions: [],
        impact: {
          impact_level: 'low',
          is_low_impact: true,
          signals: ['Mostly cosmetic changes'],
          logic_change: false,
          cosmetic_ratio: 0.9,
          confidence: 1.0,
          reason: 'Only renamed variables without logic changes'
        }
      }
    });

    // Low impact no longer applies a direct value penalty in the current engine
    expect(penalized.score0to100).toBeGreaterThanOrEqual(baseline.score0to100 - 5);
  });
});
