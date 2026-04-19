import type { Point, Stroke } from '../types';

/**
 * Linearly interpolates N evenly-spaced points along a polyline stroke.
 * Converts normalized [0-1] coords to canvas pixel coords.
 */
export function interpolateStroke(
  stroke: Stroke,
  numPoints: number,
  canvasW: number,
  canvasH: number,
): Point[] {
  if (stroke.length === 0) return [];
  if (stroke.length === 1)
    return Array(numPoints).fill({ x: stroke[0].x * canvasW, y: stroke[0].y * canvasH });

  // Build cumulative arc lengths
  const pixelPoints = stroke.map(p => ({ x: p.x * canvasW, y: p.y * canvasH }));
  const lengths: number[] = [0];
  for (let i = 1; i < pixelPoints.length; i++) {
    const dx = pixelPoints[i].x - pixelPoints[i - 1].x;
    const dy = pixelPoints[i].y - pixelPoints[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const totalLen = lengths[lengths.length - 1];
  if (totalLen === 0) return Array(numPoints).fill(pixelPoints[0]);

  const result: Point[] = [];
  for (let n = 0; n < numPoints; n++) {
    const target = (n / (numPoints - 1)) * totalLen;
    // Find segment containing target
    let seg = 1;
    while (seg < lengths.length - 1 && lengths[seg] < target) seg++;
    const segStart = lengths[seg - 1];
    const segEnd = lengths[seg];
    const t = segEnd === segStart ? 0 : (target - segStart) / (segEnd - segStart);
    result.push({
      x: pixelPoints[seg - 1].x + (pixelPoints[seg].x - pixelPoints[seg - 1].x) * t,
      y: pixelPoints[seg - 1].y + (pixelPoints[seg].y - pixelPoints[seg - 1].y) * t,
    });
  }
  return result;
}

/**
 * Computes total arc length of all strokes (in pixels), with a gap between strokes.
 */
export function computeTotalLength(
  strokes: Stroke[],
  canvasW: number,
  canvasH: number,
  gap = 60,
): number {
  let total = 0;
  for (let si = 0; si < strokes.length; si++) {
    const stroke = strokes[si];
    for (let i = 1; i < stroke.length; i++) {
      const dx = (stroke[i].x - stroke[i - 1].x) * canvasW;
      const dy = (stroke[i].y - stroke[i - 1].y) * canvasH;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    if (si < strokes.length - 1) total += gap;
  }
  return Math.max(total, 1);
}

/**
 * Resolves (x, y) canvas coordinates from a parametric distance along all strokes.
 * Returns the pixel position and whether the dot is in the inter-stroke gap.
 */
export function getPositionAtDistance(
  strokes: Stroke[],
  targetDist: number,
  canvasW: number,
  canvasH: number,
  gap = 60,
): { x: number; y: number; inGap: boolean } {
  let traveled = 0;

  for (let si = 0; si < strokes.length; si++) {
    const stroke = strokes[si];
    const pixelPoints = stroke.map(p => ({ x: p.x * canvasW, y: p.y * canvasH }));

    for (let i = 1; i < pixelPoints.length; i++) {
      const dx = pixelPoints[i].x - pixelPoints[i - 1].x;
      const dy = pixelPoints[i].y - pixelPoints[i - 1].y;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      if (traveled + segLen >= targetDist) {
        const t = segLen === 0 ? 0 : (targetDist - traveled) / segLen;
        return {
          x: pixelPoints[i - 1].x + dx * t,
          y: pixelPoints[i - 1].y + dy * t,
          inGap: false,
        };
      }
      traveled += segLen;
    }

    // Gap between strokes
    if (si < strokes.length - 1) {
      if (traveled + gap >= targetDist) {
        const last = pixelPoints[pixelPoints.length - 1];
        return { x: last.x, y: last.y, inGap: true };
      }
      traveled += gap;
    }
  }

  // Fallback: return start of first stroke
  const first = strokes[0][0];
  return { x: first.x * canvasW, y: first.y * canvasH, inGap: false };
}

/**
 * Draws a smooth quadratic-bezier curve through an array of canvas-pixel points.
 */
export function drawSmoothLine(ctx: CanvasRenderingContext2D, points: Point[]): void {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}
