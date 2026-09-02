export type KeyStats = { attempts: number; errors: number; correct: number };

export type TypingStats = {
  startedAt: number;
  elapsedSeconds: number;
  attempts: number;
  errors: number;
  correct: number;
  chars: number;
  keyStats: Record<string, KeyStats>;
};

export function createStats(now = Date.now()): TypingStats {
  return { startedAt: now, elapsedSeconds: 0, attempts: 0, errors: 0, correct: 0, chars: 0, keyStats: {} };
}

export function recordKeystroke(stats: TypingStats, key: string, correct: boolean): TypingStats {
  const prev = stats.keyStats[key] ?? { attempts: 0, errors: 0, correct: 0 };
  const nextKey = { attempts: prev.attempts + 1, errors: prev.errors + (correct ? 0 : 1), correct: prev.correct + (correct ? 1 : 0) };
  return {
    ...stats,
    attempts: stats.attempts + 1,
    errors: stats.errors + (correct ? 0 : 1),
    correct: stats.correct + (correct ? 1 : 0),
    chars: stats.chars + (correct ? 1 : 0),
    keyStats: { ...stats.keyStats, [key]: nextKey },
  };
}

export function setElapsed(stats: TypingStats, elapsedSeconds: number): TypingStats {
  return { ...stats, elapsedSeconds: Math.max(0, elapsedSeconds) };
}

export function accuracy(stats: TypingStats): number {
  return stats.attempts === 0 ? 100 : (stats.correct / stats.attempts) * 100;
}

export function wpm(stats: TypingStats): number {
  return stats.elapsedSeconds <= 0 ? 0 : (stats.chars / 5) / (stats.elapsedSeconds / 60);
}

export function keyDifficulty(stats: TypingStats, key: string): number {
  const item = stats.keyStats[key];
  return !item || item.attempts === 0 ? 0 : item.errors / item.attempts;
}
