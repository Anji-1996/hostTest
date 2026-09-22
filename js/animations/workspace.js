/* ============================================================
   WORKSPACE / SCROLL-DRIVEN STORY STAGE
   ------------------------------------------------------------
   One master progress value (0 -> 1), driven by how far the user
   has scrolled through .stage-wrapper, is mapped onto every part
   of the story: the character's walk cycle, when she reaches the
   desk, sits, types, stands, and leaves. Because everything reads
   from the SAME progress number, scrolling backward reverses the
   whole scene automatically -- nothing here is "played" as a
   one-shot animation, it's all a pure function of scroll position.
   ============================================================ */

function initWorkspaceStage(reducedMotion) {
  const wrapper = document.querySelector('.stage-wrapper');
  const stageCharEl = document.getElementById('stage-character');
  if (!wrapper || !stageCharEl) return;

  const char = CharacterRig.mount(stageCharEl);
  const anchor = document.querySelector('.character-anchor');
  const heroFrame = document.querySelector('.hero-stage-frame');
  const deskScene = document.querySelector('.desk-scene');
  const techTags = gsap.utils.toArray('.tech-tag');
  const captions = gsap.utils.toArray('.stage-caption-item');
  const codeLines = gsap.utils.toArray('.monitor .code-line');

  // ---- static base pose (legs) ----
  gsap.set([char.leftLegHip, char.rightLegHip, char.leftLegKnee, char.rightLegKnee], { rotate: 0 });

  if (reducedMotion) {
    // Simplified, non-scroll-linked version: just show her seated & working.
    gsap.set(anchor, { left: '50%' });
    gsap.set(char.leftLegHip, { rotate: -88 });
    gsap.set(char.rightLegHip, { rotate: -88 });
    gsap.set(char.leftLegKnee, { rotate: 88 });
    gsap.set(char.rightLegKnee, { rotate: 88 });
    gsap.set(char.leftArmShoulder, { rotate: -18 });
    gsap.set(char.rightArmShoulder, { rotate: 18 });
    gsap.set(deskScene, { opacity: 1, y: 0 });
    gsap.set(techTags, { opacity: 1, y: 0 });
    gsap.set(captions, { opacity: 1 });
    gsap.set(codeLines, { opacity: 1 });
    return;
  }

  // ---- segment boundaries along the 0..1 story progress ----
  const seg = {
    handoff: [0.00, 0.06],
    walkIn: [0.06, 0.28],
    arrive: [0.28, 0.34],
    sitDown: [0.34, 0.42],
    typing: [0.42, 0.66],
    standUp: [0.66, 0.74],
    walkOut: [0.74, 0.96],
    settle: [0.96, 1.00],
  };

  const map = (v, a, b, c, d) => gsap.utils.clamp(Math.min(c, d), Math.max(c, d), gsap.utils.mapRange(a, b, c, d, v));
  const within = (p, [a, b]) => p >= a && p <= b;
  const local = (p, [a, b]) => gsap.utils.clamp(0, 1, (p - a) / (b - a));

  function applyWalkCycle(phase, parts, intensity = 1) {
    const swing = Math.sin(phase * Math.PI * 2) * 24 * intensity;
    const counter = Math.sin(phase * Math.PI * 2 + Math.PI) * 24 * intensity;
    gsap.set(parts.rightLegHip, { rotate: swing });
    gsap.set(parts.leftLegHip, { rotate: counter });
    gsap.set(parts.rightLegKnee, { rotate: Math.max(0, -swing * 1.1) });
    gsap.set(parts.leftLegKnee, { rotate: Math.max(0, -counter * 1.1) });
    gsap.set(parts.rightArmShoulder, { rotate: counter * 0.6 });
    gsap.set(parts.leftArmShoulder, { rotate: swing * 0.6 });
    gsap.set(parts.torsoGroup, { y: -Math.abs(Math.sin(phase * Math.PI * 2)) * 6 });
  }

  function setCaption(activeIndex, p) {
    captions.forEach((el, i) => {
      const range = el.dataset.range.split(',').map(Number);
      const t = within(p, range) ? local(p, range) : -1;
      let o = 0;
      if (t >= 0) o = t < 0.2 ? t / 0.2 : (t > 0.8 ? (1 - t) / 0.2 : 1);
      gsap.set(el, { opacity: o, y: (1 - o) * 14 });
    });
  }

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate(self) {
      const p = self.progress;

      // -- hero -> stage handoff crossfade --
      const handoffT = within(p, seg.handoff) ? local(p, seg.handoff) : (p < seg.handoff[0] ? 0 : 1);
      gsap.set(stageCharEl.closest('.character-anchor'), { opacity: handoffT });
      if (heroFrame) gsap.set(heroFrame, { opacity: 1 - handoffT });

      // -- horizontal position across the whole journey --
      let leftPct;
      let facing = 1;
      let walking = false;
      let walkPhase = 0;

      if (p <= seg.arrive[0]) {
        leftPct = map(p, seg.walkIn[0], seg.arrive[0], 16, 50);
        walking = p >= seg.walkIn[0];
        walkPhase = local(p, seg.walkIn) * 6.5;
      } else if (p <= seg.standUp[1]) {
        leftPct = 50;
      } else {
        leftPct = map(p, seg.walkOut[0], seg.walkOut[1], 50, 10);
        walking = true;
        facing = -1;
        walkPhase = local(p, seg.walkOut) * 6.5;
      }
      gsap.set(anchor, { left: leftPct + '%', scaleX: facing });

      if (walking) {
        applyWalkCycle(walkPhase, char, 1);
      } else if (within(p, seg.arrive)) {
        const t = local(p, seg.arrive);
        const ease = 1 - gsap.parseEase('power2.out')(t);
        applyWalkCycle(6.5, char, ease); // relax the last stride back to neutral
      } else if (within(p, seg.sitDown)) {
        const t = local(p, seg.sitDown);
        const ease = gsap.parseEase('power2.inOut')(t);
        gsap.set(char.leftLegHip, { rotate: -88 * ease });
        gsap.set(char.rightLegHip, { rotate: -88 * ease });
        gsap.set(char.leftLegKnee, { rotate: 88 * ease });
        gsap.set(char.rightLegKnee, { rotate: 88 * ease });
        gsap.set(char.torsoGroup, { y: 22 * ease, rotate: 3 * ease });
        gsap.set(char.leftArmShoulder, { rotate: -18 * ease });
        gsap.set(char.rightArmShoulder, { rotate: 18 * ease });
        gsap.set(char.leftArmElbow, { rotate: -60 * ease });
        gsap.set(char.rightArmElbow, { rotate: 60 * ease });
      } else if (within(p, seg.typing)) {
        const t = local(p, seg.typing);
        const wiggle = Math.sin(t * 46) * 7;
        gsap.set([char.leftLegHip, char.rightLegHip], { rotate: -88 });
        gsap.set([char.leftLegKnee, char.rightLegKnee], { rotate: 88 });
        gsap.set(char.torsoGroup, { y: 22, rotate: 3 });
        gsap.set(char.leftArmShoulder, { rotate: -18 });
        gsap.set(char.rightArmShoulder, { rotate: 18 });
        gsap.set(char.leftArmElbow, { rotate: -60 + wiggle });
        gsap.set(char.rightArmElbow, { rotate: 60 - wiggle });

        codeLines.forEach((line, i) => {
          const reveal = (i + 1) / codeLines.length;
          gsap.set(line, { opacity: t > reveal * 0.9 ? 1 : 0.15 });
        });
      } else if (within(p, seg.standUp)) {
        const t = 1 - local(p, seg.standUp);
        const ease = gsap.parseEase('power2.inOut')(t);
        gsap.set(char.leftLegHip, { rotate: -88 * ease });
        gsap.set(char.rightLegHip, { rotate: -88 * ease });
        gsap.set(char.leftLegKnee, { rotate: 88 * ease });
        gsap.set(char.rightLegKnee, { rotate: 88 * ease });
        gsap.set(char.torsoGroup, { y: 22 * ease, rotate: 3 * ease });
        gsap.set(char.leftArmShoulder, { rotate: -18 * ease });
        gsap.set(char.rightArmShoulder, { rotate: 18 * ease });
        gsap.set(char.leftArmElbow, { rotate: -60 * ease });
        gsap.set(char.rightArmElbow, { rotate: 60 * ease });
      }

      // -- desk & monitor presence --
      let deskOpacity = 0;
      if (p >= 0.24 && p <= 0.76) {
        deskOpacity = p < 0.30 ? map(p, 0.24, 0.30, 0, 1) : (p > 0.70 ? map(p, 0.70, 0.76, 1, 0) : 1);
      }
      gsap.set(deskScene, { opacity: deskOpacity, y: (1 - deskOpacity) * 30 });

      // -- floating tech tags: appear during walk-in + typing, drift upward --
      techTags.forEach((tag, i) => {
        const startAt = 0.10 + i * 0.05;
        const t = gsap.utils.clamp(0, 1, (p - startAt) / 0.4);
        const o = t < 0.15 ? t / 0.15 : (t > 0.85 ? (1 - t) / 0.15 : 1);
        gsap.set(tag, { opacity: p > 0.06 && p < 0.9 ? o : 0, y: 24 - t * 40 });
      });

      setCaption(null, p);
    },
  });
}
