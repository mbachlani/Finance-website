// Central site scripts: mobile menu, smooth scroll, active nav, dark mode, video modal
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-button') || document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('nav');
  const overlay = document.getElementById('overlay');

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active', 'show');
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active', 'show');
    mobileMenu.classList.remove('hidden');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => (mobileMenu.classList.contains('show') ? closeMenu() : openMenu()));
    // close when a link inside the menu is clicked
    mobileMenu.querySelectorAll && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    if (overlay) overlay.addEventListener('click', closeMenu);
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeMenu(); });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      closeMenu();
    });
  });

  // Active link highlight (simple)
  const sections = Array.from(document.querySelectorAll('section[id], [id]')).filter(s => s.id);
  const navLinks = Array.from(document.querySelectorAll('nav a, .nav-link, a[href^="#"]'));
  function highlight() {
    let current = '';
    sections.forEach(sec => { if (pageYOffset >= sec.offsetTop - 150) current = sec.id; });
    navLinks.forEach(link => link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`));
  }
  window.addEventListener('scroll', highlight);
  highlight();

  // Dark mode toggle and initial state
  (function () {
    const saved = localStorage.getItem('color-theme');
    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // create a floating toggle if not present
    if (!document.getElementById('dark-mode-toggle')) {
      const toggle = document.createElement('button');
      toggle.id = 'dark-mode-toggle';
      toggle.className = 'dark-toggle fixed bottom-4 right-4 z-50';
      toggle.title = 'Toggle dark mode';
      document.body.appendChild(toggle);
      function update() { toggle.innerHTML = document.documentElement.classList.contains('dark') ? '🌞' : '🌙'; }
      toggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark'); localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark'); localStorage.setItem('color-theme', 'dark');
        }
        update();
      });
      update();
    }
  })();

  // Video modal (if present)
  (function () {
    const openBtn = document.getElementById('open-video');
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const closeBtn = document.getElementById('close-video');
    const embedBase = 'https://www.youtube.com/embed/WTTCR5-YuAU?rel=0';
    if (!openBtn || !modal || !iframe) return;
    function openModal() { iframe.src = embedBase + '&autoplay=1'; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; closeBtn && closeBtn.focus(); }
    function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); iframe.src = ''; document.body.style.overflow=''; openBtn && openBtn.focus(); }
    openBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  })();
});