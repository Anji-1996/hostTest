# Character assets

The current character is generated entirely in code: see
`js/animations/character.js` (`CharacterRig.markup()`). It renders one
rigged SVG with these logical parts, all reused across the hero,
workspace stage, projects rail, and contact section:

- `char-hairBack`
- `char-torso` (+ `char-torso-group` wrapper used for bobbing/leaning)
- `char-neckhead` (head, hair front, eyes, mouth)
- `char-leftArmShoulder` → `char-leftArmElbow` → `char-leftHand`
- `char-rightArmShoulder` → `char-rightArmElbow` → `char-rightHand`
- `char-leftLegHip` → `char-leftLegKnee`
- `char-rightLegHip` → `char-rightLegKnee`

## Swapping in real artwork

**Option A — Replace the SVG shapes directly.** Open
`CharacterRig.markup()` and swap the `<rect>`/`<circle>` primitives
for your own `<path>` artwork, keeping the same class names and the
same nesting (elbow inside shoulder, knee inside hip). Every
animation in `hero.js`, `workspace.js`, `projects.js` and
`contact.js` targets those classes/joints, so as long as the
hierarchy and pivot points (top-center of each part, since we use
`transform-box: fill-box; transform-origin: 50% 0%`) stay the same,
no animation code needs to change.

**Option B — Sprite sheet / Lottie.** Replace `CharacterRig.mount()`
with your own loader (e.g. `lottie.loadAnimation(...)`), and instead
of driving individual joint rotations, expose a small API — e.g.
`character.setPose('walk', phase)`, `character.setPose('sit', t)` —
and call that from the same scroll-progress values already computed
in `workspace.js` (`walkPhase`, sit/type/stand `t` values, etc). The
scroll-to-progress math doesn't change, only what you do with it.

Drop exported files here (e.g. `character.json` for Lottie, or
`character-sheet.png` for a sprite sheet) and reference them from
`character.js`.
