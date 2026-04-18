import { describe, expect, test } from 'vitest';
import { toScoreResult } from '../src/scoring.js';
import type { FeatureVector } from '../src/types.js';

function mkFeatures(overrides: Partial<FeatureVector> = {}): FeatureVector {
  return {
    linguistic: { genericPhraseHits: 0, specificityScore: 0.8, clarityScore: 0.8 },
    code: {
      changedFiles: 3,
      additions: 50,
      deletions: 10,
      diffSizeScore: 0.8,
      impactHeuristicScore: 0.8
    },
    context: { repoStructureAlignmentScore: 0.8, issueLinkScore: 0.7 },
    behavioral: { accountAgeDays: 400, trustScore: 0.9 },
    ...overrides
  };
}

describe('scoring', () => {
  test('produces 0..100 score', () => {
    const result = toScoreResult({ features: mkFeatures() });
    expect(result.score0to100).toBeGreaterThanOrEqual(0);
    expect(result.score0to100).toBeLessThanOrEqual(100);
  });

  test('low quality yields low category', () => {
    const result = toScoreResult({
      features: mkFeatures({
        linguistic: { genericPhraseHits: 3, specificityScore: 0.1, clarityScore: 0.2 },
        code: {
          changedFiles: 80,
          additions: 5000,
          deletions: 2000,
          diffSizeScore: 0.05,
          impactHeuristicScore: 0.2
        },
        context: { repoStructureAlignmentScore: 0.1, issueLinkScore: 0.2 },
        behavioral: { accountAgeDays: 2, trustScore: 0.4 }
      })
    });

    expect(result.category).toBe('low');
  });
});
