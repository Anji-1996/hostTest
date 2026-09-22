/* ============================================================
   CHARACTER RIG
   ------------------------------------------------------------
   One consistent character is used in every section. Rather
   than three unrelated illustrations, this module renders the
   SAME rigged SVG markup into every character slot, so replacing
   her later (real artwork, Lottie, sprite sheet) means editing
   ONE function.

   Body is split into logical, independently-animatable parts:
   hairBack, hairFront, head, torso, leftArm(shoulder+elbow+hand),
   rightArm(shoulder+elbow+hand), leftLeg(hip+knee+foot),
   rightLeg(hip+knee+foot) -- matching /assets/character/ naming.

   Each joint group uses `transform-box: fill-box` with
   `transform-origin: 50% 0%` (see animations.css .limb-pivot)
   so rotating the group pivots exactly at that joint, and any
   child joints (elbow inside shoulder, knee inside hip) inherit
   the parent rotation automatically -- classic 2D skeletal rig.
   ============================================================ */

const CharacterRig = (() => {

  function markup() {
    return `
    <svg viewBox="0 0 300 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g class="char-root">

        <!-- long hair, behind everything -->
        <rect class="char-hairBack" x="92" y="36" width="116" height="272" rx="54" fill="var(--color-ink)"></rect>

        <!-- back (right) arm -->
        <g class="char-rightArmShoulder limb-pivot">
          <rect x="175" y="124" width="26" height="84" rx="13" fill="var(--color-mustard-dark)"></rect>
          <g class="char-rightArmElbow limb-pivot" style="transform:translateY(0)">
            <rect x="177" y="208" width="22" height="80" rx="11" fill="var(--color-mustard)"></rect>
            <circle class="char-rightHand" cx="188" cy="294" r="13" fill="var(--color-skin)"></circle>
          </g>
        </g>

        <!-- legs -->
        <g class="char-rightLegHip limb-pivot">
          <rect x="154" y="340" width="30" height="118" rx="12" fill="var(--color-navy-dark)"></rect>
          <g class="char-rightLegKnee limb-pivot">
            <rect x="156" y="458" width="26" height="112" rx="10" fill="var(--color-navy)"></rect>
            <rect x="147" y="568" width="48" height="20" rx="8" fill="var(--color-shoe)"></rect>
            <rect x="147" y="584" width="48" height="6" rx="3" fill="var(--color-shoe-sole)"></rect>
          </g>
        </g>

        <g class="char-leftLegHip limb-pivot">
          <rect x="116" y="340" width="30" height="118" rx="12" fill="var(--color-navy)"></rect>
          <g class="char-leftLegKnee limb-pivot">
            <rect x="118" y="458" width="26" height="112" rx="10" fill="var(--color-navy)"></rect>
            <rect x="109" y="568" width="48" height="20" rx="8" fill="var(--color-shoe)"></rect>
            <rect x="109" y="584" width="48" height="6" rx="3" fill="var(--color-shoe-sole)"></rect>
          </g>
        </g>

        <!-- torso + head -->
        <g class="char-torso-group">
          <rect class="char-torso" x="104" y="108" width="92" height="232" rx="26" fill="var(--color-mustard)"></rect>
          <rect x="140" y="108" width="20" height="58" rx="6" fill="var(--color-surface)"></rect>
          <rect x="104" y="322" width="92" height="14" fill="var(--color-navy-dark)"></rect>

          <g class="char-neckhead">
            <rect x="136" y="100" width="28" height="26" fill="var(--color-skin)"></rect>
            <circle cx="150" cy="72" r="38" fill="var(--color-skin)"></circle>
            <rect x="104" y="54" width="15" height="112" rx="7" fill="var(--color-ink)"></rect>
            <rect x="181" y="54" width="15" height="112" rx="7" fill="var(--color-ink)"></rect>
            <rect x="112" y="32" width="76" height="48" rx="38" fill="var(--color-ink)"></rect>
            <circle class="eye-blink" cx="136" cy="76" r="4.2" fill="var(--color-ink)"></circle>
            <circle class="eye-blink" cx="164" cy="76" r="4.2" fill="var(--color-ink)"></circle>
            <rect class="char-mouth" x="141" y="92" width="18" height="3" rx="1.5" fill="var(--color-ink)"></rect>
          </g>
        </g>

        <!-- front (left / waving) arm, drawn last so it sits in front of torso -->
        <g class="char-leftArmShoulder limb-pivot">
          <rect x="99" y="124" width="26" height="84" rx="13" fill="var(--color-mustard)"></rect>
          <g class="char-leftArmElbow limb-pivot">
            <rect x="101" y="208" width="22" height="80" rx="11" fill="var(--color-mustard-light)"></rect>
            <circle class="char-leftHand" cx="112" cy="294" r="13" fill="var(--color-skin)"></circle>
          </g>
        </g>

      </g>
    </svg>`;
  }

  /**
   * Renders the rig into a container and returns handles to every
   * joint group, scoped to that container (so multiple instances
   * of the same character never collide).
   */
  function mount(containerEl) {
    containerEl.innerHTML = markup();
    const q = (sel) => containerEl.querySelector(sel);
    return {
      root: q('.char-root'),
      hairBack: q('.char-hairBack'),
      torsoGroup: q('.char-torso-group'),
      neckHead: q('.char-neckhead'),
      mouth: q('.char-mouth'),
      leftArmShoulder: q('.char-leftArmShoulder'),
      leftArmElbow: q('.char-leftArmElbow'),
      leftHand: q('.char-leftHand'),
      rightArmShoulder: q('.char-rightArmShoulder'),
      rightArmElbow: q('.char-rightArmElbow'),
      rightHand: q('.char-rightHand'),
      leftLegHip: q('.char-leftLegHip'),
      leftLegKnee: q('.char-leftLegKnee'),
      rightLegHip: q('.char-rightLegHip'),
      rightLegKnee: q('.char-rightLegKnee'),
    };
  }

  return { markup, mount };
})();
