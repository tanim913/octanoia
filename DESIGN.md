---
name: Octanoia
description: The eight functions of your mind, as a contemplative journey through eight living pigments.
colors:
  ground: "#e4e3e0"
  surface: "#d9d7d3"
  surface-2: "#cdcac5"
  band: "#c9c5be"
  ink: "#121212"
  muted: "#4f4c48"
  night: "#0e0e0e"
  night-2: "#1d1c1b"
  night-ink: "#e4e3e0"
  night-muted: "#a9a49d"
  good: "#3f6a3a"
  bad: "#9c3f2a"
  se: "#c4572f"
  si: "#8e3b22"
  ne: "#2f8a9e"
  ni: "#24506f"
  te: "#c39a2e"
  ti: "#7d6420"
  fe: "#c25f74"
  fi: "#7f3049"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 6.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2rem, 1.3rem + 3.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  reading:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.68
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  md: "6px"
spacing:
  margin: "clamp(20px, 3vw, 40px)"
  section: "clamp(96px, 12vw, 200px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#2b2a28"
  button-quiet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-light:
    backgroundColor: "{colors.night-ink}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
  answer-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  answer-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
---

# Octanoia design system

## Overview
Octanoia is a contemplative journey through eight living pigments. It adapts the principles of the David Whyte Experience (Immersive Garden; Awwwards Site of the Month, Dec 2024): a two-tone field, poem-length pauses, a pointer-responsive watercolour, and a reading library. It does not reuse that site's assets or text. Only the eight cognitive functions carry colour. Everything else is neutral grey ground and near-black ink, with black night bands for results and moments of focus.

The signature is the **eight living forms**. Each function has its own three.js shape, and it recurs on every surface: hero, picker, test progress, results chapters, cast, library and reading. A **watercolour field** behind the site blooms pigment wherever the pointer moves.

| Function | Form | What the shape says |
|---|---|---|
| Se | rippling body | presence |
| Si | stacked strata | layered memory |
| Ne | branching seed | possibilities |
| Ni | converging spiral | one meaning |
| Te | ordered lattice | shared order |
| Ti | precise crystal | inner model |
| Fe | ring of links | bonds |
| Fi | core inside a shell | private ideal |

## Colors
Use the **Restrained** strategy. The neutral ground `#e4e3e0` and ink `#121212` carry the interface. The eight function pigments are the only hues. Hue encodes the function and shade encodes the attitude: lighter means extraverted, deeper means introverted. Pigments are data and identity, never chrome. Status colours (`good`, `bad`) appear only in score ledgers. Text selection uses Ni blue, and the caret uses Ne.

## Typography
**Source Serif 4** carries the voice: display titles, headings, poem lines, leads, answer questions and the whole reading column. It is used with optical sizing at weight 400. It replaced Literata on 2026-11-06, because the user found Literata too sharp ("edgy"); keep display type soft rather than thin. **Hanken Grotesk** carries the interface: navigation, controls, labels, numbers and metadata. Numbers use tabular figures.
- Headings use `text-wrap: balance`; reading text uses `pretty`.
- The reading measure is about 66ch at 1.68 line height.
- The display line-reveal mask pads its bottom by 0.2em so descenders are never clipped.

## Layout
- One pair of outer margins, `clamp(20px, 3vw, 40px)`.
- Sections sit 96–200px apart.
- Long pages alternate light ground, black night bands, and one pinned pause where three lines crossfade.
- Results use a sticky side index of the eight notes beside one chapter per function. The reading view uses a sticky chapter outline beside the text column.

## Elevation & Depth
Surfaces are flat. Depth comes from tone steps (ground, surface, surface-2, band) and from the 3D forms themselves. No shadows rest on any element. The forms render in one fixed transparent canvas above the page, using drei `View` boxes that track their DOM elements. The watercolour field is a second fixed canvas behind everything.

## Shapes
One radius, 6px, on panels, controls and answer options. The pause indicators are thin bars. A coloured left bar is used only as a 3px inset in two places: the role note in result chapters and blockquotes in reading.

## Components
- **NoteForm:** a living function form, with an SVG glyph fallback under reduced motion or no WebGL.
- **Constellation:** the eight forms on a ring, with axis partners opposite. It is grey while the test is in progress and coloured and labelled on results. Its labels are DOM buttons projected from 3D anchors.
- **Answer options:** Likert scale and A–D choices.
- **FunctionChapter:** tier, meaning, the function's role in the best-fit type, "why it scored high or low" answer rows, practice tip, and all answers.
- **LocalNotice:** a not-signed-in warning, with download.
- **Reading article:** an article with outline, progress bar and previous/next links.

## Do's and Don'ts
- **Do** keep colour on the eight pigments only. **Do** pair every 3D form with its 2D glyph fallback.
- **Do** explain every number in plain words beside it.
- **Don't** use eyebrows above headings, gradient text, glass, card grids of icon and heading, hard offset shadows, or monospace labels.
- **Don't** put text over a 3D form, or let the watercolour bloom under the dark bands.
