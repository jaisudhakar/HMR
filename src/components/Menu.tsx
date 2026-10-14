'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { categories, dietLabels, dishById, dishes, type Dish } from '@/data/menu';
import { money, store } from '@/lib/format';
import { Icon } from './Icon';
import { Img } from './Img';
import { useSite } from './SiteProvider';

export function DietBadges({ dish }: { dish: Dish }) {
  return (
    <>
      {dish.diet.map(d => <span key={d} className={`diet diet--${d}`} title={dietLabels[d][1]}>{dietLabels[d][0]}</span>)}
    </>
  );
}

const isDesktop = () => window.matchMedia('(min-width: 1081px)').matches;

export function Menu() {
  const { menuCat: cat, setMenuCat: setCat, addToCart, setSheetId } = useSite();
  const [query, setQuery] = useState('');
  const [q, setQ] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [featured, setFeatured] = useState('signature');
  const [added, setAdded] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { setView(store.get('view', 'list')); }, []);
  useEffect(() => { const t = setTimeout(() => setQ(query.trim().toLowerCase()), 140); return () => clearTimeout(t); }, [query]);

  const items = useMemo(() => dishes.filter(d => {
    if (cat !== 'all' && d.cat !== cat) return false;
    if (!q) return true;
    const hay = `${d.name} ${d.short} ${d.desc} ${d.tags} ${d.cat}`.toLowerCase();
    return q.split(/\s+/).every(t => hay.includes(t));
  }), [cat, q]);

  // Keep the featured dish relevant to what is on screen
  useEffect(() => {
    if (items.length && !items.some(d => d.id === featured)) setFeatured((items.find(d => d.photo) ?? items[0]).id);
  }, [items, featured]);

  // Sliding active pill behind the chips
  const movePill = useCallback((instant = false) => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-cat="${cat}"]`);
    const pill = pillRef.current;
    if (!chip || !pill) return;
    if (instant) pill.style.transition = 'none';
    pill.style.width = `${chip.offsetWidth}px`;
    pill.style.height = `${chip.offsetHeight}px`;
    pill.style.transform = `translate(${chip.offsetLeft}px, ${chip.offsetTop}px)`;
    if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
  }, [cat]);
  useLayoutEffect(() => { movePill(); }, [movePill, view]);
  useEffect(() => {
    const r = () => movePill(true);
    window.addEventListener('resize', r);
    document.fonts?.ready.then(r);
    return () => window.removeEventListener('resize', r);
  }, [movePill]);

  // Press "/" to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || /INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement)?.tagName)) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const changeView = (v: 'list' | 'grid') => { setView(v); store.set('view', v); };

  const add = (dish: Dish, card: Element | null) => {
    addToCart(dish.id, 1, card);
    setAdded(dish.id);
    setTimeout(() => setAdded(a => (a === dish.id ? null : a)), 1100);
  };

  const onCardClick = (dish: Dish) => {
    clearTimeout(hoverTimer.current);
    if (view === 'list' && isDesktop()) setFeatured(dish.id);
    else setSheetId(dish.id);
  };

  const onHover = (dish: Dish) => {
    if (view !== 'list' || !isDesktop()) return;
    clearTimeout(hoverTimer.current);
    if (dish.id !== featured) hoverTimer.current = setTimeout(() => setFeatured(dish.id), 260);
  };

  const catLabel = categories.find(c => c.id === cat)?.label;

  return (
    <section className={`menu${view === 'grid' ? ' is-grid' : ''}`} id="menu" aria-labelledby="menuTitle">
      <div className="menu__main">
        <div className="menu__head reveal">
          <div>
            <p className="eyebrow">In-Room Dining</p>
            <h2 className="menu__title" id="menuTitle">Our Menu</h2>
          </div>
          <p className="menu__intro">Restaurant-quality meals, <br />delivered to your room.</p>
        </div>

        <div className="menu__tools reveal">
          <label className="search">
            <Icon name="search" />
            <input ref={searchRef} type="search" placeholder="Search dishes, cuisines or keywords…" aria-label="Search the menu"
              value={query} onChange={e => setQuery(e.target.value)} />
            <kbd>/</kbd>
          </label>
          <div className="view-toggle" role="group" aria-label="Layout">
            <button type="button" className={view === 'list' ? 'is-active' : ''} aria-pressed={view === 'list'} aria-label="List view" onClick={() => changeView('list')}><Icon name="list" /></button>
            <button type="button" className={view === 'grid' ? 'is-active' : ''} aria-pressed={view === 'grid'} aria-label="Grid view" onClick={() => changeView('grid')}><Icon name="grid" /></button>
          </div>
        </div>

        <div className="chips reveal" role="tablist" aria-label="Categories" ref={chipsRef}>
          <span className="chips__pill" aria-hidden="true" ref={pillRef} />
          {categories.map(c => (
            <button key={c.id} className={`chip${cat === c.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={cat === c.id} data-cat={c.id}
              onClick={e => { setCat(c.id); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }}>
              {c.label}
            </button>
          ))}
        </div>

        <p className="menu__meta" aria-live="polite">
          {items.length} {items.length === 1 ? 'dish' : 'dishes'}{cat !== 'all' ? ` · ${catLabel}` : ''}{q ? ` · “${query.trim()}”` : ''}
        </p>

        <div className={`dishes dishes--${view}`} key={`${cat}|${q}|${view}`}>
          {items.map((d, i) => (
            <article key={d.id} className={`dish is-in${d.id === featured && view === 'list' ? ' is-featured' : ''}`} style={{ '--i': i } as CSSProperties}
              tabIndex={0} aria-label={`${d.name}, ${money(d.price)}`}
              onClick={() => onCardClick(d)} onMouseEnter={() => onHover(d)} onMouseLeave={() => clearTimeout(hoverTimer.current)}
              onKeyDown={e => { if (e.key === 'Enter' && e.target === e.currentTarget) setSheetId(d.id); }}>
              <div className="dish__media"><Img photo={d.photo} label={d.name} sizes={view === 'grid' ? '(max-width: 640px) 50vw, 360px' : '150px'} className={d.tall ? 'is-tall' : ''} /></div>
              <div className="dish__body">
                <h3 className="dish__name">{d.name} <DietBadges dish={d} />{d.signature && <span className="badge">Signature</span>}</h3>
                <p className="dish__desc">{view === 'grid' ? d.short : d.desc}</p>
              </div>
              <div className="dish__foot">
                <div className="dish__price">{money(d.price)}<span className="dish__time"><Icon name="clock" size="sm" />{d.time} min</span></div>
                <button className={`btn btn--copper dish__add${added === d.id ? ' is-added' : ''}`} type="button" aria-label={`Add ${d.name} to order`}
                  onClick={e => { e.stopPropagation(); add(d, e.currentTarget.closest('.dish')); }}>
                  <span className="dish__add-label">{added === d.id ? 'Added' : 'Add'}</span><Icon name={added === d.id ? 'check' : 'plus'} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {!items.length && (
          <div className="empty">
            <p className="empty__title">Nothing matches “{query.trim()}”</p>
            <p>Try another word, or call our kitchen on <b>extension 0</b> — we’re happy to cook off-menu.</p>
            <button className="btn btn--ghost btn--sm" type="button" onClick={() => setQuery('')}>Clear search</button>
          </div>
        )}

        <p className="menu__note">
          <span className="diet diet--v">V</span> Vegetarian
          <span className="diet diet--gf">GF</span> Gluten-free
          <span className="diet diet--hot">Spicy</span> Spicy
          <span className="menu__note-sep" />
          Please tell us about any allergies when ordering. Prices include taxes and service.
        </p>
      </div>

      <FeaturePanel id={featured} pool={items} onPick={setFeatured} onAdd={add} />
    </section>
  );
}

function FeaturePanel({ id, pool, onPick, onAdd }: { id: string; pool: Dish[]; onPick: (id: string) => void; onAdd: (d: Dish, el: Element | null) => void }) {
  const dish = dishById[id];
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x0: number; dx: number } | null>(null);

  const list = pool.length > 1 ? pool : dishes;
  const withPhotos = list.filter(d => d.photo);
  const thumbs = [dish, ...withPhotos.filter(d => d.cat === dish.cat && d.id !== dish.id), ...withPhotos.filter(d => d.cat !== dish.cat)]
    .filter((d, i, a) => d && a.indexOf(d) === i).slice(0, 4);

  // Drag to tilt in 3D; a long swipe moves to the next dish
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x0: e.clientX, dx: 0 };
    stage.current?.setPointerCapture(e.pointerId);
    stage.current?.classList.add('is-dragging');
    if (frame.current) frame.current.style.transition = 'none';
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !frame.current) return;
    const dx = Math.max(-260, Math.min(260, e.clientX - drag.current.x0));
    drag.current.dx = dx;
    frame.current.style.transform = `rotateY(${dx * 0.12}deg) rotateZ(${dx * 0.01}deg) translateX(${dx * 0.1}px)`;
  };
  const onUp = () => {
    if (!drag.current) return;
    const { dx } = drag.current;
    drag.current = null;
    stage.current?.classList.remove('is-dragging');
    const el = frame.current;
    if (el) { el.style.transition = 'transform .9s cubic-bezier(.34,1.56,.64,1)'; el.style.transform = ''; }
    if (Math.abs(dx) > 160) {
      const idx = list.findIndex(d => d.id === id);
      onPick(list[(idx + (dx < 0 ? 1 : -1) + list.length) % list.length].id);
    }
  };
  const spin = () => frame.current?.animate([
    { transform: 'rotateY(0)' }, { transform: 'rotateY(-24deg) scale(.97)' }, { transform: 'rotateY(20deg) scale(1.01)' }, { transform: 'rotateY(0)' },
  ], { duration: 1500, easing: 'cubic-bezier(.2,.7,.2,1)' });

  if (!dish) return null;
  return (
    <aside className="feature" aria-label="Featured dish">
      <div className="feature__sticky">
        <div className="feature__head">
          <div key={dish.id}>
            <p className="eyebrow">Featured dish</p>
            <h3 className="feature__title swap-text">{dish.name}</h3>
            <span className="feature__rule" />
            <p className="feature__desc swap-text">{dish.desc}</p>
          </div>
          <button className="spin-btn" type="button" onClick={spin} aria-label="Turn the dish">
            <span>360°</span>
            <svg viewBox="0 0 40 14" aria-hidden="true"><path d="M3 4c3 5 31 5 34 0M33 9l4-5-6 1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <p className="feature__drag">Drag to turn</p>

        <div className="feature__stage" ref={stage} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className={`feature__frame is-entering${dish.tall ? ' is-tall' : ''}`} ref={frame} key={dish.id}>
            <Img photo={dish.photo} label={dish.name} sizes="(max-width: 1080px) 0px, 45vw" />
          </div>
        </div>

        <div className="feature__bar">
          <div>
            <span className="feature__price">{money(dish.price)}</span>
            <span className="feature__time"><Icon name="clock" size="sm" />{dish.time} min</span>
          </div>
          <button className="btn btn--copper" type="button" onClick={() => onAdd(dish, frame.current)}>Add to order <Icon name="plus" /></button>
        </div>

        <div className="feature__thumbs">
          {thumbs.map(d => (
            <button key={d.id} className={`thumb${d.id === id ? ' is-active' : ''}`} type="button" aria-label={`Show ${d.name}`} onClick={() => onPick(d.id)}>
              <Img photo={d.photo} label={d.name} sizes="140px" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
