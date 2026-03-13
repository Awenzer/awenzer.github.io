/* =============================================
   AWENZER.EXE — PROJECTS PAGE JAVASCRIPT
   ============================================= */

(function initProjectsPage() {

  const catBtns       = document.querySelectorAll('.cat-btn');
  const galleryHeader = document.getElementById('gallery-header');
  const galleryNavBtns= document.querySelectorAll('.gallery-nav-btn');
  const gallerySections = document.querySelectorAll('.gallery-content');

  if (!catBtns.length) return;

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      showCategory(cat);
    });
  });

  galleryNavBtns.forEach(btn => {
    btn.addEventListener('click', () => showCategory(btn.dataset.cat));
  });

  function showCategory(cat) {
    catBtns.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));

    // Hide hero section once a category has been picked
    const heroSection = document.getElementById('projects-hero-section');
    if (heroSection && !heroSection.classList.contains('hidden')) {
      heroSection.style.transition = 'opacity 0.4s ease, max-height 0.5s ease 0.3s';
      heroSection.style.opacity = '0';
      setTimeout(() => {
        heroSection.style.maxHeight = '0';
        heroSection.style.overflow = 'hidden';
        heroSection.style.padding = '0';
          heroSection.style.minHeight = '0'; 
        heroSection.classList.add('hidden');
      }, 400);
    }
    if (galleryHeader) galleryHeader.classList.add('visible');
    galleryNavBtns.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    gallerySections.forEach(s => s.classList.toggle('active', s.dataset.cat === cat));

    const activeSection = document.querySelector(`.gallery-content[data-cat="${cat}"]`);
    const countEl = document.getElementById('gallery-count');
    if (activeSection && countEl) {
      const n = activeSection.querySelectorAll('.gallery-item:not([style*="dashed"])').length;
      countEl.innerHTML = `<span>${n}</span> PROJETS`;
    }

    if (activeSection) {
      const items = activeSection.querySelectorAll('.gallery-item');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 10);
      });
    }
  }

  const countEl = document.getElementById('gallery-count');
  if (countEl) countEl.innerHTML = `<span>—</span> PROJETS`;

  // Wire up gallery items to modal
  document.querySelectorAll('.gallery-item[data-modal]').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.modal;
      const data = window.projectsData && window.projectsData[key];
      if (data) openModal(data);
    });
  });

})();

// Projects data for modals
window.projectsData = {
  youtube: {
    img: 'images/projets/projet-youtube.jpg',
    tag: 'YOUTUBE · DOCUMENTAIRE · CHAÎNE PERSONNELLE',
    title: 'Awenzer — Chaîne YouTube',
    desc: `Création complète de contenus vidéo : recherches approfondies, worldbuilding, tournage, montage et publication de documentaires et fictions sur l\'art et la culture. 7 000 abonnés organiques et 400 000 vues sans promotion payante.`,
    meta: {
      'PÉRIODE': '2018 — 2026',
      'TYPE': 'YouTube / Documentaire',
      'ABONNÉS': '7 000+',
      'VUES': '400 000+',
    },
    skills: ['Narration', 'Worldbuilding', 'Storytelling', 'Direction artistique', 'Recherche'],
    tools: ['Premiere Pro', 'After Effects', 'Photoshop', 'Lightroom'],
  },
  galian: {
    tag: 'COMMUNICATION · RÉSEAUX SOCIAUX · 2025',
    title: 'Chargé de comm — Galian',
    desc: 'Création de contenus vidéos & photos, gestion des réseaux sociaux, emailing et analyses marketing pour Galian. Mission en alternance dans le cadre du Master Direction Artistique.',
    meta: {
      'PÉRIODE': '2025 — 2026',
      'TYPE': 'Alternance / Comm',
      'ENTREPRISE': 'Galian',
      'LIEU': 'Paris',
    },
    skills: ['Stratégie digitale', 'Création de contenu', 'Emailing', 'Analyse marketing'],
    tools: ['Premiere Pro', 'Photoshop', 'After Effects', 'Wordpress'],
  },
  pullboy: {
    tag: 'MONTAGE · POST-PRODUCTION · SPORT',
    title: 'Monteur vidéo — Pull Boy',
    desc: 'Post-production complète de vidéos sportives pour la chaîne YouTube Pull Boy. Montage, étalonnage, motion design et gestion des exports finaux.',
    meta: {
      'PÉRIODE': '2023 — 2024',
      'TYPE': 'Freelance / Montage',
      'PLATEFORME': 'YouTube',
      'FORMAT': 'Sport / Fitness',
    },
    skills: ['Montage vidéo', 'Étalonnage', 'Motion design', 'Export multi-formats'],
    tools: ['Premiere Pro', 'After Effects', 'Lightroom'],
  },
  krt: {
    tag: 'E-SPORT · ÉVÉNEMENTIEL · MONTAGE',
    title: 'Monteur vidéo — KRT Studios',
    desc: `Montage vidéo événementiel, cast de tournoi e-sport et enregistrement d\'interviews pour KRT Studios. Production live et post-production.`,
    meta: {
      'PÉRIODE': '2024',
      'TYPE': 'Freelance / Event',
      'DOMAINE': 'E-Sport',
      'FORMAT': 'Live + Post-prod',
    },
    skills: ['Montage live', 'Interview', 'Cast e-sport', 'Post-production'],
    tools: ['Premiere Pro', 'After Effects'],
  },
  docGreenzer: {
    imgs: ['images/projets/greenzer.png', 'images/projets/greenzer2.png', 'images/projets/greenzer3.png', 'images/projets/greenzer4.png', 'images/projets/greenzer5.png'],
    tag: 'YOUTUBE · FILM NARRATIF · 2026',
    title: 'Nostalgia+ — Green Montana',
    desc: `Nostalgia+, Le Gouffre A est un film narratif de 40 minutes inspiré de l’univers de l’album Nostalgia+ de Green Montana. <strong>L’idée était de proposer un format différent des analyses rap classiques sur YouTube : transformer un album en expérience immersive</strong>, où le spectateur explore un monde fictif représentant l’esprit de l’artiste et ses souvenirs.<br><br>La vidéo prend la forme d’un voyage narratif. Le spectateur incarne Ward, un personnage envoyé sur la planète Nostalgia+ pour retrouver Green Montana, porté disparu. En explorant ce monde, il découvre différentes zones représentant des formes de nostalgie (créative, affective, comparatrice, mélancolique…), chacune matérialisée par un environnement visuel et une narration spécifique.<br><br>Le projet a été entièrement réalisé seul. J’ai écrit le scénario, conçu la direction artistique et créé les environnements en 3D sur Blender. L’objectif était de construire un univers cohérent, inspiré à la fois des jeux vidéo narratifs et de l’animation, tout en restant minimaliste et symbolique.<br><br>Le montage et la post-production ont été réalisés avec <strong>Adobe Premiere Pro et After Effects</strong>. <strong>Nostalgia+ est aujourd’hui le projet le plus ambitieux que j’ai réalisé.</strong><br><br>Il représente plusieurs mois de travail mêlant écriture, worldbuilding, modélisation 3D et storytelling afin de créer un format hybride entre analyse musicale et film immersif.<br><br>Après la sortie du projet, <strong>Green Montana lui-même a repartagé la vidéo en story et m’a envoyé un message vocal</strong> pour soutenir le travail. J’ai également reçu les félicitations de son directeur artistique, ce qui a été une reconnaissance importante pour ce projet.`,
    link: 'https://youtu.be/xVT-5BexUuc',
    meta: { 'DURÉE': '40 min', 'TYPE': 'Film narratif', 'PLATEFORME': 'YouTube', 'ANNÉE': '2024' },
    skills: ['Écriture', 'Worldbuilding', 'Direction artistique', 'Réalisation', 'Montage', 'Modélisation 3D'],
    tools: ['Blender', 'Premiere Pro', 'After Effects'],
  },
  docVald: {
    imgs: ['images/vald/vald-1.jpg', 'images/vald/vald-2.jpg', 'images/vald/vald-3.jpg', 'images/vald/vald-4.jpg', 'images/vald/vald-5.jpg'],
    tag: 'YOUTUBE · FICTION PSYCHOLOGIQUE · 2026',
    title: 'Vald et la malédiction de Vent Brisé',
    desc: `Vald et la malédiction de Vent Brisé est une vidéo narrative inspirée de l’univers artistique de Vald et de l’esthétique sombre de ses derniers projets. <strong>L’objectif n’était pas de réaliser une analyse musicale classique, mais plutôt de construire une fiction psychologique</strong> qui s’inscrit dans les thématiques récurrentes de l’artiste : la paranoïa, la folie et la perception altérée de la réalité.<br><br>La vidéo raconte l’histoire de Ward, un personnage qui sombre progressivement dans une psychose hallucinatoire chronique. À travers une série de tableaux narratifs, le spectateur traverse différentes périodes de sa vie : la pression familiale, un traumatisme lié à la drogue, la paranoïa dans un village isolé, puis une descente progressive vers une réalité totalement déformée. Chaque tableau fonctionne comme une pièce d’un musée mental représentant l’évolution de son état psychologique.<br><br>Le projet a été entièrement réalisé seul. J’ai écrit le scénario et conçu toute la direction artistique afin de créer un univers visuel minimaliste et symbolique, inspiré du cinéma psychologique et de l’horreur existentielle. Les environnements et éléments visuels ont été conçus en 3D sur <strong>Blender</strong>, avec l’objectif de créer des espaces mentaux abstraits représentant l’état intérieur du personnage.<br><br>Le montage et la post-production ont été réalisés avec la suite Adobe, principalement <strong>Premiere Pro et After Effects</strong>. L’intelligence artificielle a également été utilisée pour générer certains éléments visuels, notamment les tableaux présents dans la narration, afin de renforcer l’esthétique étrange et instable du récit.<br><br>Ce projet s’inscrit dans ma démarche de création de <strong>formats hybrides sur YouTube, à mi-chemin entre storytelling, fiction et analyse culturelle.</strong>`,
    link: 'https://youtu.be/mxFWV8hGKhg',
    meta: { 'TYPE': 'Fiction psychologique', 'PLATEFORME': 'YouTube', 'ANNÉE': '2024' },
    skills: ['Écriture', 'Direction artistique', 'Réalisation', 'Montage', 'Modélisation 3D'],
    tools: ['Blender', 'Premiere Pro', 'After Effects', 'IA générative'],
  },
  docPretty: {
    imgs: ['images/youtube/prettydollcorpse/pretty-1.jpg', 'images/youtube/prettydollcorpse/pretty-2.jpg', 'images/youtube/prettydollcorpse/pretty-3.jpg', 'images/youtube/prettydollcorpse/pretty-4.jpg', 'images/youtube/prettydollcorpse/pretty-5.jpg'],
    tag: 'YOUTUBE · FICTION NARRATIVE · 2025',
    title: 'Pretty Dollcorpse',
    desc: `Pretty Dollcorpse est une vidéo narrative inspirée par un album très personnel abordant des sujets graves liés à l’enfance, au traumatisme et à la construction de soi. <strong>L’objectif n’était pas de proposer une analyse musicale classique, mais plutôt de prolonger l’impact émotionnel du projet à travers une fiction originale</strong>, pensée comme une réponse artistique respectueuse à son univers.<br><br>La vidéo raconte l’histoire de Ward, un personnage fictif dont le parcours explore les conséquences psychologiques de la violence subie durant l’enfance. À travers un récit progressif, le spectateur découvre comment le harcèlement, l’isolement, l’autodestruction et certains traumatismes peuvent déformer durablement la perception de soi et du monde. Le projet adopte une approche narrative immersive, avec l’idée de créer <strong>une œuvre sensible, dure mais utile, davantage tournée vers l’empathie que vers l’explication frontale.</strong><br><br>Le projet a été entièrement réalisé seul. J’ai écrit le scénario, construit la narration et pensé la direction artistique de la vidéo afin de trouver un équilibre entre sobrieté, malaise et émotion. <strong>L’enjeu principal était de traiter des thématiques extrêmement lourdes sans tomber dans le sensationnel</strong>, en privilégiant une mise en scène qui laisse de la place au ressenti du spectateur.<br><br>Le montage et la post-production ont été réalisés avec la suite Adobe, principalement <strong>Premiere Pro et After Effects</strong>. L’ensemble du projet repose surtout sur l’écriture, le rythme, la voix et la tension émotionnelle du récit.<br><br>Cette vidéo occupe une place particulière dans mon parcours, car elle s’inscrit dans une volonté de créer des formats hybrides entre rap, fiction et réflexion intime. Elle a ensuite été republiée dans un contexte très particulier, après qu’un des artistes liés au projet ait été publiquement rattrapé par une réalité en contradiction totale avec les combats évoqués dans l’œuvre. <strong>Cette recontextualisation a profondément changé la réception de la vidéo et lui a donné une dimension encore plus trouble et douloureuse.</strong>`,
    link: 'https://youtu.be/1QS32IuWMHQ',
    meta: { 'TYPE': 'Fiction narrative', 'PLATEFORME': 'YouTube', 'ANNÉE': '2025' },
    skills: ['Écriture', 'Direction artistique', 'Réalisation', 'Montage'],
    tools: ['Premiere Pro', 'After Effects'],
  },

  doc8songs: {
    imgs: ['images/8songs/8songs-1.jpg', 'images/8songs/8songs-2.jpg', 'images/8songs/8songs-3.jpg', 'images/8songs/8songs-4.jpg'],
    tag: 'YOUTUBE · EXPÉRIENCE IMMERSIVE · 2025',
    title: '8 chansons qui TE font culpabiliser',
    desc: `8 chansons qui te font culpabiliser est une vidéo construite autour d’un concept à mi-chemin entre analyse musicale, fiction et expérience immersive. <strong>L’idée était de partir de plusieurs morceaux de rap évoquant différentes formes de culpabilité pour créer un parcours narratif</strong>, où chaque chanson ouvre la porte à un espace mental, une émotion ou une mise en scène différente.<br><br>La vidéo explore plusieurs visages de la culpabilité : les regrets liés au passé, le deuil, les non-dits, l’ignorance et la violence involontaire que l’on peut exercer sur les autres sans en mesurer immédiatement les conséquences. Le spectateur avance dans la vidéo comme dans une descente symbolique, de chanson en chanson, à travers des univers visuels distincts qui traduisent l’état émotionnel évoqué par chaque morceau.<br><br>Le projet a été entièrement réalisé seul. J’ai écrit le concept, imaginé la structure narrative et conçu toute la direction artistique de la vidéo pour transformer un simple classement en expérience beaucoup plus sensorielle et troublante. <strong>L’objectif était de dépasser le format classique du commentaire musical</strong> en donnant à chaque transition, chaque décor et chaque rupture de ton une vraie fonction émotionnelle dans le récit.<br><br>La production visuelle s’appuie à la fois sur la suite Adobe, <strong>Blender</strong> et des outils d’intelligence artificielle. J’ai utilisé Blender pour créer certains environnements et séquences en 3D, afin de renforcer la sensation de progression dans des espaces mentaux abstraits. Le montage, le sound design et la post-production ont ensuite été réalisés avec <strong>Premiere Pro et After Effects</strong>, dans une logique de tension progressive, de rupture visuelle et d’immersion.<br><br>Ce projet représente bien ma manière d’aborder la vidéo sur YouTube : partir d’un sujet culturel accessible, ici la musique, pour le faire basculer vers une forme plus cinématographique, introspective et expérimentale. <strong>L’objectif n’était pas seulement de parler de chansons, mais de faire ressentir physiquement au spectateur les émotions qu’elles réveillent.</strong>`,
    link: 'https://youtu.be/bVZNTE-iFhk',
    meta: { 'TYPE': 'Expérience immersive', 'PLATEFORME': 'YouTube', 'ANNÉE': '2025' },
    skills: ['Écriture', 'Direction artistique', 'Réalisation', 'Montage', 'Modélisation 3D'],
    tools: ['Blender', 'Premiere Pro', 'After Effects', 'IA générative'],
  },
  
  docSkyrim: {
    imgs: ['images/youtube/skyrim/skyrim-1.jpg', 'images/youtube/skyrim/skyrim-2.jpg', 'images/youtube/skyrim/skyrim-3.jpg', 'images/youtube/skyrim/skyrim-4.jpg', 'images/youtube/skyrim/skyrim-5.jpg'],
    tag: 'YOUTUBE · ANALYSE · RÉTRO · 2023',
    title: 'Pourquoi Skyrim reste un chef-d’œuvre',
    desc: `Cette vidéo publiée en 2023 avait pour objectif de revenir sur Skyrim, un jeu devenu culte, pour montrer <strong>pourquoi il restait encore aujourd’hui une œuvre majeure du jeu vidéo</strong>. L’idée n’était pas simplement de recommander un classique, mais d’expliquer ce qui rend ce RPG aussi marquant plus de dix ans après sa sortie : son univers, son sens de l’exploration, sa direction artistique, sa musique et sa capacité rare à créer un sentiment d’immersion durable.<br><br>La vidéo prend la forme d’un commentaire personnel et analytique, à mi-chemin entre rétrospective, vulgarisation et hommage. J’y retrace les grandes forces du jeu, son héritage dans la série The Elder Scrolls, la richesse de certaines quêtes, l’impact de sa bande originale, ainsi que la manière dont Skyrim a marqué toute une génération de joueurs. Le projet repose sur une approche très incarnée, où l’analyse s’appuie autant sur la culture vidéoludique que sur le ressenti du joueur.<br><br>Le projet a été entièrement réalisé seul. J’ai écrit le script, structuré la progression du propos et conçu le montage pour maintenir un équilibre entre information, narration et rythme. <strong>L’enjeu principal était de traiter un sujet très connu sans tomber dans la simple nostalgie</strong>, en proposant une vidéo capable de parler autant à des joueurs de longue date qu’à des personnes découvrant l’importance du jeu.<br><br>Le montage et la post-production ont été réalisés avec la suite Adobe, principalement <strong>Premiere Pro et After Effects</strong>. Le travail s’est concentré sur le rythme, la fluidité entre les séquences de jeu, les transitions et la mise en valeur de l’atmosphère propre à Skyrim.<br><br><strong>Cette vidéo a atteint environ 180 000 vues</strong>, ce qui en fait l’un de mes formats les plus visibles sur ce type de sujet. Elle représente bien ma manière d’aborder la vidéo d’analyse sur YouTube : partir d’un objet culturel populaire, ici un jeu vidéo culte, pour en faire un contenu personnel, immersif et accessible, capable de transmettre à la fois une réflexion et une émotion.`,
    link: 'https://youtu.be/O3mQ-2S25Vo',
    meta: { 'VUES': '~180 000', 'TYPE': 'Analyse / Rétro', 'PLATEFORME': 'YouTube', 'ANNÉE': '2023' },
    skills: ['Écriture', 'Narration', 'Réalisation', 'Montage'],
    tools: ['Premiere Pro', 'After Effects'],
  },
  

  fiction: {
    video: 'images/shortfilm/shortfilm.mp4',
    tag: 'YOUTUBE · FICTION · COURT-MÉTRAGE',
    title: 'Fiction Court-Métrage',
    desc: `Court-métrage de fiction réalisé, monté et produit de A à Z. Écriture du scénario, direction d\'acteurs, tournage et post-production complète.`,
    meta: { 'DURÉE': '12 min', 'TYPE': 'Fiction', 'PLATEFORME': 'YouTube', 'ANNÉE': '2023' },
    skills: ['Scénarisation', 'Direction', 'Réalisation', 'Post-production'],
    tools: ['Premiere Pro', 'After Effects', 'Lightroom'],
  },
  generiqueAnime: {
    tag: 'MOTION DESIGN · AFTER EFFECTS · 2024',
    title: 'Générique animé',
    desc: `Création d\'un générique animé complet pour intro YouTube. Motion design, animation de texte, transitions cinématiques et sound design.`,
    meta: { 'DURÉE': '15 sec', 'TYPE': 'Motion Design', 'OUTIL': 'After Effects', 'ANNÉE': '2024' },
    skills: ['Animation', 'Motion design', 'Typography animée'],
    tools: ['After Effects', 'Premiere Pro'],
  },
  scene3d: {
    tag: 'MODÉLISATION 3D · BLENDER · 2024',
    title: 'Scène 3D — Environnement',
    desc: `Modélisation et rendu d\'un environnement 3D complet sous Blender. Texturing avec Substance, éclairage avancé et rendu cycles photoréaliste.`,
    meta: { 'TYPE': 'Environnement 3D', 'OUTIL': 'Blender', 'TEXTURES': 'Substance', 'ANNÉE': '2024' },
    skills: ['Modélisation', 'Texturing', 'Éclairage', 'Rendu'],
    tools: ['Blender', 'Substance'],
  },
  galianDA: {
    tag: 'GRAPHISME · IDENTITÉ VISUELLE · BRAND',
    title: 'Direction artistique — Galian',
    desc: 'Définition et mise en œuvre de la direction artistique pour Galian. Création de chartes graphiques, gabarits de communication et déclinaisons print/digital.',
    meta: { 'CLIENT': 'Galian', 'TYPE': 'Brand / DA', 'FORMAT': 'Print + Digital', 'ANNÉE': '2025' },
    skills: ['Direction artistique', 'Identité visuelle', 'Design graphique'],
    tools: ['Photoshop', 'After Effects'],
  },
  galianSocial: {
    tag: 'RÉSEAUX SOCIAUX · STRATÉGIE · 2025',
    title: 'Stratégie contenu — Galian',
    desc: `Élaboration et exécution d\'une stratégie de contenu pour les réseaux sociaux de Galian. Création de visuels, planification éditoriale et analyse des performances.`,
    meta: { 'CLIENT': 'Galian', 'PLATFORMS': 'Instagram / LinkedIn', 'TYPE': 'Social Media', 'ANNÉE': '2025' },
    skills: ['Stratégie digitale', 'Content creation', 'Community management'],
    tools: ['Photoshop', 'Premiere Pro', 'After Effects'],
  },
};

// ═══════════════════════════════════════════════
// GALIAN — PROJETS DATA
// ═══════════════════════════════════════════════


// ─── DATA ─────────────────────────────────────

window.projectsData.galianOctobreRose = {
  img: 'images/galian/octobre-rose.jpg',
  tag: 'GALIAN · VIDÉO · PUBLICITAIRE · 2025',
  title: 'Octobre Rose',
  desc: 'Vidéo publicitaire réalisée dans le cadre de la campagne Octobre Rose pour Galian. Production complète : script, tournage, montage et post-production.',
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Vidéo publicitaire', 'FORMAT': 'Horizontal', 'ANNÉE': '2025' },
  skills: ['Réalisation', 'Montage', 'Direction artistique'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianBosch = {
  img: 'images/galian/bosch.jpg',
  tag: 'GALIAN · VIDÉO · PUBLICITAIRE · 2025',
  title: 'Bosch — Nouveau vélo',
  desc: 'Vidéo publicitaire pour la sortie du nouveau vélo Bosch, distribué par Galian. Mise en valeur du produit, storytelling visuel et motion design.',
  meta: { 'CLIENT': 'Galian × Bosch', 'TYPE': 'Vidéo produit', 'FORMAT': 'Horizontal', 'ANNÉE': '2025' },
  skills: ['Réalisation', 'Montage', 'Motion design'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianLevee = {
  img: 'images/galian/levee-fonds.jpg',
  tag: 'GALIAN · VIDÉO · INSTITUTIONNEL · 2025',
  title: 'Levée de fond',
  desc: 'Film institutionnel pour accompagner la levée de fond de Galian. Vidéo de présentation à destination des investisseurs, mêlant interviews et motion design.',
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Film institutionnel', 'FORMAT': 'Horizontal', 'ANNÉE': '2025' },
  skills: ['Réalisation', 'Montage', 'Interviews'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianNoel = {
  img: 'images/galian/offre-noel.jpg',
  tag: 'GALIAN · VIDÉO · PUBLICITAIRE · 2025',
  title: 'Offre de Noël',
  desc: `Vidéo promotionnelle pour l\'offre de Noël Galian. Motion design, animation de textes et habillage graphique sur la charte de marque.`,
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Vidéo promotionnelle', 'FORMAT': 'Horizontal', 'ANNÉE': '2025' },
  skills: ['Motion design', 'Animation', 'Montage'],
  tools: ['After Effects', 'Premiere Pro'],
};

window.projectsData.galianSpecialiste = {
  img: 'images/galian/le-specialiste.jpg',
  tag: 'GALIAN · VIDÉO · SÉRIE · 2025',
  title: 'Le Spécialiste',
  desc: `Série de vidéos "Le Spécialiste" pour Galian. Format récurrent mettant en avant les experts de l\'entreprise à travers des portraits filmés et interviews.`,
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Série vidéo', 'FORMAT': 'Horizontal', 'ANNÉE': '2025' },
  skills: ['Réalisation', 'Interviews', 'Direction artistique', 'Montage'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianSAV = {
  img: 'images/galian/sav.jpg',
  tag: 'GALIAN · VIDÉO · SÉRIE SAV · 2025–2026',
  title: 'Série SAV',
  desc: 'Galerie de vidéos constituant la série SAV de Galian — tutoriels et présentations liées au service après-vente.',
  linkType: 'video',
  links: [
    { label: 'SAV — Épisode 1', url: 'https://youtu.be/mI6esxwkNxI' },
    { label: 'SAV — Épisode 2', url: 'https://youtu.be/5nYBkfAB4GE' },
    { label: 'SAV — Épisode 3', url: 'https://youtu.be/iqa3ZwyAgwo' },
    { label: 'SAV — Épisode 4', url: 'https://youtu.be/eGAN-p2f8qQ' }
    // Ajoutez vos liens ici
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Série vidéo', 'FORMAT': 'Horizontal', 'ANNÉE': '2025–2026' },
  skills: ['Réalisation', 'Montage', 'Motion design'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianShorts = {
  img: 'images/galian/shorts.jpg',
  tag: 'GALIAN · RÉSEAUX SOCIAUX · SHORTS · 2025–2026',
  title: 'Shorts / Vidéos courtes',
  desc: 'Collection de vidéos courtes réalisées pour les réseaux sociaux de Galian (Instagram Reels, stories). Cliquez sur les liens pour visionner.',
  linkType: 'video',
  links: [
    { label: 'Short — Titre 1', url: 'https://www.instagram.com/reel/XXXX/' },
    { label: 'Short — Titre 2', url: 'https://www.instagram.com/reel/XXXX/' },
    { label: 'Short — Titre 3', url: 'https://www.instagram.com/reel/XXXX/' },
    // Remplacez les URL par vos vrais liens Instagram
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Reels / Shorts', 'PLATEFORME': 'Instagram', 'ANNÉE': '2025–2026' },
  skills: ['Montage vertical', 'Motion design', 'Content creation'],
  tools: ['Premiere Pro', 'After Effects'],
};

window.projectsData.galianPosts = {
  img: 'images/galian/posts-instagram.jpg',
  tag: 'GALIAN · RÉSEAUX SOCIAUX · PUBLICATIONS · 2025–2026',
  title: 'Publications Instagram',
  desc: 'Galerie de publications Instagram créées pour Galian — visuels, carousels et stories.',
  linkType: 'post',
  links: [
    { label: 'Post — Titre 1', url: 'https://www.instagram.com/p/XXXX/' },
    { label: 'Post — Titre 2', url: 'https://www.instagram.com/p/XXXX/' },
    { label: 'Post — Titre 3', url: 'https://www.instagram.com/p/XXXX/' },
    // Remplacez les URL par vos vrais liens Instagram
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Publications', 'PLATEFORME': 'Instagram', 'ANNÉE': '2025–2026' },
  skills: ['Design graphique', 'Direction artistique', 'Community management'],
  tools: ['Photoshop', 'After Effects'],
};

window.projectsData.galianPhotos = {
  tag: 'GALIAN · PHOTOS · 2025–2026',
  title: 'Galerie Photos',
  desc: 'Photos réalisées dans le cadre de la mission Galian — prises de vue événementielles, produits et portraits.',
  // Ajoutez vos photos : 'images/galian/photo1.jpg', 'images/galian/photo2.jpg', ...
  photos: [
    'images/galian/photo-1.jpg',
    'images/galian/photo-2.jpg',
    'images/galian/photo-3.jpg',
    'images/galian/photo-4.jpg',
    'images/galian/photo-5.jpg',
    'images/galian/photo-6.jpg',
    'images/galian/photo-7.jpg',
    'images/galian/photo-8.jpg',
    'images/galian/photo-9.jpg',
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Photographie', 'ANNÉE': '2025–2026' },
  skills: ['Photographie', 'Direction artistique', 'Retouche'],
  tools: ['Lightroom', 'Photoshop'],
};

window.projectsData.galianCinema = {
  tag: 'GALIAN · GRAPHISME · CINÉMA · 2025',
  title: 'Galian × Cinéma',
  desc: 'Collaboration Galian × Cinéma — production graphique complète : affiches, visuels événementiels et identité visuelle pour un partenariat cinéma.',
  photos: [
    'images/galian/cinema-1.jpg',
    'images/galian/cinema-2.jpg',
    'images/galian/cinema-3.jpg',
    'images/galian/cinema-4.jpg',
    'images/galian/cinema-5.jpg',
    'images/galian/cinema-6.jpg',
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Production graphique', 'PARTENARIAT': 'Cinéma', 'ANNÉE': '2025' },
  skills: ['Direction artistique', 'Design graphique', 'Identité visuelle'],
  tools: ['Photoshop', 'After Effects'],
};

window.projectsData.galianAffiches = {
  tag: 'GALIAN · GRAPHISME · AFFICHES · 2025–2026',
  title: 'Affiches',
  desc: `Création d\'affiches pour Galian — supports print et digital déclinés sur la charte graphique de la marque.`,
  photos: [
    'images/galian/affiche-1.jpg',
    'images/galian/affiche-2.jpg',
    'images/galian/affiche-3.jpg',
    'images/galian/affiche-4.jpg',
    'images/galian/affiche-5.jpg',
  ],
  meta: { 'CLIENT': 'Galian', 'TYPE': 'Print + Digital', 'FORMAT': 'Affiches', 'ANNÉE': '2025–2026' },
  skills: ['Direction artistique', 'Design graphique', 'Print'],
  tools: ['Photoshop'],
};

// ─── GALIAN SUBCATEGORY TABS JS ───────────────
// Patch gallery items for link/photo gallery modals