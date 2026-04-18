import { describe, expect, test } from 'vitest';
import { extractFeatures } from '../src/features.js';
import type { PullRequestContext } from '../src/types.js';

describe('features', () => {
  test('generic phrases are detected', () => {
    const ctx: PullRequestContext = {
      owner: 'o',
      repo: 'r',
      pullNumber: 1,
      installationId: 1,
      title: 'Minor fixes',
      body: 'Just some updates and cleanup',
      authorLogin: 'a',
      authorId: 1,
      changedFiles: 1,
      additions: 5,
      deletions: 1
    };

    const f = extractFeatures(ctx);
    expect(f.linguistic.genericPhraseHits).toBeGreaterThan(0);
  });
});
