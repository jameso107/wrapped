"use client";

import { useEffect, useRef } from "react";

// Red / white / blue.
const PALETTE: [number, number, number][] = [
  [255, 45, 64], // red
  [255, 255, 255], // white
  [40, 120, 255], // blue
];

/**
 * Full-bleed canvas fireworks: rockets launch from the bottom across the whole
 * width, arc up to varied heights, and burst into red/white/blue showers with
 * glowing trails (a translucent dark-sky fade each frame). Additive "lighter"
 * blending makes overlaps glow. Runs only while mounted (the wedding card) and
 * cancels its animation frame on unmount.
 */
export default function Fireworks() {
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
    const pickColor = () => PALETTE[(Math.random() * PALETTE.length) | 0];
    const scale = () => Math.max(0.6, h / 800);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      size: number;
      c: [number, number, number];
    };
    type Rocket = {
      x: number;
      y: number;
      vy: number;
      target: number;
      c: [number, number, number];
    };

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const launch = () => {
      const s = scale();
      rockets.push({
        x: rand(w * 0.08, w * 0.92),
        y: h + 4,
        vy: rand(-13.5, -10.5) * s,
        target: rand(h * 0.08, h * 0.7),
        c: pickColor(),
      });
    };

    const explode = (x: number, y: number, c: [number, number, number]) => {
      const s = scale();
      const n = (rand(55, 100) | 0);
      const power = rand(2.2, 4.6) * s;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + rand(-0.07, 0.07);
        const sp = rand(0.35, 1) * power;
        const c2: [number, number, number] =
          Math.random() < 0.18 ? [255, 255, 255] : c;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: rand(50, 95),
          size: rand(1.6, 3) * s,
          c: c2,
        });
      }
    };

    let raf = 0;
    let prev = 0;
    let acc = 0;
    let nextLaunch = 150;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!prev) prev = t;
      const dt = Math.min(50, t - prev);
      prev = t;

      acc += dt;
      if (acc >= nextLaunch) {
        acc = 0;
        nextLaunch = rand(260, 520);
        launch();
        if (Math.random() < 0.6) launch();
        if (Math.random() < 0.25) launch();
      }

      // Translucent dark-sky fade => glowing trails + a night backdrop.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8,6,26,0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      rockets = rockets.filter((r) => {
        r.y += r.vy;
        r.vy += 0.12;
        ctx.fillStyle = `rgb(${r.c[0]},${r.c[1]},${r.c[2]})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.target || r.vy >= 0) {
          explode(r.x, r.y, r.c);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        const alpha = Math.max(0, 1 - p.life / p.max);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return p.life < p.max;
      });

      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />;
}
