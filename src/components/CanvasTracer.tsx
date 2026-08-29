import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import type { LetterData, Point } from '../types';
import { generateCheckpoints, computeAccuracy } from '../utils/accuracy';
import {
  computeTotalLength,
  getPositionAtDistance,
  drawSmoothLine,
} from '../utils/pathUtils';

// Internal canvas resolution — independent of CSS display size
const CW = 360;
const CH = 420;

interface CanvasTracerProps {
  letterData: LetterData;
  showHint: boolean;       // show hint path after a failed attempt
  onCheck: (accuracy: number) => void;
}

const CanvasTracer: React.FC<CanvasTracerProps> = ({ letterData, showHint, onCheck }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing state (refs to avoid re-render on each pointer event)
  const isPointerDown = useRef(false);
  const currentStroke = useRef<Point[]>([]);
  const allStrokes = useRef<Point[][]>([]);

  // Guide animation state
  const animIdRef = useRef<number>(0);
  const distTraveled = useRef(0);
  const lastTime = useRef<number | null>(null);
  const isUserActive = useRef(false); // hides guide while user draws

  // Pre-compute checkpoints and total guide path length
  const checkpoints = useMemo(
    () => generateCheckpoints(letterData.strokes),
    [letterData],
  );
  const totalLength = useMemo(
    () => computeTotalLength(letterData.strokes, CW, CH),
    [letterData],
  );

  // ── Canvas rendering ────────────────────────────────────────────────────────
  const render = useCallback(
    (guideDot: { x: number; y: number; inGap: boolean } | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, CW, CH);

      const color = letterData.color;

      // ── Guide strokes (dashed pale lines) ──────────────────────────────────
      ctx.save();
      ctx.setLineDash([14, 10]);
      ctx.strokeStyle = '#DDDDDD';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const stroke of letterData.strokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x * CW, stroke[0].y * CH);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x * CW, stroke[i].y * CH);
        }
        ctx.stroke();
      }
      ctx.restore();

      // ── Stroke start markers (pulsing dots) ────────────────────────────────
      for (const stroke of letterData.strokes) {
        if (stroke.length === 0) continue;
        const sx = stroke[0].x * CW;
        const sy = stroke[0].y * CH;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.fillStyle = color + '33';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = color + '99';
        ctx.fill();
      }

      // ── Hint: dense interpolated guide line ────────────────────────────────
      if (showHint) {
        ctx.save();
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = color + 'AA';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (const stroke of letterData.strokes) {
          if (stroke.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(stroke[0].x * CW, stroke[0].y * CH);
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x * CW, stroke[i].y * CH);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Animated guide dot ─────────────────────────────────────────────────
      if (guideDot && !guideDot.inGap && !isUserActive.current) {
        const { x, y } = guideDot;
        // Outer glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 22);
        grd.addColorStop(0, color + 'AA');
        grd.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        // Inner white highlight
        ctx.beginPath();
        ctx.arc(x - 3, y - 3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      }

      // ── User's drawn strokes ───────────────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = color + '66';
      ctx.shadowBlur = 8;

      for (const stroke of allStrokes.current) {
        drawSmoothLine(ctx, stroke);
      }
      // Live stroke being drawn
      if (currentStroke.current.length > 1) {
        drawSmoothLine(ctx, currentStroke.current);
      }
      ctx.restore();
    },
    [letterData, showHint],
  );

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const SPEED = 130; // px / second
    distTraveled.current = 0;
    lastTime.current = null;
    isUserActive.current = false;

    const loop = (time: number) => {
      if (lastTime.current === null) lastTime.current = time;
      const dt = (time - lastTime.current) / 1000;
      lastTime.current = time;

      distTraveled.current = (distTraveled.current + SPEED * dt) % totalLength;
      const pos = getPositionAtDistance(letterData.strokes, distTraveled.current, CW, CH);
      render(pos);

      animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animIdRef.current);
  }, [letterData, totalLength, render]);

  // ── Pointer-event helpers ───────────────────────────────────────────────────
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CW,
      y: ((e.clientY - rect.top) / rect.height) * CH,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isPointerDown.current = true;
    isUserActive.current = true;
    currentStroke.current = [getCanvasPoint(e)];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDown.current) return;
    currentStroke.current.push(getCanvasPoint(e));
    render(null);
  };

  const handlePointerUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    if (currentStroke.current.length > 1) {
      allStrokes.current = [...allStrokes.current, [...currentStroke.current]];
    }
    currentStroke.current = [];
  };

  // ── Public actions ──────────────────────────────────────────────────────────
  const handleClear = () => {
    allStrokes.current = [];
    currentStroke.current = [];
    isUserActive.current = false;
  };

  const handleCheck = () => {
    const accuracy = computeAccuracy(allStrokes.current, checkpoints, CW, CH);
    onCheck(accuracy);
  };

  return (
    <div className="canvas-tracer">
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="tracing-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <div className="canvas-actions">
        <button className="btn btn-clear" onClick={handleClear} aria-label="Clear drawing">
          🗑️ Clear
        </button>
        <button className="btn btn-check" onClick={handleCheck} aria-label="Check my tracing">
          ✓ Check
        </button>
      </div>
    </div>
  );
};

export default CanvasTracer;
