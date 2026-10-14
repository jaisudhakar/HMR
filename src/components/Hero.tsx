'use client';

import { useEffect, useRef, useState } from 'react';
import { photos } from '@/data/photos';
import { prefersReducedMotion } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { useSite } from './SiteProvider';

const SLIDE_MS = 7000;
const slides = [
  { photo: photos.biryaniHandi, caption: 'The Signature Handi Biryani' },
  { photo: photos.pool, caption: 'Rooftop infinity pool' },
  { photo: photos.roomPresidential, caption: 'The Presidential Suite' },
  { photo: photos.lobby, caption: 'The Grand Lobby' },
];

/** Drifting embers over the hero photography. */
function useDust(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, raf = 0, running = true;
    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; t: number };
    let ps: P[] = [];
    const spawn = (anywhere: boolean): P => ({
      x: Math.random() * w, y: anywhere ? Math.random() * h : h + 10, r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08), vx: (Math.random() - 0.5) * 0.15, a: Math.random() * 0.6 + 0.2, t: Math.random() * 6.3,
    });
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: Math.round(Math.min(70, w / 22)) }, () => spawn(true));
    };
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.t += 0.02; p.y += p.vy; p.x += p.vx + Math.sin(p.t) * 0.12;
        if (p.y < -10) Object.assign(p, spawn(false));
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,160,105,${p.a * (0.6 + Math.sin(p.t * 2) * 0.4)})`;
        ctx.shadowColor = 'rgba(226,160,105,.8)'; ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) tick();
    });
    io.observe(canvas);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); io.disconnect(); };
  }, [ref]);
}

export function Hero() {
  const { setMenuCat } = useSite();
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const dust = useRef<HTMLCanvasElement>(null);
  useDust(dust);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setTimeout(() => setIndex(i => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, cycle]);

  const go = (i: number) => { setIndex(i); setCycle(c => c + 1); };

  return (
    <section className="lux-hero" aria-labelledby="heroTitle" style={{ ['--slide-ms' as string]: `${SLIDE_MS}ms` }}>
      <div className="lux-hero__media" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.caption} className={`lux-hero__slide${i === index ? ' is-active' : ''}`}>
            <Img photo={s.photo} sizes="100vw" priority={i === 0} />
          </div>
        ))}
      </div>
      <div className="lux-hero__shade" aria-hidden="true" />
      <canvas className="lux-hero__dust" ref={dust} aria-hidden="true" />

      <div className="lux-hero__inner">
        <div className="lux-hero__content">
          <p className="eyebrow" data-in style={{ ['--d' as string]: 0 }}>HMR Hotels &amp; Resorts · Home of the HMR Biryani</p>
          <h1 className="lux-hero__title" id="heroTitle">
            <span className="line"><span data-in style={{ ['--d' as string]: 1 }}>Our famous biryani,</span></span>
            <span className="line"><span data-in style={{ ['--d' as string]: 2 }}>to your door.</span></span>
          </h1>
          <p className="lux-hero__lead" data-in style={{ ['--d' as string]: 3 }}>
            Aged basmati, saffron and tender meat, sealed in a handi and slow-cooked on dum — served in our restaurant
            or opened at your door, still steaming.
          </p>
          <div className="lux-hero__stats" data-in style={{ ['--d' as string]: 4 }}>
            <div className="stat-card">
              <Icon name="flame" size="lg" className="stat-card__icon" />
              <div>
                <span className="stat-card__label">Slow-cooked on dum</span>
                <span className="stat-card__value"><span data-count-to="4">0</span> hours</span>
              </div>
            </div>
            <div className="stat-card">
              <Icon name="clock" size="lg" className="stat-card__icon" />
              <div>
                <span className="stat-card__label">In-room delivery</span>
                <span className="stat-card__value"><span data-count-to="25">0</span> min</span>
              </div>
            </div>
          </div>
          <div className="lux-hero__ctas" data-in style={{ ['--d' as string]: 5 }}>
            <a className="btn btn--copper btn--lg" href="#menu" onClick={() => setMenuCat('biryani')}>
              Order biryani <Icon name="arrow" className="btn__arrow" />
            </a>
            <a className="btn btn--ghost btn--lg" href="#rooms">Explore the hotel</a>
          </div>
        </div>

        <div className="lux-hero__slides" role="tablist" aria-label="Hero photographs" data-in style={{ ['--d' as string]: 6 }}>
          {slides.map((s, i) => (
            <button key={s.caption} type="button" role="tab" aria-selected={i === index}
              className={`lux-hero__dot${i === index ? ' is-active' : ''}`} onClick={() => go(i)}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>{s.caption}</span>
              <i key={i === index ? `${index}-${cycle}` : i} />
            </button>
          ))}
        </div>
      </div>

      <a className="scroll-cue" href="#book" aria-label="Scroll to booking"><span /></a>
    </section>
  );
}
