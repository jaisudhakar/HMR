'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { dishById } from '@/data/menu';
import { food, photos, type Photo } from '@/data/photos';
import { money } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { useSite } from './SiteProvider';

const cats: { cat: string; label: string; photo: Photo }[] = [
  { cat: 'biryani', label: 'Biryani', photo: photos.biryaniPlate },
  { cat: 'breakfast', label: 'Breakfast', photo: food('croissant') },
  { cat: 'salads', label: 'All-day', photo: food('caesar') },
  { cat: 'desserts', label: 'Desserts', photo: food('fondant') },
  { cat: 'beverages', label: 'Wine & Bar', photo: photos.bar },
];

export function CategoryStrip() {
  const { setMenuCat } = useSite();
  return (
    <section className="cats" id="categories" aria-label="Browse the menu">
      {cats.map(c => (
        <a key={c.cat} className="cat reveal" href="#menu" onClick={() => setMenuCat(c.cat)}>
          <span className="cat__img"><Img photo={c.photo} sizes="120px" /></span>
          <span>{c.label}</span><Icon name="chevron-r" size="sm" />
        </a>
      ))}
    </section>
  );
}

const phrases = ['Home of the HMR dum biryani', 'Served 24 hours', 'Sealed, slow-cooked, served', 'A higher standard stays with you'];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].flatMap(copy => phrases.flatMap(p => [<span key={`${copy}-${p}`}>{p}</span>, <i key={`${copy}-${p}-dot`}>✦</i>]))}
      </div>
    </div>
  );
}

const steps: { title: string; text: string; time: string; icon: ReactNode }[] = [
  {
    title: 'Marinate', text: 'Overnight in yoghurt, ginger, garlic, mint and our 21-spice garam masala.', time: '12 hours',
    icon: <path d="M6 22h36c0 10-8 18-18 18S6 32 6 22Z M14 16c2-3 0-5 2-8M24 16c2-3 0-5 2-8M34 16c2-3 0-5 2-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  },
  {
    title: 'Layer', text: 'Aged basmati, saffron milk, ghee, crisp birista and fresh mint — by hand, in that order.', time: '7 layers',
    icon: <path d="M8 16 24 8l16 8-16 8-16-8Zm0 8 16 8 16-8M8 32l16 8 16-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  },
  {
    title: 'Seal', text: 'The handi is sealed with a ring of dough, locking in every drop of steam.', time: 'Dough-sealed',
    icon: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="24" cy="26" rx="18" ry="7" /><path d="M8 24c2-8 10-12 16-12s14 4 16 12M24 12V8" /></g>,
  },
  {
    title: 'Dum', text: 'Slow-cooked over embers for four hours, then served at Ember or opened at your door.', time: '4 hours',
    icon: <path d="M24 42c-7 0-12-5-12-11 0-6 4-9 6-14 1 3 2 5 4 6 0-5 3-9 7-12-1 5 2 8 4 11 2 3 3 5 3 9 0 6-5 11-12 11Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  },
];

function QuickAdd({ id, note, ghost }: { id: string; note: string; ghost?: boolean }) {
  const { addToCart } = useSite();
  const card = useRef<HTMLDivElement>(null);
  const dish = dishById[id];
  return (
    <div className="dum__offer" ref={card}>
      <span className="dum__offer-img"><Img photo={dish.photo} sizes="110px" /></span>
      <div><b>{dish.name}</b><span>{note}</span></div>
      <span className="dum__price">{money(dish.price)}</span>
      <button className={`btn ${ghost ? 'btn--ghost' : 'btn--copper'}`} type="button" onClick={() => addToCart(id, 1, card.current)}>
        Add to order <Icon name="plus" />
      </button>
    </div>
  );
}

export function DumSection() {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-lit'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dum" id="biryani" aria-labelledby="dumTitle">
      <div className="dum__hero reveal">
        <div className="dum__photo dum__photo--main"><Img photo={photos.biryaniPair} sizes="(max-width: 1080px) 100vw, 50vw" /></div>
        <div className="dum__photo dum__photo--inset"><Img photo={photos.biryaniHandi} sizes="(max-width: 1080px) 50vw, 22vw" /></div>
        <div className="dum__intro">
          <p className="eyebrow">Our signature</p>
          <h2 className="section-title" id="dumTitle">The art <em>of dum.</em></h2>
          <p>
            Biryani is the dish HMR is known for. Each handi takes a full day: marinated overnight, layered by hand,
            sealed with dough and slow-cooked over embers — the way it has been made in Hyderabad’s royal kitchens for centuries.
          </p>
        </div>
      </div>
      <ol className="dum__steps" ref={list}>
        {steps.map((s, i) => (
          <li className="reveal" key={s.title}>
            <span className="dum__num">{String(i + 1).padStart(2, '0')}</span>
            <svg className="dum__icon" viewBox="0 0 48 48" aria-hidden="true">{s.icon}</svg>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span className="dum__time">{s.time}</span>
          </li>
        ))}
      </ol>
      <div className="dum__cta reveal">
        <QuickAdd id="signature" note="For one or two · with raita & salan" />
        <QuickAdd id="family-handi" note="Serves four · with raita, salan & dessert" ghost />
      </div>
    </section>
  );
}
