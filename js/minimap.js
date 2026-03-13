/* =============================================
   AWENZER.EXE — MINIMAP MODULE (all pages)
   ============================================= */

(function initMinimap() {
  const minimap    = document.getElementById('minimap');
  const toggleBtn  = document.querySelector('.minimap-toggle');
  if (!minimap) return;

  const handle     = document.getElementById('minimap-drag-handle');
  const toggleIcon = document.getElementById('minimap-toggle-icon');
  const canvas     = document.getElementById('minimap-canvas');
  const hudLabel   = document.getElementById('minimap-hud-label');
  const ctx        = canvas ? canvas.getContext('2d') : null;

  // ── Per-page section config ───────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';

  const pageConfig = {
    'index.html': {
      sections: [
        { id: 'hero',     label: 'HERO',     color: '#00c8ff' },
        { id: 'featured', label: 'PROJETS',  color: '#c084fc' },
        { id: 'skills',   label: 'SKILLS',   color: '#00ffa3' },
      ]
    },
    'projects.html': {
      sections: [
        { id: 'projects-hero-section', label: 'GALERIE', color: '#00c8ff' },
        { id: 'projects-gallery',      label: 'PROJETS', color: '#c084fc' },
      ]
    },
    'contact.html': {
      sections: [
        { id: 'contact-page', label: 'CONTACT', color: '#00ffa3' },
      ]
    },
  };

  const cfg      = pageConfig[page] || pageConfig['index.html'];
  const sections = cfg.sections;

  // ── Init position ─────────────────────────────
  const r = minimap.getBoundingClientRect();
  minimap.style.position = 'fixed';
  minimap.style.right    = 'auto';
  minimap.style.left     = r.left + 'px';
  minimap.style.top      = r.top  + 'px';

  // ── Drag + click-to-collapse ──────────────────
  let isDragging = false, dragMoved = false;
  let startX, startY, startLeft, startTop;

  if (handle) {
    handle.addEventListener('mousedown', (e) => {
      isDragging = true; dragMoved = false;
      startX = e.clientX; startY = e.clientY;
      startLeft = parseFloat(minimap.style.left);
      startTop  = parseFloat(minimap.style.top);
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
      e.preventDefault();
    });
    handle.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      isDragging = true; dragMoved = false;
      startX = t.clientX; startY = t.clientY;
      startLeft = parseFloat(minimap.style.left);
      startTop  = parseFloat(minimap.style.top);
      document.addEventListener('touchmove', onDragTouch, { passive: false });
      document.addEventListener('touchend', stopDragTouch);
      e.preventDefault();
    }, { passive: false });
  }

  function onDrag(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
    clampAndSet(startLeft + dx, startTop + dy);
  }
  function onDragTouch(e) {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
    clampAndSet(startLeft + dx, startTop + dy);
    e.preventDefault();
  }
  function clampAndSet(left, top) {
    const w = minimap.offsetWidth, h = minimap.offsetHeight;
    left = Math.max(0, Math.min(window.innerWidth - w, left));
    top  = Math.max(0, Math.min(window.innerHeight - h, top));
    minimap.style.left = left + 'px';
    minimap.style.top  = top  + 'px';
  }
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    if (!dragMoved) toggleCollapse();
  }
  function stopDragTouch() {
    isDragging = false;
    document.removeEventListener('touchmove', onDragTouch);
    document.removeEventListener('touchend', stopDragTouch);
    if (!dragMoved) toggleCollapse();
  }
  function toggleCollapse() {
    const collapsed = minimap.classList.toggle('collapsed');
    if (toggleIcon) toggleIcon.textContent = collapsed ? '+' : '−';
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      minimap.classList.remove('collapsed');
      if (toggleIcon) toggleIcon.textContent = '−';
      toggleBtn.classList.remove('show');
    });
  }

  // ── Canvas Minimap ────────────────────────────
  if (!ctx) return;

  const W = 200, H = 160;
  canvas.width  = W;
  canvas.height = H;

  // Buildings layout (same on all pages for consistency)
  const buildings = [
    [4,8,28,20],[4,32,28,14],[4,50,20,28],[6,82,22,16],[4,102,26,22],[6,128,18,18],[4,150,24,10],
    [168,6,28,18],[170,28,24,22],[172,54,22,16],[166,74,30,20],[170,98,26,18],[168,120,28,24],[170,148,26,12],
    [60,4,30,14],[100,4,36,10],[142,4,20,16],
    [54,140,34,18],[96,144,40,14],[144,140,22,18],
    [44,30,20,12],[44,48,16,20],[44,74,18,14],[44,94,20,18],[44,118,16,16],
    [140,30,20,12],[140,48,16,20],[140,74,18,16],[140,96,20,16],[140,116,16,18],
    [72,56,22,18],[100,52,30,16],[76,80,16,20],[98,76,28,22],
  ];

  // Path always goes top→bottom (hero at top, last section at bottom)
  const pathPoints = [
    { x: 100, y: 12  },
    { x: 100, y: 44  },
    { x: 100, y: 68  },
    { x: 86,  y: 90  },
    { x: 100, y: 112 },
    { x: 100, y: 155 },
  ];

  // Distribute section markers evenly along path
  const sectionMarkers = sections.map((sec, i) => {
    const t = sections.length === 1 ? 0.5 : i / (sections.length - 1);
    const totalPts = pathPoints.length - 1;
    const rawIdx   = t * totalPts;
    const idx      = Math.min(Math.floor(rawIdx), totalPts - 1);
    const frac     = rawIdx - idx;
    const a = pathPoints[idx], b = pathPoints[Math.min(idx + 1, totalPts)];
    return {
      id:    sec.id,
      label: sec.label,
      color: sec.color,
      pt:    { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac }
    };
  });

  let currentSection = sections[0] ? sections[0].id : '';

  function getScrollProgress() {
    const scrollY = window.scrollY || 0;
    const docH    = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const p       = scrollY / docH;
    return isNaN(p) ? 0 : Math.min(Math.max(p, 0), 1);
  }

  function getPlayerPos(progress) {
    const totalPts = pathPoints.length - 1;
    const rawIdx   = progress * totalPts;
    const idx      = Math.min(Math.floor(rawIdx), totalPts - 1);
    const t        = rawIdx - idx;
    const a = pathPoints[idx];
    const b = pathPoints[Math.min(idx + 1, totalPts)];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function getNearestSection(progress) {
    const docH    = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollY = progress * docH;
    let closest = sections[0] ? sections[0].id : '', closestDist = Infinity;
    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (!el) return;
      const dist = Math.abs(scrollY - el.offsetTop);
      if (dist < closestDist) { closestDist = dist; closest = sec.id; }
    });
    return closest;
  }

  function draw() {
    try {
      const progress = getScrollProgress();
      const player   = getPlayerPos(progress);
      currentSection = getNearestSection(progress);

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#03040a';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0,180,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 16) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 16) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Road BG
      ctx.strokeStyle = 'rgba(0,180,200,0.18)';
      ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      ctx.stroke();

      // Road center dashed
      ctx.strokeStyle = 'rgba(0,220,240,0.25)';
      ctx.lineWidth = 1; ctx.setLineDash([4,6]);
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      ctx.stroke(); ctx.setLineDash([]);

      // Buildings
      buildings.forEach(([bx,by,bw,bh]) => {
        ctx.fillStyle = 'rgba(18,20,38,0.95)'; ctx.fillRect(bx,by,bw,bh);
        ctx.strokeStyle = 'rgba(60,80,160,0.5)'; ctx.lineWidth = 0.5; ctx.strokeRect(bx,by,bw,bh);
        ctx.fillStyle = 'rgba(100,120,220,0.07)'; ctx.fillRect(bx,by,bw,2);
      });

      // Visited trail
      const totalPts = pathPoints.length - 1;
      const rawIdx   = progress * totalPts;
      const splitIdx = Math.min(Math.floor(rawIdx), totalPts - 1);
      if (progress > 0.001) {
        ctx.strokeStyle = 'rgba(192,132,252,0.6)'; ctx.lineWidth = 2;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i <= splitIdx; i++) ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        ctx.lineTo(player.x, player.y);
        ctx.stroke();
      }

      // Remaining dotted path
      ctx.strokeStyle = 'rgba(100,150,200,0.25)'; ctx.lineWidth = 1.5; ctx.setLineDash([3,5]);
      ctx.beginPath(); ctx.moveTo(player.x, player.y);
      for (let i = splitIdx + 1; i < pathPoints.length; i++) ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      ctx.stroke(); ctx.setLineDash([]);

      // Section markers
      sectionMarkers.forEach(sm => {
        const isActive = sm.id === currentSection;
        const r2 = isActive ? 5 : 3.5;
        ctx.beginPath(); ctx.arc(sm.pt.x, sm.pt.y, r2 + 4, 0, Math.PI*2);
        ctx.fillStyle = isActive ? 'rgba(255,80,80,0.15)' : 'rgba(140,70,240,0.08)'; ctx.fill();
        ctx.beginPath(); ctx.arc(sm.pt.x, sm.pt.y, r2, 0, Math.PI*2);
        ctx.fillStyle = isActive ? '#ff4444' : 'rgba(140,70,240,0.6)'; ctx.fill();
        if (isActive) { ctx.strokeStyle = 'rgba(255,80,80,0.4)'; ctx.lineWidth=1; ctx.stroke(); }
      });

      // Player dot (gold pulse)
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
      ctx.beginPath(); ctx.arc(player.x, player.y, 10 + pulse*4, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,220,0,${0.15+pulse*0.1})`; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(player.x, player.y, 6, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,200,0,0.2)'; ctx.fill();
      ctx.beginPath(); ctx.arc(player.x, player.y, 4, 0, Math.PI*2);
      ctx.fillStyle = '#ffd700'; ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur=0;

      // Arrow
      ctx.save(); ctx.translate(player.x, player.y - 10); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = '#00ff88'; ctx.beginPath();
      ctx.moveTo(0,-4); ctx.lineTo(3,2); ctx.lineTo(-3,2); ctx.closePath(); ctx.fill();
      ctx.restore();

      // HUD section label
      const secObj = sections.find(s => s.id === currentSection);
      if (hudLabel) {
        hudLabel.textContent = secObj ? secObj.label : '';
        hudLabel.style.color = secObj ? secObj.color : '#00e5ff';
      }

    } catch(e) { console.warn('minimap draw:', e); }
    rafId = requestAnimationFrame(draw);
  }

  let rafId = null;
  function startLoop() { if (!rafId) rafId = requestAnimationFrame(draw); }
  function stopLoop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopLoop(); else startLoop(); });
  window.addEventListener('focus', startLoop);
  startLoop();

  // Click on canvas to jump to section
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (W / rect.width);
    const cy = (e.clientY - rect.top)  * (H / rect.height);
    let closest = null, closestD = 30;
    sectionMarkers.forEach(sm => {
      const d = Math.hypot(cx - sm.pt.x, cy - sm.pt.y);
      if (d < closestD) { closestD = d; closest = sm.id; }
    });
    if (closest) document.getElementById(closest)?.scrollIntoView({ behavior: 'smooth' });
  });

})();
