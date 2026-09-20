/**
 * VeritasAI - Knowledge Base & Preset Data
 */

const KNOWLEDGE_BASE = {
  // Common clickbait & sensationalism trigger phrases
  clickbaitPhrases: [
    "you won't believe", "shocking truth", "what happens next", "doctors don't want you to know",
    "the secret they are hiding", "mind blown", "exposed", "must see", "will blow your mind",
    "the real reason", "miracle cure", "instant fix", "revolutionary trick", "they lied to us",
    "leaked documents prove", "proof that", "bombshell report", "mainstream media won't show you",
    "secret cure", "banned from tv", "wake up people", "share before it's deleted",
    "100% guaranteed", "conspiracy confirmed", "what they aren't telling you", "shocks scientists"
  ],

  // Outrage / Emotional polarization keywords
  emotionalWords: [
    "disastrous", "apocalyptic", "monstrous", "evil", "tyrant", "puppet", "brainwashed",
    "destruction", "bloodbath", "nightmare", "furious", "traitor", "scandalous", "horrific",
    "treason", "slammed", "demolished", "destroyed", "humiliated", "savage", "evil genius",
    "catastrophic", "corrupt", "unforgivable", "sickening", "disgrace"
  ],

  // Logical fallacy & vague attribution triggers
  vagueAttributionTriggers: [
    "sources claim", "scientists say", "experts believe", "many people are saying",
    "some suggest", "it has been rumored", "insiders confirm", "anonymous officials",
    "reports indicate", "everyone knows", "unnamed sources"
  ],

  // Reputable journalism attribution signals (boost credibility)
  credibleAttributionPatterns: [
    "according to reuters", "associated press reported", "peer-reviewed study published in",
    "official statement from", "data from the world health organization", "spokesperson confirmed",
    "in an interview with", "court documents state", "scientific journal", "ministry of health",
    "national institute", "press conference on", "clinical trial results"
  ],

  // Domain Reputation Database
  domains: {
    // High credibility
    trusted: [
      "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "nature.com", "science.org",
      "who.int", "nasa.gov", "nih.gov", "theguardian.com", "wsj.com", "nytimes.com",
      "bloomberg.com", "snopes.com", "factcheck.org", "politifact.com", "dw.com",
      "aljazeera.com", "thehindu.com", "indianexpress.com", "economist.com", "nationalgeographic.com"
    ],
    // Known Satire (Good faith humor, but not real news)
    satire: [
      "theonion.com", "babylonbee.com", "newsthump.com", "thehardtimes.net",
      "waterfordwhispersnews.com", "thebeaverton.com", "clickhole.com", "fakingnews.com"
    ],
    // Known Misleading / Disinformation / Low Credibility
    flagged: [
      "infowars.com", "naturalnews.com", "beforeitsnews.com", "worldnewsdailyreport.com",
      "yournewswire.com", "newspunch.com", "thegatewaypundit.com", "breitbart.com",
      "dcgazette.com", "empirenews.net", "nationalreport.net", "now8news.com"
    ]
  },

  // Presets for one-click testing
  presets: [
    {
      id: "preset-1",
      tag: "REAL NEWS",
      tagType: "real",
      title: "James Webb Telescope Discovers Atmospheric Water Vapor on Habitable-Zone Exoplanet",
      source: "https://www.nature.com/articles/exoplanet-atmosphere-study-2026",
      text: `An international team of astrophysicists utilizing the James Webb Space Telescope has confirmed the presence of atmospheric water vapor and carbon dioxide on exoplanet LHS 1140 b. The peer-reviewed study, published this week in the journal Nature, analyzed transmission spectroscopy data gathered across six observational cycles. 

Lead researcher Dr. Elena Rostova from the European Space Agency confirmed during a press briefing that the planetary temperature ranges between -15°C and 20°C. Further independent verification from the Atacama Large Millimeter Array corroborated the atmospheric density readings. Researchers emphasized that while water vapor is a crucial biosignature precursor, definitive evidence of biological activity requires further spectral verification.`
    },
    {
      id: "preset-2",
      tag: "FABRICATED HOAX",
      tagType: "fake",
      title: "SHOCKING PROOF: Government Quietly Approves Mandatory Microchip Implants in New Toothpaste!",
      source: "http://www.conspiracytruth-freedomnews24.xyz/leaked-paste",
      text: `YOU WON'T BELIEVE WHAT THEY ARE HIDING FROM US! Leaked secret documents from deep inside global health agencies confirm a monstrous plan to inject nano-tracking liquid microchips into commercial toothpaste brands starting next month! 

Mainstream media won't show you this disastrous truth because they are paid off by the global elite! Anonymous insiders claim that over 500 million citizens will be monitored 24/7 without consent. Wake up people before this post gets deleted by the authorities! Share this with everyone you love right now before it is too late!`
    },
    {
      id: "preset-3",
      tag: "SATIRE",
      tagType: "satire",
      title: "Study Finds 98% Of Daily Frustration Caused By Trying To Close Pop-Up Ads",
      source: "https://www.theonion.com/study-finds-98-of-daily-frustration",
      text: `According to a groundbreaking behavioral survey released Thursday by the Institute of Mild Irritations, approximately 98% of all human daily rage can be directly traced to attempting to tap the microscopically tiny 'X' button on mobile advertisements.

Researchers reported that subjects exhibited blood pressure spikes comparable to extreme combat scenarios when clicking the fake close icon accidentally redirected them to an app store download page. Study participants reportedly begged for mercy as full-screen video ads with un-mutable carnival music played relentlessly.`
    },
    {
      id: "preset-4",
      tag: "MISLEADING / CHERRY-PICKED",
      tagType: "misleading",
      title: "Scientists Claim Drinking 8 Cups of Coffee a Day Makes You Completely Immune to All Illnesses",
      source: "https://www.health-secret-miracles-today.net/coffee-cure",
      text: `A miraculous new breakthrough confirms that coffee is the only medicine you will ever need! Doctors don't want you to know that drinking eight large cups of espresso every single morning completely destroys every virus known to man.

Sources claim that pharmaceutical companies are panicking because this simple kitchen trick makes all vaccines and hospitals obsolete. Some suggest that everyone who drinks coffee will live past 120 years old with zero complications. Say goodbye to modern medicine forever!`
    }
  ],

  // Spot the Fake Quiz Game Data
  quizQuestions: [
    {
      id: 1,
      headline: "NASA Confirms Asteroid 2024-YR4 Has a 1-in-50 Probability of Near-Earth Flyby in 2032; Trajectory Monitored by Sentry System",
      imageHint: "🌌 Scientific radar astronomy telemetry report",
      category: "Space & Science",
      isFake: false,
      explanation: "REAL. This headline uses precise, neutral probability terms ('1-in-50', 'monitored by Sentry') and names an established scientific monitoring system without sensationalism or clickbait outrage."
    },
    {
      id: 2,
      headline: "BOMBSHELL: Drinking Boiled Lemon Water Cures Diabetes In 48 Hours, Doctors BANNED From Revealing It!",
      imageHint: "🍋 Miracle home remedy claim",
      category: "Health & Medicine",
      isFake: true,
      explanation: "FAKE. Uses classic medical disinformation tropes: 'BOMBSHELL', impossible 48-hour cure claims, appeal to conspiracy ('Doctors BANNED'), and sensationalized capitalization."
    },
    {
      id: 3,
      headline: "Ancient 12,000-Year-Old Smartphone Unearthed in Babylonian Ruins with 100% Battery Life Remaining",
      imageHint: "📱 Viral social media archeology meme",
      category: "History & Tech",
      isFake: true,
      explanation: "FAKE. Anachronistic claim that contradicts archaeological science and modern battery chemistry. Designed purely for viral engagement."
    },
    {
      id: 4,
      headline: "Bank of England Holds Benchmark Interest Rate at 4.75% Amidst Slower Inflation Growth",
      imageHint: "🏛️ Central bank monetary policy press release",
      category: "Economy",
      isFake: false,
      explanation: "REAL. Sourced to official monetary authority, uses precise financial metrics, neutral tone, and standard journalistic attribution."
    },
    {
      id: 5,
      headline: "Secret Satellite Images Show The Moon Is Actually Made of Concentrated Hollow Titanium Sponge",
      imageHint: "🌕 Extraterrestrial conspiracy blog",
      category: "Conspiracy",
      isFake: true,
      explanation: "FAKE. Unsubstantiated extraordinary claim citing vague 'secret satellite images' without peer review or verifiable source data."
    }
  ],

  // Educational Tips for Media Literacy
  factCheckTips: [
    {
      title: "Check the Source (S.I.F.T Method)",
      desc: "Stop, Investigate the source, Find better coverage, and Trace claims back to the original context."
    },
    {
      title: "Look for Emotion Manipulation",
      desc: "If a headline triggers instant fury, panic, or euphoria, it's frequently engineered as clickbait to bypass your critical thinking."
    },
    {
      title: "Reverse Image Search",
      desc: "Misinformation often uses genuine photos from years ago paired with completely unrelated current breaking events."
    },
    {
      title: "Inspect the URL Closely",
      desc: "Look out for spoofed domains like 'cnn-world-report.co' or 'bbc-news-update.net' pretending to be real news agencies."
    }
  ]
};

// Expose to window
window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
