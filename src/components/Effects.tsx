'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/format';

export function countUp(el: HTMLElement, duration = 1400) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const to = parseFloat(el.dataset.countTo ?? '0');
  const dec = parseInt(el.dataset.decimals ?? '0', 10);
  if (prefersReducedMotion()) { el.textContent = to.toFixed(dec); return; }
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Page-level motion: preloader hand-off, scroll reveals and counters. */
export function Effects() {
  useEffect(() => {
    const body = document.body;
    const start = performance.now();
    const ready = () => {
      const wait = prefersReducedMotion() ? 0 : Math.max(0, 1100 - (performance.now() - start));
      setTimeout(() => {
        body.classList.remove('is-loading');
        requestAnimationFrame(() => body.classList.add('is-ready'));
        document.querySelectorAll<HTMLElement>('.lux-hero [data-count-to]').forEach(el => countUp(el, 900));
      }, wait);
    };
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready, { once: true });
    const failSafe = setTimeout(ready, 3500);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add('is-visible');
        el.querySelectorAll<HTMLElement>('[data-count-to]').forEach(n => countUp(n));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const watch = (root: ParentNode) => root.querySelectorAll<HTMLElement>('.reveal:not([data-watched])').forEach(el => {
      el.dataset.watched = '1';
      if (!el.style.getPropertyValue('--d') && el.parentElement) {
        const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        el.style.setProperty('--d', String(Math.max(0, sibs.indexOf(el))));
      }
      io.observe(el);
    });
    watch(document);
    const mo = new MutationObserver(() => watch(document));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { clearTimeout(failSafe); io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
