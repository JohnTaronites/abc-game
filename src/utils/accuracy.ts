import type { Point, Stroke, Checkpoint } from '../types';

/**
 * Auto-generates checkpoints from letter strokes by interpolating
 * evenly-spaced sample points along each stroke.
 */
export function generateCheckpoints(strokes: Stroke[], _canvasW?: number, _canvasH?: number): Checkpoint[] {
  const SAMPLES_PER_STROKE = 8;
  const RADIUS = 0.14; // normalized tolerance radius (generous for kids)
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
 * Given all user strokes (in canvas pixel coords) and checkpoints (in normalized coords),
 * returns accuracy as a 0–100 integer.
 */
export function computeAccuracy(
  userStrokes: Point[][],
  checkpoints: Checkpoint[],
  canvasW: number,
  canvasH: number,
): number {
  if (checkpoints.length === 0 || userStrokes.flat().length === 0) return 0;

  const allPoints = userStrokes.flat();
  let hits = 0;

  for (const cp of checkpoints) {
    const cpxPx = cp.x * canvasW;
    const cpyPx = cp.y * canvasH;
    const radiusPx = cp.radius * Math.min(canvasW, canvasH);

    const hit = allPoints.some(p => {
      const dx = p.x - cpxPx;
      const dy = p.y - cpyPx;
      return dx * dx + dy * dy <= radiusPx * radiusPx;
    });
    if (hit) hits++;
  }

  return Math.round((hits / checkpoints.length) * 100);
}

/** Maps an accuracy score to 0–3 stars. */
export function accuracyToStars(accuracy: number): number {
  if (accuracy >= 88) return 3;
  if (accuracy >= 72) return 2;
  if (accuracy >= 55) return 1;
  return 0;
}
