'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { categories, dishById } from '@/data/menu';
import { fmtTime, money, prefersReducedMotion, store } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { DietBadges } from './Menu';
import { useSite } from './SiteProvider';

/** Closes on Escape while `open`. */
function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);
}

function useTweenedNumber(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || prefersReducedMotion()) { setShown(value); from.current = value; return; }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      setShown(Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = value; };
  }, [value]);
  return shown;
}

export function CartDrawer() {
  const { cart, setQty, clearCart, cartCount, cartTotal, cartOpen, setCartOpen, room, setOrder } = useSite();
  const [slot, setSlot] = useState('asap');
  const [notes, setNotes] = useState('');
  const [pay, setPay] = useState('room');
  const [placing, setPlacing] = useState(false);
  const shownTotal = useTweenedNumber(cartTotal);
  const close = () => setCartOpen(false);
  useEscape(cartOpen, close);

  const lines = Object.entries(cart).filter(([id]) => dishById[id]);
  const prepMax = Math.max(15, ...lines.map(([id]) => dishById[id].time));
  const slots = useMemo(() => {
    const first = new Date(Date.now() + 45 * 60000);
    first.setMinutes(first.getMinutes() < 30 ? 30 : 60, 0, 0);
    const later = new Date(first.getTime() + 30 * 60000);
    return [
      { id: 'asap', title: 'ASAP', sub: `${prepMax} min`, label: `in about ${prepMax} minutes` },
      { id: first.toISOString(), title: fmtTime(first), label: `at ${fmtTime(first)}` },
      { id: later.toISOString(), title: fmtTime(later), label: `at ${fmtTime(later)}` },
    ];
    // Recompute when the drawer opens so times stay current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen, prepMax]);
  const current = slots.find(s => s.id === slot) ?? slots[0];

  const place = () => {
    if (!cartCount || placing) return;
    setPlacing(true);
    setTimeout(() => {
      const orderNo = 'HMR-' + String(Math.floor(1000 + Math.random() * 9000));
      store.set('lastOrder', { orderNo, room, items: cart, total: cartTotal, eta: current.label, notes, pay, at: Date.now() });
      clearCart();
      setNotes('');
      setPlacing(false);
      setCartOpen(false);
      setOrder({ orderNo, eta: current.label });
    }, prefersReducedMotion() ? 200 : 1400);
  };

  return (
    <>
      <div className={`scrim${cartOpen ? ' is-open' : ''}`} onClick={close} />
      <aside className={`drawer${cartOpen ? ' is-open' : ''}${cartCount ? '' : ' is-empty'}`} role="dialog" aria-modal="true" aria-labelledby="drawerTitle" aria-hidden={!cartOpen}>
        <div className="drawer__head">
          <div>
            <h2 className="drawer__title" id="drawerTitle">Your Order</h2>
            <p className="drawer__room">Room {room}</p>
          </div>
          <button className="icon-btn" type="button" onClick={close} aria-label="Close order"><Icon name="close" /></button>
        </div>

        <div className="drawer__body">
          <ul className="lines">
            {lines.map(([id, qty], i) => {
              const d = dishById[id];
              return (
                <li className="line-item" key={id} style={{ ['--i' as string]: i }}>
                  <div className="line-item__media"><Img photo={d.photo} label={d.name} sizes="118px" className={d.tall ? 'is-tall' : ''} /></div>
                  <span className="line-item__name">{d.name}</span>
                  <span className="line-item__price" key={qty}>{money(d.price * qty)}</span>
                  <div className="stepper">
                    <button type="button" onClick={() => setQty(id, qty - 1)} aria-label={`Remove one ${d.name}`}><Icon name="minus" /></button>
                    <span key={qty} className="tick">{qty}</span>
                    <button type="button" onClick={() => setQty(id, qty + 1)} aria-label={`Add one ${d.name}`}><Icon name="plus" /></button>
                  </div>
                  <button className="line-item__del" type="button" onClick={() => setQty(id, 0)} aria-label={`Remove ${d.name}`}><Icon name="trash" /></button>
                </li>
              );
            })}
          </ul>

          <div className="drawer__empty">
            <div className="cloche" aria-hidden="true">
              <svg viewBox="0 0 120 80"><path d="M10 66h100M18 66c0-24 19-42 42-42s42 18 42 42M60 24v-6m-6 0h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <p className="drawer__empty-title">Your tray is empty</p>
            <p>Add a dish from the menu and it will appear here.</p>
            <button className="btn btn--ghost btn--sm" type="button" onClick={close}>Browse the menu</button>
          </div>

          <div className="drawer__section" data-cart-only>
            <h3 className="drawer__label">Delivery time</h3>
            <p className="drawer__muted">When would you like this delivered?</p>
            <div className="slots" role="radiogroup" aria-label="Delivery time">
              {slots.map(s => (
                <button key={s.id} className="slot" type="button" role="radio" aria-checked={current.id === s.id} onClick={() => setSlot(s.id)}>
                  {s.title}{s.sub && <><br /><small>{s.sub}</small></>}
                </button>
              ))}
            </div>
          </div>

          <div className="drawer__section" data-cart-only>
            <label className="drawer__label" htmlFor="notes">Notes for the kitchen</label>
            <textarea id="notes" rows={2} placeholder="Allergies, spice level, chicken or mutton for the family handi…" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="drawer__foot" data-cart-only>
          <div className="total"><span>Total</span><span className="total__value">{money(shownTotal)}</span></div>
          <label className="pay">
            <Icon name="bed" />
            <select aria-label="Payment method" value={pay} onChange={e => setPay(e.target.value)}>
              <option value="room">Charge to room {room}</option>
              <option value="card">Card on delivery</option>
              <option value="cash">Cash on delivery</option>
            </select>
            <Icon name="chevron" size="sm" className="pay__chev" />
          </label>
          <button className={`btn btn--copper btn--block btn--xl${placing ? ' is-loading-btn' : ''}`} type="button" onClick={place}>
            <span className="btn__label">Place order</span><span className="btn__spinner" aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}

export function OrderConfirm() {
  const { order, setOrder, room } = useSite();
  const [progress, setProgress] = useState(0);
  const close = () => setOrder(null);
  useEscape(!!order, close);

  useEffect(() => {
    if (!order) return;
    setProgress(0);
    const a = setTimeout(() => setProgress(1), 1800);
    const b = setTimeout(() => setProgress(2), 4400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [order]);

  return (
    <div className={`confirm${order ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="confirmTitle" aria-hidden={!order}
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="confirm__panel">
        <svg className="check" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36" /><path d="M25 41l10 10 20-22" /></svg>
        <p className="eyebrow">Order {order?.orderNo}</p>
        <h2 className="confirm__title" id="confirmTitle">Thank you.</h2>
        <p className="confirm__text">Your order is with the kitchen and will arrive at <b>Room {room}</b> {order?.eta}.</p>
        <ol className="track" style={{ ['--p' as string]: progress / 3 }}>
          {['Received', 'Preparing', 'On its way', 'Delivered'].map((s, i) => (
            <li key={s} className={i <= progress ? 'is-done' : ''}><span />{s}</li>
          ))}
        </ol>
        <button className="btn btn--ghost" type="button" onClick={close}>Back to the menu</button>
      </div>
    </div>
  );
}

export function DishSheet() {
  const { sheetId, setSheetId, addToCart } = useSite();
  const [qty, setQty] = useState(1);
  const [last, setLast] = useState<string | null>(null);
  const media = useRef<HTMLDivElement>(null);
  const close = () => setSheetId(null);
  useEscape(!!sheetId, close);
  useEffect(() => { if (sheetId) { setQty(1); setLast(sheetId); } }, [sheetId]);

  const d = dishById[sheetId ?? last ?? ''];
  return (
    <div className={`sheet${sheetId ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="sheetTitle" aria-hidden={!sheetId}
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {d && (
        <div className="sheet__panel">
          <button className="icon-btn sheet__close" type="button" onClick={close} aria-label="Close"><Icon name="close" /></button>
          <div className="sheet__media" ref={media}><Img key={d.id} photo={d.photo} label={d.name} sizes="(max-width: 640px) 100vw, 460px" className={d.tall ? 'is-tall' : ''} /></div>
          <div className="sheet__body">
            <p className="eyebrow">{categories.find(c => c.id === d.cat)?.label}</p>
            <h2 className="sheet__title" id="sheetTitle">{d.name}</h2>
            <p className="sheet__desc">{d.desc}</p>
            <div className="sheet__facts">
              <span><Icon name="clock" size="sm" />Ready in about {d.time} min</span>
              <span><DietBadges dish={d} /></span>
            </div>
            {d.pair && <p className="sheet__pair">{d.pair}</p>}
            <div className="sheet__actions">
              <div className="stepper">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity"><Icon name="minus" /></button>
                <span key={qty} className="tick">{qty}</span>
                <button type="button" onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Increase quantity"><Icon name="plus" /></button>
              </div>
              <button className="btn btn--copper btn--lg sheet__add" type="button"
                onClick={() => { addToCart(d.id, qty, media.current); setTimeout(close, 250); }}>
                Add · {money(d.price * qty)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Lightbox() {
  const { lightbox, setLightbox } = useSite();
  const close = () => setLightbox(null);
  const go = (dir: number) => lightbox && setLightbox({ ...lightbox, index: (lightbox.index + dir + lightbox.items.length) % lightbox.items.length });
  const touch = useRef<number | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const item = lightbox?.items[lightbox.index];
  return (
    <div className={`lightbox${lightbox ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Photo viewer" aria-hidden={!lightbox}
      onClick={e => { if (e.target === e.currentTarget) close(); }}
      onTouchStart={e => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}>
      <button className="icon-btn lightbox__close" type="button" onClick={close} aria-label="Close"><Icon name="close" /></button>
      <button className="round-btn lightbox__prev" type="button" onClick={() => go(-1)} aria-label="Previous photo"><Icon name="chevron-l" /></button>
      {item && lightbox && (
        <figure className="lightbox__figure">
          <div className="lightbox__frame" key={lightbox.index}><Img photo={item.photo} alt={item.title} sizes="90vw" /></div>
          <figcaption><span>{item.title}</span><span className="lightbox__count">{lightbox.index + 1} / {lightbox.items.length}</span></figcaption>
        </figure>
      )}
      <button className="round-btn lightbox__next" type="button" onClick={() => go(1)} aria-label="Next photo"><Icon name="chevron-r" /></button>
    </div>
  );
}

export function Toast() {
  const { toast, hideToast, setCartOpen } = useSite();
  return (
    <div className={`toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">
      {toast && (
        <>
          {toast.image
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={toast.image} alt="" />
            : null}
          <span>{toast.message}</span>
          {toast.action === 'cart' && <button type="button" onClick={() => { hideToast(); setCartOpen(true); }}>View order</button>}
        </>
      )}
    </div>
  );
}

export function CartBar() {
  const { cartCount, cartTotal, cartOpen, setCartOpen } = useSite();
  return (
    <button className={`cart-bar${cartCount && !cartOpen ? ' is-visible' : ''}`} type="button" onClick={() => setCartOpen(true)} tabIndex={cartCount ? 0 : -1}>
      <span><b>{cartCount}</b> {cartCount === 1 ? 'item' : 'items'}</span>
      <span>View order</span>
      <span>{money(cartTotal)}</span>
    </button>
  );
}
