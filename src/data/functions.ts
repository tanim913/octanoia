import type { Fn } from '../engine/model'

export interface Quote {
  text: string
  source: string
}

export interface FunctionProfile {
  fn: Fn
  name: string
  /** Octanoia's musical nickname. */
  note: string
  color: string
  kind: 'perceiving' | 'judging'
  attitude: 'extraverted' | 'introverted'
  oneLine: string
  definition: string
  looksLike: string[]
  notThis: string[]
  underPressure: string
  story: string
  quotes: Quote[]
}

export const PROFILES: Record<Fn, FunctionProfile> = {
  Se: {
    fn: 'Se',
    name: 'Extraverted Sensing',
    note: 'The Live Note',
    color: '#c4572f',
    kind: 'perceiving',
    attitude: 'extraverted',
    oneLine: 'Meeting the world as it is, right now, through the body.',
    definition:
      'Se takes in concrete reality at full volume: textures, sounds, movement, the mood of a room. It learns by doing, adjusts in real time, and only feels something is real once it has been touched, tried or tasted.',
    looksLike: [
      'Learning a sport, dish or instrument by jumping in and repeating until it is felt',
      'Reacting quickly and practically when something happens in front of you',
      'Reading how things are going from people’s visible reactions',
      'Enjoying quality: good food, good fabric, a great view',
      'Losing interest once a situation is “in hand”',
    ],
    notThis: [
      'Not mere thrill-seeking. At its best Se is a refined, appreciative presence.',
      'Not Si: Se loses itself in what is happening; Si finds itself in it, through what it already knows.',
    ],
    underPressure:
      'As someone’s weakest function, Se shows up as sudden overindulgence, fixating on physical details, or feeling the body “take over” in stress.',
    story:
      'A mechanic working on an engine: the material changes, their hands change with it, and thought and action move together. That loop of acting and noticing is Se.',
    quotes: [
      { text: 'No other human type can equal the extraverted sensation-type in realism.', source: 'Jung, Psychological Types, p.457' },
      { text: 'the difference between talking about it and getting to know it intimately', source: 'Beebe, Energies and Patterns, ch.1' },
    ],
  },
  Si: {
    fn: 'Si',
    name: 'Introverted Sensing',
    note: 'The Remembered Note',
    color: '#8e3b22',
    kind: 'perceiving',
    attitude: 'introverted',
    oneLine: 'Checking new experience against a rich inner store of what you’ve lived.',
    definition:
      'Si keeps a personal, detailed archive of impressions: how things felt, what worked, how your body reacted. Each new experience is steadied by comparing it with that archive. It is not about tradition. It is about trusting what you have actually experienced.',
    looksLike: [
      'Noticing when something is different from how it was before',
      'Remembering detailed facts in the areas you care about',
      'Being very aware of comfort, fatigue, hunger and other inner bodily states',
      'Reading carefully and wanting to be sure before moving on',
      'Building a deep, offbeat collection or expertise over years',
    ],
    notThis: [
      'Not conservatism. Si-led people can hold very unconventional views; they just hold them steadily.',
      'Not “good memory” in general. Si remembers selectively, around what matters to you.',
    ],
    underPressure:
      'As someone’s weakest function, Si shows up as neglecting the body until it protests, or a sudden anxious need for things to stay put.',
    story:
      'Five people leave the same movie and each remembers something different. Si is the reason: it keeps what mattered to you, not what was objectively there.',
    quotes: [
      { text: 'They look on tempests and are never shaken.', source: 'Myers, Gifts Differing, p.102' },
      { text: 'All things flow away like water; the ground of our self-experience remains.', source: 'Thomson, Personality Type, p.171' },
    ],
  },
  Ne: {
    fn: 'Ne',
    name: 'Extraverted Intuition',
    note: 'The Branching Note',
    color: '#2f8a9e',
    kind: 'perceiving',
    attitude: 'extraverted',
    oneLine: 'Seeing what a situation could become.',
    definition:
      'Ne treats the present as a springboard. From a few cues it sees a pattern and many possible futures: what this person, idea or project could turn into. Once the possibility is pinned down, attention leaps to the next one.',
    looksLike: [
      'Jumping to “what if…” before someone has finished describing how things are',
      'Starting many things; finishing is harder than beginning',
      'Seeing potential in people and ideas before others do',
      'Feeling trapped by situations that are fully settled',
      'Connecting ideas from unrelated areas',
    ],
    notThis: [
      'Not fickleness. Ne is loyal to the possibility, not to the plan.',
      'Not Ni: Ne branches outward into many options; Ni converges inward on one meaning.',
    ],
    underPressure:
      'As someone’s weakest function, Ne shows up as catastrophising: imagining every way things could go wrong.',
    story:
      'A traffic light only you can see: green, develop this now; red, drop it; yellow, careful. Others can’t see your signal, so your timing looks random to them. That is Ne.',
    quotes: [
      { text: 'He has a keen nose for things in the bud pregnant with future promise.', source: 'Jung, Psychological Types, p.464' },
      { text: 'But Intuition can be dead wrong and still feel like knowledge.', source: 'Thomson, Personality Type, p.198' },
    ],
  },
  Ni: {
    fn: 'Ni',
    name: 'Introverted Intuition',
    note: 'The Converging Note',
    color: '#24506f',
    kind: 'perceiving',
    attitude: 'introverted',
    oneLine: 'Sensing the one pattern or meaning beneath many things.',
    definition:
      'Ni watches the background of the mind, where images and patterns form. It reframes problems, notices how labels shape what we see, and arrives at insights whole, often with conviction and without a step-by-step explanation.',
    looksLike: [
      'Solving a dilemma by redefining the question rather than picking an answer',
      'Having an image or metaphor arrive that sums up a situation',
      'Struggling to put a strong sense of “where this is going” into words',
      'Losing interest in something once it becomes obvious or popular',
      'Neglecting practical upkeep while absorbed in an idea',
    ],
    notThis: [
      'Not psychic powers. Ni is a pattern-sense that can be wrong.',
      'Not Fi: Ni “sees” the image behind a situation; Fi “feels” whether it is right.',
    ],
    underPressure:
      'As someone’s weakest function, Ni shows up as vague foreboding, suspicion of hidden motives, or seeing conspiracies where none exist.',
    story:
      'At the beach, one friend sunbathes, one packs extra towels, one imagines building an amusement park. The Ni friend asks why a tan became attractive in the first place.',
    quotes: [
      { text: 'Introverted Intuitions are not really ideas. They’re like trains at the edge of articulated knowledge.', source: 'Thomson, Personality Type, p.229' },
      { text: 'the impossible takes a little longer, but not much', source: 'Myers, Gifts Differing, p.109' },
    ],
  },
  Te: {
    fn: 'Te',
    name: 'Extraverted Thinking',
    note: 'The Measured Note',
    color: '#c39a2e',
    kind: 'judging',
    attitude: 'extraverted',
    oneLine: 'Organising the world by shared, impersonal standards.',
    definition:
      'Te turns conclusions into plans, steps, rules and measurements that work for everyone. Its test of truth is outside the self: evidence, results, what can be checked. It runs things, and it builds while it critiques.',
    looksLike: [
      'Turning a shared concern into steps, roles and deadlines',
      'Wanting evidence or a measurable result',
      'Applying the same rule to everyone, including yourself',
      'Expressing care by solving the problem',
      'Getting impatient with inefficiency and half-measures',
    ],
    notThis: [
      'Not coldness. Te types have died for principles; they just show feeling less.',
      'Not Ti: Te asks “does it work and can we agree on it?”; Ti asks “is it internally consistent?”',
    ],
    underPressure:
      'As someone’s weakest function, Te shows up as sudden harsh criticism, rigid rule-citing, or frantic over-organising.',
    story:
      'A child drops a spoon from a high chair a thousand times to learn that it falls. Te takes that principle out of the kitchen and uses it everywhere: a portable rule.',
    quotes: [
      { text: 'Freedom is management so adept that external reality all but takes care of itself.', source: 'Thomson, Personality Type, p.259' },
      { text: 'By this formula are good and evil measured, and beauty and ugliness determined.', source: 'Jung, Psychological Types, p.435' },
    ],
  },
  Ti: {
    fn: 'Ti',
    name: 'Introverted Thinking',
    note: 'The Tuned Note',
    color: '#7d6420',
    kind: 'judging',
    attitude: 'introverted',
    oneLine: 'Making things fit an inner model of how they really work.',
    definition:
      'Ti checks ideas against an internal sense of coherence. It defines, names and refines until things hang together, and in practical settings it works as tacit, body-level reasoning: balancing many variables at once without spelling them out.',
    looksLike: [
      'Rebuilding someone else’s explanation in your own terms before accepting it',
      'Hunting for the exact word or definition',
      'Wanting a diagram of how the whole thing works rather than steps',
      'Not caring what the consensus is if the logic doesn’t hold',
      'Struggling to explain how you knew; it felt like instinct',
    ],
    notThis: [
      'Not “being abstract”. Ti can be very hands-on, as in a mechanic’s feel for an engine.',
      'Not Te: Ti doesn’t need others to agree, only for it to cohere.',
    ],
    underPressure:
      'As someone’s weakest function, Ti shows up as nit-picking, cold over-analysis of people, or harsh “that makes no sense” judgments.',
    story:
      'Rounding second base at the top of the ninth: the rulebook is Te, but deciding whether to run, weighing speed, the throw and the score in a flash, is Ti.',
    quotes: [
      { text: 'Intensity is his aim, not extensity.', source: 'Jung, Psychological Types, p.485' },
      { text: 'I don’t care what the truth turns out to be, but I want it to hang together.', source: 'Myers, Gifts Differing, p.65' },
    ],
  },
  Fe: {
    fn: 'Fe',
    name: 'Extraverted Feeling',
    note: 'The Shared Note',
    color: '#c25f74',
    kind: 'judging',
    attitude: 'extraverted',
    oneLine: 'Weighing what matters by its effect on the people and bonds around you.',
    definition:
      'Fe evaluates by relationship: who is this to me, what does this moment call for, how will this land with the group? It reads and uses the shared language of gestures, rituals and courtesies that make relationships visible. It is reasoning, not emotion.',
    looksLike: [
      'Adjusting what you say to what the moment and the people need',
      'Thinking out loud with others to work out what you think',
      'Remembering the gestures that matter: birthdays, thank-yous, check-ins',
      'Steering a group away from open conflict',
      'Finding it hard to say no',
    ],
    notThis: [
      'Not fake or people-pleasing. Fe’s judgments are genuine; they are tuned to the shared situation.',
      'Not Fi: Fe adapts to shared values; Fi measures against private ones.',
    ],
    underPressure:
      'As someone’s weakest function, Fe shows up as feeling unappreciated, hypersensitivity to others’ reactions, or sudden emotional outbursts.',
    story:
      'Your friend’s basement floods. For the cashier who mentions it you offer sympathy; for your best friend you bring a mop. Same event, different relationship, different right response. That is Fe.',
    quotes: [
      { text: 'For Feeling types, talking is doing.', source: 'Thomson, Personality Type, p.331' },
      { text: 'It is feeling which serves as the bridge between one human being and another.', source: 'Myers, Gifts Differing, p.66' },
    ],
  },
  Fi: {
    fn: 'Fi',
    name: 'Introverted Feeling',
    note: 'The Inner Note',
    color: '#7f3049',
    kind: 'judging',
    attitude: 'introverted',
    oneLine: 'Measuring things against a deeply personal sense of what is right.',
    definition:
      'Fi judges by an inner ideal shaped by lived experience: is this fitting, is this true to what matters? It is intense rather than expressive, often quiet until a core value is touched, and then very firm.',
    looksLike: [
      'Being flexible on most things and immovable on a few',
      'Caring for people through quiet, practical gestures rather than words',
      'Noticing misuse of power quickly',
      'Needing your work to mean something to you',
      'Holding back praise you don’t really feel',
    ],
    notThis: [
      'Not selfishness. Fi’s values are often deeply humane.',
      'Not emotional display. Fi often looks calm on the outside.',
    ],
    underPressure:
      'As someone’s weakest function, Fi shows up as feeling unappreciated, sudden moral outrage, or taking criticism very personally.',
    story:
      'Cooking a sauce without a recipe, tasting and adjusting toward a flavour you know in your bones is right. That inner standard, tuned by experience, is Fi.',
    quotes: [
      { text: 'Introverted Feeling … bypasses structural considerations and puts human value first.', source: 'Thomson, Personality Type, p.368' },
      { text: 'They wear their warm side inside, like a fur-lined coat.', source: 'Myers, Gifts Differing, p.96' },
    ],
  },
}
