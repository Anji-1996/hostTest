/* ============================================================
   PROJECTS
   She keeps walking (same character, same rig) alongside the
   project list while cards reveal one at a time based on scroll
   position -- not all at once.
   ============================================================ */

function initProjects(reducedMotion) {
  const guideEl = document.getElementById('projects-character');
  const cards = gsap.utils.toArray('.project-card');

  if (guideEl) {
    const char = CharacterRig.mount(guideEl);
    gsap.set(guideEl.closest('.projects-guide'), { scaleX: -1 });

    if (!reducedMotion) {
      ScrollTrigger.create({
        trigger: '.projects-section',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate(self) {
          const phase = self.progress * 5;
          const swing = Math.sin(phase * Math.PI * 2) * 20;
          const counter = Math.sin(phase * Math.PI * 2 + Math.PI) * 20;
          gsap.set(char.rightLegHip, { rotate: swing });
          gsap.set(char.leftLegHip, { rotate: counter });
          gsap.set(char.rightLegKnee, { rotate: Math.max(0, -swing) });
          gsap.set(char.leftLegKnee, { rotate: Math.max(0, -counter) });
          gsap.set(char.rightArmShoulder, { rotate: counter * 0.5 });
          gsap.set(char.leftArmShoulder, { rotate: swing * 0.5 });
          gsap.set(char.torsoGroup, { y: -Math.abs(Math.sin(phase * Math.PI * 2)) * 5 });
        },
      });
    }
  }

  if (reducedMotion) {
    gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}
