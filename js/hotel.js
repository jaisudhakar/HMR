/* HMR Hotels & Resorts — booking, rooms, gallery, reviews. Depends on js/app.js (window.HMR). */
(() => {
  'use strict';

  const { rooms, gallery, reviews } = window.HMR_HOTEL;
  const { openLayer, closeLayer, toast, observeReveals, escapeHtml, store, reduceMotion } = window.HMR;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = n => '$' + n.toLocaleString('en-US');
  const roomById = Object.fromEntries(rooms.map(r => [r.id, r]));

  /* ------------------------------------------------------------------
     Booking bar
     ------------------------------------------------------------------ */
  const form = $('[data-booking-form]');
  const inEl = $('[data-checkin]');
  const outEl = $('[data-checkout]');
  const typeEl = $('[data-room-type]');
  const guests = { adults: 2, children: 0, rooms: 1 };
  const limits = { adults: [1, 8], children: [0, 6], rooms: [1, 4] };

  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = v => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
  const fmt = d => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  const nights = () => Math.max(1, Math.round((parse(outEl.value) - parse(inEl.value)) / 864e5));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  inEl.min = iso(today);
  inEl.value = iso(addDays(today, 1));
  outEl.min = iso(addDays(today, 2));
  outEl.value = iso(addDays(today, 3));
  inEl.addEventListener('change', () => {
    if (!inEl.value) return;
    const next = addDays(parse(inEl.value), 1);
    outEl.min = iso(next);
    if (!outEl.value || parse(outEl.value) <= parse(inEl.value)) outEl.value = iso(addDays(parse(inEl.value), 2));
  });

  typeEl.insertAdjacentHTML('beforeend', rooms.map(r => `<option value="${r.id}">${escapeHtml(r.name)}</option>`).join(''));

  const guestWrap = $('[data-guests]');
  const guestBtn = $('[data-guests-btn]');
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const guestText = () => [plural(guests.adults, 'adult', 'adults'), guests.children ? plural(guests.children, 'child', 'children') : '', guests.rooms > 1 ? plural(guests.rooms, 'room', 'rooms') : '']
    .filter(Boolean).join(' · ');
  const paintGuests = () => {
    $('[data-guests-label]').textContent = guestText();
    Object.keys(guests).forEach(k => { $(`[data-g-val="${k}"]`).textContent = guests[k]; });
  };
  const setGuestsOpen = open => { guestWrap.classList.toggle('is-open', open); guestBtn.setAttribute('aria-expanded', String(open)); };
  guestBtn.addEventListener('click', e => { e.stopPropagation(); setGuestsOpen(!guestWrap.classList.contains('is-open')); });
  $('[data-guests-pop]').addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('[data-g]');
    if (!b) return;
    const k = b.dataset.g;
    guests[k] = Math.min(limits[k][1], Math.max(limits[k][0], guests[k] + Number(b.dataset.d)));
    paintGuests();
  });
  document.addEventListener('click', () => setGuestsOpen(false));
  paintGuests();

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    openBooking({ highlight: typeEl.value });
  });

  /* ------------------------------------------------------------------
     Booking modal
     ------------------------------------------------------------------ */
  const modal = $('[data-bmodal]');
  const bForm = $('[data-b-form]');
  let picked = null;

  const perRoom = () => Math.ceil((guests.adults + guests.children) / guests.rooms);
  const stayText = () => `${fmt(parse(inEl.value))} – ${fmt(parse(outEl.value))} · ${plural(nights(), 'night', 'nights')} · ${guestText()}`;
  const stayTotal = r => r.price * nights() * guests.rooms;

  function goStep(n) {
    $$('[data-bstep]', modal).forEach(s => {
      const on = s.dataset.bstep === String(n);
      s.classList.toggle('is-active', on);
      if (on && !reduceMotion) { s.classList.remove('swap-text'); void s.offsetWidth; s.classList.add('swap-text'); }
    });
    $$('[data-bstep-ind]', modal).forEach(li => {
      const i = Number(li.dataset.bstepInd);
      li.classList.toggle('is-active', i === n);
      li.classList.toggle('is-done', i < n);
    });
    $('.bmodal__panel', modal).scrollTop = 0;
  }

  function renderResults(highlight) {
    $('[data-b-summary]', modal).textContent = stayText();
    const fit = r => r.guests >= perRoom();
    const order = [...rooms].sort((a, b) => (b.id === highlight) - (a.id === highlight) || fit(b) - fit(a));
    $('[data-b-results]', modal).innerHTML = order.map((r, i) => `
      <li class="bresult${r.id === highlight ? ' is-highlight' : ''}${fit(r) ? '' : ' is-disabled'}" style="--i:${i}">
        <img src="${r.img}" alt="">
        <div class="bresult__info">
          <h3>${escapeHtml(r.name)}</h3>
          <p>${r.size} m² · ${escapeHtml(r.bed)} · up to ${r.guests} guests · ${escapeHtml(r.view)}</p>
          <p class="bresult__perks"><svg class="icon icon--sm"><use href="#i-check"/></svg>Breakfast included · Free cancellation</p>
        </div>
        <div class="bresult__price">
          <span><b>${money(r.price)}</b> / night</span>
          <small>${money(stayTotal(r))} total${guests.rooms > 1 ? ` for ${guests.rooms} rooms` : ''}</small>
          ${fit(r)
            ? `<button class="btn btn--copper btn--sm" type="button" data-b-select="${r.id}">Select</button>`
            : `<small class="bresult__na">Sleeps up to ${r.guests} — add a room</small>`}
        </div>
      </li>`).join('');
  }

  function renderPick() {
    const r = roomById[picked];
    $('[data-b-pick]', modal).innerHTML = `
      <img src="${r.img}" alt="">
      <div>
        <b>${escapeHtml(r.name)}</b>
        <span>${stayText()}</span>
      </div>
      <div class="bpick__total"><small>Total</small><b>${money(stayTotal(r))}</b><small>incl. taxes &amp; breakfast</small></div>`;
  }

  function openBooking({ highlight = '', roomId = '' } = {}) {
    if (!inEl.value || !outEl.value) { inEl.value = iso(addDays(today, 1)); outEl.value = iso(addDays(today, 3)); }
    renderResults(highlight || roomId);
    if (roomId && roomById[roomId].guests >= perRoom()) { picked = roomId; renderPick(); goStep(2); }
    else goStep(1);
    openLayer(modal);
  }

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-bmodal-close]')) { closeLayer(modal); return; }
    const sel = e.target.closest('[data-b-select]');
    if (sel) { picked = sel.dataset.bSelect; renderPick(); goStep(2); setTimeout(() => $('input', bForm).focus(), 60); }
    if (e.target.closest('[data-b-back]')) { renderResults(picked); goStep(1); }
  });

  bForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('button[type="submit"]', bForm);
    btn.classList.add('is-loading-btn');
    setTimeout(() => {
      btn.classList.remove('is-loading-btn');
      const data = Object.fromEntries(new FormData(bForm));
      const code = 'HMR' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const r = roomById[picked];
      store.set('lastBooking', { code, room: picked, checkin: inEl.value, checkout: outEl.value, guests: { ...guests }, total: stayTotal(r), guest: { first: data.first, last: data.last, email: data.email } });
      $('[data-b-code]', modal).textContent = code;
      $('[data-b-final]', modal).innerHTML = `${escapeHtml(data.first)}, your <b>${escapeHtml(r.name)}</b> is reserved for ${escapeHtml(stayText())}. A confirmation is on its way to <b>${escapeHtml(data.email)}</b>.`;
      goStep(3);
      bForm.reset();
    }, reduceMotion ? 150 : 1300);
  });

  $$('[data-book-open]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openBooking(); }));

  /* ------------------------------------------------------------------
     Rooms carousel
     ------------------------------------------------------------------ */
  const track = $('[data-rooms]');
  track.innerHTML = rooms.map((r, i) => `
    <article class="room-card reveal" style="--d:${i}">
      <div class="room-card__media">
        <img src="${r.img}" alt="${escapeHtml(r.name)}" loading="lazy">
        <span class="room-card__tag">${escapeHtml(r.tag)}</span>
      </div>
      <div class="room-card__body">
        <h3>${escapeHtml(r.name)}</h3>
        <p class="room-card__desc">${escapeHtml(r.desc)}</p>
        <ul class="specs">
          <li><svg class="icon icon--sm"><use href="#i-size"/></svg>${r.size} m²</li>
          <li><svg class="icon icon--sm"><use href="#i-bed"/></svg>${escapeHtml(r.bed)}</li>
          <li><svg class="icon icon--sm"><use href="#i-user"/></svg>Up to ${r.guests}</li>
          <li><svg class="icon icon--sm"><use href="#i-eye"/></svg>${escapeHtml(r.view)}</li>
        </ul>
        <ul class="features">${r.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
        <div class="room-card__foot">
          <p class="room-card__price"><small>From</small><b>${money(r.price)}</b><small>/ night</small></p>
          <button class="btn btn--copper btn--sm" type="button" data-book-room="${r.id}">Book now <svg class="icon btn__arrow"><use href="#i-arrow"/></svg></button>
        </div>
      </div>
    </article>`).join('');
  observeReveals(track.parentElement);

  track.addEventListener('click', e => {
    const b = e.target.closest('[data-book-room]');
    if (!b) return;
    typeEl.value = b.dataset.bookRoom;
    openBooking({ roomId: b.dataset.bookRoom });
  });
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 400) + 24;
  $('[data-rooms-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('[data-rooms-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  const progress = $('[data-rooms-progress]');
  const paintProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const visible = track.clientWidth / track.scrollWidth;
    progress.style.width = `${Math.max(visible, 0.12) * 100}%`;
    progress.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * (1 / Math.max(visible, 0.12) - 1) * 100 : 0}%)`;
  };
  track.addEventListener('scroll', paintProgress, { passive: true });
  window.addEventListener('resize', paintProgress);
  paintProgress();

  // Drag-to-scroll with the mouse
  (() => {
    let x0 = null, s0 = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; x0 = e.clientX; s0 = track.scrollLeft; moved = false; track.classList.add('is-grabbing'); });
    window.addEventListener('pointermove', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = s0 - dx; });
    window.addEventListener('pointerup', () => { x0 = null; track.classList.remove('is-grabbing'); });
    track.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  })();

  /* ------------------------------------------------------------------
     Gallery + lightbox
     ------------------------------------------------------------------ */
  const gEl = $('[data-gallery]');
  let gFilter = 'all';
  const gItems = () => gallery.filter(g => gFilter === 'all' || g.cat === gFilter);
  function renderGallery(animate) {
    const paint = () => {
      gEl.innerHTML = gItems().map((g, i) => `
        <button class="shot${g.wide ? ' shot--wide' : ''}${g.tall ? ' shot--tall' : ''}" type="button" data-shot="${i}" style="--i:${i}" aria-label="Open photo: ${escapeHtml(g.title)}">
          <img src="${g.img}" alt="${escapeHtml(g.title)}" loading="lazy">
          <span class="shot__cap">${escapeHtml(g.title)}</span>
        </button>`).join('');
    };
    if (!animate || reduceMotion) return paint();
    $$('.shot', gEl).forEach(s => s.classList.add('is-out'));
    setTimeout(paint, 220);
  }
  renderGallery(false);
  $('[data-gallery-filters]').addEventListener('click', e => {
    const b = e.target.closest('[data-gf]');
    if (!b || b.dataset.gf === gFilter) return;
    gFilter = b.dataset.gf;
    $$('.gchip').forEach(c => c.classList.toggle('is-active', c === b));
    renderGallery(true);
  });

  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lb-img]');
  let lbIndex = 0;
  const showShot = (i, dir = 0) => {
    const list = gItems();
    lbIndex = (i + list.length) % list.length;
    const g = list[lbIndex];
    lbImg.src = g.img; lbImg.alt = g.title;
    $('[data-lb-cap]').textContent = g.title;
    $('[data-lb-count]').textContent = `${lbIndex + 1} / ${list.length}`;
    if (!reduceMotion) lbImg.animate([{ opacity: 0, transform: `translateX(${dir * 40}px) scale(.98)` }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
  };
  gEl.addEventListener('click', e => {
    const s = e.target.closest('[data-shot]');
    if (!s) return;
    showShot(Number(s.dataset.shot));
    openLayer(lb);
  });
  $('[data-lb-prev]').addEventListener('click', () => showShot(lbIndex - 1, -1));
  $('[data-lb-next]').addEventListener('click', () => showShot(lbIndex + 1, 1));
  $('[data-lb-close]').addEventListener('click', () => closeLayer(lb));
  lb.addEventListener('click', e => { if (e.target === lb) closeLayer(lb); });
  (() => {
    let x0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) showShot(lbIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  })();

  /* ------------------------------------------------------------------
     Reviews
     ------------------------------------------------------------------ */
  const stage = $('[data-quotes-stage]');
  const dots = $('[data-quotes-dots]');
  let qi = 0, qTimer = null;
  dots.innerHTML = reviews.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}" data-q="${i}"><span></span></button>`).join('');
  function showQuote(i) {
    qi = (i + reviews.length) % reviews.length;
    const r = reviews[qi];
    stage.innerHTML = `
      <blockquote class="swap-text">
        <div class="stars stars--sm" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}<span>${'★'.repeat(5 - r.rating)}</span></div>
        <p>“${escapeHtml(r.quote)}”</p>
        <footer><span class="avatar">${escapeHtml(r.name.replace(/^The /, '').split(/[ &]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join(''))}</span><span><b>${escapeHtml(r.name)}</b><small>${escapeHtml(r.trip)}</small></span></footer>
      </blockquote>`;
    $$('button', dots).forEach((d, k) => d.classList.toggle('is-active', k === qi));
  }
  const autoplay = () => { clearInterval(qTimer); if (!reduceMotion) qTimer = setInterval(() => showQuote(qi + 1), 6500); };
  dots.addEventListener('click', e => { const d = e.target.closest('[data-q]'); if (d) { showQuote(Number(d.dataset.q)); autoplay(); } });
  $('[data-q-prev]').addEventListener('click', () => { showQuote(qi - 1); autoplay(); });
  $('[data-q-next]').addEventListener('click', () => { showQuote(qi + 1); autoplay(); });
  const quotesEl = $('[data-quotes]');
  quotesEl.addEventListener('mouseenter', () => clearInterval(qTimer));
  quotesEl.addEventListener('mouseleave', autoplay);
  showQuote(0);
  autoplay();

  const dumSteps = $('[data-dum-steps]');
  if (dumSteps) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { dumSteps.classList.add('is-lit'); o.disconnect(); } }, { threshold: .3 }).observe(dumSteps);

  /* ------------------------------------------------------------------
     Newsletter & keyboard
     ------------------------------------------------------------------ */
  $('[data-newsletter]').addEventListener('submit', e => {
    e.preventDefault();
    e.target.reset();
    toast('<b>Welcome to HMR Rewards.</b> Check your inbox to confirm.');
  });

  document.addEventListener('keydown', e => {
    if (lb.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') showShot(lbIndex + 1, 1);
      if (e.key === 'ArrowLeft') showShot(lbIndex - 1, -1);
      if (e.key === 'Escape') closeLayer(lb);
    } else if (modal.classList.contains('is-open') && e.key === 'Escape') {
      closeLayer(modal);
    } else if (e.key === 'Escape') {
      setGuestsOpen(false);
    }
  });
})();
