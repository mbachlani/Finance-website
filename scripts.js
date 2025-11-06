document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden-mobile');
  }
  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('show');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileBtn && mobileBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden-mobile');
  }
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => (mobileMenu.classList.contains('show') ? closeMenu() : openMenu()));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
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
  const sections = Array.from(document.querySelectorAll('section, [id]')).filter(s => s.id);
  const navLinks = document.querySelectorAll('nav a');
  function highlight() {
    let current = '';
    sections.forEach(sec => { if (pageYOffset >= sec.offsetTop - 150) current = sec.id; });
    navLinks.forEach(link => {
      link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', highlight);
  highlight();

  // Dark mode toggle (creates floating button)
  (function () {
    const saved = localStorage.getItem('color-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    let toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'dark-mode-toggle';
      toggle.className = 'fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all z-50';
      toggle.title = 'Toggle dark mode';
      document.body.appendChild(toggle);
    }
    function updateIcon() { toggle.innerHTML = document.documentElement.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; }
    toggle.addEventListener('click', function () {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark'); localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark'); localStorage.setItem('color-theme', 'dark');
      }
      updateIcon();
    });
    updateIcon();
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