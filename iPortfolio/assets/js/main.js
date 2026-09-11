(function() {
  "use strict";
 
  /**
   * CPA Locker (AdBlueMedia) helpers
   */
  function checkLockerUnlock() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlocked') === '1') {
      localStorage.setItem('cpa_unlocked', 'true');
      // نمسحو الباراميتر من الرابط باش ما يبقاش ظاهر
      params.delete('unlocked');
      const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', cleanUrl);
    }
  }
 
  function isUnlocked() {
    return localStorage.getItem('cpa_unlocked') === 'true';
  }
 
  function openLocker() {
    if (typeof _uj === 'function') {
      _uj();
    } else {
      console.warn('AdBlueMedia locker script ma tحملش بعد. عاود جرب من بعد شوية.');
    }
  }
 
  function renderDownloadButton(project) {
    if (isUnlocked()) {
      return `
        <a href="${project.downloadUrl}" target="_blank" class="download-btn">
          <i class="bi bi-download"></i>
          Click Me 😏
        </a>
      `;
    }
    return `
      <a href="#" class="download-btn" data-locked="true">
        <i class="bi bi-download"></i>
       Unlock to Download 
      </a>
    `;
  }
 
  const portfolioProjects = [
    {
      id: 1,
      title: 'Professional PSD Thumbnail Template',
      shortTitle: 'Thumbnail Template',
      shortDescription: 'Free Thumbnail Template pack',
      category: 'PSD Templates',
      client: 'PSD / Photoshop / Photopea',
      date: '01 March, 2026',
      image: 'assets/img/portfolio/product-3.jpg',
      gallery: [
        
        'assets/img/portfolio/product-2.jpg',
        'assets/img/portfolio/thmbnil1.jpg',
        'assets/img/portfolio/product-3.jpg'
      ],
      downloadUrl: 'https://drive.google.com/file/d/18VGWNRGr9jJ1PZoDUIh_SqNLtNHYGLsL/view?usp=sharing',
      description: 'Download this high-quality PSD thumbnail template and customize it easily in Adobe Photoshop. The template is fully editable, allowing you to change the text, images, colors, and other design elements according to your needs. This PSD template is suitable for YouTube thumbnails, social media content, promotional designs, and other creative projects.'
    },
    /* {
      id: 2,
      title: 'Creative Social Media Branding Kit',
      shortTitle: 'Branding Kit',
      shortDescription: 'Editable branding template pack',
      category: 'PSD Templates',
      client: 'PSD / Photoshop / Photopea',
      date: '05 March, 2026',
      image: 'assets/img/portfolio/branding-3.jpg',
      gallery: [
        'assets/img/portfolio/branding-3.jpg',
        'assets/img/portfolio/branding-2.jpg',
        'assets/img/portfolio/books-1.jpg'
      ],
      downloadUrl: 'vvs',
      description: 'This branding package gives you a polished range of editable PSD layouts for online branding, digital promos, and modern social media graphics. You can quickly replace text, photos, and colors to match your own identity and campaign style.'
    } */
  ];
 
  function slugify(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
 
  function renderPortfolioFilters() {
    const filterList = document.querySelector('#portfolio-filters');
    if (!filterList) return;
 
    const categories = [...new Set(portfolioProjects.map(project => project.category))];
 
    filterList.innerHTML = `
      <li><button type="button" class="filter-active" data-filter="all">All</button></li>
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
        <div class="portfolio-content h-100">
          <img src="${project.image}" class="img-fluid" alt="${project.title}">
          <div class="portfolio-info">
            <h4>${project.shortTitle}</h4>
            <p>${project.shortDescription}</p>
            <a href="${project.image}" title="${project.title}" data-gallery="portfolio-gallery-${project.id}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
            <a href="portfolio-details.html?id=${project.id}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
          </div>
        </div>
      </div>
    `).join('');
 
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
 
  function renderProjectDetails() {
    const detailContainer = document.querySelector('#project-details-content');
    if (!detailContainer) return;
 
    const params = new URLSearchParams(window.location.search);
    const projectId = Number(params.get('id')) || portfolioProjects[0].id;
    const project = portfolioProjects.find(item => item.id === projectId) || portfolioProjects[0];
 
    detailContainer.innerHTML = `
      <div class="row gy-4">
        <div class="col-lg-8">
          <div class="portfolio-details-slider swiper init-swiper">
            <script type="application/json" class="swiper-config">
              {
                "loop": true,
                "speed": 600,
                "autoplay": {
                  "delay": 5000
                },
                "slidesPerView": "auto",
                "pagination": {
                  "el": ".swiper-pagination",
                  "type": "bullets",
                  "clickable": true
                }
              }
            </script>
 
            <div class="swiper-wrapper align-items-center">
              ${project.gallery.map(image => `
                <div class="swiper-slide">
                  <img src="${image}" alt="${project.title}">
                </div>
              `).join('')}
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
 
        <div class="col-lg-4">
          <div class="portfolio-info" data-aos="fade-up" data-aos-delay="200">
            <h3>Project information</h3>
            <ul>
              <li><strong>Category</strong>: ${project.category}</li>
              <li><strong>Client</strong>: ${project.client}</li>
              <li><strong>Project date</strong>: ${project.date}</li>
              <li class="download-item">
                <strong>Download</strong>:
                ${renderDownloadButton(project)}
              </li>
            </ul>
          </div>
 
          <div class="portfolio-description" data-aos="fade-up" data-aos-delay="300">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
          </div>
        </div>
      </div>
    `;
 
    // نربطو الكليك بزر التحميل المقفول (إلا كان موجود) - بلا inline onclick
    const lockedBtn = detailContainer.querySelector('.download-btn[data-locked="true"]');
    if (lockedBtn) {
      lockedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openLocker();
      });
    }
  }
 
  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
 
  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);
 
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
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
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
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
 
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);
 
  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);
 
  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }
 
  /**
   * Initiate Pure Counter
   */
  new PureCounter();
 
  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });
 
  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
 
  checkLockerUnlock();
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
 
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
 
  window.addEventListener("load", initSwiper);
 
  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
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
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
 
})();