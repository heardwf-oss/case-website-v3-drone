(() => {
  const root = document.documentElement;

  // Header: clear over a hero, solid once past it. Pages without a hero keep it solid.
  const bar = document.querySelector('[data-bar]');
  const hero = document.querySelector('.hero, .phero');
  if (bar && hero) {
    const setBar = () => bar.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
    setBar();
    window.addEventListener('scroll', setBar, { passive: true });
  }

  // Film pause
  const film = document.querySelector('.hero__film, video.phero__media');
  const pause = document.querySelector('[data-pause]');
  if (film && pause) {
    pause.addEventListener('click', () => {
      const paused = !film.paused;
      paused ? film.pause() : film.play();
      pause.textContent = paused ? 'Play film' : 'Pause film';
      pause.setAttribute('aria-pressed', String(paused));
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { film.pause(); pause.textContent = 'Play film'; }
  }

  // Home services: picture follows the service under the pointer
  const pic = document.querySelector('[data-svc-pic]');
  const rows = document.querySelectorAll('.svc[data-pic]');
  if (pic) {
    rows.forEach((row) => row.addEventListener('mouseenter', () => {
      rows.forEach((r) => r.classList.toggle('is-on', r === row));
      const src = row.dataset.pic;
      if (pic.getAttribute('src') === src) return;
      pic.classList.add('is-swapping');
      setTimeout(() => { pic.src = src; pic.onload = () => pic.classList.remove('is-swapping'); }, 200);
    }));
    rows.forEach((r) => { const i = new Image(); i.src = r.dataset.pic; });
  }

  // Projects filter: rows run pair, pair, single full-width, repeating; pairs alternate wide-narrow and narrow-wide; a lone last tile spans the row (same rule as build.mjs)
  const list = document.querySelector('[data-plist]');
  if (list) {
    const tiles = [...list.querySelectorAll('.ptile')];
    const buttons = document.querySelectorAll('[data-filter]');
    const none = document.querySelector('[data-none]');
    const layout = () => {
      const shown = tiles.filter((t) => !t.hidden);
      let row = 0, k = 0;
      while (k < shown.length) {
        const size = row % 3 === 2 ? 1 : 2, pairRow = row - Math.floor(row / 3);
        for (let j = 0; j < size && k + j < shown.length; j++) {
          const t = shown[k + j];
          t.classList.remove('is-w', 'is-n', 'is-full');
          if (size === 1 || k === shown.length - 1) t.classList.add('is-full');
          else t.classList.add((j === 0) === (pairRow % 2 === 0) ? 'is-w' : 'is-n');
        }
        k += size; row++;
      }
      if (none) none.hidden = shown.length > 0;
    };
    const apply = (key) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
      tiles.forEach((t) => { t.hidden = key !== 'all' && !t.dataset.cats.split(' ').includes(key); t.classList.add('is-in'); });
      layout();
    };
    buttons.forEach((b) => b.addEventListener('click', () => {
      apply(b.dataset.filter);
      history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname + location.search : '#' + b.dataset.filter);
    }));
    const start = location.hash.slice(1);
    if (start && [...buttons].some((b) => b.dataset.filter === start)) apply(start); else layout();
  }

  // Quiet reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  if (/[?&]still/.test(location.search)) document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
})();
