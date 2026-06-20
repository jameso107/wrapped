"use client";

import { useEffect, useRef } from "react";
import type { EffectKind } from "@/lib/types";

/**
 * A pointer-events-none canvas overlay rendered on top of a card's content.
 * `kind` selects the particle behavior:
 *   snow     – white flakes drifting down with sway
 *   petals   – rose petals tumbling down
 *   pixie    – golden Tinker-Bell sparkle floating up, twinkling (additive)
 *   confetti – one-shot celebratory cannon burst from the bottom corners
 *   sparkle  – sporadic four-point diamond glints (additive)
 * Cleans up its animation frame on unmount.
 */
export default function Effect({ kind }: { kind: EffectKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let raf = 0;
    let prev = 0;
    let draw: (dt: number, t: number) => void = () => {};

    // ── SNOW ─────────────────────────────────────────────────────────────
    if (kind === "snow") {
      const flakes = Array.from({ length: 80 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1, 3.2),
        vy: rand(0.3, 1.2),
        sway: rand(0.4, 1.3),
        phase: rand(0, Math.PI * 2),
      }));
      draw = (dt, t) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        for (const f of flakes) {
          f.y += f.vy * (dt / 16);
          f.x += Math.sin((t / 1000) * f.sway + f.phase) * 0.5;
          if (f.y > h + 5) {
            f.y = -5;
            f.x = rand(0, w);
          }
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    }

    // ── PETALS ───────────────────────────────────────────────────────────
    else if (kind === "petals") {
      const colors = ["#e23d6e", "#ff5d8f", "#c2185b", "#ff7aa2", "#ffa1bd"];
      const petals = Array.from({ length: 28 }, () => ({
        x: rand(0, w),
        y: rand(-h, h),
        vy: rand(0.5, 1.3),
        vx: rand(-0.4, 0.4),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.03, 0.03),
        size: rand(6, 12),
        sway: rand(0.5, 1.4),
        phase: rand(0, Math.PI * 2),
        color: colors[(Math.random() * colors.length) | 0],
      }));
      draw = (dt, t) => {
        ctx.clearRect(0, 0, w, h);
        for (const p of petals) {
          p.y += p.vy * (dt / 16);
          p.x += (p.vx + Math.sin((t / 1000) * p.sway + p.phase) * 0.6) * (dt / 16);
          p.rot += p.vr * (dt / 16);
          if (p.y > h + 14) {
            p.y = -14;
            p.x = rand(0, w);
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      };
    }

    // ── PIXIE DUST ───────────────────────────────────────────────────────
    else if (kind === "pixie") {
      type Spark = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        max: number;
        size: number;
        gold: boolean;
      };
      let sparks: Spark[] = [];
      const spawn = (n: number) => {
        for (let i = 0; i < n; i++) {
          sparks.push({
            x: rand(0, w),
            y: rand(0, h),
            vx: rand(-0.3, 0.3),
            vy: rand(-0.7, -0.2),
            life: 0,
            max: rand(40, 90),
            size: rand(1, 3.2),
            gold: Math.random() < 0.7,
          });
        }
      };
      let acc = 0;
      draw = (dt, t) => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        acc += dt;
        if (acc > 50) {
          acc = 0;
          spawn(5);
        }
        sparks = sparks.filter((s) => {
          s.life++;
          s.x += s.vx * (dt / 16);
          s.y += s.vy * (dt / 16);
          const p = s.life / s.max;
          const twinkle = Math.sin(p * Math.PI) * (0.6 + 0.4 * Math.sin(t / 90 + s.x));
          const a = Math.max(0, twinkle);
          ctx.fillStyle = s.gold
            ? `rgba(255,215,120,${a})`
            : `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          return s.life < s.max;
        });
        ctx.globalCompositeOperation = "source-over";
      };
    }

    // ── CONFETTI (one-shot cannon) ───────────────────────────────────────
    else if (kind === "confetti") {
      const colors = [
        "#ff4d6d",
        "#ffffff",
        "#3b82f6",
        "#ffd166",
        "#ff8fab",
        "#a855f7",
      ];
      type Piece = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        rot: number;
        vr: number;
        w: number;
        h: number;
        color: string;
      };
      const pieces: Piece[] = [];
      const s = Math.max(0.5, h / 800);
      const cannon = (ox: number, dir: number) => {
        for (let i = 0; i < 70; i++) {
          pieces.push({
            x: ox,
            y: h + 6,
            // always launch upward (negative vy), drifting inward
            vx: (dir * rand(2.5, 6) + rand(-1.5, 1.5)) * s,
            vy: -rand(9, 16) * s,
            rot: rand(0, Math.PI * 2),
            vr: rand(-0.3, 0.3),
            w: rand(5, 9),
            h: rand(8, 14),
            color: colors[(Math.random() * colors.length) | 0],
          });
        }
      };
      cannon(w * 0.1, 1);
      cannon(w * 0.9, -1);
      const grav = 0.35 * s;
      draw = (dt, t) => {
        ctx.clearRect(0, 0, w, h);
        const f = dt / 16;
        for (const p of pieces) {
          p.vy += grav * f; // gravity scaled to card => arc stays on screen
          p.vx *= 0.992;
          p.x += (p.vx + Math.sin(t / 200 + p.rot) * 0.6) * f; // flutter
          p.y += p.vy * f;
          p.rot += p.vr * f;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * (0.6 + 0.4 * Math.abs(Math.sin(p.rot))));
          ctx.restore();
        }
      };
    }

    // ── SPARKLE (diamond glints) ─────────────────────────────────────────
    else if (kind === "sparkle") {
      type Glint = { x: number; y: number; life: number; max: number; size: number };
      let glints: Glint[] = [];
      let acc = 0;
      let nextSpawn = 120;
      draw = (dt) => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        acc += dt;
        if (acc >= nextSpawn) {
          acc = 0;
          nextSpawn = rand(120, 320);
          glints.push({
            x: rand(w * 0.1, w * 0.9),
            y: rand(h * 0.1, h * 0.9),
            life: 0,
            max: rand(28, 50),
            size: rand(7, 16),
          });
        }
        glints = glints.filter((g) => {
          g.life++;
          const p = g.life / g.max;
          const s = Math.sin(p * Math.PI); // grow then shrink
          const len = g.size * s;
          const a = s;
          ctx.strokeStyle = `rgba(220,235,255,${a})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(g.x - len, g.y);
          ctx.lineTo(g.x + len, g.y);
          ctx.moveTo(g.x, g.y - len);
          ctx.lineTo(g.x, g.y + len);
          ctx.stroke();
          // bright core
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, 1.3 * s + 0.5, 0, Math.PI * 2);
          ctx.fill();
          return g.life < g.max;
        });
        ctx.globalCompositeOperation = "source-over";
      };
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!prev) prev = t;
      const dt = Math.min(50, t - prev);
      prev = t;
      draw(dt, t);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
