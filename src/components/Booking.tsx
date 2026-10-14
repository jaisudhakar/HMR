'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { rooms, type Room } from '@/data/hotel';
import { addDays, fmtDate, iso, money, parseIso, plural, prefersReducedMotion, store } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { useSite } from './SiteProvider';

const limits = { adults: [1, 8], children: [0, 6], rooms: [1, 4] } as const;
type GuestKey = keyof typeof limits;

function useStay() {
  const { checkin, checkout, guests } = useSite();
  const nights = checkin && checkout ? Math.max(1, Math.round((parseIso(checkout).getTime() - parseIso(checkin).getTime()) / 864e5)) : 1;
  const guestText = [plural(guests.adults, 'adult', 'adults'), guests.children ? plural(guests.children, 'child', 'children') : '', guests.rooms > 1 ? plural(guests.rooms, 'room', 'rooms') : '']
    .filter(Boolean).join(' · ');
  const stayText = checkin && checkout ? `${fmtDate(parseIso(checkin))} – ${fmtDate(parseIso(checkout))} · ${plural(nights, 'night', 'nights')} · ${guestText}` : '';
  const perRoom = Math.ceil((guests.adults + guests.children) / guests.rooms);
  const total = (r: Room) => r.price * nights * guests.rooms;
  return { nights, guestText, stayText, perRoom, total };
}

export function BookingBar() {
  const { checkin, setCheckin, checkout, setCheckout, guests, setGuests, roomType, setRoomType, openBooking } = useSite();
  const { guestText } = useStay();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const today = iso(new Date());

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const step = (k: GuestKey, d: number) => setGuests({ ...guests, [k]: Math.min(limits[k][1], Math.max(limits[k][0], guests[k] + d)) });

  const onCheckin = (v: string) => {
    setCheckin(v);
    if (v && (!checkout || parseIso(checkout) <= parseIso(v))) setCheckout(iso(addDays(parseIso(v), 2)));
  };

  const submit = (e: FormEvent) => { e.preventDefault(); openBooking({ highlight: roomType }); };

  return (
    <section className="booking" id="book" aria-label="Book your stay">
      <form className="booking__bar reveal" autoComplete="off" onSubmit={submit}>
        <div className="booking__brand">
          <p className="eyebrow">Reserve</p>
          <p className="booking__title">Your stay at HMR</p>
        </div>
        <label className="bfield">
          <span className="bfield__label"><Icon name="calendar" size="sm" />Check-in</span>
          <input type="date" required min={today} value={checkin} onChange={e => onCheckin(e.target.value)} />
        </label>
        <label className="bfield">
          <span className="bfield__label"><Icon name="calendar" size="sm" />Check-out</span>
          <input type="date" required min={checkin ? iso(addDays(parseIso(checkin), 1)) : today} value={checkout} onChange={e => setCheckout(e.target.value)} />
        </label>
        <div className={`bfield bfield--guests${open ? ' is-open' : ''}`} ref={wrap}>
          <span className="bfield__label"><Icon name="user" size="sm" />Guests</span>
          <button type="button" className="bfield__value" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <span>{guestText}</span><Icon name="chevron" size="sm" />
          </button>
          <div className="guests-pop">
            {([['adults', 'Adults', 'Ages 13+'], ['children', 'Children', 'Ages 0–12'], ['rooms', 'Rooms', 'Up to 4 per booking']] as const).map(([k, label, hint]) => (
              <div className="guests-pop__row" key={k}>
                <div><b>{label}</b><small>{hint}</small></div>
                <div className="stepper stepper--sm">
                  <button type="button" onClick={() => step(k, -1)} aria-label={`Fewer ${label.toLowerCase()}`}><Icon name="minus" /></button>
                  <span>{guests[k]}</span>
                  <button type="button" onClick={() => step(k, 1)} aria-label={`More ${label.toLowerCase()}`}><Icon name="plus" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <label className="bfield">
          <span className="bfield__label"><Icon name="key" size="sm" />Room type</span>
          <select value={roomType} onChange={e => setRoomType(e.target.value)}>
            <option value="">Any room</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <button className="btn btn--copper booking__submit" type="submit">Check availability <Icon name="arrow" className="btn__arrow" /></button>
      </form>
      <ul className="perks reveal">
        {['Best rate guaranteed', 'Free cancellation up to 48 h', 'Breakfast for two included', 'No payment until arrival'].map(p => (
          <li key={p}><Icon name="check" size="sm" />{p}</li>
        ))}
      </ul>
    </section>
  );
}

export function BookingModal() {
  const { booking, closeBooking, checkin, checkout, guests, setCheckin, setCheckout } = useSite();
  const { stayText, perRoom, total } = useStay();
  const [step, setStep] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ code: string; first: string; email: string; room: Room } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Each time the modal opens, start at the right step
  useEffect(() => {
    if (!booking.open) return;
    if (!checkin || !checkout) { const t = new Date(); setCheckin(iso(addDays(t, 1))); setCheckout(iso(addDays(t, 3))); }
    const direct = booking.roomId && rooms.find(r => r.id === booking.roomId);
    if (direct && direct.guests >= perRoom) { setPicked(direct.id); setStep(2); } else { setPicked(null); setStep(1); }
    setDone(null);
    setTimeout(() => panel.current?.querySelector<HTMLElement>('button, input')?.focus(), 80);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeBooking(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.open]);

  useEffect(() => { panel.current?.scrollTo({ top: 0 }); }, [step]);

  const highlight = booking.highlight || booking.roomId || picked || '';
  const ordered = useMemo(() => {
    const fit = (r: Room) => Number(r.guests >= perRoom);
    return [...rooms].sort((a, b) => Number(b.id === highlight) - Number(a.id === highlight) || fit(b) - fit(a));
  }, [highlight, perRoom]);

  const room = rooms.find(r => r.id === picked);

  const confirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setLoading(true);
    setTimeout(() => {
      const code = 'HMR' + Math.random().toString(36).slice(2, 8).toUpperCase();
      store.set('lastBooking', { code, room: picked, checkin, checkout, guests, total: room ? total(room) : 0 });
      setDone({ code, first: data.first, email: data.email, room: room! });
      setLoading(false);
      setStep(3);
    }, prefersReducedMotion() ? 150 : 1300);
  };

  return (
    <div className={`bmodal${booking.open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="bmodalTitle" aria-hidden={!booking.open}
      onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}>
      <div className="bmodal__panel" ref={panel}>
        <button className="icon-btn bmodal__close" type="button" onClick={closeBooking} aria-label="Close"><Icon name="close" /></button>
        <ol className="bsteps" aria-label="Booking steps">
          {['Choose room', 'Guest details', 'Confirmed'].map((label, i) => (
            <li key={label} className={step === i + 1 ? 'is-active' : step > i + 1 ? 'is-done' : ''}><span>{i + 1}</span>{label}</li>
          ))}
        </ol>

        {step === 1 && (
          <div className="bstep is-active swap-text">
            <h2 className="bmodal__title" id="bmodalTitle">Available rooms</h2>
            <p className="bmodal__summary">{stayText}</p>
            <ul className="bresults">
              {ordered.map((r, i) => {
                const fits = r.guests >= perRoom;
                return (
                  <li key={r.id} className={`bresult${r.id === highlight ? ' is-highlight' : ''}${fits ? '' : ' is-disabled'}`} style={{ ['--i' as string]: i }}>
                    <span className="bresult__img"><Img photo={r.photo} sizes="150px" /></span>
                    <div className="bresult__info">
                      <h3>{r.name}</h3>
                      <p>{r.size} m² · {r.bed} · up to {r.guests} guests · {r.view}</p>
                      <p className="bresult__perks"><Icon name="check" size="sm" />Breakfast included · Free cancellation</p>
                    </div>
                    <div className="bresult__price">
                      <span><b>{money(r.price)}</b> / night</span>
                      <small>{money(total(r))} total{guests.rooms > 1 ? ` for ${guests.rooms} rooms` : ''}</small>
                      {fits
                        ? <button className="btn btn--copper btn--sm" type="button" onClick={() => { setPicked(r.id); setStep(2); }}>Select</button>
                        : <small className="bresult__na">Sleeps up to {r.guests} — add a room</small>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {step === 2 && room && (
          <form className="bstep is-active swap-text" onSubmit={confirm}>
            <h2 className="bmodal__title" id="bmodalTitle">Guest details</h2>
            <div className="bpick">
              <span className="bpick__img"><Img photo={room.photo} sizes="110px" /></span>
              <div><b>{room.name}</b><span>{stayText}</span></div>
              <div className="bpick__total"><small>Total</small><b>{money(total(room))}</b><small>incl. taxes &amp; breakfast</small></div>
            </div>
            <div className="bform">
              <label><span>First name</span><input name="first" required autoComplete="given-name" /></label>
              <label><span>Last name</span><input name="last" required autoComplete="family-name" /></label>
              <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
              <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label className="bform__full"><span>Arrival time</span>
                <select name="arrival" defaultValue="I don’t know yet">
                  {['I don’t know yet', 'Before 12:00', '12:00 – 15:00', '15:00 – 18:00', 'After 18:00'].map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="bform__full"><span>Special requests</span>
                <textarea name="requests" rows={2} placeholder="Celebrations, dietary needs, accessibility, a biryani waiting on arrival…" />
              </label>
            </div>
            <p className="bnote"><Icon name="check" size="sm" />Free cancellation until 48 hours before arrival. No payment is taken today.</p>
            <div className="bactions">
              <button className="btn btn--ghost" type="button" onClick={() => setStep(1)}>Back</button>
              <button className={`btn btn--copper${loading ? ' is-loading-btn' : ''}`} type="submit" disabled={loading}>
                <span className="btn__label">Confirm reservation</span><span className="btn__spinner" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && done && (
          <div className="bstep bstep--done is-active">
            <svg className="check" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36" /><path d="M25 41l10 10 20-22" /></svg>
            <p className="eyebrow">Confirmation {done.code}</p>
            <h2 className="bmodal__title" id="bmodalTitle">We look forward to welcoming you.</h2>
            <p className="bmodal__summary">
              {done.first}, your <b>{done.room.name}</b> is reserved for {stayText}. A confirmation is on its way to <b>{done.email}</b>.
            </p>
            <button className="btn btn--copper" type="button" onClick={closeBooking}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
