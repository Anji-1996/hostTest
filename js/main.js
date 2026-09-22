/* ============================================================
   MAIN
   Boots the page: registers GSAP/ScrollTrigger, checks the
   visitor's motion preference, then hands off to each section's
   module in order. Every module receives `reducedMotion` and is
   responsible for providing a simplified fallback itself.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) document.body.classList.add('reduced-motion');

  // -- nav background on scroll --
  const nav = document.querySelector('.site-nav');
  ScrollTrigger.create({
    start: 'top -10',
    end: 99999,
    onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 10),
  });

  // -- journey rail waypoints --
  const waypoints = gsap.utils.toArray('.journey-rail .waypoint');
  const sectionSelectors = ['#hero', '.stage-wrapper', '.projects-section', '.contact-section'];
  sectionSelectors.forEach((selector, i) => {
    const target = document.querySelector(selector);
    if (!target || !waypoints[i]) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => setActiveWaypoint(i),
      onEnterBack: () => setActiveWaypoint(i),
    });
  });
  function setActiveWaypoint(i) {
    waypoints.forEach((w, idx) => w.classList.toggle('is-active', idx === i));
  }

  // -- boot each section --
  initHero(reducedMotion);
  initWorkspaceStage(reducedMotion);
  initProjects(reducedMotion);
  initContact(reducedMotion);

  ScrollTrigger.refresh();

  // Recalculate on resize (debounced) so pin distances stay correct
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });

  // Contact form: no backend wired yet -- structured for the user to connect later
  const form = document.getElementById('contact-form-el');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: connect to your form handler / API endpoint here
      console.info('Contact form submitted (not yet connected to a backend).');
    });
  }
});
