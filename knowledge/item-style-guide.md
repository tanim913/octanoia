# Octanoia item style guide

Every item in `src/data/items/` must pass these rules. Rules marked **[lint]** are enforced automatically by `src/data/items/__tests__/lint.test.ts`.

## What an item measures
1. **Natural tendency, not "should".** Ask what is effortless, energising, or "feels like me", not what you think is right or have trained yourself to do (Myers p.73; Beebe on ego-syntonic ownership).
2. **Preference, not ability.** No "I'm good at…" items. Myers: preferences are not abilities, and skill can be learned by any type.
3. **One idea per item.** No "and" joining two separate claims.
4. **Self-description, not reputation.** No "others see me as…". Exception: Deep-mode stress items may ask about what people point out to you, because Beebe and Myers both say the shadow is "visible to the partner but not to the possessor".
5. **No absolutes or superpowers.** **[lint]** Banned words: *always, never, everyone, photographic, prophetic, uncanny, manipulate, genius*.
6. **No speed.** No timer, and no wording that equates quick or abstract thinking with being smarter (Myers p.143).

## Function confusions to avoid
| Don't treat… | …as evidence of | Why |
|---|---|---|
| being emotional or crying easily | Feeling | Feeling is evaluation, not affect (Jung p.544; Myers p.192; Thomson p.321) |
| liking abstract ideas | Ti | Abstract vs concrete is not E vs I (Jung p.429); clever ideas are often intuition (Myers p.192) |
| liking concrete things | Te | same as above |
| liking tradition or routine | Si | Si is a personal store of impressions used to check new experience; ISJs can be "diehard liberals" (Thomson p.175) |
| thinking a lot about others' feelings and finding it a burden | Fe | that pattern points to *inferior* Fe (Beebe ch.13) |
| being sociable | Fe or Ne | Extraversion of the dominant gets mistaken for the auxiliary (Beebe ch.13) |
| having hunches about people | Ni or Ne | often Se/Fi observation (Thomson p.199) |
| endorsing an ideal ("harmony matters", "logic matters") | that function | people idealise their *inferior* function (Beebe ch.8), so these go in the `value` facet with half weight |

## Introverted functions
An introvert's dominant function is hidden, even from themselves (Myers pp.13, 22). For Ti, Fi, Si and Ni, ask about inner process, and about what happens "when something important to you is at stake". Don't ask about outward conduct.

## Facets
- `process`: how your mind actually works. Weight 1.0.
- `energy`: what feels like you and what energises or drains you. Weight 1.0.
- `value`: what you care about. Weight 0.5, because people inflate the ideals of their inferior function.
- `stress`: what happens to you under pressure. Weight 0 for preference; it feeds the separate "Under pressure" scale.

## Balance [lint]
- Quick: 6 Likert items per function (3 process, 2 energy, 1 value) and 16 choice items. Each function appears in exactly 8 choice options.
- Deep adds 9 Likert per function (4 process, 2 energy, 1 value, 2 stress) and 24 choice items. Each function appears in exactly 12 more options.
- Each function needs at least one reverse-keyed (negative-load) Likert item per mode.
- Every item needs a `why` (plain-language: what this item listens for) and at least one `sources` entry.
- No duplicate texts.

## Tone
- Warm and concrete, second person ("you").
- Use short scenes and everyday situations: work, friends, a trip, a free afternoon.
- No type jargon in item text. Function names appear only in results.
- Not flattering: every function gets items that describe its less attractive side too.

## Must not sound like Sakinorva [lint]
Octanoia items are original scenes. They never paraphrase Sakinorva's flat "You are/You have…" statements.

- `src/data/items/__tests__/sakinorvaReference.ts` holds the Sakinorva items quoted in `sakinorva-analysis.md`. It is used only for this check and is never shown in the app.
- The lint test fails if any Octanoia item shares more than 40% of its content words (Jaccard overlap, stop-words removed) with any of them.
- Style difference to keep:
  - Sakinorva states a trait ("You are the life of the party").
  - Octanoia sets a scene and asks what you'd naturally do or how much it fits ("Friday evening, nothing planned. What sounds best?").
- Avoid starting Likert items with "You are…" or "You have…".
