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

describe('duplicate scoring penalties', () => {
  test('applies high duplication penalty', () => {
    const baseline = toScoreResult({ features: mkFeatures() });
    const penalized = toScoreResult({
      features: mkFeatures(),
      llm: {
        score: 0.8,
        type: 'specific',
        issues: [],
        suggestions: [],
        duplication: {
          is_duplicate: true,
          similarity_score: 0.95,
          duplication_level: 'high',
          matched_patterns: ['Identical description', 'Repeated logic'],
          confidence: 0.9,
          reason: 'Clear spam pattern detected across multiple PRs'
        }
      }
    });

    // High duplication penalty is now 0.3 (30 points)
    expect(penalized.score0to100).toBeLessThanOrEqual(baseline.score0to100 - 30);
    expect(penalized.risk.level).toBe('medium');
    expect(penalized.risk.signals).toContain('Suspected duplication/spam');
  });
});
