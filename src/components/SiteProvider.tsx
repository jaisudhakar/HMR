'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { dishById } from '@/data/menu';
import type { GalleryItem } from '@/data/hotel';
import { addDays, iso, prefersReducedMotion, store } from '@/lib/format';

type Guests = { adults: number; children: number; rooms: number };
type ToastState = { id: number; message: ReactNode; image?: string; action?: 'cart' } | null;
export type Order = { orderNo: string; eta: string };

type SiteContext = {
  room: string;
  setRoom: (r: string) => void;

  cart: Record<string, number>;
  addToCart: (id: string, qty?: number, source?: Element | null) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  order: Order | null;
  setOrder: (o: Order | null) => void;

  sheetId: string | null;
  setSheetId: (id: string | null) => void;

  menuCat: string;
  setMenuCat: (cat: string) => void;

  checkin: string; setCheckin: (v: string) => void;
  checkout: string; setCheckout: (v: string) => void;
  guests: Guests; setGuests: (g: Guests) => void;
  roomType: string; setRoomType: (v: string) => void;
  booking: { open: boolean; highlight?: string; roomId?: string };
  openBooking: (opts?: { highlight?: string; roomId?: string }) => void;
  closeBooking: () => void;

  lightbox: { items: GalleryItem[]; index: number } | null;
  setLightbox: (lb: { items: GalleryItem[]; index: number } | null) => void;

  toast: ToastState;
  showToast: (message: ReactNode, opts?: { image?: string; action?: 'cart' }) => void;
  hideToast: () => void;
};

const Ctx = createContext<SiteContext | null>(null);

export const useSite = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSite must be used inside <SiteProvider>');
  return c;
};

/** Animate a copy of the dish photo into the cart button. */
function flyToCart(source: Element | null | undefined, done: () => void) {
  const img = source?.querySelector('img') ?? (source instanceof HTMLImageElement ? source : null);
  const bar = document.querySelector('.cart-bar.is-visible');
  const target = (bar && getComputedStyle(bar).display !== 'none' ? bar : document.querySelector('.cart-btn')) as HTMLElement | null;
  if (!img || !target || prefersReducedMotion()) return done();
  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!a.width) return done();
  const size = Math.min(110, Math.max(64, Math.min(a.width, a.height)));
  const fly = document.createElement('div');
  fly.className = 'fly';
  fly.innerHTML = `<img src="${img.currentSrc || img.src}" alt="">`;
  Object.assign(fly.style, { width: `${size}px`, height: `${size}px`, left: '0', top: '0' });
  document.body.appendChild(fly);
  const sx = a.left + a.width / 2 - size / 2, sy = a.top + a.height / 2 - size / 2;
  const ex = b.left + b.width / 2 - size / 2, ey = b.top + b.height / 2 - size / 2;
  const midX = sx + (ex - sx) * 0.55, midY = Math.min(sy, ey) - 120;
  const anim = fly.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(.6)`, opacity: 0 },
    { transform: `translate(${sx}px, ${sy - 20}px) scale(1)`, opacity: 1, offset: 0.15 },
    { transform: `translate(${midX}px, ${midY}px) scale(.7)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${ex}px, ${ey}px) scale(.18)`, opacity: 0.3 },
  ], { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' });
  anim.onfinish = () => { fly.remove(); done(); };
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [room, setRoomState] = useState('1204');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [menuCat, setMenuCat] = useState('all');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, rooms: 1 });
  const [roomType, setRoomType] = useState('');
  const [booking, setBooking] = useState<{ open: boolean; highlight?: string; roomId?: string }>({ open: false });
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hydrated = useRef(false);

  // Restore saved state and default stay dates after mount
  useEffect(() => {
    setRoomState(store.get('room', '1204'));
    const saved = store.get<Record<string, number>>('cart', {});
    setCart(Object.fromEntries(Object.entries(saved).filter(([id, q]) => dishById[id] && q > 0)));
    const today = new Date();
    setCheckin(iso(addDays(today, 1)));
    setCheckout(iso(addDays(today, 3)));
    hydrated.current = true;
  }, []);

  useEffect(() => { if (hydrated.current) store.set('cart', cart); }, [cart]);

  // Lock page scroll while an overlay is open
  const anyOverlay = cartOpen || !!order || !!sheetId || booking.open || !!lightbox;
  useEffect(() => { document.body.classList.toggle('is-locked', anyOverlay); }, [anyOverlay]);

  const setRoom = useCallback((r: string) => { setRoomState(r); store.set('room', r); }, []);

  const showToast = useCallback((message: ReactNode, opts?: { image?: string; action?: 'cart' }) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, ...opts });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  const bumpCart = () => {
    const btn = document.querySelector('.cart-btn');
    if (!btn || prefersReducedMotion()) return;
    btn.classList.remove('bump');
    void (btn as HTMLElement).offsetWidth;
    btn.classList.add('bump');
  };

  const addToCart = useCallback((id: string, qty = 1, source?: Element | null) => {
    const dish = dishById[id];
    if (!dish) return;
    const commit = () => {
      setCart(c => ({ ...c, [id]: Math.min(20, (c[id] ?? 0) + qty) }));
      bumpCart();
    };
    flyToCart(source, commit);
    const img = source?.querySelector('img') as HTMLImageElement | null;
    showToast(<><b>{dish.name}</b>{qty > 1 ? ` ×${qty}` : ''} added</>, { image: img?.currentSrc || img?.src, action: 'cart' });
  }, [showToast]);

  const setQty = useCallback((id: string, qty: number) => {
    setCart(c => {
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = Math.min(20, qty);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const openBooking = useCallback((opts?: { highlight?: string; roomId?: string }) => setBooking({ open: true, ...opts }), []);
  const closeBooking = useCallback(() => setBooking(b => ({ ...b, open: false })), []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, q]) => sum + (dishById[id]?.price ?? 0) * q, 0);

  const value = useMemo<SiteContext>(() => ({
    room, setRoom, cart, addToCart, setQty, clearCart, cartCount, cartTotal,
    cartOpen, setCartOpen, order, setOrder, sheetId, setSheetId, menuCat, setMenuCat,
    checkin, setCheckin, checkout, setCheckout, guests, setGuests, roomType, setRoomType,
    booking, openBooking, closeBooking, lightbox, setLightbox, toast, showToast, hideToast,
  }), [room, setRoom, cart, addToCart, setQty, clearCart, cartCount, cartTotal, cartOpen, order, sheetId, menuCat,
    checkin, checkout, guests, roomType, booking, openBooking, closeBooking, lightbox, toast, showToast, hideToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
