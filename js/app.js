/* HMR Hotels & Resorts — In-Room Dining
   Vanilla JS: menu rendering, featured dish, cart drawer, ordering and motion. */
(() => {
  'use strict';

  const { categories, dishes } = window.HMR_MENU;
  const byId = Object.fromEntries(dishes.map(d => [d.id, d]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 1081px)').matches;
  const money = n => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem('hmr:' + key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem('hmr:' + key, JSON.stringify(value)); } catch { /* storage unavailable */ } }
  };
  const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const media = (dish, extra = '') => dish.img
    ? `<img src="${dish.img}" alt="${escapeHtml(dish.name)}" loading="lazy" class="${dish.tall ? 'is-tall' : ''} ${extra}">`
    : `<div class="plate-ph"><span>HMR</span></div>`;
  const dietBadges = dish => dish.diet.map(d => `<span class="diet diet--${d}" title="${d === 'v' ? 'Vegetarian' : 'Gluten-free'}">${d.toUpperCase()}</span>`).join('');

  /* ------------------------------------------------------------------
     Preloader & hero entrance
     ------------------------------------------------------------------ */
  const start = performance.now();
  const ready = () => {
    const wait = Math.max(0, 1100 - (performance.now() - start));
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      requestAnimationFrame(() => document.body.classList.add('is-ready'));
      countUp($('.stat-card [data-count-to]'), 900);
    }, reduceMotion ? 0 : wait);
  };
  if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready, { once: true });
  setTimeout(() => document.body.classList.contains('is-loading') && ready(), 3500);

  $('[data-year]').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Header
     ------------------------------------------------------------------ */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active nav link follows the section in view
  const navLinks = $$('.nav__link');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id === 'top' ? 'menu' : e.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['menu', 'hotel', 'contact'].forEach(id => sectionObs.observe(document.getElementById(id)));

  // Mobile nav
  const burger = $('[data-burger]');
  const mnav = $('[data-mnav]');
  const toggleMnav = open => {
    burger.setAttribute('aria-expanded', String(open));
    mnav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => toggleMnav(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => toggleMnav(false)));

  /* ------------------------------------------------------------------
     Room number
     ------------------------------------------------------------------ */
  let room = store.get('room', '1204');
  const roomEl = $('[data-room]');
  const roomInput = $('#roomInput');
  const paintRoom = () => {
    $$('[data-room-label]').forEach(el => { el.textContent = room; });
    $('[data-room-option]').textContent = `Charge to room ${room}`;
  };
  const setRoomOpen = open => {
    roomEl.classList.toggle('is-open', open);
    $('.room__btn').setAttribute('aria-expanded', String(open));
    if (open) { roomInput.value = room; setTimeout(() => roomInput.select(), 60); }
  };
  paintRoom();
  $('.room__btn').addEventListener('click', e => { e.stopPropagation(); setRoomOpen(!roomEl.classList.contains('is-open')); });
  $('.room__pop').addEventListener('click', e => e.stopPropagation());
  $('.room__pop').addEventListener('submit', e => {
    e.preventDefault();
    const v = roomInput.value.trim();
    if (!/^\d{2,5}$/.test(v)) { roomInput.focus(); return; }
    room = v; store.set('room', room); paintRoom(); setRoomOpen(false);
    toast(`Delivering to Room ${room}`);
  });
  document.addEventListener('click', () => setRoomOpen(false));
  $('[data-room-trigger]').addEventListener('click', e => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    setRoomOpen(true);
  });

  /* ------------------------------------------------------------------
     Hero: gold dust, parallax, 360 spin
     ------------------------------------------------------------------ */
  const canvas = $('.hero__dust');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles = [], running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, w / 22));
      particles = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: w * (0.35 + Math.random() * 0.65),
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.6 + 0.2,
      t: Math.random() * Math.PI * 2
    });
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.t += 0.02; p.y += p.vy; p.x += p.vx + Math.sin(p.t) * 0.12;
        if (p.y < -10) Object.assign(p, spawn(false));
        const flicker = p.a * (0.6 + Math.sin(p.t * 2) * 0.4);
        ctx.beginPath();
        ctx.fillStyle = `rgba(226, 160, 105, ${flicker})`;
        ctx.shadowColor = 'rgba(226,160,105,.8)'; ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize(); tick();
    window.addEventListener('resize', resize);
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) tick();
    }).observe(canvas);
  }

  const stage = $('[data-parallax]');
  if (stage && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      if (document.body.classList.contains('is-ready')) {
        stage.style.transform = `translate3d(${cx * 18}px, ${cy * 14}px, 0) rotateY(${cx * 4}deg) rotateX(${-cy * 3}deg)`;
      }
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    $('.hero').addEventListener('pointermove', e => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  $('[data-spin]').addEventListener('click', () => {
    const plate = $('.hero__plate');
    plate.classList.remove('is-spinning');
    void plate.offsetWidth;
    plate.classList.add('is-spinning');
    plate.addEventListener('animationend', () => plate.classList.remove('is-spinning'), { once: true });
  });

  /* ------------------------------------------------------------------
     Scroll reveal & counters
     ------------------------------------------------------------------ */
  function countUp(el, duration = 1400) {
    if (!el || el.dataset.counted) return;
    el.dataset.counted = '1';
    const to = parseFloat(el.dataset.countTo);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      $$('[data-count-to]', e.target).forEach(n => countUp(n));
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  const observeReveals = root => $$('.reveal', root).forEach((el, i) => {
    if (!el.style.getPropertyValue('--d')) {
      const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
      el.style.setProperty('--d', Math.max(0, siblings.indexOf(el)));
    }
    revealObs.observe(el);
  });
  observeReveals(document);

  /* ------------------------------------------------------------------
     Menu: chips, search, view, render
     ------------------------------------------------------------------ */
  const chipsEl = $('[data-chips]');
  const pill = $('.chips__pill');
  const listEl = $('[data-dishes]');
  const searchEl = $('[data-search]');
  const emptyEl = $('[data-empty]');
  const state = { cat: 'all', q: '', view: store.get('view', 'list'), featured: 'wagyu' };

  chipsEl.insertAdjacentHTML('beforeend', categories.map(c =>
    `<button class="chip" type="button" role="tab" data-cat="${c.id}" aria-selected="false">${c.label}</button>`).join(''));

  const movePill = (instant = false) => {
    const active = $(`.chip[data-cat="${state.cat}"]`, chipsEl);
    if (!active) return;
    if (instant) pill.style.transition = 'none';
    pill.style.width = active.offsetWidth + 'px';
    pill.style.height = active.offsetHeight + 'px';
    pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
  };

  const setCat = (cat, { scroll = false } = {}) => {
    state.cat = cat;
    $$('.chip', chipsEl).forEach(c => {
      const on = c.dataset.cat === cat;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
      if (on && scroll) c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    movePill();
    render();
  };
  chipsEl.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) setCat(chip.dataset.cat, { scroll: true });
  });
  window.addEventListener('resize', () => movePill(true));
  document.fonts && document.fonts.ready.then(() => movePill(true));

  $$('[data-cat-jump]').forEach(a => a.addEventListener('click', () => {
    if (state.q) { searchEl.value = ''; state.q = ''; }
    setCat(a.dataset.catJump);
  }));

  let searchTimer;
  searchEl.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = searchEl.value.trim().toLowerCase(); render(); }, 140);
  });
  $('[data-clear-search]').addEventListener('click', () => { searchEl.value = ''; state.q = ''; render(); searchEl.focus(); });

  const viewBtns = $$('[data-view]');
  const setView = view => {
    state.view = view; store.set('view', view);
    viewBtns.forEach(b => { const on = b.dataset.view === view; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    listEl.className = `dishes dishes--${view}`;
    $('.menu').classList.toggle('is-grid', view === 'grid');
    requestAnimationFrame(() => movePill());
  };
  viewBtns.forEach(b => b.addEventListener('click', () => { if (b.dataset.view !== state.view) { setView(b.dataset.view); render(true); } }));

  const filtered = () => dishes.filter(d => {
    if (state.cat !== 'all' && d.cat !== state.cat) return false;
    if (!state.q) return true;
    const hay = `${d.name} ${d.short} ${d.desc} ${d.tags} ${d.cat}`.toLowerCase();
    return state.q.split(/\s+/).every(term => hay.includes(term));
  });

  const dishHTML = (d, i) => `
    <article class="dish is-in${d.id === state.featured ? ' is-featured' : ''}" data-id="${d.id}" style="--i:${i}" tabindex="0" aria-label="${escapeHtml(d.name)}, ${money(d.price)}">
      <div class="dish__media">${media(d)}</div>
      <div class="dish__body">
        <h3 class="dish__name">${escapeHtml(d.name)} ${dietBadges(d)}${d.signature ? '<span class="badge">Signature</span>' : ''}</h3>
        <p class="dish__desc">${escapeHtml(state.view === 'grid' ? d.short : d.desc)}</p>
      </div>
      <div class="dish__foot">
        <div class="dish__price">${money(d.price)}<span class="dish__time"><svg class="icon icon--sm"><use href="#i-clock"/></svg>${d.time} min</span></div>
        <button class="btn btn--copper dish__add" type="button" data-add="${d.id}" aria-label="Add ${escapeHtml(d.name)} to order">
          <span class="dish__add-label">Add</span><svg class="icon"><use href="#i-plus"/></svg>
        </button>
      </div>
    </article>`;

  let renderToken = 0;
  function render(immediate = false) {
    const items = filtered();
    const token = ++renderToken;
    const paint = () => {
      if (token !== renderToken) return;
      listEl.innerHTML = items.map(dishHTML).join('');
      emptyEl.hidden = items.length > 0;
      $('[data-empty-q]').textContent = searchEl.value.trim();
      $('[data-result-count]').textContent = `${items.length} ${items.length === 1 ? 'dish' : 'dishes'}${state.cat !== 'all' ? ' · ' + categories.find(c => c.id === state.cat).label : ''}${state.q ? ` · “${searchEl.value.trim()}”` : ''}`;
      // Keep the featured panel relevant to what is on screen
      if (items.length && !items.some(d => d.id === state.featured)) setFeatured(items.find(d => d.img) || items[0]);
      else paintThumbs();
    };
    const current = $$('.dish', listEl);
    if (immediate || reduceMotion || !current.length) return paint();
    current.forEach(el => el.classList.add('is-out'));
    setTimeout(paint, 200);
  }

  listEl.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add, 1, add); return; }
    const card = e.target.closest('.dish');
    if (!card) return;
    clearTimeout(hoverTimer);
    if (state.view === 'list' && isDesktop()) setFeatured(byId[card.dataset.id]);
    else openSheet(card.dataset.id);
  });
  listEl.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.target.closest('button')) return;
    const card = e.target.closest('.dish');
    if (card) openSheet(card.dataset.id);
  });
  // Hover intent previews a dish in the featured panel
  let hoverTimer;
  listEl.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || state.view !== 'list' || !isDesktop()) return;
    const card = e.target.closest('.dish');
    clearTimeout(hoverTimer);
    if (card && card.dataset.id !== state.featured) hoverTimer = setTimeout(() => setFeatured(byId[card.dataset.id]), 260);
  });
  listEl.addEventListener('pointerleave', () => clearTimeout(hoverTimer));

  /* ------------------------------------------------------------------
     Featured dish panel
     ------------------------------------------------------------------ */
  const f = {
    title: $('[data-f-title]'), desc: $('[data-f-desc]'), price: $('[data-f-price]'), time: $('[data-f-time]'),
    img: $('[data-f-img]'), stage: $('[data-f-stage]'), thumbs: $('[data-f-thumbs]'), add: $('[data-f-add]')
  };

  const swapText = (el, text) => { el.textContent = text; el.classList.remove('swap-text'); void el.offsetWidth; el.classList.add('swap-text'); };

  function setFeatured(dish, { animate = true } = {}) {
    if (!dish) return;
    const changed = dish.id !== state.featured;
    state.featured = dish.id;
    $$('.dish', listEl).forEach(el => el.classList.toggle('is-featured', el.dataset.id === dish.id));
    paintThumbs();
    if (!changed && animate) return;

    const apply = () => {
      swapText(f.title, dish.name);
      swapText(f.desc, dish.desc);
      swapText(f.price, money(dish.price));
      f.time.textContent = `${dish.time} min`;
      f.add.setAttribute('aria-label', `Add ${dish.name} to order`);
      const ph = $('.feature__ph', f.stage);
      if (ph) ph.remove();
      if (dish.img) {
        f.img.hidden = false;
        f.img.src = dish.hero || dish.img;
        f.img.alt = dish.name;
        f.img.classList.toggle('is-tall', !!dish.tall);
        f.img.classList.toggle('is-photo', !dish.hero && !dish.tall);
        f.img.classList.toggle('is-small', !dish.hero && !dish.tall && /lobster|club|burrata|croissant|garden/.test(dish.img));
      } else {
        f.img.hidden = true;
        f.stage.insertAdjacentHTML('beforeend', `<div class="feature__ph">${media(dish)}</div>`);
      }
      f.stage.classList.toggle('has-hero', !!dish.hero);
      $('.feature__steam', f.stage).style.display = dish.cat === 'beverages' || dish.cat === 'salads' ? 'none' : '';
      if (animate && !reduceMotion) {
        const target = dish.img ? f.img : $('.feature__ph', f.stage);
        target.classList.remove('is-swapping');
        target.classList.add('is-entering');
        target.addEventListener('animationend', () => target.classList.remove('is-entering'), { once: true });
      }
    };
    if (!animate || reduceMotion) return apply();
    const current = f.img.hidden ? $('.feature__ph', f.stage) : f.img;
    current.classList.add('is-swapping');
    setTimeout(apply, 260);
  }

  function paintThumbs() {
    const current = byId[state.featured];
    const pool = filtered();
    const source = (pool.length > 1 ? pool : dishes).filter(d => d.img);
    const sameCat = source.filter(d => d.cat === current.cat && d.id !== current.id);
    const others = source.filter(d => d.cat !== current.cat && d.id !== current.id);
    const picks = [current, ...sameCat, ...others].filter((d, i, a) => a.indexOf(d) === i).slice(0, 4);
    f.thumbs.innerHTML = picks.map(d => `
      <button class="thumb${d.id === current.id ? ' is-active' : ''}" type="button" data-thumb="${d.id}" aria-label="Show ${escapeHtml(d.name)}">${media(d)}</button>`).join('');
  }
  f.thumbs.addEventListener('click', e => {
    const t = e.target.closest('[data-thumb]');
    if (t) setFeatured(byId[t.dataset.thumb]);
  });
  f.add.addEventListener('click', () => addToCart(state.featured, 1, f.add, f.img.hidden ? $('.feature__ph', f.stage) : f.img));

  // Drag to rotate (3D tilt); a long swipe moves to the next dish
  (() => {
    let x0 = null, dx = 0, raf = 0;
    const target = () => f.img.hidden ? $('.feature__ph', f.stage) : f.img;
    const paint = () => { raf = 0; target().style.transform = `rotateY(${dx * 0.18}deg) rotateZ(${dx * 0.012}deg) translateX(${dx * 0.12}px)`; };
    f.stage.addEventListener('pointerdown', e => {
      x0 = e.clientX; dx = 0;
      f.stage.setPointerCapture(e.pointerId);
      f.stage.classList.add('is-dragging');
      target().style.transition = 'none';
    });
    f.stage.addEventListener('pointermove', e => {
      if (x0 === null) return;
      dx = Math.max(-260, Math.min(260, e.clientX - x0));
      if (!raf) raf = requestAnimationFrame(paint);
    });
    const end = () => {
      if (x0 === null) return;
      x0 = null;
      f.stage.classList.remove('is-dragging');
      const el = target();
      el.style.transition = 'transform .9s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform = '';
      if (Math.abs(dx) > 160) {
        const pool = filtered();
        const list = pool.length > 1 ? pool : dishes;
        const idx = list.findIndex(d => d.id === state.featured);
        const next = list[(idx + (dx < 0 ? 1 : -1) + list.length) % list.length];
        setTimeout(() => { el.style.transition = ''; setFeatured(next); }, 120);
      } else {
        setTimeout(() => { el.style.transition = ''; }, 900);
      }
    };
    f.stage.addEventListener('pointerup', end);
    f.stage.addEventListener('pointercancel', end);
    $('[data-drag-hint]').addEventListener('click', () => {
      const el = target();
      el.animate([
        { transform: 'rotateY(0)' }, { transform: 'rotateY(-35deg) scale(.96)' },
        { transform: 'rotateY(30deg) scale(1.02)' }, { transform: 'rotateY(0)' }
      ], { duration: 1500, easing: 'cubic-bezier(.2,.7,.2,1)' });
    });
  })();

  /* ------------------------------------------------------------------
     Dish detail sheet
     ------------------------------------------------------------------ */
  const sheet = $('[data-sheet]');
  let sheetDish = null, sheetQty = 1, lastFocus = null;
  function openSheet(id) {
    const d = byId[id];
    sheetDish = d; sheetQty = 1;
    const mediaWrap = $('.sheet__media', sheet);
    mediaWrap.innerHTML = d.img ? `<img src="${d.hero || d.img}" alt="${escapeHtml(d.name)}" class="${d.tall ? 'is-tall' : ''}">` : media(d);
    $('[data-s-cat]', sheet).textContent = categories.find(c => c.id === d.cat).label;
    $('[data-s-title]', sheet).textContent = d.name;
    $('[data-s-desc]', sheet).textContent = d.desc;
    $('[data-s-time]', sheet).textContent = `Ready in about ${d.time} min`;
    $('[data-s-diet]', sheet).innerHTML = dietBadges(d);
    $('[data-s-pair]', sheet).textContent = d.pair || '';
    paintSheetQty();
    openLayer(sheet);
  }
  const paintSheetQty = () => {
    const q = $('[data-s-qty]', sheet);
    q.textContent = sheetQty; q.classList.remove('tick'); void q.offsetWidth; q.classList.add('tick');
    $('[data-s-price]', sheet).textContent = money(sheetDish.price * sheetQty);
  };
  $('[data-s-inc]', sheet).addEventListener('click', () => { sheetQty = Math.min(20, sheetQty + 1); paintSheetQty(); });
  $('[data-s-dec]', sheet).addEventListener('click', () => { sheetQty = Math.max(1, sheetQty - 1); paintSheetQty(); });
  $('[data-s-add]', sheet).addEventListener('click', e => {
    addToCart(sheetDish.id, sheetQty, e.currentTarget, $('.sheet__media img, .sheet__media .plate-ph', sheet));
    setTimeout(() => closeLayer(sheet), 250);
  });
  $('[data-close-sheet]', sheet).addEventListener('click', () => closeLayer(sheet));
  sheet.addEventListener('click', e => { if (e.target === sheet) closeLayer(sheet); });

  /* Generic overlay helpers */
  function openLayer(el) {
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(() => { const f = $('button, [href], input, select, textarea', el); f && f.focus({ preventScroll: true }); }, 80);
  }
  function closeLayer(el) {
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (!$$('.drawer.is-open, .sheet.is-open, .confirm.is-open').length) document.body.classList.remove('is-locked');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------
     Cart
     ------------------------------------------------------------------ */
  const drawer = $('[data-drawer]');
  const scrim = $('[data-scrim]');
  const linesEl = $('[data-lines]');
  const totalEl = $('[data-total]');
  const cartBar = $('[data-cart-bar]');
  let cart = new Map(Object.entries(store.get('cart', {})).filter(([id]) => byId[id]));
  let shownTotal = 0;

  const cartCount = () => [...cart.values()].reduce((a, b) => a + b, 0);
  const cartTotal = () => [...cart].reduce((sum, [id, q]) => sum + byId[id].price * q, 0);
  const saveCart = () => store.set('cart', Object.fromEntries(cart));

  function addToCart(id, qty = 1, sourceBtn, sourceImg) {
    cart.set(id, (cart.get(id) || 0) + qty);
    saveCart();
    const d = byId[id];
    if (sourceBtn) {
      ripple(sourceBtn);
      if (sourceBtn.classList.contains('dish__add')) {
        sourceBtn.classList.add('is-added');
        setTimeout(() => sourceBtn.classList.remove('is-added'), 1100);
      }
    }
    const img = sourceImg || (sourceBtn && sourceBtn.closest('.dish') && $('.dish__media > *', sourceBtn.closest('.dish')));
    flyToCart(img, () => {
      updateCartUI({ bump: true });
    });
    if (!img) updateCartUI({ bump: true });
    toast(`<b>${escapeHtml(d.name)}</b>${qty > 1 ? ' ×' + qty : ''} added`, d, true);
  }

  function setQty(id, qty) {
    if (qty <= 0) {
      const row = $(`.line-item[data-line="${id}"]`, linesEl);
      cart.delete(id); saveCart();
      if (row && !reduceMotion) {
        row.style.height = row.offsetHeight + 'px';
        row.classList.add('is-removing');
        row.addEventListener('animationend', () => updateCartUI(), { once: true });
        updateCartUI({ skipLines: true });
        return;
      }
    } else {
      cart.set(id, Math.min(20, qty)); saveCart();
    }
    updateCartUI();
  }

  function updateCartUI({ bump = false, skipLines = false } = {}) {
    const count = cartCount();
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });
    $('[data-cart-noun]').textContent = count === 1 ? 'item' : 'items';
    const btn = $('.cart-btn');
    btn.classList.toggle('has-items', count > 0);
    if (bump && !reduceMotion) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
    cartBar.classList.toggle('is-visible', count > 0 && !drawer.classList.contains('is-open'));
    $('[data-cart-bar-total]').textContent = money(cartTotal());
    drawer.classList.toggle('is-empty', count === 0);
    if (!skipLines) renderLines();
    tweenTotal(cartTotal());
  }

  function renderLines() {
    const existing = new Map($$('.line-item', linesEl).map(li => [li.dataset.line, li]));
    let i = 0;
    for (const [id, qty] of cart) {
      const d = byId[id];
      let li = existing.get(id);
      if (!li) {
        li = document.createElement('li');
        li.className = 'line-item';
        li.dataset.line = id;
        li.style.setProperty('--i', i);
        li.innerHTML = `
          <div class="line-item__media">${media(d)}</div>
          <span class="line-item__name">${escapeHtml(d.name)}</span>
          <span class="line-item__price"></span>
          <div class="stepper">
            <button type="button" data-dec aria-label="Remove one ${escapeHtml(d.name)}"><svg class="icon"><use href="#i-minus"/></svg></button>
            <span data-qty></span>
            <button type="button" data-inc aria-label="Add one ${escapeHtml(d.name)}"><svg class="icon"><use href="#i-plus"/></svg></button>
          </div>
          <button class="line-item__del" type="button" data-del aria-label="Remove ${escapeHtml(d.name)}"><svg class="icon"><use href="#i-trash"/></svg></button>`;
        linesEl.appendChild(li);
      }
      existing.delete(id);
      const q = $('[data-qty]', li), p = $('.line-item__price', li);
      if (q.textContent !== String(qty)) {
        const animate = q.textContent !== '';
        q.textContent = qty; p.textContent = money(d.price * qty);
        if (animate) {
          q.classList.remove('tick'); p.classList.remove('flash'); void q.offsetWidth;
          q.classList.add('tick'); p.classList.add('flash');
        }
      }
      i++;
    }
    existing.forEach(li => li.remove());
  }

  linesEl.addEventListener('click', e => {
    const li = e.target.closest('.line-item');
    if (!li) return;
    const id = li.dataset.line;
    if (e.target.closest('[data-inc]')) setQty(id, cart.get(id) + 1);
    else if (e.target.closest('[data-dec]')) setQty(id, cart.get(id) - 1);
    else if (e.target.closest('[data-del]')) setQty(id, 0);
  });

  function tweenTotal(to) {
    const from = shownTotal;
    shownTotal = to;
    if (reduceMotion || from === to) { totalEl.textContent = money(to); return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / 600);
      const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
      totalEl.textContent = money(Math.round(v));
      if (p < 1) requestAnimationFrame(step); else totalEl.textContent = money(to);
    };
    requestAnimationFrame(step);
  }

  const openCart = () => {
    renderSlots();
    drawer.classList.add('is-open');
    scrim.classList.add('is-open');
    cartBar.classList.remove('is-visible');
    openLayer(drawer);
  };
  const closeCart = () => {
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');
    closeLayer(drawer);
    cartBar.classList.toggle('is-visible', cartCount() > 0);
  };
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  $$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
  scrim.addEventListener('click', closeCart);

  // Delivery slots: ASAP + the next two half-hour slots at least 45 minutes out
  let slot = 'asap';
  const slotsEl = $('[data-slots]');
  const fmtTime = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  function renderSlots() {
    const now = new Date();
    const first = new Date(now.getTime() + 45 * 60000);
    first.setMinutes(first.getMinutes() < 30 ? 30 : 60, 0, 0);
    const times = [first, new Date(first.getTime() + 30 * 60000)];
    const prepMax = Math.max(15, ...[...cart.keys()].map(id => byId[id].time));
    const options = [{ id: 'asap', html: `ASAP<br><small>${prepMax} min</small>`, label: `in about ${prepMax} minutes` }]
      .concat(times.map(t => ({ id: t.toISOString(), html: fmtTime(t), label: `at ${fmtTime(t)}` })));
    if (!options.some(o => o.id === slot)) slot = 'asap';
    slotsEl.innerHTML = options.map(o =>
      `<button class="slot" type="button" role="radio" aria-checked="${o.id === slot}" data-slot="${o.id}" data-label="${o.label}">${o.html}</button>`).join('');
  }
  slotsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-slot]');
    if (!b) return;
    slot = b.dataset.slot;
    $$('.slot', slotsEl).forEach(s => s.setAttribute('aria-checked', String(s === b)));
  });

  // Place order
  const confirmEl = $('[data-confirm]');
  let trackTimers = [];
  $('[data-place-order]').addEventListener('click', e => {
    const btn = e.currentTarget;
    if (!cartCount() || btn.classList.contains('is-loading-btn')) return;
    ripple(btn, e);
    btn.classList.add('is-loading-btn');
    const etaLabel = $('.slot[aria-checked="true"]', slotsEl)?.dataset.label || 'shortly';
    setTimeout(() => {
      btn.classList.remove('is-loading-btn');
      const orderNo = 'HMR-' + String(Math.floor(1000 + Math.random() * 9000));
      store.set('lastOrder', { orderNo, room, items: Object.fromEntries(cart), total: cartTotal(), eta: etaLabel, notes: $('[data-notes]').value, pay: $('[data-pay]').value, at: Date.now() });
      cart.clear(); saveCart();
      $('[data-notes]').value = '';
      drawer.classList.remove('is-open');
      scrim.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      updateCartUI();
      $('[data-order-no]', confirmEl).textContent = orderNo;
      $('[data-eta]', confirmEl).textContent = etaLabel;
      runTracker();
      openLayer(confirmEl);
    }, reduceMotion ? 200 : 1400);
  });
  function runTracker() {
    const steps = $$('[data-track] li', confirmEl);
    const track = $('[data-track]', confirmEl);
    trackTimers.forEach(clearTimeout);
    steps.forEach((s, i) => s.classList.toggle('is-done', i === 0));
    track.style.setProperty('--p', 0);
    [1, 2].forEach((n, k) => trackTimers.push(setTimeout(() => {
      steps[n].classList.add('is-done');
      track.style.setProperty('--p', n / (steps.length - 1));
    }, 1800 + k * 2600)));
  }
  $('[data-close-confirm]').addEventListener('click', () => { trackTimers.forEach(clearTimeout); closeLayer(confirmEl); });
  confirmEl.addEventListener('click', e => { if (e.target === confirmEl) { trackTimers.forEach(clearTimeout); closeLayer(confirmEl); } });

  /* ------------------------------------------------------------------
     Micro-interactions
     ------------------------------------------------------------------ */
  function ripple(btn, evt) {
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = size + 'px';
    const x = evt && evt.clientX ? evt.clientX - r.left : r.width / 2;
    const y = evt && evt.clientY ? evt.clientY - r.top : r.height / 2;
    s.style.left = x - size / 2 + 'px';
    s.style.top = y - size / 2 + 'px';
    btn.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }

  function flyToCart(sourceEl, done) {
    if (!sourceEl || reduceMotion) { done && done(); return; }
    const target = (getComputedStyle(cartBar).display !== 'none' ? (cartBar.classList.contains('is-visible') ? cartBar : null) : null) || $('.cart-btn');
    const a = sourceEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    if (!a.width) { done && done(); return; }
    const size = Math.min(110, Math.max(64, Math.min(a.width, a.height)));
    const fly = document.createElement('div');
    fly.className = 'fly';
    fly.innerHTML = sourceEl.tagName === 'IMG' ? `<img src="${sourceEl.currentSrc || sourceEl.src}" alt="">` : sourceEl.outerHTML;
    Object.assign(fly.style, { width: size + 'px', height: size + 'px', left: '0', top: '0' });
    document.body.appendChild(fly);
    const sx = a.left + a.width / 2 - size / 2, sy = a.top + a.height / 2 - size / 2;
    const ex = b.left + b.width / 2 - size / 2, ey = b.top + b.height / 2 - size / 2;
    const midX = sx + (ex - sx) * 0.55, midY = Math.min(sy, ey) - 120;
    const anim = fly.animate([
      { transform: `translate(${sx}px, ${sy}px) scale(.6)`, opacity: 0 },
      { transform: `translate(${sx}px, ${sy - 20}px) scale(1)`, opacity: 1, offset: 0.15 },
      { transform: `translate(${midX}px, ${midY}px) scale(.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${ex}px, ${ey}px) scale(.18)`, opacity: .3 }
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' });
    anim.onfinish = () => { fly.remove(); done && done(); };
  }

  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(html, dish, withAction = false) {
    toastEl.innerHTML = `${dish ? media(dish) : ''}<span>${html}</span>${withAction ? '<button type="button" data-toast-open>View order</button>' : ''}`;
    if (!dish) toastEl.style.paddingLeft = '20px'; else toastEl.style.paddingLeft = '';
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }
  toastEl.addEventListener('click', e => { if (e.target.closest('[data-toast-open]')) { toastEl.classList.remove('is-on'); openCart(); } });

  /* ------------------------------------------------------------------
     Keyboard
     ------------------------------------------------------------------ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (confirmEl.classList.contains('is-open')) closeLayer(confirmEl);
      else if (sheet.classList.contains('is-open')) closeLayer(sheet);
      else if (drawer.classList.contains('is-open')) closeCart();
      else if (mnav.classList.contains('is-open')) toggleMnav(false);
      setRoomOpen(false);
    }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault();
      searchEl.focus();
      searchEl.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  setView(state.view);
  setCat('all');
  setFeatured(byId.wagyu, { animate: false });
  updateCartUI();
})();
