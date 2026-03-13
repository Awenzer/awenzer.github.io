/* =============================================
   AWENZER.EXE — GALLERY MODULE
   Photo museum + Video gallery overlays
   ============================================= */

// ── PHOTO GALLERY (musée cyberpunk) ─────────────

let pgPhotos   = [];
let pgCurrent  = 0;
let pgLbOpen   = false;

window.openPhotoGallery = function(key) {
  const data = window.projectsData && window.projectsData[key];
  if (!data) return;

  const overlay = document.getElementById('photo-gallery-overlay');
  const wall    = document.getElementById('pg-wall');
  const title   = document.getElementById('pg-title');
  const counter = document.getElementById('pg-counter');
  if (!overlay || !wall) return;

  pgPhotos = data.photos || [];

  // Set header
  title.textContent   = (data.title || 'GALERIE').toUpperCase() + ' // AWENZER.EXE';
  counter.textContent = pgPhotos.length + ' ŒUVRE' + (pgPhotos.length > 1 ? 'S' : '');

  // Desc + skills
  const pgInfo   = document.getElementById('pg-gallery-info');
  const pgDesc   = document.getElementById('pg-gallery-desc');
  const pgSkills = document.getElementById('pg-gallery-skills');
  if (pgInfo) {
    const hasInfo = (data.desc || (data.skills && data.skills.length));
    pgInfo.style.display = hasInfo ? 'block' : 'none';
    if (pgDesc)   pgDesc.textContent = data.desc || '';
    if (pgSkills) pgSkills.innerHTML = (data.skills || []).map(s => `<span class="gallery-info-pill">${s}</span>`).join('') + (data.tools || []).map(t => `<span class="gallery-info-pill gallery-info-tool">${t}</span>`).join('');
  }

  // Build wall
  wall.innerHTML = '';
  if (pgPhotos.length === 0) {
    wall.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:80px 0; font-family:var(--font-mono,monospace); font-size:11px; color:var(--gray); letter-spacing:3px;">
      // AUCUNE IMAGE — Ajoutez vos fichiers dans images/galian/<br>et listez les chemins dans projects.js
    </div>`;
  } else {
    pgPhotos.forEach((src, i) => {
      // Vary heights for museum feel
      const heights = [180, 240, 200, 220, 260, 190];
      const h = heights[i % heights.length];

      const frame = document.createElement('div');
      frame.className = 'pg-frame';
      frame.style.animationDelay = (i * 60) + 'ms';
      frame.innerHTML = `
        <div class="pg-frame-border">
          <div class="pg-frame-inner" style="height:${h}px;">
            <img src="${src}" alt="Photo ${i+1}" loading="lazy" style="height:100%;object-fit:cover;">
            <div class="pg-frame-scan"></div>
            <div class="pg-fc tl"></div><div class="pg-fc tr"></div>
            <div class="pg-fc bl"></div><div class="pg-fc br"></div>
          </div>
        </div>
        <div class="pg-label">
          <span class="pg-label-num">// ${String(i+1).padStart(2,'0')}</span>
          <span class="pg-label-name">${data.title || 'PHOTO'}</span>
        </div>`;
      frame.addEventListener('click', () => openLightbox(i));
      wall.appendChild(frame);
    });
  }

  // Open overlay
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('visible'));
};

window.closePhotoGallery = function() {
  const overlay = document.getElementById('photo-gallery-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  setTimeout(() => { overlay.classList.remove('open'); document.body.style.overflow = ''; }, 400);
};

// Lightbox
window.openLightbox = function(index) {
  pgCurrent = index;
  const lb  = document.getElementById('pg-lightbox');
  const img = document.getElementById('pg-lightbox-img');
  if (!lb || !img || !pgPhotos[index]) return;
  img.src = pgPhotos[index];
  updateLbCounter();
  lb.classList.add('open');
  pgLbOpen = true;
};

window.closeLightbox = function() {
  const lb = document.getElementById('pg-lightbox');
  if (lb) lb.classList.remove('open');
  pgLbOpen = false;
};

function updateLbCounter() {
  const el = document.getElementById('pg-lb-counter');
  if (el) el.textContent = (pgCurrent + 1) + ' / ' + pgPhotos.length;
}

document.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('pg-lb-prev');
  const next = document.getElementById('pg-lb-next');
  if (prev) prev.addEventListener('click', () => {
    pgCurrent = (pgCurrent - 1 + pgPhotos.length) % pgPhotos.length;
    document.getElementById('pg-lightbox-img').src = pgPhotos[pgCurrent];
    updateLbCounter();
  });
  if (next) next.addEventListener('click', () => {
    pgCurrent = (pgCurrent + 1) % pgPhotos.length;
    document.getElementById('pg-lightbox-img').src = pgPhotos[pgCurrent];
    updateLbCounter();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (pgLbOpen) {
      if (e.key === 'ArrowLeft')  prev && prev.click();
      if (e.key === 'ArrowRight') next && next.click();
      if (e.key === 'Escape') closeLightbox();
    } else {
      const pgOpen = document.getElementById('photo-gallery-overlay');
      const vgOpen = document.getElementById('video-gallery-overlay');
      if (e.key === 'Escape') {
        if (pgOpen && pgOpen.classList.contains('open')) closePhotoGallery();
        if (vgOpen && vgOpen.classList.contains('open')) closeVideoGallery();
      }
    }
  });
});


// ── VIDEO GALLERY (futuriste) ────────────────────

window.openVideoGallery = function(key) {
  const data = window.projectsData && window.projectsData[key];
  if (!data) return;

  const overlay = document.getElementById('video-gallery-overlay');
  const grid    = document.getElementById('vg-grid');
  const title   = document.getElementById('vg-title');
  const desc    = document.getElementById('vg-desc');
  if (!overlay || !grid) return;

  const links   = data.links || [];
  const isVideo = data.linkType === 'video';

  title.textContent = (data.title || 'VIDÉOS').toUpperCase() + ' // AWENZER.EXE';
  desc.textContent  = data.desc || '';

  // Desc + skills in header area
  const vgInfo   = document.getElementById('vg-gallery-info');
  const vgDesc   = document.getElementById('vg-gallery-desc');
  const vgSkills = document.getElementById('vg-gallery-skills');
  if (vgInfo) {
    const hasInfo = (data.desc || (data.skills && data.skills.length));
    vgInfo.style.display = hasInfo ? 'block' : 'none';
    if (vgDesc)   vgDesc.textContent = data.desc || '';
    if (vgSkills) vgSkills.innerHTML = (data.skills || []).map(s => `<span class="gallery-info-pill">${s}</span>`).join('') + (data.tools || []).map(t => `<span class="gallery-info-pill gallery-info-tool">${t}</span>`).join('');
  }

  grid.innerHTML = '';

  if (links.length === 0) {
    grid.innerHTML = `<div class="vg-card-empty">
      <div class="vg-card-empty-text">// AUCUN LIEN CONFIGURÉ<br>Ajoutez vos URL dans projects.js<br>dans la propriété "links"</div>
    </div>`;
  } else {
    links.forEach((link, i) => {
      const isConfigured = link.url && !link.url.startsWith('LIEN_') && link.url !== '#';
      const card = document.createElement('a');
      card.className  = isConfigured ? 'vg-card' : 'vg-card-empty';
      card.href       = isConfigured ? link.url : '#';
      card.target     = isConfigured ? '_blank' : '_self';
      card.rel        = 'noopener noreferrer';
      card.style.animationDelay = (i * 50) + 'ms';

      if (isConfigured) {
        const isIG = link.url.includes('instagram.com');

        // Extract YouTube videoId for thumbnail
        let ytId = null;
        const ytMatch = link.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch) ytId = ytMatch[1];

        // Build thumbnail HTML
        let thumbHtml;
        if (ytId) {
          // Real YouTube thumbnail
          thumbHtml = `<img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg"
            onerror="this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg'"
            style="width:100%;height:100%;object-fit:cover;display:block;" alt="${link.label || ''}">`;
        } else if (isIG) {
          // Instagram gradient placeholder (API required for real thumb)
          thumbHtml = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);display:flex;align-items:center;justify-content:center;font-size:28px;color:rgba(255,255,255,0.6);">◈</div>`;
        } else {
          thumbHtml = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#050510,#0a0a1e);display:flex;align-items:center;justify-content:center;font-size:28px;color:rgba(255,255,255,0.3);">▶</div>`;
        }

        card.innerHTML = `
          <div class="vg-card-thumb">
            ${thumbHtml}
            <div class="vg-play-btn">${isIG ? '◈' : '▶'}</div>
          </div>
          <div class="vg-card-body">
            <div class="vg-card-num">// ${String(i+1).padStart(2,'0')}</div>
            <div class="vg-card-title">${link.label || 'Vidéo ' + (i+1)}</div>
            <div class="vg-card-url">${link.url.replace('https://','')}</div>
          </div>
          <span class="vg-card-arrow">→</span>`;
      } else {
        card.innerHTML = `<div class="vg-card-empty-text">
          // ${String(i+1).padStart(2,'0')} — ${link.label || 'À CONFIGURER'}<br>
          <span style="font-size:8px;opacity:0.6;">Remplacez l'URL dans projects.js</span>
        </div>`;
      }

      grid.appendChild(card);
    });
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('visible'));
};

window.closeVideoGallery = function() {
  const overlay = document.getElementById('video-gallery-overlay');
  if (!overlay) return;
  overlay.classList.remove('visible');
  setTimeout(() => { overlay.classList.remove('open'); document.body.style.overflow = ''; }, 400);
};
