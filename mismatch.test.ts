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

describe('mismatch scoring penalties', () => {
  test('applies high severity penalty', () => {
    const baseline = toScoreResult({ features: mkFeatures() });
    const penalized = toScoreResult({
      features: mkFeatures(),
      llm: {
        score: 0.8,
        type: 'specific',
        issues: [],
        suggestions: [],
        mismatch: {
          intent: 'bug_fix',
          code_reality: { logic_change: false, structural_change: false, performance_change: false, cosmetic_only: true },
          mismatch: true,
          severity: 'high',
          confidence: 1.0,
          reason: 'Claimed bug fix but only changed comments'
        }
      }
    });

    // High mismatch penalty is now 0.15 (15 points)
    expect(penalized.score0to100).toBeLessThanOrEqual(baseline.score0to100 - 15);
    expect(penalized.risk.signals.some((s: string) => s.includes('Intent mismatch'))).toBe(true);
  });

  test('applies medium severity penalty', () => {
    const baseline = toScoreResult({ features: mkFeatures() });
    const penalized = toScoreResult({
      features: mkFeatures(),
      llm: {
        score: 0.8,
        type: 'specific',
        issues: [],
        suggestions: [],
        mismatch: {
          intent: 'feature',
          code_reality: { logic_change: true, structural_change: false, performance_change: false, cosmetic_only: false },
          mismatch: true,
          severity: 'medium',
          confidence: 0.8,
          reason: 'Description is slightly misleading'
        }
      }
    });

    // Medium mismatch penalty is also 0.15 (15 points) in current logic
    expect(penalized.score0to100).toBeLessThanOrEqual(baseline.score0to100 - 15);
  });
});
