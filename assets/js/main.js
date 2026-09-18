(function() {
  "use strict";

  /**
   * OGAds Locker helpers.
   * Locker ID 5n73n6 — script tag lives in the <head> of every page:
   * <script id="ogjs" src="https://offertrk.org/cl/js/5n73n6"></script>
   * That script exposes a global `og_load()` which opens the OGAds locker overlay.
   * NOTE: OGAds lockers commonly redirect back to the original page with
   * `?unlocked=1` once an offer is completed — checkLockerUnlock() below expects
   * that. If your OGAds dashboard is configured with a different completion
   * redirect/param, update this function and the URL you set in the OGAds panel
   * to match.
   */
  function checkLockerUnlock() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlocked') === '1') {
      localStorage.setItem('ogads_unlocked', 'true');
      params.delete('unlocked');
      const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', cleanUrl);
    }
  }

  function isUnlocked() {
    return localStorage.getItem('ogads_unlocked') === 'true';
  }

  function openLocker() {
    if (typeof og_load === 'function') {
      og_load();
    } else {
      console.warn('OGAds locker script not loaded yet. Try again in a moment.');
    }
  }

  function renderDownloadButton(project, context = 'detail') {
    const unlocked = isUnlocked();
    const href = unlocked ? project.downloadUrl : '#';
    const target = unlocked ? ' target="_blank" rel="noopener noreferrer"' : '';
    const btnClass = context === 'card'
      ? 'project-action-btn download-btn download-btn--card glow-surface magnetic-btn'
      : 'download-btn glow-surface magnetic-btn';
    const icon = unlocked ? 'bi-download' : 'bi-lock-fill';
    const label = unlocked ? 'Download' : 'Unlock download';

    return `
      <a href="${href}" class="${btnClass}" data-locked="${unlocked ? 'false' : 'true'}"${target}>
        <i class="bi ${icon}"></i>
        <span>${label}</span>
      </a>
    `;
  }

  function bindLockedDownloadButtons(root = document) {
    root.querySelectorAll('.download-btn[data-locked="true"]').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        openLocker();
      });
    });
  }


  /**
   * Project data.
   * NOTE for Hamza: `version` is a placeholder field on every project (defaults to "v1.0")
   * so the cards have something real to show for "file information" — edit it per pack
   * whenever you know the real version. Everything else (images, links, description,
   * features) is kept exactly as it was in the old site.
   */
  const portfolioProjects = [
    {
      id: 1,
      title: 'Professional PSD Thumbnail Template',
      shortTitle: 'Thumbnail Template',
      shortDescription: 'Free Thumbnail Template pack',
      category: 'PSD Templates',
      client: 'PSD / Photoshop / Photopea',
      date: '01 March, 2026',
      version: 'v1.0',
      image: 'assets/img/portfolio/product-3.jpg',
      gallery: [
        'assets/img/portfolio/product-2.jpg',
        'assets/img/portfolio/thmbnil1.jpg',
        'assets/img/portfolio/product-3.jpg'
      ],
      downloadUrl: 'https://mega.nz/folder/jzwxjBZY#-1NSmiRucdTgCcKldK0q7Q',
      description: 'Download this high-quality PSD thumbnail template and customize it easily in Adobe Photoshop. The template is fully editable, allowing you to change the text, images, colors, and other design elements according to your needs. This PSD template is suitable for YouTube thumbnails, social media content, promotional designs, and other creative projects.',
      features: [
        'Editable PSD',
        'Customizable text',
        'Customizable colors',
        'Photoshop compatible',
        'Photopea compatible'
      ]
    },
    {
      id: 2,
      title: 'A massive collection of creative assets for designers',
      shortTitle: 'Ultimate Design Assets Pack',
      shortDescription: 'Design Assets',
      category: 'Design Assets',
      client: 'PSD / Photoshop / Photopea',
      date: '14 September, 2026',
      version: 'v1.0',
      image: 'assets/img/portfolio/project2/Project2Cover.jpg',
      gallery: [
        'assets/img/portfolio/project2/1.jpg',
        'assets/img/portfolio/project2/2.jpg',
        'assets/img/portfolio/project2/3.jpg',
        'assets/img/portfolio/project2/4.jpg',
        'assets/img/portfolio/project2/5.png',
        'assets/img/portfolio/project2/6.png',
        'assets/img/portfolio/project2/amazon.png',
        'assets/img/portfolio/project2/Paypal 1.png',
        'assets/img/portfolio/project2/Paypal 2.png'
      ],
      downloadUrl: 'https://mega.nz/file/KvAnzaoa#eLiJNvHATBcolAJ4QIVDVTzlG2KqESQ3rUUBLlkG0yg',
      description: 'The Ultimate Design Assets Pack is a versatile collection of creative resources designed to speed up your workflow and give your projects a more professional look. From realistic textures and paper elements to sparks, lasers, lens flares, backgrounds, UI graphics, and more, this pack gives you a wide variety of visual resources that can be used across graphic design, thumbnails, social media content, video editing, promotional designs, and creative projects. Whether you are creating a YouTube thumbnail, editing a video, designing social media content, or building a professional graphic composition, these assets can help you add depth, atmosphere, detail, and visual impact to your work.',
      features: [
        'Material Textures',
        'Paper Textures & Elements',
        'Ripped Paper',
        'Sparks & Particle Effects',
        'Laser Effects'
      ]
    }
  ];

  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /** Derives a short file-type badge (PSD / ZIP / ...) from the category text. */
  function getFileType(project) {
    const src = `${project.category} ${project.client}`.toLowerCase();
    if (src.includes('psd')) return 'PSD';
    if (src.includes('zip')) return 'ZIP';
    if (src.includes('template')) return 'PSD';
    return 'FILE';
  }

  function renderHeroStats() {
    const packCount = document.querySelector('#stat-pack-count');
    if (packCount) packCount.textContent = portfolioProjects.length;
    const categoryCount = document.querySelector('#stat-category-count');
    if (categoryCount) categoryCount.textContent = new Set(portfolioProjects.map(p => p.category)).size;
  }

  function renderPortfolioFilters() {
    const filterList = document.querySelector('#portfolio-filters');
    if (!filterList) return;

    const categories = [...new Set(portfolioProjects.map(project => project.category))];

    filterList.innerHTML = `
      <li><button type="button" class="filter-active" data-filter="all">All packs</button></li>
      ${categories.map(category => `
        <li><button type="button" data-filter="${slugify(category)}">${category}</button></li>
      `).join('')}
    `;

    filterList.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function() {
        filterList.querySelectorAll('button').forEach(item => item.classList.remove('filter-active'));
        this.classList.add('filter-active');

        const selectedFilter = this.getAttribute('data-filter');
        document.querySelectorAll('.portfolio-card').forEach(card => {
          const matches = selectedFilter === 'all' || card.getAttribute('data-category') === this.textContent.trim();
          card.style.display = matches ? '' : 'none';
        });
      });
    });
  }

  function renderPortfolioProjects() {
    const grid = document.querySelector('#portfolio-grid');
    if (!grid) return;

    grid.innerHTML = portfolioProjects.map(project => `
      <div class="col-lg-6 col-md-6 portfolio-item portfolio-card" data-category="${project.category}">
        <div class="portfolio-card-inner glow-surface">
          <div class="portfolio-content">
            <span class="category-badge">${project.category}</span>
            <span class="filetype-badge">${getFileType(project)}</span>
            <img src="${project.image}" class="img-fluid" alt="${project.title}" loading="lazy">
            <div class="portfolio-info">
              <h4>${project.shortTitle}</h4>
              <p>${project.shortDescription}</p>
              <a href="${project.image}" title="${project.title}" data-gallery="portfolio-gallery-${project.id}" class="glightbox preview-link" aria-label="Preview ${project.shortTitle}"><i class="bi bi-zoom-in"></i></a>
              <a href="portfolio-details.html?id=${project.id}" title="More Details" class="details-link" aria-label="View details for ${project.shortTitle}"><i class="bi bi-link-45deg"></i></a>
            </div>
          </div>

          <div class="portfolio-card-body">
            <h4>${project.shortTitle}</h4>
            <p>${project.shortDescription}</p>
            <div class="card-meta-row">
              <span class="card-meta-item"><i class="bi bi-tag"></i>${project.version}</span>
              <span class="card-meta-item"><i class="bi bi-calendar3"></i>${project.date}</span>
              <span class="card-meta-item"><i class="bi bi-layers"></i>${project.client}</span>
            </div>
          </div>

          <div class="portfolio-card-actions">
            <a href="portfolio-details.html?id=${project.id}" class="project-action-btn project-action-btn--secondary">
              <i class="bi bi-eye"></i>
              <span>Show details</span>
            </a>
            ${renderDownloadButton(project, 'card')}
          </div>
        </div>
      </div>
    `).join('');

    bindLockedDownloadButtons(grid);

    if (window.GLightbox) {
      if (window.portfolioLightbox) {
        window.portfolioLightbox.destroy();
      }
      window.portfolioLightbox = GLightbox({ selector: '.glightbox' });
    }

    if (window.AOS) {
      window.AOS.refreshHard();
    }
  }

  function getProjectFeatures(project) {
    if (Array.isArray(project.features) && project.features.length) {
      return project.features;
    }

    const features = [];
    const description = (project.description || '').toLowerCase();
    const clientText = (project.client || '').toLowerCase();

    if (description.includes('custom') || description.includes('editable')) {
      features.push('Editable design');
    }
    if (description.includes('color') || description.includes('text')) {
      features.push('Easy customization');
    }
    if (description.includes('photopea')) {
      features.push('Photopea compatible');
    }
    if (description.includes('photoshop')) {
      features.push('Photoshop compatible');
    }
    if (description.includes('social media') || description.includes('branding')) {
      features.push('Brand-ready layout');
    }
    if (description.includes('thumbnail') || description.includes('youtube')) {
      features.push('Social media ready');
    }
    if (description.includes('template')) {
      features.push('Ready-to-use template');
    }

    if (!features.length && clientText.includes('photoshop')) {
      features.push('Photoshop compatible');
    }
    if (!features.length && clientText.includes('photopea')) {
      features.push('Photopea compatible');
    }

    return [...new Set(features)].slice(0, 6);
  }

  function renderProjectDetails() {
    const detailContainer = document.querySelector('#project-details-content');
    if (!detailContainer) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = Number(params.get('id')) || portfolioProjects[0].id;
    const project = portfolioProjects.find(item => item.id === projectId) || portfolioProjects[0];
    const projectFeatures = getProjectFeatures(project);
    const compatibilityLabel = /photoshop|photopea|figma|canva|illustrator/i.test(project.client || '') ? 'Compatible with' : 'Client';

    document.title = `${project.title} | RYVL`;

    detailContainer.innerHTML = `
      <div class="project-detail-page">
        <nav class="project-breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="index.html#portfolio">Projects</a>
          <span class="breadcrumb-separator">/</span>
          <span>${project.shortTitle}</span>
        </nav>

        <div class="project-showcase">
          <div class="project-gallery-panel" data-aos="fade-up" data-aos-delay="100">
            <div class="portfolio-details-slider swiper init-swiper project-swiper">
              <script type="application/json" class="swiper-config">
                {
                  "loop": true,
                  "speed": 700,
                  "autoplay": { "delay": 5000 },
                  "slidesPerView": 1,
                  "spaceBetween": 18,
                  "pagination": { "el": ".swiper-pagination", "type": "bullets", "clickable": true },
                  "navigation": { "nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev" }
                }
              </script>

              <div class="swiper-wrapper">
                ${project.gallery.map(image => `
                  <div class="swiper-slide">
                    <a href="${image}" class="project-lightbox" data-gallery="project-gallery-${project.id}" aria-label="Open preview for ${project.title}">
                      <img src="${image}" alt="${project.title} preview" loading="eager">
                    </a>
                  </div>
                `).join('')}
              </div>

              <div class="swiper-button-next"><i class="bi bi-chevron-right"></i></div>
              <div class="swiper-button-prev"><i class="bi bi-chevron-left"></i></div>
              <div class="swiper-pagination"></div>
            </div>
          </div>

          <div class="project-summary" data-aos="fade-up" data-aos-delay="180">
            <span class="project-category-badge"><i class="bi bi-folder2"></i>${project.category}</span>
            <h1>${project.title}</h1>
            <p class="project-short-description">${project.shortDescription}</p>

            <div class="project-summary-meta">
              <div class="meta-item">
                <span class="meta-label">Version</span>
                <strong>${project.version}</strong>
              </div>
              <div class="meta-item">
                <span class="meta-label">${compatibilityLabel}</span>
                <strong>${project.client}</strong>
              </div>
              <div class="meta-item">
                <span class="meta-label">Updated</span>
                <strong>${project.date}</strong>
              </div>
            </div>

            <div class="project-actions">
              ${renderDownloadButton(project)}
              <a href="index.html#portfolio" class="secondary-action-btn glow-surface">
                <i class="bi bi-arrow-left"></i>
                <span>Back to projects</span>
              </a>
            </div>

            <p class="project-trust-text">Ready for Photoshop, Photopea, and fast creative workflows.</p>
          </div>
        </div>

        <div class="project-content-grid">
          <article class="project-copy-panel">
            <div class="detail-panel" data-aos="fade-up" data-aos-delay="220">
              <h2>About this pack</h2>
              <p>${project.description}</p>
            </div>

            ${projectFeatures.length ? `
              <div class="detail-panel" data-aos="fade-up" data-aos-delay="260">
                <h3>What's included</h3>
                <ul class="project-feature-list">
                  ${projectFeatures.map(feature => `
                    <li><i class="bi bi-check-circle-fill"></i><span>${feature}</span></li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </article>
        </div>
      </div>
    `;

    if (window.GLightbox) {
      if (window.projectDetailLightbox) {
        window.projectDetailLightbox.destroy();
      }
      window.projectDetailLightbox = GLightbox({ selector: '.project-lightbox' });
    }

    bindLockedDownloadButtons(detailContainer);
  }

  /**
   * Header toggle (mobile dock -> overlay menu)
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  if (headerToggleBtn) headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Light / dark theme toggle
   */
  const themeToggleBtn = document.querySelector('#themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('ryvle-theme', next);
      } catch (e) {
        // localStorage unavailable (private mode, etc.) — theme still applies for this session
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll — single reveal on section containers only (not per-card)
   */
  function aosInit() {
    if (window.AOS) {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Typed.js — rotating product types in the hero
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && window.Typed) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2200
    });
  }

  /**
   * Initiate glightbox (base instance for any static .glightbox links outside the grid)
   */
  if (window.GLightbox) {
    GLightbox({ selector: '.glightbox' });
  }

  checkLockerUnlock();
  renderHeroStats();
  renderPortfolioFilters();
  renderPortfolioProjects();
  renderProjectDetails();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      new Swiper(swiperElement, config);
    });
  }
  if (window.Swiper) window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function() {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({ top: section.offsetTop - parseInt(scrollMarginTop || 0), behavior: 'smooth' });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Cursor-tracked glow on any .glow-surface element (cards, CTAs)
   */
  document.addEventListener('pointermove', (e) => {
    const target = e.target.closest('.glow-surface');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    target.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  });

  /**
   * Magnetic pull for primary download CTAs (.magnetic-btn)
   */
  (function initMagneticButtons() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    document.addEventListener('mousemove', (e) => {
      document.querySelectorAll('.magnetic-btn').forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.hypot(dx, dy);
        const radius = Math.max(rect.width, rect.height) * 1.4;

        if (distance < radius) {
          const pull = 1 - distance / radius;
          btn.style.transform = `translate(${(dx * 0.25 * pull).toFixed(1)}px, ${(dy * 0.25 * pull).toFixed(1)}px)`;
        } else {
          btn.style.transform = '';
        }
      });
    });

    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.magnetic-btn').forEach((btn) => { btn.style.transform = ''; });
    });
  })();

})();