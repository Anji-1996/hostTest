/* ============================================================
   CONTACT
   Final stop of the journey: she stands beside the form and
   gestures toward it once, when it scrolls into view.
   ============================================================ */

function initContact(reducedMotion) {
  const el = document.getElementById('contact-character');
  if (el) {
    const char = CharacterRig.mount(el);
    gsap.set(char.leftArmShoulder, { rotate: 4 });
    gsap.set(char.rightArmShoulder, { rotate: -6 });

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0 });
      gsap.set(char.rightArmShoulder, { rotate: 55 });
    } else {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.contact-section', start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      tl.to(el, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' })
        .to(char.rightArmShoulder, { rotate: 55, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.2')
        .to(char.rightArmElbow, { rotate: -15, duration: 0.4 }, '<')
        .to(char.rightArmShoulder, { rotate: 20, duration: 0.5, ease: 'power2.inOut' }, '+=0.3')
        .to(char.rightArmElbow, { rotate: 0, duration: 0.5 }, '<');
    }
  }

  const formEls = [document.querySelector('.contact-form'), ...gsap.utils.toArray('.contact-intro > *')];
  if (reducedMotion) {
    gsap.set('.contact-form', { opacity: 1, y: 0 });
    return;
  }
  gsap.to('.contact-form', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-section', start: 'top 65%' },
  });
}
