/* La Serrure — interactions communes (nav, menu mobile, révélations) */
(function () {
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  var drawer = document.getElementById('drawer'),
      burger = document.getElementById('burger'),
      dclose = document.getElementById('drawerClose');
  if (burger && drawer) burger.addEventListener('click', function () { drawer.classList.add('open'); });
  if (dclose && drawer) dclose.addEventListener('click', function () { drawer.classList.remove('open'); });
  if (drawer) drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { drawer.classList.remove('open'); });
  });

  window.addEventListener('load', function () {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('[data-reveal]').forEach(function (el) {
        if (el.parentElement && el.parentElement.hasAttribute('data-stagger')) return;
        gsap.from(el, { y: 34, opacity: 0, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' } });
      });
      gsap.utils.toArray('[data-stagger]').forEach(function (grid) {
        var items = grid.querySelectorAll('[data-reveal]'); if (!items.length) return;
        gsap.from(items, { y: 40, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 82%' } });
      });
    }
  });
})();
