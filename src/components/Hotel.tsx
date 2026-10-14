'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gallery, reviews, rooms, type GalleryItem } from '@/data/hotel';
import { photos, type Photo } from '@/data/photos';
import { money } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { useSite } from './SiteProvider';

export function Rooms() {
  const { openBooking, setRoomType } = useSite();
  const track = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ w: 30, x: 0 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const paint = () => {
      const visible = Math.max(el.clientWidth / el.scrollWidth, 0.12);
      const max = el.scrollWidth - el.clientWidth;
      setBar({ w: visible * 100, x: max > 0 ? (el.scrollLeft / max) * (1 / visible - 1) * 100 : 0 });
    };
    paint();
    el.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);

    // Drag to scroll with the mouse
    let x0: number | null = null, s0 = 0, moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('button')) return;
      x0 = e.clientX; s0 = el.scrollLeft; moved = false; el.classList.add('is-grabbing');
    };
    const move = (e: PointerEvent) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = s0 - dx; };
    const up = () => { x0 = null; el.classList.remove('is-grabbing'); };
    const click = (e: MouseEvent) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    el.addEventListener('click', click, true);
    return () => {
      el.removeEventListener('scroll', paint); window.removeEventListener('resize', paint);
      el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up); el.removeEventListener('click', click, true);
    };
  }, []);

  const step = (dir: number) => {
    const card = track.current?.firstElementChild as HTMLElement | null;
    track.current?.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 24), behavior: 'smooth' });
  };

  return (
    <section className="rooms" id="rooms" aria-labelledby="roomsTitle">
      <div className="section-head reveal">
        <div>
          <p className="eyebrow">Stay</p>
          <h2 className="section-title" id="roomsTitle">Rooms &amp; Suites</h2>
        </div>
        <p className="section-head__lead">286 rooms and 34 suites, each finished in velvet, walnut and hand-brushed copper — and every one with our biryani on call, day and night.</p>
        <div className="rooms__nav">
          <button className="round-btn" type="button" onClick={() => step(-1)} aria-label="Previous rooms"><Icon name="chevron-l" /></button>
          <button className="round-btn" type="button" onClick={() => step(1)} aria-label="Next rooms"><Icon name="chevron-r" /></button>
        </div>
      </div>
      <div className="rooms__track" ref={track}>
        {rooms.map((r, i) => (
          <article className="room-card reveal" key={r.id} style={{ ['--d' as string]: i }}>
            <div className="room-card__media">
              <Img photo={r.photo} sizes="(max-width: 640px) 86vw, (max-width: 1080px) 46vw, 31vw" />
              <span className="room-card__tag">{r.tag}</span>
            </div>
            <div className="room-card__body">
              <h3>{r.name}</h3>
              <p className="room-card__desc">{r.desc}</p>
              <ul className="specs">
                <li><Icon name="size" size="sm" />{r.size} m²</li>
                <li><Icon name="bed" size="sm" />{r.bed}</li>
                <li><Icon name="user" size="sm" />Up to {r.guests}</li>
                <li><Icon name="eye" size="sm" />{r.view}</li>
              </ul>
              <ul className="features">{r.features.map(f => <li key={f}>{f}</li>)}</ul>
              <div className="room-card__foot">
                <p className="room-card__price"><small>From</small><b>{money(r.price)}</b><small>/ night</small></p>
                <button className="btn btn--copper btn--sm" type="button" onClick={() => { setRoomType(r.id); openBooking({ roomId: r.id }); }}>
                  Book now <Icon name="arrow" className="btn__arrow" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="rooms__progress" aria-hidden="true"><span style={{ width: `${bar.w}%`, transform: `translateX(${bar.x}%)` }} /></div>
    </section>
  );
}

const tiles: { cls: string; photo: Photo; tag: string; title: string; text: string; hours: string; link?: boolean }[] = [
  { cls: 'dining', photo: photos.restaurant, tag: 'Restaurant · Level 1 · Home of the HMR biryani', title: 'Ember', text: 'Our biryani handis are sealed with dough and slow-cooked over embers for four hours — the same kitchen that cooks your in-room dining.', hours: 'Daily 6:30 – 23:30', link: true },
  { cls: 'pool', photo: photos.pool, tag: 'Rooftop · Level 32', title: 'Infinity Pool', text: 'Heated year-round, with cabanas and sunset service.', hours: '7:00 – 22:00' },
  { cls: 'spa', photo: photos.spa, tag: 'Wellness', title: 'The Copper Spa', text: 'Six treatment rooms, hammam and thermal pool.', hours: '9:00 – 21:00' },
  { cls: 'bar', photo: photos.bar, tag: 'Bar · Lobby level', title: 'Copper Bar', text: 'Rare wines by the glass and a live pianist nightly.', hours: '16:00 – 1:00' },
  { cls: 'gym', photo: photos.gym, tag: 'Wellness', title: 'Fitness Studio', text: 'Open around the clock, with personal trainers on request.', hours: '24 hours' },
  { cls: 'lobby', photo: photos.lobby, tag: 'Concierge', title: 'Les Clefs Concierge', text: 'Theatre tickets, private cars, tables that are “fully booked”.', hours: '24 hours · extension 7' },
];

export function Amenities() {
  const { setMenuCat } = useSite();
  return (
    <section className="amenities" id="amenities" aria-labelledby="amenTitle">
      <div className="section-head reveal">
        <div>
          <p className="eyebrow">Experiences</p>
          <h2 className="section-title" id="amenTitle">Beyond <em>the room.</em></h2>
        </div>
        <p className="section-head__lead">A rooftop pool above the skyline, a spa built around warm stone and water, and a restaurant famous for its biryani.</p>
      </div>
      <div className="bento">
        {tiles.map(t => (
          <article key={t.cls} className={`tile tile--${t.cls} reveal`}>
            <Img photo={t.photo} sizes={t.cls === 'dining' || t.cls === 'lobby' ? '(max-width: 1080px) 100vw, 50vw' : '(max-width: 1080px) 50vw, 25vw'} />
            <div className="tile__body">
              <span className="tile__tag">{t.tag}</span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
              <span className="tile__hours"><Icon name="clock" size="sm" />{t.hours}</span>
              {t.link && <a className="tile__link" href="#menu" onClick={() => setMenuCat('biryani')}>See the biryani menu <Icon name="arrow" size="sm" /></a>}
            </div>
          </article>
        ))}
      </div>
      <ul className="services reveal">
        {[['wifi', 'High-speed Wi-Fi'], ['car', 'Valet & airport transfers'], ['bell', '24-hour room service'], ['paw', 'Pet friendly'], ['briefcase', 'Meeting & event rooms'], ['access', 'Accessible rooms']].map(([i, s]) => (
          <li key={s}><Icon name={i} />{s}</li>
        ))}
      </ul>
    </section>
  );
}

export function About() {
  return (
    <section className="hotel" id="about" aria-labelledby="hotelTitle">
      <div className="hotel__copy reveal">
        <p className="eyebrow">About HMR</p>
        <h2 className="section-title" id="hotelTitle">A higher standard,<br /><em>delivered quietly.</em></h2>
        <p>Our kitchen never closes. Every handi of biryani is layered by hand, sealed with dough and slow-cooked on dum by the same brigade that runs Ember — then carried to your door and opened in front of you, still steaming.</p>
      </div>
      <div className="about__photo reveal"><Img photo={photos.exterior} sizes="(max-width: 1080px) 100vw, 50vw" /></div>
      <ul className="stats">
        <li className="reveal"><span className="stats__num"><span data-count-to="24">0</span>/7</span><span className="stats__label">Kitchen hours</span></li>
        <li className="reveal"><span className="stats__num"><span data-count-to="25">0</span> min</span><span className="stats__label">In-room delivery</span></li>
        <li className="reveal"><span className="stats__num"><span data-count-to="4.9" data-decimals="1">0</span><small>★</small></span><span className="stats__label">Guest rating</span></li>
        <li className="reveal"><span className="stats__num"><span data-count-to="320">0</span></span><span className="stats__label">Rooms &amp; suites</span></li>
      </ul>
      <ul className="awards">
        {[['★★★★★', 'Five-Star Rated', 'Hotel of distinction'], ['2026', 'Best Urban Retreat', 'Luxury Travel Awards'], ['Top 50', 'Hotel Dining', 'Ember restaurant'], ['9.6', 'Guest Favourite', 'Verified stays']].map(([l, b, s]) => (
          <li className="reveal" key={b}><span className="laurel">{l}</span><b>{b}</b><small>{s}</small></li>
        ))}
      </ul>
    </section>
  );
}

const filters = [['all', 'All'], ['rooms', 'Rooms'], ['dining', 'Dining'], ['wellness', 'Wellness'], ['hotel', 'Hotel']] as const;

export function Gallery() {
  const { setLightbox } = useSite();
  const [f, setF] = useState<string>('all');
  const items: GalleryItem[] = gallery.filter(g => f === 'all' || g.cat === f);
  return (
    <section className="gallery" id="gallery" aria-labelledby="galleryTitle">
      <div className="section-head reveal">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="section-title" id="galleryTitle">Inside HMR</h2>
        </div>
        <div className="gallery__filters" role="tablist" aria-label="Filter gallery">
          {filters.map(([id, label]) => (
            <button key={id} className={`gchip${f === id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={f === id} onClick={() => setF(id)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="masonry" key={f}>
        {items.map((g, i) => (
          <button key={g.title} className={`shot${g.wide ? ' shot--wide' : ''}${g.tall ? ' shot--tall' : ''}`} type="button" style={{ ['--i' as string]: i }}
            aria-label={`Open photo: ${g.title}`} onClick={() => setLightbox({ items, index: i })}>
            <Img photo={g.photo} alt={g.title} sizes={g.wide ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'} />
            <span className="shot__cap">{g.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI(n => (n + 1) % reviews.length), 6500);
    return () => clearTimeout(t);
  }, [i, paused]);
  const r = reviews[i];
  const initials = r.name.replace(/^The /, '').split(/[ &]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('');
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviewsTitle">
      <div className="reviews__summary reveal">
        <p className="eyebrow">Guest reviews</p>
        <h2 className="section-title" id="reviewsTitle"><span data-count-to="4.9" data-decimals="1">0</span><small>/5</small></h2>
        <div className="stars" aria-label="4.9 out of 5 stars">★★★★★</div>
        <p className="reviews__count">Based on 2,148 verified guest reviews</p>
        <ul className="bars">
          {[['Service', '.99', '5.0'], ['Cleanliness', '.98', '4.9'], ['Dining', '.98', '4.9'], ['Location', '.96', '4.8'], ['Value', '.92', '4.6']].map(([k, v, s]) => (
            <li key={k}><span>{k}</span><i style={{ ['--v' as string]: v }} /><b>{s}</b></li>
          ))}
        </ul>
      </div>
      <div className="quotes reveal" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <svg className="quotes__mark" viewBox="0 0 48 36" aria-hidden="true"><path d="M0 36V21C0 9 6 2 18 0l2 5c-7 2-10 6-10 12h9v19H0Zm28 0V21C28 9 34 2 46 0l2 5c-7 2-10 6-10 12h9v19H28Z" fill="currentColor" /></svg>
        <div className="quotes__stage" aria-live="polite">
          <blockquote className="swap-text" key={i}>
            <div className="stars stars--sm" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}<span>{'★'.repeat(5 - r.rating)}</span></div>
            <p>“{r.quote}”</p>
            <footer><span className="avatar">{initials}</span><span><b>{r.name}</b><small>{r.trip}</small></span></footer>
          </blockquote>
        </div>
        <div className="quotes__controls">
          <div className="quotes__dots">
            {reviews.map((_, k) => <button key={k} type="button" className={k === i ? 'is-active' : ''} aria-label={`Show review ${k + 1}`} onClick={() => setI(k)}><span /></button>)}
          </div>
          <div className="quotes__arrows">
            <button className="round-btn" type="button" onClick={() => setI(n => (n - 1 + reviews.length) % reviews.length)} aria-label="Previous review"><Icon name="chevron-l" /></button>
            <button className="round-btn" type="button" onClick={() => setI(n => (n + 1) % reviews.length)} aria-label="Next review"><Icon name="chevron-r" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section className="location" id="location" aria-labelledby="locTitle">
      <div className="location__info reveal">
        <p className="eyebrow">Location</p>
        <h2 className="section-title" id="locTitle">In the heart <em>of the city.</em></h2>
        <address className="location__address">HMR Hotels &amp; Resorts<br />1 Harbour Boulevard, City Centre</address>
        <ul className="distances">
          {[['plane', 'International airport', '25 min'], ['train', 'Central station', '8 min'], ['pin', 'Old town & museums', '5 min walk'], ['bag2', 'Harbour shopping district', '3 min walk']].map(([i, s, t]) => (
            <li key={s}><Icon name={i} size="sm" /><span>{s}</span><b>{t}</b></li>
          ))}
        </ul>
        <div className="location__actions">
          <a className="btn btn--copper" href="https://www.google.com/maps/search/?api=1&query=HMR+Hotels+%26+Resorts" target="_blank" rel="noopener noreferrer">Get directions <Icon name="arrow" className="btn__arrow" /></a>
          <a className="btn btn--ghost" href="tel:+10000000000"><Icon name="phone" />Call the hotel</a>
        </div>
      </div>
      <div className="location__photo reveal">
        <Img photo={photos.poolDeck} sizes="(max-width: 1080px) 100vw, 55vw" />
        <div className="location__card">
          <Icon name="pin" />
          <div><b>HMR Hotels &amp; Resorts</b><span>Check-in 15:00 · Check-out 12:00</span></div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { showToast } = useSite();
  const join = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    showToast(<><b>Welcome to HMR Rewards.</b> Check your inbox to confirm.</>);
  };
  return (
    <footer className="footer" id="contact">
      <div className="newsletter reveal">
        <div>
          <p className="eyebrow">HMR Rewards</p>
          <h2 className="newsletter__title">Members save up to 15% and stay longer.</h2>
        </div>
        <form className="newsletter__form" onSubmit={join}>
          <label className="sr-only" htmlFor="nlEmail">Email address</label>
          <input id="nlEmail" type="email" placeholder="Your email address" required />
          <button className="btn btn--copper" type="submit">Join for free</button>
        </form>
      </div>
      <div className="footer__grid">
        <div className="reveal">
          <span className="brand__logo brand__logo--lg"><span className="brand__name">HMR</span><span className="brand__sub">Hotels &amp; Resorts</span></span>
          <p className="footer__tag">A higher standard stays with you.</p>
          <div className="social">
            <a href="#" aria-label="Instagram"><Icon name="instagram" /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" /></a>
            <a href="#" aria-label="YouTube"><Icon name="youtube" /></a>
          </div>
        </div>
        <div className="reveal">
          <h3>Stay</h3>
          <ul className="footer__links">
            <li><a href="#rooms">Rooms &amp; Suites</a></li>
            <li><a href="#book">Offers &amp; packages</a></li>
            <li><a href="#amenities">Spa &amp; wellness</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
        </div>
        <div className="reveal">
          <h3>Dining</h3>
          <p>Ember restaurant, Level 1<br />In-room dining — dial <b>0</b><br />Breakfast 6:30 – 11:00<br />All-day &amp; dinner 11:00 – 23:30</p>
        </div>
        <div className="reveal">
          <h3>Contact</h3>
          <p>1 Harbour Boulevard, City Centre<br /><a href="tel:+10000000000">+1 (000) 000-0000</a><br /><a href="mailto:reservations@hmrhotels.com">reservations@hmrhotels.com</a></p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} HMR Hotels &amp; Resorts. All rights reserved. Photography: Pexels (placeholder).</p>
        <ul className="footer__legal">
          {['Privacy', 'Terms', 'Accessibility', 'Cookies'].map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </div>
    </footer>
  );
}
