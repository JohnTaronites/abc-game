import type { Point, Stroke, Checkpoint } from '../types';

/**
 * Auto-generates checkpoints from letter strokes by interpolating
 * evenly-spaced sample points along each stroke.
 */
export function generateCheckpoints(strokes: Stroke[], _canvasW?: number, _canvasH?: number): Checkpoint[] {
  const SAMPLES_PER_STROKE = 14; // more checkpoints = finer validation
  const RADIUS = 0.07;           // ~25px on 360px canvas — tighter hit zone
  const checkpoints: Checkpoint[] = [];

  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    if (stroke.length === 1) {
      checkpoints.push({ x: stroke[0].x, y: stroke[0].y, radius: RADIUS });
      continue;
    }

    // Build cumulative arc-length in NORMALIZED space
    const lengths: number[] = [0];
    for (let i = 1; i < stroke.length; i++) {
      const dx = stroke[i].x - stroke[i - 1].x;
      const dy = stroke[i].y - stroke[i - 1].y;
      lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    const totalLen = lengths[lengths.length - 1];

    for (let n = 0; n < SAMPLES_PER_STROKE; n++) {
      const target = (n / (SAMPLES_PER_STROKE - 1)) * totalLen;
      let seg = 1;
      while (seg < lengths.length - 1 && lengths[seg] < target) seg++;
      const segStart = lengths[seg - 1];
      const segEnd = lengths[seg];
      const t = segEnd === segStart ? 0 : (target - segStart) / (segEnd - segStart);
      checkpoints.push({
        x: stroke[seg - 1].x + (stroke[seg].x - stroke[seg - 1].x) * t,
        y: stroke[seg - 1].y + (stroke[seg].y - stroke[seg - 1].y) * t,
        radius: RADIUS,
      });
    }
  }

  return checkpoints;
}

/**
 * Two-metric accuracy:
 *
 * 1. FORWARD  — what % of letter checkpoints did the user pass through?
 *               Requires minimum ink so a single dot can't score.
 * 2. REVERSE  — what % of the user's drawn path is actually near the letter?
 *               Penalises random swipes that happen to cross a few points.
 *
 * final = forward × (0.55 + 0.45 × reverse)
 */
export function computeAccuracy(
  userStrokes: Point[][],
  checkpoints: Checkpoint[],
  canvasW: number,
  canvasH: number,
): number {
  if (checkpoints.length === 0) return 0;

  const allPoints = userStrokes.flat();
  if (allPoints.length < 6) return 0;

  // Minimum ink guard — less than 40px total path = not a real letter
  let totalInk = 0;
  for (const stroke of userStrokes) {
    for (let i = 1; i < stroke.length; i++) {
      const dx = stroke[i].x - stroke[i - 1].x;
      const dy = stroke[i].y - stroke[i - 1].y;
      totalInk += Math.sqrt(dx * dx + dy * dy);
    }
  }
  if (totalInk < 40) return 0;

  const dim = Math.min(canvasW, canvasH);

  // ── Metric 1: Forward — checkpoints hit by user ──────────────────────────
  let cpHits = 0;
  for (const cp of checkpoints) {
    const cpxPx = cp.x * canvasW;
    const cpyPx = cp.y * canvasH;
    const r = cp.radius * dim;
    const hit = allPoints.some(p => {
      const dx = p.x - cpxPx;
      const dy = p.y - cpyPx;
      return dx * dx + dy * dy <= r * r;
    });
    if (hit) cpHits++;
  }
  const forward = cpHits / checkpoints.length;

  // ── Metric 2: Reverse — how much of user's path is on the letter ─────────
  // Sample every few points for performance; use a slightly larger radius
  const REVERSE_RADIUS = 0.10 * dim;
  const step = Math.max(1, Math.floor(allPoints.length / 80));
  let nearCount = 0;
  let sampleCount = 0;
  for (let i = 0; i < allPoints.length; i += step) {
    sampleCount++;
    const p = allPoints[i];
    const onLetter = checkpoints.some(cp => {
      const dx = p.x - cp.x * canvasW;
      const dy = p.y - cp.y * canvasH;
      return dx * dx + dy * dy <= REVERSE_RADIUS * REVERSE_RADIUS;
    });
    if (onLetter) nearCount++;
  }
  const reverse = sampleCount > 0 ? nearCount / sampleCount : 0;

  // Combined: forward is primary, reverse penalises off-letter scribbles
  const raw = forward * (0.55 + 0.45 * reverse);
  return Math.round(raw * 100);
}

/** Maps an accuracy score to 0–3 stars. */
export function accuracyToStars(accuracy: number): number {
  if (accuracy >= 80) return 3;
  if (accuracy >= 62) return 2;
  if (accuracy >= 45) return 1;
  return 0;
}
