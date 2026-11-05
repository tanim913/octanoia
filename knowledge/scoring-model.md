# Octanoia scoring model (v1)

This is the single source of truth for how answers become scores. The public "How scoring works" page in the app restates it in plain language. Code: `src/engine/`.

## 1. Answers
- **Likert items:** five anchors, mapped to r ∈ {−2, −1, 0, +1, +2} ("Not me" … "Very me"). Every Likert item is answered.
- **Choice items:** pick one of 4 options, or "none of these fit" (the item is then skipped entirely).

## 2. Acquiescence correction (Likert only)
Some people agree with most statements regardless of content. To remove that:

    mean = average r over all answered Likert items
    r_adj = r − mean

The results page shows `mean` ("you tend to agree by +0.4; we subtracted that"). Choice items are immune, since you pick one option over the others.

## 3. Item contributions
Each item loads on one or more functions (`load`, usually +1, or negative for reverse-keyed items).

- **Likert:** `c = w(facet) × load × r_adj`
  - Facet weights: `process` 1.0, `energy` 1.0, `value` 0.5, `stress` 0 (stress feeds §7 instead).
- **Choice:** the chosen option gives `+1.5 × load` to its function(s). Each of the 3 unchosen options gives `−0.5 × load`. A choice item therefore sums to zero; picking at random has no expected effect.

## 4. Function score (0–100, 50 = neutral)
For each function f, with only preference facets counted:

    S       = Σ c                                   (all contributions to f)
    maxUp   = Σ the largest positive c each item could have given f
              (Likert: 2·w·|load|; choice: 1.5·|load| if f was an option)
    maxDown = Σ the largest negative magnitude each item could have given f
              (Likert: 2·w·|load|; choice: 0.5·|load| if f was an option)
    score   = 50 + 50 · S / maxUp     if S ≥ 0
              50 + 50 · S / maxDown   if S < 0
    then clamped to [0, 100]

100 means every answer pushed the function up as far as it could go, 0 means as far down as it could go, and 50 means the answers cancelled out or were neutral.

## 5. Ledger and clarity
- **Ledger:** every contribution is stored with its item, so the results page can list the answers that raised or lowered each function.
- **Clarity:** `clarity(f) = |Σ c| / Σ |c|`, from 0 to 1 (0 if there are no contributions). It answers "how consistently did your answers point the same way?" Low clarity means less differentiated, not "balanced" (Jung pp.514–515; Myers p.11).

## 6. Type fit
Each of the 16 types has an 8-position stack (Beebe; see `beebe.md` A.3). The template gives each function a weight by its position:

| Position | 1 dominant | 2 auxiliary | 3 tertiary | 4 inferior | 5–8 shadow |
|---|---|---|---|---|---|
| Weight | 1.0 | 0.8 | 0.4 | 0.1 | 0.3 each |

- Positions 5–8 get one shared neutral weight because the books disagree about them. Thomson treats some of them as fairly available "alternatives"; Beebe treats them as defensive shadow roles.
- **fit(type)** = Pearson correlation between the user's 8 scores and the type's template. Displayed fit % = round(max(0, r) × 100).
- Types are ranked by r. The top 3 are shown with the gap between #1 and #2.
- **Too close to call:** if r1 − r2 < 0.05, the UI says so, names the functions that differ between the two stacks, and offers a Sharpen follow-up.

## 7. Under pressure (stress facet)
- Stress items describe how a function erupts under pressure, typically as someone's inferior. Each function's stress score uses the same formula as §4, but only over stress items.
- These scores are never added to preference scores.
- **Corroboration:** for each top type, the UI reports whether the stress score of its inferior function is above 60, which supports that type.
- **Tiebreak:** when the top two are too close to call, the one whose inferior has the higher stress score is listed first, and the UI says that this was the reason.

## 8. Lenses
- **Jung:** the dominant function, the top function of the best fit.
- **Myers:** the 4-letter code of the best fit.
- **Beebe:** the user's functions laid out as a cast of 8 roles, using the best-fit stack.
- **Thomson axes:** the four opposite pairs Ni/Se, Ne/Si, Ti/Fe, Te/Fi, shown as score differences. The left/right-brain grouping (left: Te Fe Si Ni; right: Se Ne Ti Fi) appears as a metaphor only. It comes from Niednagel's "brain typing" and is not established neuroscience.

## 9. Versioning
Every stored result keeps `testVersion` and the raw answers, so any old result can be re-scored when items change.
