/* ============================================================
   HERO ANIMATION
   Wave-on-load + subtle idle breathing. Not scroll-driven --
   this plays once when the page opens, exactly like the brief
   asks ("waving animation should happen when hero loads").
   ============================================================ */

function initHero(reducedMotion) {
  const container = document.getElementById('hero-character');
  if (!container) return;

  const char = CharacterRig.mount(container);
  container.closest('.hero-stage-frame').classList.add('is-idle');

  if (reducedMotion) {
    gsap.set(char.leftArmShoulder, { rotate: -18 });
    return;
  }

  // Resting pose: arms relaxed at sides, slight elbow bend
  gsap.set(char.leftArmElbow, { rotate: 8 });
  gsap.set(char.rightArmElbow, { rotate: -8 });
  gsap.set([char.leftArmShoulder], { rotate: 6 });
  gsap.set([char.rightArmShoulder], { rotate: -4 });

  const tl = gsap.timeline({ delay: 0.4 });

  // entrance
  tl.from(container, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' })
    // raise arm to wave
    .to(char.leftArmShoulder, { rotate: -150, duration: 0.55, ease: 'back.out(1.4)' }, 0.5)
    .to(char.leftArmElbow, { rotate: -10, duration: 0.4, ease: 'power2.out' }, 0.55)
    // wave wrist a few times
    .to(char.leftArmElbow, {
      rotate: 22,
      duration: 0.28,
      ease: 'sine.inOut',
      repeat: 5,
      yoyo: true,
    }, 0.95)
    // lower arm back to resting position
    .to(char.leftArmShoulder, { rotate: 6, duration: 0.5, ease: 'power2.inOut' }, '+=0.05')
    .to(char.leftArmElbow, { rotate: 8, duration: 0.5, ease: 'power2.inOut' }, '<');

  // continuous idle sway on the shoulders (very subtle, GPU-friendly)
  gsap.to(char.rightArmShoulder, {
    rotate: '-=3', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6,
  });
}
