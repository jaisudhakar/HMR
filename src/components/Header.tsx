'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from './Icon';
import { useSite } from './SiteProvider';

const links = [
  { href: '#biryani', label: 'Biryani' },
  { href: '#menu', label: 'In-Room Dining' },
  { href: '#rooms', label: 'Stay' },
  { href: '#amenities', label: 'Experiences' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];
// Sections that light up a nav link (section id → link href)
const sectionMap: Record<string, string> = {
  biryani: '#biryani', menu: '#menu', book: '#rooms', rooms: '#rooms', amenities: '#amenities', about: '#amenities',
  gallery: '#gallery', reviews: '#gallery', location: '#contact', contact: '#contact',
};

export function Header() {
  const { room, setRoom, cartCount, setCartOpen, openBooking, showToast } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [roomOpen, setRoomOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(sectionMap[e.target.id] ?? ''); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(sectionMap).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!roomOpen) return;
    const close = (e: MouseEvent) => { if (!roomRef.current?.contains(e.target as Node)) setRoomOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setRoomOpen(false); };
    document.addEventListener('click', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', esc); };
  }, [roomOpen]);

  useEffect(() => { document.body.classList.toggle('is-locked', navOpen); }, [navOpen]);

  const saveRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{2,5}$/.test(draft.trim())) return;
    setRoom(draft.trim());
    setRoomOpen(false);
    showToast(<>Delivering to <b>Room {draft.trim()}</b></>);
  };

  const book = () => { setNavOpen(false); openBooking(); };

  return (
    <>
      <header className={`header${scrolled ? ' is-scrolled' : ''}`} id="top">
        <div className="topbar">
          <div className="topbar__inner">
            <div className="topbar__contact">
              <a href="tel:+10000000000"><Icon name="phone" size="sm" />+1 (000) 000-0000</a>
              <a href="mailto:reservations@hmrhotels.com"><Icon name="mail" size="sm" />reservations@hmrhotels.com</a>
            </div>
            <p className="topbar__offer"><span className="topbar__dot" />Book direct — complimentary breakfast &amp; late check-out on every stay</p>
            <div className="topbar__meta">
              <span>EN · USD</span>
              <a href="#book">HMR Rewards</a>
            </div>
          </div>
        </div>
        <div className="header__inner">
          <a className="brand" href="#top" aria-label="HMR Hotels & Resorts — home">
            <span className="brand__logo">
              <span className="brand__name">HMR</span>
              <span className="brand__sub">Hotels &amp; Resorts</span>
            </span>
            <span className="brand__divider" aria-hidden="true" />
            <span className="brand__tagline">A higher<br />standard<br />stays with you</span>
          </a>

          <nav className="nav" aria-label="Primary">
            {links.map(l => (
              <a key={l.href} className={`nav__link${active === l.href ? ' is-active' : ''}`} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="header__actions">
            <span className="header__rule" aria-hidden="true" />
            <div className={`room${roomOpen ? ' is-open' : ''}`} ref={roomRef}>
              <button className="room__btn" type="button" aria-haspopup="true" aria-expanded={roomOpen}
                onClick={() => { setDraft(room); setRoomOpen(o => !o); }}>
                <span className="icon-circle"><Icon name="bed" /></span>
                <span>Room <b>{room}</b></span>
                <Icon name="chevron" size="sm" className="room__chev" />
              </button>
              <form className="room__pop" autoComplete="off" onSubmit={saveRoom}>
                <label htmlFor="roomInput">Your room number</label>
                <div className="room__row">
                  <input id="roomInput" inputMode="numeric" maxLength={5} pattern="[0-9]{2,5}" placeholder="1204" required
                    value={draft} onChange={e => setDraft(e.target.value)} autoFocus={roomOpen} />
                  <button className="btn btn--copper btn--sm" type="submit">Save</button>
                </div>
                <p className="room__hint">In-room dining is delivered and charged to this room.</p>
              </form>
            </div>
            <button className={`cart-btn${cartCount ? ' has-items' : ''}`} type="button" aria-label={`Open your order (${cartCount} items)`} onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              <span className="cart-btn__count">{cartCount}</span>
            </button>
            <button className="btn btn--copper btn--sm header__book" type="button" onClick={book}>Book a stay</button>
            <button className="burger" type="button" aria-label="Open menu" aria-expanded={navOpen} onClick={() => setNavOpen(o => !o)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mnav${navOpen ? ' is-open' : ''}`} aria-hidden={!navOpen}>
        {links.map(l => <a key={l.href} href={l.href} onClick={() => setNavOpen(false)} tabIndex={navOpen ? 0 : -1}>{l.label}</a>)}
        <button className="btn btn--copper btn--lg mnav__book" type="button" onClick={book} tabIndex={navOpen ? 0 : -1}>Book a stay</button>
      </div>
    </>
  );
}
