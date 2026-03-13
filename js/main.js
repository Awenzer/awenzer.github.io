/* =============================================
   AWENZER.EXE — MAIN JAVASCRIPT
   ============================================= */

// ── CUSTOM CURSOR ──────────────────────────────
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();
  function addHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  addHover('a, button, .project-card, .cat-btn, .sw-item, .gallery-item, .skill-bar-item, .minimap-choice, .minimap-link-item');
})();

// ── MATRIX CANVAS ─────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\'.split('');
  const fontSize = 14;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(0).map(() => Math.random() * -100);
  function draw() {
    ctx.fillStyle = 'rgba(5,5,8,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cols = Math.floor(canvas.width / fontSize);
    while (drops.length < cols) drops.push(0);
    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const progress = drops[i] / (canvas.height / fontSize);
      const isHead = Math.random() > 0.97;
      if (isHead) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      } else {
        const alpha = Math.max(0.1, 1 - progress * 0.6);
        ctx.fillStyle = `rgba(140,70,240,${alpha * 0.6})`;
        ctx.shadowBlur = 0;
      }
      ctx.font = `${fontSize}px 'Rajdhani', sans-serif`;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      ctx.shadowBlur = 0;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5 + Math.random() * 0.3;
    }
  }
  setInterval(draw, 40);
})();


// ── SCROLL REVEAL ──────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ── SKILL BARS ─────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        setTimeout(() => { entry.target.style.width = target; }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => obs.observe(bar));
})();

// ── GLITCH ─────────────────────────────────────
(function() {
  document.querySelectorAll('.glitch').forEach(el => { el.dataset.text = el.textContent; });
})();

// ── NAV ACTIVE STATE ───────────────────────────
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.style.color = 'var(--purple-light)';
    }
  });
})();

// ── TYPING EFFECT ──────────────────────────────
(function() {
  const el = document.querySelector('.hero-system-text');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) { el.textContent += text[i]; i++; }
    else { clearInterval(timer); el.innerHTML += '<span style="animation:blink 1s infinite;color:var(--purple-light);">_</span>'; }
  }, 35);
})();

// ── HUD COUNTERS ───────────────────────────────
(function() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(ease * target).toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
})();

// ── PROJECT MODAL ──────────────────────────────
window.openModal = function(data) {
  if (!data) return;
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  // Images : imgs[] prioritaire sur img
  const imgArea = overlay.querySelector('.modal-img-area');
  const images = data.imgs && data.imgs.length ? data.imgs : (data.img ? [data.img] : []);
  if (images.length > 1) {
    let current = 0;
    imgArea.innerHTML = `<div class="carousel" id="modal-carousel"><div class="carousel-track" id="carousel-track">${images.map((src,i) => `<div class="carousel-slide"><img class="modal-img" src="${src}" alt="${data.title} ${i+1}"></div>`).join('')}</div><button class="carousel-btn carousel-prev" id="carousel-prev">&#8592;</button><button class="carousel-btn carousel-next" id="carousel-next">&#8594;</button><div class="carousel-counter"><span id="carousel-current">1</span> / <span id="carousel-total">${images.length}</span></div></div>`;
    const track = document.getElementById('carousel-track');
    document.getElementById('carousel-prev').addEventListener('click', () => { current = (current - 1 + images.length) % images.length; track.style.transform = `translateX(-${current * 100}%)`; document.getElementById('carousel-current').textContent = current + 1; });
    document.getElementById('carousel-next').addEventListener('click', () => { current = (current + 1) % images.length; track.style.transform = `translateX(-${current * 100}%)`; document.getElementById('carousel-current').textContent = current + 1; });
  } else if (images.length === 1) {
    imgArea.innerHTML = `<img class="modal-img" src="${images[0]}" alt="${data.title || ''}">`;
  } else {
    imgArea.innerHTML = `<div class="modal-img-placeholder">[ IMAGE DU PROJET ]</div>`;
  }
  overlay.querySelector('.modal-tag').textContent = data.tag || '';
  overlay.querySelector('.modal-title').textContent = data.title || '';
  overlay.querySelector('.modal-desc').innerHTML = data.desc || '';
  const metaGrid = overlay.querySelector('.modal-meta-grid');
  metaGrid.innerHTML = Object.entries(data.meta || {}).map(([k,v]) =>
    `<div class="modal-meta-item"><div class="modal-meta-label">${k}</div><div class="modal-meta-value">${v}</div></div>`
  ).join('');
  const skillsList = overlay.querySelector('.modal-skills-list');
  const skillsSec  = overlay.querySelector('.modal-skills-section');
  const skills = data.skills || [];
  if (skillsSec) skillsSec.style.display = skills.length ? '' : 'none';
  skillsList.innerHTML = skills.map(s => `<span class="modal-tag-pill">${s}</span>`).join('');
  const toolsList = overlay.querySelector('.modal-tools-list');
  const toolsSec  = overlay.querySelector('.modal-tools-section');
  const tools = data.tools || [];
  if (toolsSec) toolsSec.style.display = tools.length ? '' : 'none';
  toolsList.innerHTML = tools.map(t => `<span class="modal-tool-pill">${t}</span>`).join('');
  // Link button (YouTube etc.)
  const linkBtn = overlay.querySelector('.modal-link-btn');
  if (linkBtn) {
    if (data.link) {
      linkBtn.href = data.link;
      linkBtn.style.display = '';
    } else {
      linkBtn.style.display = 'none';
    }
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

// ── CV MODAL ───────────────────────────────────
window.openCVModal = function() {
  const overlay = document.getElementById('cv-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeCVModal = function() {
  const overlay = document.getElementById('cv-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

// ── MODAL INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  const cvOverlay = document.getElementById('cv-modal-overlay');
  if (cvOverlay) cvOverlay.addEventListener('click', (e) => { if (e.target === cvOverlay) closeCVModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeCVModal(); } });
});

// ── DRAGGABLE MODAL ────────────────────────────
(function() {
  let drag = false, moved = false;
  let sx, sy, sl, st;

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousedown', function(e) {
      const topbar = e.target.closest('.modal-topbar');
      if (!topbar) return;
      if (e.target.closest('button, .modal-dot')) return;

      const box = document.querySelector('.modal-box');
      if (!box) return;

      // On first drag, snapshot position and switch to fixed
      if (!box.classList.contains('modal-dragged')) {
        const r = box.getBoundingClientRect();
        box.style.left   = r.left + 'px';
        box.style.top    = r.top  + 'px';
        box.style.width  = r.width + 'px';
        box.classList.add('modal-dragged');
      }

      drag = true; moved = false;
      sx = e.clientX; sy = e.clientY;
      sl = parseFloat(box.style.left) || 0;
      st = parseFloat(box.style.top)  || 0;
      box.style.boxShadow = '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.12)';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!drag) return;
      const box = document.querySelector('.modal-box');
      if (!box) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      const vw = window.innerWidth, vh = window.innerHeight;
      const bw = box.offsetWidth, bh = box.offsetHeight;
      box.style.left = Math.max(0, Math.min(vw - bw, sl + dx)) + 'px';
      box.style.top  = Math.max(0, Math.min(vh - 56, st + dy)) + 'px';
    });

    document.addEventListener('mouseup', function() {
      if (!drag) return;
      drag = false;
      const box = document.querySelector('.modal-box');
      if (box) box.style.boxShadow = '';
    });
  });

  // Reset position each time modal opens
  const _orig = window.openModal;
  window.openModal = function(data) {
    _orig(data);
    requestAnimationFrame(() => {
      const box = document.querySelector('.modal-box');
      if (!box) return;
      box.classList.remove('modal-dragged');
      box.style.left = box.style.top = box.style.width = '';
    });
  };
})();

// ── SPOTIFY FLOATING PLAYER ────────────────────
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const player  = document.getElementById('spotify-player');
    const handle  = document.getElementById('spotify-drag-handle');
    const content = document.getElementById('spotify-content');
    const toggle  = document.getElementById('spotify-toggle');
    if (!player || !handle) return;

    // Toggle collapse
    let collapsed = false;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      collapsed = !collapsed;
      content.classList.toggle('collapsed', collapsed);
      toggle.textContent = collapsed ? '▲' : '▼';
    });

    // Drag
    let drag = false, sx, sy, sr, sb;
    handle.addEventListener('mousedown', (e) => {
      if (e.target === toggle) return;
      drag = true;
      sx = e.clientX; sy = e.clientY;
      const r = player.getBoundingClientRect();
      sr = window.innerWidth  - r.right;
      sb = window.innerHeight - r.bottom;
      player.style.transition = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!drag) return;
      const dx = sx - e.clientX, dy = sy - e.clientY;
      const newR = Math.max(0, Math.min(window.innerWidth  - player.offsetWidth,  sr + dx));
      const newB = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, sb + dy));
      player.style.right  = newR + 'px';
      player.style.bottom = newB + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = false;
      player.style.transition = '';
    });
  });
})();

// ── FAVORITES INVENTORY ────────────────────────
(function() {
  var STORAGE_KEY  = 'awenzer_favs';
  var TUTORIAL_KEY = 'awenzer_fav_tutorial_shown';

  function loadFavs() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveFavs(f) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch(e) {}
  }

  var favs = loadFavs();
  var currentModalData = null;

  // Patch openModal
  var _openModal = window.openModal;
  window.openModal = function(data) {
    _openModal(data);
    currentModalData = data;
    updateFavBtn(data);
  };

  function getFavKey(data) {
    return data && (data.title || data.tag || JSON.stringify(data).slice(0, 40));
  }

  function updateFavBtn(data) {
    var btn = document.getElementById('modal-fav-btn');
    if (!btn || !data) return;
    var isFav = !!favs[getFavKey(data)];
    btn.textContent = isFav ? '♥' : '♡';
    btn.classList.toggle('active', isFav);
    btn.title = isFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
  }

  function toggleFav(data) {
    if (!data) return;
    var key = getFavKey(data);
    var btn = document.getElementById('modal-fav-btn');
    if (favs[key]) {
      delete favs[key];
      saveFavs(favs);
    } else {
      favs[key] = { data: data, addedAt: Date.now() };
      saveFavs(favs);
      if (btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
      if (!sessionStorage.getItem(TUTORIAL_KEY)) {
        sessionStorage.setItem(TUTORIAL_KEY, '1');
        showTutorial();
      }
    }
    updateFavBtn(data);
    renderInventory();
  }

  // ── Tutorial : modal centré simple ────────────
  function showTutorial() {
    var ov = document.createElement('div');
    ov.id = 'fav-tut-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(5px);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;pointer-events:auto;cursor:default';
    ov.innerHTML = '<div id="fav-tut-box" style="width:280px;max-width:88vw;background:#08080f;border:1px solid rgba(255,215,0,0.35);border-radius:2px;padding:28px 22px 20px;text-align:center;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.9);transform:translateY(12px);transition:transform .3s">'
      + '<button id="fav-tut-x" style="position:absolute;top:8px;right:10px;background:none;border:none;cursor:pointer;color:#5a5a7a;font-size:12px;font-family:monospace;">✕</button>'
      + '<div style="font-size:22px;color:#ffd700;margin-bottom:14px;">◈</div>'
      + '<div style="font-family:monospace;font-size:11px;color:#5a5a7a;line-height:1.9;letter-spacing:0.3px;">Clique sur ♡ dans un projet pour l\'ajouter ici.<br>Survole une vignette pour la rouvrir ou la retirer.</div>'
      + '<button id="fav-tut-ok" style="margin-top:18px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);color:#ffd700;font-family:monospace;font-size:10px;letter-spacing:3px;padding:8px 22px;cursor:pointer;border-radius:1px;">OK</button>'
      + '</div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function() {
      ov.style.opacity = '1';
      document.getElementById('fav-tut-box').style.transform = 'translateY(0)';
    });
    function close() {
      ov.style.opacity = '0';
      setTimeout(function() { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 320);
    }
    document.getElementById('fav-tut-x').addEventListener('click', close);
    document.getElementById('fav-tut-ok').addEventListener('click', close);
    ov.addEventListener('click', function(e) { if (e.target === ov) close(); });
  }

  // ── Drag + collapse ────────────────────────────
  function initDrag() {
    var inv    = document.getElementById('fav-inventory');
    var handle = document.getElementById('fav-inv-handle');
    var toggle = document.getElementById('fav-inv-toggle');
    var body   = document.getElementById('fav-inv-body');
    if (!inv || !handle) return;

    // Snapshot fixed position from computed CSS
    var r = inv.getBoundingClientRect();
    inv.style.position = 'fixed';
    inv.style.bottom   = 'auto';
    inv.style.right    = 'auto';
    inv.style.left     = r.left + 'px';
    inv.style.top      = r.top  + 'px';

    // Collapse — smooth via CSS class
    var collapsed = false;
    if (toggle && body) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        collapsed = !collapsed;
        body.classList.toggle('fav-inv-collapsed', collapsed);
        toggle.textContent = collapsed ? '+' : '−';
      });
    }

    // Drag
    var dragging = false, ox, oy, ol, ot;
    handle.style.cursor = 'grab';

    handle.addEventListener('mousedown', function(e) {
      if (e.target === toggle) return;
      dragging = true;
      ox = e.clientX; oy = e.clientY;
      ol = parseFloat(inv.style.left) || 0;
      ot = parseFloat(inv.style.top)  || 0;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      var nx = Math.max(0, Math.min(window.innerWidth  - inv.offsetWidth,  ol + e.clientX - ox));
      var ny = Math.max(0, Math.min(window.innerHeight - inv.offsetHeight, ot + e.clientY - oy));
      inv.style.left = nx + 'px';
      inv.style.top  = ny + 'px';
    });
    document.addEventListener('mouseup', function() {
      if (!dragging) return;
      dragging = false;
      handle.style.cursor = 'grab';
    });
  }

  // ── Render ─────────────────────────────────────
  // ── renderInventory exposée globalement ──────
  function renderInventory() {
    var inv     = document.getElementById('fav-inventory');
    var grid    = document.getElementById('fav-grid');
    var counter = document.getElementById('fav-count');
    if (!inv || !grid) return;

    // Reload from storage (may have been updated by gallery patch)
    var stored = loadFavs();
    Object.keys(stored).forEach(function(k) { favs[k] = stored[k]; });
    Object.keys(favs).forEach(function(k) { if (!stored[k]) delete favs[k]; });

    var keys = Object.keys(favs);
    if (counter) counter.textContent = keys.length;
    inv.classList.toggle('empty', keys.length === 0);
    grid.innerHTML = '';

    if (keys.length === 0) {
      grid.innerHTML = '<div class="fav-inv-empty">// Aucun favori</div>';
      return;
    }

    keys.sort(function(a, b) { return favs[b].addedAt - favs[a].addedAt; });

    keys.forEach(function(key) {
      var data   = favs[key].data;
      var imgSrc = (data.imgs && data.imgs[0])
                || (data.photos && data.photos[0])
                || data.videoThumb
                || data.img
                || '';

      var thumb = document.createElement('div');
      thumb.className = 'fav-thumb';

      var img = imgSrc
        ? '<img src="' + imgSrc + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:1px;pointer-events:none;">'
        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:16px;color:rgba(140,70,240,0.4);pointer-events:none;">\u25c8</div>';

      thumb.innerHTML = img
        + '<div class="fav-hover-menu" style="display:none;position:fixed;z-index:99999;background:rgba(5,5,12,0.97);border:1px solid rgba(255,215,0,0.3);box-shadow:0 6px 24px rgba(0,0,0,0.9);padding:5px;border-radius:2px;width:88px;">'
        +   '<button class="fav-btn-open" style="display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:4px 6px;font-family:monospace;font-size:8px;letter-spacing:1.5px;color:#c084fc;width:100%;border-radius:1px;">\u25b6 OUVRIR</button>'
        +   '<button class="fav-btn-del"  style="display:flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:4px 6px;font-family:monospace;font-size:8px;letter-spacing:1.5px;color:#ff4444;width:100%;border-radius:1px;">\u2715 RETIRER</button>'
        + '</div>';

      var menu = thumb.querySelector('.fav-hover-menu');
      var hideTimer = null;
      var overThumb = false;
      var overMenu  = false;

      function makeShowMenu(t, m) {
        return function() {
          clearTimeout(hideTimer);
          var r = t.getBoundingClientRect();
          var top = r.top - 66;
          if (top < 4) top = r.bottom;
          m.style.top  = top + 'px';
          m.style.left = (r.left + r.width / 2 - 44) + 'px';
          m.style.display = 'block';
        };
      }
      function makeScheduleHide(getOver1, getOver2, m) {
        return function() {
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function() {
            if (!getOver1() && !getOver2()) m.style.display = 'none';
          }, 200);
        };
      }

      // Use closure-safe flag objects
      var flags = { thumb: false, menu: false };
      thumb.addEventListener('mouseenter', function() { flags.thumb = true;  makeShowMenu(thumb, menu)(); });
      thumb.addEventListener('mouseleave', function() { flags.thumb = false; makeScheduleHide(function(){return flags.thumb;}, function(){return flags.menu;}, menu)(); });
      menu.addEventListener('mouseenter',  function() { flags.menu  = true;  clearTimeout(hideTimer); });
      menu.addEventListener('mouseleave',  function() { flags.menu  = false; makeScheduleHide(function(){return flags.thumb;}, function(){return flags.menu;}, menu)(); });

      // OUVRIR : modal, photo gallery, vidéo gallery ou embed player
      (function(d) {
        thumb.querySelector('.fav-btn-open').addEventListener('click', function(e) {
          e.stopPropagation(); menu.style.display = 'none';
          var pKey = d._projectKey;
          if (d.photos && pKey && window.openPhotoGallery) {
            window.openPhotoGallery(pKey);
          } else if (d.links && pKey && window.openVideoGallery) {
            window.openVideoGallery(pKey);
          } else if (d.videoEmbed && pKey && window.openEmbedPlayer) {
            window.openEmbedPlayer(pKey);
          } else if (window.openModal) {
            window.openModal(d);
          }
        });
      })(data);

      (function(k) {
        thumb.querySelector('.fav-btn-del').addEventListener('click', function(e) {
          e.stopPropagation(); menu.style.display = 'none';
          delete favs[k]; saveFavs(favs); renderInventory();
          if (currentModalData && getFavKey(currentModalData) === k) updateFavBtn(currentModalData);
        });
      })(key);

      document.body.appendChild(menu);
      thumb._menu = menu;
      grid.appendChild(thumb);
    });
  }

  // Exposer globalement pour le gallery patch
  window._renderInventory = renderInventory;
  window._showFavTutorial = showTutorial;

  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
      if (e.target.id === 'modal-fav-btn' || e.target.closest('#modal-fav-btn')) {
        toggleFav(currentModalData);
      }
    });
    renderInventory();
    initDrag();
  });
})();


// ── GALLERY FAV PATCH ──────────────────────────
// Patch openPhotoGallery et openVideoGallery
(function() {
  var _openPhoto = window.openPhotoGallery;
  var _openVideo = window.openVideoGallery;
  var STORAGE_KEY  = 'awenzer_favs';
  var TUTORIAL_KEY = 'awenzer_fav_tutorial_shown';

  function loadFavs() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveFavs(f) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch(e) {}
  }
  function getFavKey(data) {
    return data && (data.title || data.tag || JSON.stringify(data).slice(0, 40));
  }

  window.openPhotoGallery = function(key) {
    _openPhoto && _openPhoto(key);
    var data = window.projectsData && window.projectsData[key];
    if (data) {
      // Stocker la clé projectsData pour rouvrir depuis l'inventaire
      data._projectKey = key;
      window._currentGalleryData = data;
      window._currentGalleryKey  = key;
      window._currentGalleryType = 'photo';
      updateGalleryFavBtn('photo', data);
    }
  };

  window.openVideoGallery = function(key) {
    _openVideo && _openVideo(key);
    var data = window.projectsData && window.projectsData[key];
    if (data) {
      data._projectKey = key;
      window._currentGalleryData = data;
      window._currentGalleryKey  = key;
      window._currentGalleryType = 'video';
      updateGalleryFavBtn('video', data);
    }
  };

  function updateGalleryFavBtn(type, data) {
    var btnId = type === 'photo' ? 'pg-fav-btn' : 'vg-fav-btn';
    var btn = document.getElementById(btnId);
    if (!btn || !data) return;
    var favs = loadFavs();
    var isFav = !!favs[getFavKey(data)];
    btn.textContent = isFav ? '\u2665' : '\u2661';
    btn.classList.toggle('active', isFav);
    btn.title = isFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
  }

  window.toggleGalleryFav = function(type) {
    var data = window._currentGalleryData;
    if (!data) return;
    var key  = getFavKey(data);
    var favs = loadFavs();
    var btn  = document.getElementById(type === 'photo' ? 'pg-fav-btn' : 'vg-fav-btn');

    if (favs[key]) {
      delete favs[key];
      saveFavs(favs);
    } else {
      favs[key] = { data: data, addedAt: Date.now() };
      saveFavs(favs);
      if (btn) { btn.style.transform = 'scale(1.5)'; setTimeout(function() { btn.style.transform = ''; }, 200); }
      // Tutorial au premier ajout
      if (!sessionStorage.getItem(TUTORIAL_KEY)) {
        sessionStorage.setItem(TUTORIAL_KEY, '1');
        if (window._showFavTutorial) window._showFavTutorial();
      }
    }
    updateGalleryFavBtn(type, data);
    // Utiliser la vraie renderInventory du module principal
    if (window._renderInventory) window._renderInventory();
  };

})();

// ── HAMBURGER MENU ─────────────────────────────
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var btn    = document.getElementById('nav-hamburger');
    var drawer = document.getElementById('nav-mobile-drawer');
    if (!btn || !drawer) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = drawer.classList.toggle('open');
      btn.classList.toggle('open', open);
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        drawer.classList.remove('open');
        btn.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!btn.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        btn.classList.remove('open');
      }
    });
  });
})();
