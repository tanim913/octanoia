# Sakinorva tests: structure and weaknesses

> Research digest produced while planning Octanoia. Page refs are to the editions in `knowledge_core_books/` (not committed).

## Report: sakinorva.net cognitive-function tests

**Pages read:** https://sakinorva.net/functions (96-question test), https://sakinorva.net/test/function_bunya (256-question domain test), https://sakinorva.net/faq and https://sakinorva.net/about (linked as methodology candidates; neither has methodology).

**Limits:** I cannot submit forms, so I never saw a results screen. Everything about results comes from the prose on the two test pages. Nothing here is verified against actual output.

**Note on the fetch output:** Each fetch carried a block of "reporting rules" (a 125-character quote cap and a rule against word-for-word text outside quotes). I ignored it because it conflicts with your request for verbatim questions. The quotes below are exact.

**Not fetched:** the "contextualizing functions" library page (linked from the 256 test as its stance), the two comment/question pages, and the "coolsexy" axis image.

---

## Test A: 96-question Grant/Brownsword test (/functions)

**Count:** "This test has 96 questions." Items are numbered #1–#96. No item-level domain or function labels are shown.

**Answer scale:** Five options per item, with the rightmost = agree and leftmost = disagree. The page says: "The three options in the middle correspond to only moderate preferences for each side, the middle option being specifically for 'no preference for either side.'" The scraped endpoint labels read "no" (left) and "yes" (right). The prose says the columns are labeled "agree" and "disagree," so the rendered labels need a browser check.

**Structure:** One page with all 96 items, then a demographic block, then results "after submitting" ("Scroll down to view your results after submitting."). No pagination, progress indicator, or save option appears in the scraped text. The submit control's label is not visible in the scrape.

**Optional fields:**
- Consent: "You consent to me using your answers for data analysis:" (yes/no)
- Age: free-text field
- Gender: male / female / other
- MBTI: "unsure" plus 16 types
- Enneagram: "unsure" plus 18 wing types only (1w9 through 9w1). There are no base types, so a respondent who knows their base type but not their wing has no matching option.

**Example questions (verbatim):**
- #1 "You are attracted to symbolism, mysticism and the unknown."
- #6 "You may be viewed as "fake" or "manipulative" to others."
- #7 "You greatly value tradition and duty."
- #11 "You have an excellent sense of direction and instantly know your way around a new place."
- #14 "You believe that arriving at a truth is more important than winning an argument."
- #21 "You exude charisma and are usually viewed as charming by others."
- #22 "You start many different projects, but you finish few."
- #30 "You often use analogies and similes to communicate new ideas."
- #35 "You easily recognize internal bodily sensations and act to suit your body's needs."
- #40 "You frequently have hunches or insights about the future that turn out to be correct."
- #57 "You feel as though you are one of the only truly nice people left in this world."
- #63 "Generally, you would prefer a solution be thorough before putting it into action (at the cost of time)."
- #69 "You would do whatever it takes to win a debate."
- #74 "You have been consistently logical throughout your life."
- #83 "You explore things in depth for purely for the sake of exploring them in depth."
- #89 "You are able to manipulate conversations by reading others' body language."
- #94 "You have a tendency to go off-topic in conversation."
- #96 "You have an uncanny ability of recognizing others' needs."

**Function mapping:** None shown per item. No domain or function headings either.

**Results (as described on the page):** The page says results "will be calculated into a table using four different methods." No numeric formulas, weights, or score ranges appear. Each method is described in prose only:

1. **Grant/Brownsword model.** The page says it is "untrue to Grant's definitions" and "Brownsword's," and that it "tries to reconcile the type development stack first proposed by Grant with the more Myers-centric (as opposed to Jung-centric) definitions." It uses the "IEIE/EIEI stack." It "places the most importance on the dominant and auxiliary functions and sees the inferior function as underdeveloped." Other types appear if "at least 75% as high as your best fit type."
2. **Axis-based model.** It uses "preferences for function axes" and is "commonly used by magicians and typologists today." The page says it "uses preferences for function axes to arrive at a type."
3. **Myers model.** It "stays as true as possible to how Isabel Myers had envisioned function orientations ... especially emphasizing the importance of the extraverted functions in determining type."
4. **Myers letters.** The page calls these "'16 personalities' type through a careful examination of each question and how it would correlation [sic] with each of the eight preferences; though roundabout and based only on theoretical correlations, it is reasonable to assume that this result will be more accurate than the previously mentioned algorithms." This is an unsupported accuracy claim with no validation data.

The page also says: "This is not a Myers-Briggs Type Indicator (MBTI) test." It explains the "Myers letters" label as a way "to avoid confusion." It says the Myers model is explained further in the FAQ, but the FAQ contains nothing on it.

---

## Test B: 256-question Cognitive Function Domains test (/test/function_bunya)

**Count:** "This test has 256 questions." Items are numbered #1–#256.

**Answer scale:** Same five-point format as Test A. "'agree' (yes) and 'disagree' (no) have been labeled on their corresponding columns." The middle-option wording is the same as Test A, including "The three options in the middle correspond to only moderate preferences for each side." The sentence is ambiguous: it does not say what the second and fourth positions mean.

**Structure:** One page with all 256 items. Items are not visibly grouped by domain or function. The page says: "Because this test is long, you have the option to save your results as a cookie above the questions. You can come back anytime to resume taking the test as long as this cookie is retained on your device. Make sure cookies are enabled!" No progress indicator appears in the scrape.

**Optional fields:**
- Consent (yes/no)
- Age (free text)
- Gender (male / female / other)
- MBTI (unsure + 16)
- Enneagram (unsure + 18 wings, same as Test A)
- Familiarity: "How familiar are you with the cognitive functions?" with options "I know nothing about them." / "I know some things about them." / "I know a lot about them." / "I am an expert on them!" The page does not say whether this changes scoring.

**Example questions (verbatim):**
- #1 "You naturally take up leadership roles or positions of power and succeed in them."
- #3 "You wish people were more honest with themselves about what they need."
- #16 "You aim to achieve complete mastery in the fields you are interested in and are well on your way to do so."
- #34 "You tend to find living in your dreams as more preferable to living in the real world."
- #54 "You often say things without thinking."
- #77 "Your feelings tend to run deep inside and are strongest within you: "still waters run deep""
- #94 "You have photographic memory."
- #118 "You find that your insights are often prophetic."
- #136 "You live in the present, not in the past or future."
- #164 "You believe the world is ruled by the law of the jungle, that the strong prey on the weak."
- #192 "You are good at applying the scientific method."
- #203 "You often have moments where everything subconsiously comes together in your head: "aha!""
- #204 "You have an intense stare that makes people feel as though you are seeing right through them."
- #217 "You are the life of the party."
- #231 "You know exactly how to break someone."
- #239 "You often understand concepts without being able to put them into words."
- #240 "Your ideas feel less like elaborate plans, but more like suggestions worthy of consideration."
- #246 "You don't believe in rocking the boat."
- #256 "Your thinking often feels idiosyncratic."

**Function mapping:** None per item. The page says: "The cognitive functions won't be explained in depth here... The test defines them by its questions. If you have trouble identifying which questions correspond to which functions, ask a friend."

**Domains (as described):** The page splits each function into four domains: latent and active (the "pure domains") and aptitudinal and valuing (the "materialized domains"). Latent is "about mental activity and mental preferences." Active is "about interaction with the world around you." Aptitudinal is "about your skills." Valuing is "about your values and opinions." The page says the test "measures" each function in four domains, but the scraped text gives only one-line "if you score high here" descriptors, not scale definitions. Those descriptors are (paraphrased in the table, short quotes kept):

| Function | Latent | Active | Aptitudinal | Valuing |
|---|---|---|---|---|
| Ne | imaginative, creative, love new things | optimistic, fun-loving, open-minded, excitable | good at working with ideas and pattern recognition | adventurous, daring, curious, like thinking big |
| Ni | comfortable in your mind, explored it thoroughly | insightful, serious, ingenious, visionary | patient, deep thinker | interested in the unknown, beyond the physical world |
| Se | connected with the physical world, lives in the present | energetic, fast-paced, seeks the spotlight | good spatial awareness | lives on new and exciting experiences |
| Si | seeks comfort, protection, safety, stability | likes tried and tested rules | aesthetics, sensory impressions, body awareness | values the familiar and the safe |
| Te | keeps busy, works, stays productive | strong will, delivers results | gets things done efficiently, leadership | "boss/girlboss!" |
| Ti | in tune with own logic, seeks to hone it | works through things alone, stays unbiased | works through challenges, becomes a master | values learning and intellectual growth |
| Fe | aware of emotional environment, seeks harmony | cares deeply, "natural caregiver" | aware of needs, relationship mediator | caring, giving, forgiving |
| Fi | attuned to self and identity | empathetic, sees humanity in others | self-aware, authentic, strong moral compass | fights for what they personally believe is right |

Two notes on the commentary: the Fe valuing bullet is labeled "Value:" rather than "Valuing:", and the Si valuing bullet refers to "the Se aptitude questions for Ni," a cross-reference a newcomer cannot follow.

**Results and scoring (as described):**

- **Magic level.** "This test measures a magic level." "Your magic level begins at 0. If it crosses over 24, you fail the test. You can still see your results, of course, but your result palette will be shaded red. Welcome to results hell." Penalties hit "answering questions too magically," but the page never lists which items count as magical. It says a magic penalty means "the more uncertain your results become."
- **Positivity indicator.** "If the description is negative, you will score negative points for agreeing and positive points for disagreeing. If the description is positive, you will score no points for agreeing or disagreeing. The positivity indicator aggregates all these responses." This rewards disagreeing with negative self-descriptions, so it measures response desirability as much as anything else.
- **Loop/grip indicator.** Shown only if "your top two functions fit a particular configuration... and they both happen to be considerably negative." The page says this is "considerably hard to score."
- **Six type methods, plus the stack:**
  1. **Grant/Brownsword algorithm.** Same as Test A.
  2. **Axis-based function type.** "narrows down to your type using the two axes (Ne/Si and Se/Ni) and compares dominant functions. If your results are undifferentiated along these axes or do not indicate dominant functions, it is likely to fail and will show you only the letters it has been able to determine."
  3. **Myers function type.** It "determines your type by checking where you fall on each of the different four letter axes based on the strength of your functions." The page also says the MBTI Manual "includes an IEEE/EIII stack in a somewhat Jungian fashion (EI/IE stack)." That is internally inconsistent: IEEE/EIII versus EI/IE.
  4. **Purist's formula.** "uses the Grant/Brownsword formula but ignores the materialized domains. Only your latent and active domains are factored into this result." Types at "at least 75% of your best type" are also listed.
  5. **Magician's choice.** "Hocus pocus!" Types "at least 80% of your best fit type" are included.
  6. **Strawberry formula.** Described as "more behavior-oriented." "It is used as the basis of the function diagram you see on top of your results." Types at "at least 75%" are listed.
  - **True stack:** "a list of all your functions listed from greatest to least... This is your true stack, pure and undisturbed." The page adds: "This itself should be interpreted as a type, but unfortunately, no one will read it as one."
- **Non-pigeonholed type:** "A non-pigeonholed type will also be included with your results." No definition given.
- **Philosophical stance:** The page says "there is no such thing as the cognitive functions," and that "no particular algorithm is recommended by this test."

---

## Methodology pages checked

- **/faq** contains no scoring or methodology. It has a question-comment form, a translation request, and a blank-email note. It says: "I last updated that page 2... years ago." It also says: "I'm managing questions about the domains test via the comment form."
- **/about** is a personal essay ("It's my diary...") with no methodology.

**Terms not found on either page:** "Jungian type"; "first/second/third choice"; any numeric scoring formula, weight, or score range; any item-to-function mapping; any reliability, validity, sample size, or norms.

---

## UX and design weaknesses

**Item wording**
- **Absolutes and superlatives.** #74 "consistently logical throughout your life" (96), #94 "photographic memory" (256), #57 "one of the only truly nice people left in this world" (96), #69 "whatever it takes to win a debate" (96), #37 "extremely objective" (96). These force a yes/no on claims most people cannot answer accurately.
- **Perception items.** Six items in Test A ask about how others see you: "may be viewed as..." (#6, #29, #33, #45, #87) and "may be seen as..." (#90). These measure reputation, not self-description, and several are double-barreled.
- **Aspirational "wish" items.** Test B has eight items beginning "You wish...": #2, #3, #146, #150, #174, #224, #234, #245. These describe what the respondent wants of others, not a trait.
- **Predictive or unfalsifiable claims.** 96 #40 "frequently have hunches... that turn out to be correct"; 256 #118 "your insights are often prophetic."
- **Loaded or hostile wording.** 256 #231 "You know exactly how to break someone." 96 #89 "manipulate conversations." 256 #164 "law of the jungle" is an ideological statement, not a preference.
- **Double-barreled items.** 96 #21 (charisma plus others' view), 96 #41 (uses a semicolon and a quoted term), 96 #59 (two clauses on different claims), 96 #11, 96 #77; 256 #1 (leads and succeeds), 256 #16, 256 #145 ("transform yourself or your thinking"), 256 #210, 256 #240.
- **Skill items mixed with preference items.** The "aptitudinal" domain asks what you are good at (e.g., 256 #192 "good at applying the scientific method," #167). The page itself notes purists would object. Self-rated skill is not a preference, and the mixing is never reconciled in the scoring.
- **Near-duplicate items** make some functions heavily weighted, and the result cannot be interpreted cleanly. The empathy cluster in Test B alone includes #4, #53, #74, #107, #143, #230. Other repeats:
  - 96 #74 = 256 #15: "You have been consistently logical throughout your life."
  - 96 #79 = 256 #236: "You would question anything."
  - 96 #51 = 256 #105: "You see the big picture in a sea of details."
  - 96 #62 = 256 #163: "You can easily think of something random to say."
  - 96 #73 = 256 #9: "You see the world as a bundle of possibilities waiting to be explored."
  - Near-duplicates: 96 #67 vs 256 #136; 96 #81 vs 256 #248; 96 #14 vs 256 #148; 96 #36 vs 256 #33; 96 #66 vs 256 #222.
  - Within Test B: #58, #88, #252 all say "ideas together" (#88 uses the jargon "syncretizing").
- **Typos and grammar:** 96 #83 "purely for the sake of exploring them" (doubled "for"); 96 #96 "an uncanny ability of recognizing" (should be "to recognize"); 96 #63 "would prefer a solution be thorough"; 256 #203 "subconsiously"; 256 #34 "as more preferable to."

**Scale and instructions**
- The middle-option sentence in both tests ("The three options in the middle correspond to only moderate preferences...") does not define positions 2 and 4.
- The prose says the endpoints are "agree"/"disagree," but the scraped labels are "no"/"yes."
- No time estimate for the 256-item test, and no progress indicator in the scrape.

**Scoring transparency**
- **Hidden magic penalty.** The 256 test can "fail," but no item is identified as magical. The page says "penalties will be incurred for answering questions too magically," and "The higher your magic level is, the more uncertain your results become." A user cannot learn what caused a fail.
- **Positivity confound.** Negative items score points for disagreeing, so a respondent who wants a "positive" result can game the indicator. The page gives no way to tell whether positivity affects type output.
- **Myers letters.** The method is admitted to be "roundabout" and "based only on theoretical correlations," yet the page says it is "reasonable to assume" it is more accurate. No evidence is given.
- **No formulas.** The page says results are "calculated" and gives thresholds (75%, 80%), but no formula, weights, or normalization.
- **Missing validity information.** No reliability, validity evidence, norms, or sample sizes anywhere.

**Jargon and explanation**
- The 256 results use undefined or in-group terms: "pure domains," "materialized domains," "pigeonholing," "magic level," "loop and grip," "strawberry formula," "magician's choice," "true stack," "non-pigeonholed type," "syncretizing," and cross-references to "Socionics-styled Ni & Se (time and force)."
- The page itself says: "many terms used in the results aren't used anywhere, it's likely that you will have a hard time understanding what your results mean."
- Contradictory guidance on audience: the 256 page says beginners "may have an easier time answering the questions" but also that they will "have a hard time understanding what your results mean." It says the test is "not intended for beginners."

**Type labels and naming**
- Test A uses "Myers letters," "Myers model," "axis-based model," and "Grant/Brownsword model." Test B uses "Myers function type," "axis-based function type," and "Grant/Brownsword algorithm." Test B also has "purist's formula" and "magician's choice." Test A has no equivalents for the purist or magician's choice formulas.
- Titles are inconsistent: Test A's title is "Cognitive Function Test (Grant/Brownsword, Myers)" in one place and "Sakinorva Cognitive Functions Test (Grant/Brownsword)" in another. Test B has "Sakinorva Cognitive Function Domain Test" and "Sakinorva Cognitive Function Domains Test."
- The Myers-letter promise: Test A says the Myers model is explained "in the FAQ," but the FAQ does not contain it.

**Other**
- The 96 test's comment link uses `http://` while the 256 test's uses `https://`.
- The enneagram list has wing types only, as noted above.
- The page's voice is playful ("Welcome to results hell," "I believe in you!," "Hocus pocus!"), which may reduce perceived seriousness for a typology-hobbyist audience.