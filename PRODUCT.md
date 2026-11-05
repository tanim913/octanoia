# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Mainly curious newcomers: people who have heard of MBTI or "personality types" but not of cognitive functions. They come to learn something true about how their own mind works. Typology enthusiasts are welcome too, but plain language and learning come before jargon.

## Product Purpose
Octanoia is a free cognitive-function self-assessment, plus a library for learning about the functions. It measures the eight Jungian function-attitudes (Se, Si, Ne, Ni, Te, Ti, Fe, Fi). Success means the user understands **why** each function scored as it did, sees type as a spectrum rather than a box, and keeps coming back to learn and to retake the test over time.

## Positioning
- Built as a better alternative to sakinorva.net's tests. Sakinorva uses opaque algorithms, jargon and flat, absolute statements.
- Octanoia asks scene-based questions grounded in four named books.
- It publishes its full scoring formula and the item-to-function map.
- It shows a ledger of the answers that raised or lowered each function.
- It presents ranked type fits with reasons, and says plainly when two types are too close to call.

## Operating Context
- People take the test alone, on a phone or desktop, in about 12 minutes (Quick, 64 items) or about 30 (Deep, 160 items).
- They read their results, explore the library, and retake the test months later to compare.
- Results stay in the browser unless the user signs in with Google (Supabase), which is planned but not yet connected.

## Capabilities and Constraints
- **Stack:** Vite, React, TypeScript, react-three-fiber/three.js, zustand and supabase-js. Static hosting on GitHub Pages under `/octanoia/`, with hash routing and PKCE auth.
- **Scoring engine:** pure functions in `src/engine/`, specified in `knowledge/scoring-model.md`. It includes the acquiescence correction, facet weights, a per-function clarity measure, and type fit against Beebe's 8-position stacks.
- **Item bank:** enforced by a lint test. The test checks balance, banned absolutes, required `why` notes and sources, and that no item resembles a Sakinorva question.
- **Honest limits:**
  - The test is not psychometrically validated.
  - Thomson's brain-hemisphere model may appear only as a labelled metaphor.
  - Results stored only on the device can be lost if browser data is cleared, and users must be told this.

## Brand Commitments
- **Name:** Octanoia. **Tagline:** "the eight functions of your mind".
- **Governing metaphor:** eight notes of an octave, so everyone plays all eight. The eight functions also appear as a constellation.
- **Note colours by function family:** hue = function (sensing, intuition, thinking, feeling), and shade = attitude (extraverted lighter, introverted deeper).
- **Design reference chosen by the user:** the David Whyte Experience (Immersive Garden, Awwwards Site of the Month, Dec 2024). Adapt its principles, not its assets or text.
- **Voice:** warm, plain, second person, never flattering, never boxing people in.

## Evidence on Hand
- **Source books:** Jung's *Psychological Types*, Myers' *Gifts Differing*, Thomson's *Personality Type: An Owner's Manual* and Beebe's *Energies and Patterns in Psychological Type*. They live in `knowledge_core_books/`, are copyrighted, and are never committed.
- **Digests:** in `knowledge/`.
- **Archival images:** in `public/img/`, with credits in `public/img/credits.json`. Jung around 1910, the Burghölzli, Doppelmayr's 1730 star chart, and a Wellcome medieval chant manuscript.
- **Absences:** no testimonials, user counts, validation studies or press. These must never be invented.

## Product Principles
1. **Show the working.** Every number traces back to the answers that produced it.
2. **A spectrum, not a box.** Give ranked fits, clarity and context, never a verdict.
3. **Teach while measuring.** The test and the results double as an introduction to the functions.
4. **Grounded and cited.** Claims come from the four books, quotes stay short, and all other prose is original.
5. **The user's data is theirs.** It stays local by default, with clear warnings about what is and isn't saved.

## Accessibility & Inclusion
- The test must be fully usable by keyboard (1–5 and A–D shortcuts).
- 3D always has a 2D fallback under `prefers-reduced-motion` or when WebGL is missing.
- Body text keeps high contrast.
