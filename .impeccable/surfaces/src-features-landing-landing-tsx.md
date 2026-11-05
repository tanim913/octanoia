---
version: 1
slug: "src-features-landing-landing-tsx"
primary_target: "src/features/landing/Landing.tsx"
related_targets: ["src/features/results/ResultsPage.tsx","src/features/test/TestPage.tsx"]
---

# Surface brief: Octanoia site (landing, test, results, read, profile)

Scope: whole web app redesign. Modes: landing = Persuade; test = Operate; results and profile = Experience/Operate; read = Read.
Audience: curious newcomers. Job: learn how their own mind works and why each function scored as it did.
Direction pinned by the user: principles of the David Whyte Experience (Immersive Garden, Awwwards SOTM Dec 2024). Seed: none (direction pinned by the user).

## Direction contract
THESIS: The test is a contemplative journey through eight living pigments. It refuses the quiz template of card grids, progress bars and a verdict badge. The page is a two-tone field where only the eight functions carry colour.
OWN-WORLD:
- Neutral light grey ground (#e4e3e0) with near-black ink (#121212); black night bands for results.
- Watercolour pigment blooms that follow the pointer.
- Eight distinct 3D forms, one per function, in their pigment hue.
- Literata for poem lines and reading; Archivo for interface text.
- Square-ish 6px controls, no cards, no shadows at rest.
STORY:
- The visitor first meets the eight forms, then reads poem-length pauses ("Everyone plays all eight").
- They try a real scene, see the ledger, and begin.
- Results unfold as eight chapters, strongest note first, each saying in plain words why the score is high or low.
FIRST VIEWPORT:
- A large serif title, with the eight forms drifting on the painted field and pigment following the pointer.
- One black "Begin" action and a scroll cue.
SIGNATURE: Pointer-painted watercolour pigments, and eight living 3D forms that recur in every surface (landing, test, results, library, read). The pinned scroll scene crossfades poem lines.
RISK: Two WebGL layers on low-end phones. Mitigate with a single shared View canvas, DPR caps and a static SVG glyph fallback under reduced motion or no WebGL.
