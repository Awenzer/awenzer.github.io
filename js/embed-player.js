/* =============================================
   AWENZER.EXE — EMBED PLAYER v4
   Miniature YouTube HD + ouverture YouTube
   ============================================= */
(function () {
  var STORAGE_KEY  = 'awenzer_favs';
  var TUTORIAL_KEY = 'awenzer_fav_tutorial_shown';
  var _key = null;

  function loadFavs() { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) { return {}; } }
  function saveFavs(f) { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch(e) {} }
  function favKey(d) { return d && (d.title || d.tag || JSON.stringify(d).slice(0,40)); }

  /* ── styles ── */
  function injectStyles() {
    if (document.getElementById('ep-styles')) return;
    var s = document.createElement('style');
    s.id = 'ep-styles';
    s.textContent = [
      '#embed-player-overlay{display:none;position:fixed;inset:0;z-index:8000;background:rgba(3,2,10,.9);backdrop-filter:blur(10px);align-items:center;justify-content:center;padding:20px}',
      '#embed-player-overlay.ep-open{display:flex}',
      '.ep-box{position:fixed;width:90vw;max-width:860px;max-height:92vh;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(140,70,240,.3) transparent;background:var(--panel,#0d0d14);border:1px solid var(--border,rgba(140,70,240,.35));box-shadow:0 0 60px rgba(140,70,240,.18);top:50%;left:50%;transform:translate(-50%,-50%);transition:box-shadow .2s;user-select:none}',
      '.ep-box.ep-dragging{box-shadow:0 20px 60px rgba(0,0,0,.8),0 0 30px rgba(255,215,0,.12);cursor:grabbing}',
      '.ep-corner{position:absolute;width:14px;height:14px;border-color:var(--purple-light,#c084fc);border-style:solid;z-index:2;pointer-events:none}',
      '.ep-tl{top:-1px;left:-1px;border-width:2px 0 0 2px}.ep-tr{top:-1px;right:-1px;border-width:2px 2px 0 0}.ep-bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}.ep-br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}',
      '.ep-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(192,132,252,.4),transparent);animation:ep-scan 3s linear infinite;pointer-events:none;z-index:3;top:0}',
      '@keyframes ep-scan{0%{top:0;opacity:0}5%{opacity:1}95%{opacity:1}100%{top:100%;opacity:0}}',
      '.ep-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border,rgba(140,70,240,.25));background:rgba(140,70,240,.06);cursor:grab;flex-wrap:wrap;gap:8px}',
      '.ep-topbar:active{cursor:grabbing}',
      '.ep-topbar-left{display:flex;align-items:center;gap:10px;pointer-events:none}',
      '.ep-topbar-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;pointer-events:all}',
      '.ep-dot{width:12px;height:12px;border-radius:50%;cursor:pointer;transition:opacity .2s;flex-shrink:0;pointer-events:all}',
      '.ep-dot:hover{opacity:.7}.ep-dot-r{background:#ff5f57}.ep-dot-y{background:#febc2e;cursor:default}.ep-dot-g{background:#28c840;cursor:default}',
      '.ep-topbar-title{font-family:"Share Tech Mono","Courier New",monospace;font-size:11px;color:var(--purple-light,#c084fc);letter-spacing:2px}',
      '.ep-fav-btn{background:none;border:1px solid rgba(255,215,0,.25);color:#5a5a7a;font-size:15px;padding:4px 12px;cursor:pointer;transition:all .2s;font-family:inherit;line-height:1}',
      '.ep-fav-btn:hover{color:#ffd700;border-color:rgba(255,215,0,.5)}',
      '.ep-fav-btn.active{color:#ffd700;border-color:rgba(255,215,0,.5);box-shadow:0 0 10px rgba(255,215,0,.15)}',
      '@keyframes ep-fav-pop{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(1)}}',
      '.ep-fav-btn.ep-pop{animation:ep-fav-pop .25s ease}',
      '.ep-yt-link{font-family:"Rajdhani",sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:var(--purple-light,#c084fc);text-decoration:none;padding:5px 12px;border:1px solid rgba(192,132,252,.4);transition:all .2s}',
      '.ep-yt-link:hover{background:rgba(192,132,252,.1);box-shadow:0 0 12px rgba(192,132,252,.2)}',
      '.ep-close-btn{background:none;border:1px solid rgba(255,80,80,.3);color:#ff5f57;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 12px;cursor:pointer;font-family:"Rajdhani",sans-serif;transition:all .2s}',
      '.ep-close-btn:hover{background:rgba(255,80,80,.1);border-color:#ff5f57}',
      /* ── video area ── */
      '.ep-video-wrap{padding:16px 20px 0}',
      '.ep-video-border{border:1px solid var(--border,rgba(140,70,240,.3));background:#000;position:relative}',
      '.ep-video-inner{position:relative;padding-bottom:56.25%;height:0;overflow:hidden}',
      /* ── thumbnail player ── */
      '.ep-thumb-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;text-decoration:none}',
      '.ep-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s,filter .4s;filter:brightness(.75)}',
      '.ep-thumb-wrap:hover .ep-thumb-img{transform:scale(1.04);filter:brightness(.5)}',
      '.ep-thumb-ui{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:14px;pointer-events:none}',
      '.ep-play-ring{width:72px;height:72px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;transition:transform .2s,background .2s,border-color .2s;backdrop-filter:blur(4px)}',
      '.ep-thumb-wrap:hover .ep-play-ring{transform:scale(1.12);background:rgba(255,0,0,.82);border-color:transparent}',
      '.ep-play-arrow{width:0;height:0;border-style:solid;border-width:14px 0 14px 26px;border-color:transparent transparent transparent #fff;margin-left:5px}',
      '.ep-thumb-label{font-family:"Rajdhani",sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,.7);text-transform:uppercase;transition:color .2s}',
      '.ep-thumb-wrap:hover .ep-thumb-label{color:#fff}',
      /* scan overlay on thumb */
      '.ep-thumb-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.08) 2px,rgba(0,0,0,.08) 4px);z-index:1}',
      '.ep-thumb-glow{position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(140,70,240,.12),transparent 60%);z-index:1}',
      /* ── info ── */
      '.ep-info{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:14px 20px 0;flex-wrap:wrap}',
      '.ep-info-left{flex:1;min-width:200px}',
      '.ep-tag{font-family:"Rajdhani",sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:var(--purple-light,#c084fc);margin-bottom:4px}',
      '.ep-title{font-family:"Orbitron","Rajdhani",sans-serif;font-size:18px;font-weight:700;color:var(--white,#e8e8f0);line-height:1.2}',
      '.ep-info-meta{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;justify-content:flex-end}',
      '.ep-meta-pill{font-family:"Share Tech Mono",monospace;font-size:9px;letter-spacing:1.5px;color:var(--gray,#5a5a7a);border:1px solid rgba(90,90,122,.4);padding:4px 10px;white-space:nowrap}',
      '.ep-meta-key{color:var(--purple-light,#c084fc);margin-right:6px}',
      '.ep-skills-row{display:flex;flex-wrap:wrap;gap:6px;padding:10px 20px 0}',
      '.ep-skill-tag{font-family:"Rajdhani",sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;color:var(--gray,#5a5a7a);border:1px solid rgba(140,70,240,.2);padding:3px 10px}',
      '.ep-skill-tag.tool{color:rgba(0,200,255,.6);border-color:rgba(0,200,255,.15)}',
      '.ep-desc-wrap{padding:12px 20px 0;border-top:1px solid rgba(140,70,240,.1);margin-top:12px}',
      '.ep-desc{font-size:13px;color:var(--gray,#5a5a7a);line-height:1.7;font-family:"Rajdhani",sans-serif;font-weight:400}',
      '.ep-desc strong{color:var(--white,#e8e8f0)}',
      '.ep-hud{display:flex;align-items:center;gap:20px;padding:10px 20px 14px;margin-top:10px;border-top:1px solid rgba(140,70,240,.1)}',
      '.ep-hud-item{font-family:"Share Tech Mono",monospace;font-size:9px;letter-spacing:2px;color:rgba(90,90,122,.6)}',
      '.ep-hud-live{color:var(--purple-light,#c084fc);animation:ep-blink 1.8s ease-in-out infinite}',
      '@keyframes ep-blink{0%,100%{opacity:1}50%{opacity:.4}}',
      /* ── index featured card badges ── */
      '.ep-card-badge{position:absolute;top:10px;right:10px;background:rgba(140,70,240,.85);backdrop-filter:blur(4px);color:#fff;font-family:"Rajdhani",sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;padding:4px 10px;z-index:2;border:1px solid rgba(192,132,252,.5);pointer-events:none}',
      '.ep-card-play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(5,5,12,0);transition:background .2s;z-index:1}',
      '.ep-card-play-btn{width:52px;height:52px;border-radius:50%;border:2px solid rgba(192,132,252,.7);background:rgba(140,70,240,.3);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--purple-light,#c084fc);opacity:0;transition:opacity .2s;backdrop-filter:blur(4px)}',
      '.project-card:hover .ep-card-play-overlay{background:rgba(5,5,12,.35)!important}',
      '.project-card:hover .ep-card-play-btn{opacity:1!important}',
      '.project-link-embed{color:var(--purple-light,#c084fc)!important;border-color:rgba(192,132,252,.5)!important}',
      '.project-link-embed:hover{background:rgba(192,132,252,.12)!important;box-shadow:0 0 16px rgba(192,132,252,.25)!important}',
      '@media(max-width:600px){.ep-box{width:100vw;max-width:100vw;max-height:100vh;top:0;left:0;transform:none}.ep-title{font-size:15px}.ep-yt-link,.ep-close-btn{font-size:10px;padding:4px 8px}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── overlay HTML ── */
  function injectOverlay() {
    if (document.getElementById('embed-player-overlay')) return;
    var ov = document.createElement('div');
    ov.id = 'embed-player-overlay';

    var box = document.createElement('div');
    box.className = 'ep-box';
    box.id = 'ep-box';
    box.innerHTML =
      '<div class="ep-corner ep-tl"></div>' +
      '<div class="ep-corner ep-tr"></div>' +
      '<div class="ep-corner ep-bl"></div>' +
      '<div class="ep-corner ep-br"></div>' +
      '<div class="ep-scan"></div>' +
      '<div class="ep-topbar" id="ep-topbar">' +
        '<div class="ep-topbar-left">' +
          '<div class="ep-dot ep-dot-r" id="ep-dot-close" title="Fermer"></div>' +
          '<div class="ep-dot ep-dot-y"></div>' +
          '<div class="ep-dot ep-dot-g"></div>' +
          '<span class="ep-topbar-title" id="ep-topbar-title">PLAYER // AWENZER.EXE</span>' +
        '</div>' +
        '<div class="ep-topbar-right">' +
          '<button class="ep-fav-btn" id="ep-fav-btn">\u2661</button>' +
          '<a class="ep-yt-link" id="ep-yt-link" href="#" target="_blank" rel="noopener">\u25b6 VOIR SUR YOUTUBE</a>' +
          '<button class="ep-close-btn" id="ep-close-btn">\u2715 FERMER</button>' +
        '</div>' +
      '</div>' +
      '<div class="ep-video-wrap">' +
        '<div class="ep-video-border">' +
          '<div class="ep-video-inner" id="ep-video-inner"></div>' +
        '</div>' +
      '</div>' +
      '<div class="ep-info">' +
        '<div class="ep-info-left">' +
          '<div class="ep-tag" id="ep-tag"></div>' +
          '<div class="ep-title" id="ep-title"></div>' +
        '</div>' +
        '<div class="ep-info-meta" id="ep-info-meta"></div>' +
      '</div>' +
      '<div class="ep-skills-row" id="ep-skills-row"></div>' +
      '<div class="ep-desc-wrap" id="ep-desc-wrap" style="display:none">' +
        '<div class="ep-desc" id="ep-desc"></div>' +
      '</div>' +
      '<div class="ep-hud">' +
        '<span class="ep-hud-item">// SHORT FILM</span>' +
        '<span class="ep-hud-item ep-hud-live">\u25cf AWENZER.EXE</span>' +
        '<span class="ep-hud-item" id="ep-hud-views"></span>' +
      '</div>';

    ov.appendChild(box);
    document.body.appendChild(ov);

    document.getElementById('ep-dot-close').addEventListener('click', window.closeEmbedPlayer);
    document.getElementById('ep-close-btn').addEventListener('click', window.closeEmbedPlayer);
    document.getElementById('ep-fav-btn').addEventListener('click', epToggleFav);
    ov.addEventListener('click', function(e) { if (e.target === ov) window.closeEmbedPlayer(); });
    initDrag();
  }

  /* ── drag ── */
  function initDrag() {
    var topbar = document.getElementById('ep-topbar');
    var box    = document.getElementById('ep-box');
    if (!topbar || !box) return;
    var drag = false, sx, sy, sl, st;
    topbar.addEventListener('mousedown', function(e) {
      if (e.target.closest('button,a,.ep-dot')) return;
      if (!box.classList.contains('ep-pos')) {
        var r = box.getBoundingClientRect();
        box.style.transform = 'none';
        box.style.left = r.left + 'px';
        box.style.top  = r.top  + 'px';
        box.classList.add('ep-pos');
      }
      drag = true;
      sx = e.clientX; sy = e.clientY;
      sl = parseFloat(box.style.left) || 0;
      st = parseFloat(box.style.top)  || 0;
      box.classList.add('ep-dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
      if (!drag) return;
      box.style.left = Math.max(0, Math.min(window.innerWidth  - box.offsetWidth,  sl + e.clientX - sx)) + 'px';
      box.style.top  = Math.max(0, Math.min(window.innerHeight - 56,               st + e.clientY - sy)) + 'px';
    });
    document.addEventListener('mouseup', function() {
      if (!drag) return; drag = false; box.classList.remove('ep-dragging');
    });
  }

  /* ── fav ── */
  function updateFavBtn() {
    var btn = document.getElementById('ep-fav-btn');
    if (!btn || !_key) return;
    var d = window.projectsData && window.projectsData[_key];
    if (!d) return;
    var isFav = !!loadFavs()[favKey(d)];
    btn.textContent = isFav ? '\u2665' : '\u2661';
    btn.classList.toggle('active', isFav);
    btn.title = isFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
  }
  function epToggleFav() {
    if (!_key) return;
    var d = window.projectsData && window.projectsData[_key];
    if (!d) return;
    d._projectKey = _key;
    var k = favKey(d), favs = loadFavs();
    var btn = document.getElementById('ep-fav-btn');
    if (favs[k]) {
      delete favs[k];
    } else {
      favs[k] = { data: d, addedAt: Date.now() };
      if (btn) { btn.classList.remove('ep-pop'); void btn.offsetWidth; btn.classList.add('ep-pop'); }
      if (!sessionStorage.getItem(TUTORIAL_KEY)) {
        sessionStorage.setItem(TUTORIAL_KEY, '1');
        if (window._showFavTutorial) window._showFavTutorial();
      }
    }
    saveFavs(favs);
    updateFavBtn();
    if (window._renderInventory) window._renderInventory();
  }

  /* ── thumbnail player ─────────────────────────
     Miniature HD YouTube avec hover animé.
     Clic → ouvre la vidéo sur YouTube dans un nouvel onglet.
     Fiable sur tous les domaines, pas d'erreur 153.
  ── */
  function renderVideo(inner, videoId, data) {
    var ytUrl    = data.link || (videoId ? 'https://youtu.be/' + videoId : '#');
    var thumbHD  = videoId ? 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg' : '';
    var thumbFB  = videoId ? 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'     : '';
    var customTh = data.videoThumb || '';

    inner.innerHTML = '';

    /* Lien cliquable = toute la zone vidéo */
    var a = document.createElement('a');
    a.className = 'ep-thumb-wrap';
    a.href      = ytUrl;
    a.target    = '_blank';
    a.rel       = 'noopener';
    a.title     = 'Regarder sur YouTube';

    /* Miniature — cascade : customThumb → maxresdefault → hqdefault → mqdefault */
    var firstSrc = customTh || thumbHD;
    if (firstSrc) {
      var img = document.createElement('img');
      img.className = 'ep-thumb-img';
      img.alt = data.title || '';
      img.src = firstSrc;
      /* Cascade de fallbacks YouTube jusqu'à mqdefault qui existe toujours */
      var fallbacks = [];
      if (customTh && thumbHD)  fallbacks.push(thumbHD);
      if (thumbFB)              fallbacks.push(thumbFB);
      if (videoId)              fallbacks.push('https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg');
      img.onerror = function() {
        if (fallbacks.length) { this.src = fallbacks.shift(); }
        else { this.style.display = 'none'; }
      };
      a.appendChild(img);
    }

    /* Scanlines + glow */
    var scan = document.createElement('div'); scan.className = 'ep-thumb-scan'; a.appendChild(scan);
    var glow = document.createElement('div'); glow.className = 'ep-thumb-glow'; a.appendChild(glow);

    /* Bouton play centré */
    var ui = document.createElement('div');
    ui.className = 'ep-thumb-ui';

    var ring = document.createElement('div');
    ring.className = 'ep-play-ring';
    var arrow = document.createElement('div');
    arrow.className = 'ep-play-arrow';
    ring.appendChild(arrow);

    var label = document.createElement('div');
    label.className  = 'ep-thumb-label';
    label.textContent = 'Regarder sur YouTube';

    ui.appendChild(ring);
    ui.appendChild(label);
    a.appendChild(ui);

    inner.appendChild(a);
  }

  /* ── open ── */
  window.openEmbedPlayer = function(key) {
    var data = window.projectsData && window.projectsData[key];
    if (!data) return;

    injectStyles();
    injectOverlay();
    _key = key;

    var box = document.getElementById('ep-box');
    if (box) {
      box.classList.remove('ep-pos', 'ep-dragging');
      box.style.transform = 'translate(-50%,-50%)';
      box.style.left = '50%';
      box.style.top  = '50%';
    }

    var g = function(id) { return document.getElementById(id); };
    g('ep-topbar-title').textContent = (data.title || 'PLAYER').toUpperCase() + ' // AWENZER.EXE';
    g('ep-tag').textContent          = data.tag   || 'SHORTFILM';
    g('ep-title').textContent        = data.title || '';

    var ytLink = g('ep-yt-link');
    ytLink.href = data.link || '#';
    ytLink.style.display = data.link ? '' : 'none';

    var metaEl = g('ep-info-meta');
    metaEl.innerHTML = '';
    Object.keys(data.meta || {}).forEach(function(k) {
      var pill = document.createElement('div');
      pill.className = 'ep-meta-pill';
      var key2 = document.createElement('span'); key2.className = 'ep-meta-key'; key2.textContent = k + '_';
      pill.appendChild(key2);
      pill.appendChild(document.createTextNode(data.meta[k] || ''));
      metaEl.appendChild(pill);
    });

    var skillsEl = g('ep-skills-row');
    skillsEl.innerHTML = '';
    (data.skills || []).forEach(function(s) { var sp = document.createElement('span'); sp.className = 'ep-skill-tag'; sp.textContent = s; skillsEl.appendChild(sp); });
    (data.tools  || []).forEach(function(t) { var sp = document.createElement('span'); sp.className = 'ep-skill-tag tool'; sp.textContent = t; skillsEl.appendChild(sp); });

    var descWrap = g('ep-desc-wrap');
    if (data.desc) { g('ep-desc').innerHTML = data.desc; descWrap.style.display = ''; }
    else { descWrap.style.display = 'none'; }

    g('ep-hud-views').textContent = data.views ? '// ' + data.views + ' VUES' : '';
    updateFavBtn();

    var videoId = data.videoId || null;
    if (!videoId && data.videoEmbed) {
      var m = data.videoEmbed.match(/embed\/([a-zA-Z0-9_-]{11})/);
      if (m) videoId = m[1];
    }
    renderVideo(g('ep-video-inner'), videoId, data);

    g('embed-player-overlay').classList.add('ep-open');
    document.body.style.overflow = 'hidden';
  };

  /* ── close ── */
  window.closeEmbedPlayer = function() {
    var ov = document.getElementById('embed-player-overlay');
    if (!ov) return;
    ov.classList.remove('ep-open');
    document.body.style.overflow = '';
    var inner = document.getElementById('ep-video-inner');
    if (inner) inner.innerHTML = '';
    _key = null;
  };

  /* ── keyboard ── */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    var ov = document.getElementById('embed-player-overlay');
    if (ov && ov.classList.contains('ep-open')) window.closeEmbedPlayer();
  });

  /* ── init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { injectStyles(); injectOverlay(); });
  } else { injectStyles(); injectOverlay(); }
})();
