// Per-type story notes, paraphrased from Thomson's growth logic (Personality Type, chs. 10–21)
// and Myers' type portraits. Original wording; page refs in knowledge/thomson.md Part C.

export interface TypeNote {
  /** One-line portrait in plain language. */
  portrait: string
  /** How the tertiary misleads under strain (Thomson’s “tertiary misfire”). */
  stuck: string
  /** Growth through the auxiliary/secondary function. */
  growth: string
}

export const TYPE_NOTES: Record<string, TypeNote> = {
  ESTP: {
    portrait: 'Lives in the moment and reads situations fast; acts, adjusts, and enjoys the game.',
    stuck: 'May reach for a big, charming public persona or grand gestures, and mistake being busy with people for being close to them.',
    growth: 'Slowing down to work out, by their own inner logic, what they actually want to bring to life rather than what they can get from it.',
  },
  ESFP: {
    portrait: 'Warm, present and responsive; brings people into shared experience and makes things enjoyable.',
    stuck: 'May grab a ready-made theory or cause and throw themselves into it as a new arena.',
    growth: 'Developing an inner code: knowing what really matters to them, pacing themselves and saying no.',
  },
  ISTJ: {
    portrait: 'Steady, thorough and grounded in what has proven true; keeps commitments when nobody is watching.',
    stuck: 'May treat their own priorities as unconditional and enforce them rigidly on others.',
    growth: 'Accepting that their view is one view among many, and engaging with other people’s logic and goals.',
  },
  ISFJ: {
    portrait: 'Attentive, loyal and caring; remembers what matters to people and quietly keeps things running.',
    stuck: 'May sacrifice themselves to a “larger scheme” or lost cause and keep real intimacy at arm’s length.',
    growth: 'Turning their natural care for others toward their own needs as well.',
  },
  ENTP: {
    portrait: 'Quick, inventive and energised by possibilities; tests ideas by playing with them out loud.',
    stuck: 'May use charm tactically to win support, and feel badly offended when it doesn’t work.',
    growth: 'Applying their sharp inner logic to their own behaviour: self-discipline in service of their ideas.',
  },
  ENFP: {
    portrait: 'Enthusiastic and imaginative; sees potential in people and champions what could be.',
    stuck: 'May insist others respect their priorities, judge critics as controlling, and find it hard to apologise.',
    growth: 'Grounding possibilities in personal values: choosing limits and keeping promises that matter to them.',
  },
  INTJ: {
    portrait: 'Independent and visionary; reframes problems and pursues a long-range insight with determination.',
    stuck: 'May idealise their ideas and hold real relationships at a distance as not quite worthy.',
    growth: 'Bringing the vision into the world through practical structure: bills, schedules, other people’s logic.',
  },
  INFJ: {
    portrait: 'Insightful and quietly determined; senses meanings beneath the surface and cares about their effect on people.',
    stuck: 'May retreat into a truth they feel can’t be expressed, and point out others’ shortcomings from a distance.',
    growth: 'Bringing their insight back into community through warmth and shared purpose.',
  },
  ESTJ: {
    portrait: 'Organised and decisive; turns goals into plans and holds everyone, themselves included, to clear standards.',
    stuck: 'May fixate on negative possibilities and quietly keep others dependent on them.',
    growth: 'Checking in with what genuinely matters to them, and accepting life’s irrational, untidy side.',
  },
  ENTJ: {
    portrait: 'Strategic and driven; sees what could be improved and organises people to get there.',
    stuck: 'May chase intense experiences, or act out “real feelings” impulsively as if that were authenticity.',
    growth: 'Letting insight soften certainty: doubting the absoluteness of logic and valuing untidy experience.',
  },
  ISTP: {
    portrait: 'Cool, capable and hands-on; understands how things work by working with them.',
    stuck: 'May see hypocrisy everywhere and drift toward a cynical, slightly suspicious stance.',
    growth: 'Engaging more fully with unfamiliar situations and people, adapting their skill to new contexts.',
  },
  INTP: {
    portrait: 'Curious and precise; builds models of how things fit together and follows ideas for their own sake.',
    stuck: 'May become vigilant about health, food or environment as a stand-in for inner unrest.',
    growth: 'Seeing themselves as part of the bigger picture: letting their ideas meet the world and other people.',
  },
  ESFJ: {
    portrait: 'Warm, conscientious and community-minded; makes sure people are included and cared for.',
    stuck: 'May feel an urgent need to change everything right now, even behind people’s backs.',
    growth: 'Accepting their own needs and doubts, not only everyone else’s.',
  },
  ENFJ: {
    portrait: 'Encouraging and perceptive; brings out the best in people and rallies them around shared ideals.',
    stuck: 'May reach for an escape hatch: blurting things out or longing to break free of obligations.',
    growth: 'Turning their insight inward, reflecting on their own experience and not only on others’.',
  },
  ISFP: {
    portrait: 'Gentle, observant and quietly principled; expresses deep values through action and craft.',
    stuck: 'May adopt an alternative stance as a shield and resist anything that feels like being co-opted.',
    growth: 'Engaging with the concrete world as it is, letting life flow through without losing their values.',
  },
  INFP: {
    portrait: 'Idealistic and deeply caring; measures life against an inner sense of what is truly worthwhile.',
    stuck: 'May avoid any situation that demands compromise, narrowing their world to stay safe.',
    growth: 'Using imagination outwardly: building toward their ideals instead of only defending them.',
  },
}
