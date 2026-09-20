/**
 * VeritasAI - Advanced Heuristic & NLP Truth Analysis Engine
 */

class NewsDetector {
  constructor(kb = window.KNOWLEDGE_BASE) {
    this.kb = kb;
  }

  /**
   * Main analysis entry point
   * @param {string} text - Article text or headline
   * @param {string} url - Optional URL
   */
  analyze(text = "", url = "") {
    const cleanText = text.trim();
    if (!cleanText && !url) {
      throw new Error("Please provide text or a URL to analyze.");
    }

    // Extract domain if URL provided or found inside text
    const extractedDomain = this.extractDomain(url || this.findUrlInText(cleanText));
    const domainCheck = this.evaluateDomain(extractedDomain);

    // Text metrics
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Sentence segmentation
    const rawSentences = this.segmentSentences(cleanText);

    // Analyze Clickbait & Sensationalism
    const clickbaitMetrics = this.evaluateClickbait(cleanText, words);

    // Analyze Emotional Bias & Polarization
    const emotionMetrics = this.evaluateEmotionalTone(cleanText, words);

    // Analyze Attribution & Source Integrity
    const attributionMetrics = this.evaluateAttribution(cleanText, rawSentences);

    // Analyze Sentence-by-Sentence Breakdown
    const sentenceBreakdown = this.analyzeSentences(rawSentences);

    // Compute composite Truth Index (0 - 100)
    const compositeScore = this.calculateCompositeScore({
      domainCheck,
      clickbaitMetrics,
      emotionMetrics,
      attributionMetrics,
      sentenceBreakdown,
      wordCount
    });

    // Determine Verdict classification
    const verdict = this.getVerdict(compositeScore, domainCheck, clickbaitMetrics);

    // Generate actionable summary & red flags
    const redFlags = this.compileRedFlags({
      domainCheck,
      clickbaitMetrics,
      emotionMetrics,
      attributionMetrics,
      wordCount
    });

    const recommendations = this.getRecommendations(verdict.type);

    return {
      score: compositeScore,
      verdict,
      metrics: {
        clickbait: clickbaitMetrics,
        emotion: emotionMetrics,
        attribution: attributionMetrics,
        domain: domainCheck
      },
      sentenceBreakdown,
      redFlags,
      recommendations,
      stats: {
        wordCount,
        sentenceCount: rawSentences.length,
        readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200))
      }
    };
  }

  extractDomain(urlString) {
    if (!urlString) return null;
    try {
      let formatted = urlString.trim();
      if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
        formatted = "https://" + formatted;
      }
      const parsed = new URL(formatted);
      return parsed.hostname.toLowerCase().replace(/^www\./, "");
    } catch (e) {
      return null;
    }
  }

  findUrlInText(text) {
    const match = text.match(/https?:\/\/[^\s]+/i);
    return match ? match[0] : "";
  }

  evaluateDomain(domain) {
    if (!domain) {
      return {
        domain: null,
        status: "UNSPECIFIED",
        scoreDelta: 0,
        label: "No domain provided",
        description: "Text evaluated independently of publisher registry."
      };
    }

    const { trusted, satire, flagged } = this.kb.domains;

    if (trusted.some(d => domain.includes(d))) {
      return {
        domain,
        status: "TRUSTED",
        scoreDelta: +25,
        label: "Verified Major News Wire / Academic Domain",
        description: `Domain (${domain}) matches indexed high-integrity press standards.`
      };
    }

    if (satire.some(d => domain.includes(d))) {
      return {
        domain,
        status: "SATIRE",
        scoreDelta: -40,
        label: "Known Satire / Humor Publication",
        description: `Domain (${domain}) is an indexed parody publication intended for entertainment.`
      };
    }

    if (flagged.some(d => domain.includes(d))) {
      return {
        domain,
        status: "FLAGGED",
        scoreDelta: -45,
        label: "High-Risk / Flagged Disinformation Domain",
        description: `Domain (${domain}) has a documented history of misleading or unsubstantiated stories.`
      };
    }

    return {
      domain,
      status: "NEUTRAL",
      scoreDelta: 0,
      label: "Unverified / Independent Domain",
      description: `Domain (${domain}) is not in current major press whitelist or blacklist.`
    };
  }

  evaluateClickbait(text, words) {
    const lower = text.toLowerCase();
    const matches = [];

    this.kb.clickbaitPhrases.forEach(phrase => {
      if (lower.includes(phrase)) {
        matches.push(phrase);
      }
    });

    // Count ALL CAPS words (words longer than 2 chars)
    const allCapsWords = words.filter(w => {
      const clean = w.replace(/[^A-Za-z]/g, "");
      return clean.length >= 3 && clean === clean.toUpperCase();
    });

    // Exclamation mark density
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;

    // Clickbait score (0 to 100, where 100 is pure sensationalism)
    let score = (matches.length * 18) + (allCapsWords.length * 4) + (exclamationCount * 6);
    score = Math.min(100, Math.max(0, score));

    return {
      score,
      matches,
      allCapsCount: allCapsWords.length,
      exclamationCount,
      questionCount,
      level: score > 60 ? "CRITICAL" : score > 30 ? "MODERATE" : "MINIMAL"
    };
  }

  evaluateEmotionalTone(text, words) {
    const lower = text.toLowerCase();
    const matches = [];

    this.kb.emotionalWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(lower)) {
        matches.push(word);
      }
    });

    // Emotional Outrage Index (0 to 100)
    let score = matches.length * 15;
    if (text.includes("!!!") || text.includes("???")) score += 20;
    score = Math.min(100, Math.max(0, score));

    return {
      score,
      matches,
      level: score > 50 ? "HIGH POLARIZATION" : score > 20 ? "ELEVATED" : "BALANCED / NEUTRAL"
    };
  }

  evaluateAttribution(text, sentences) {
    const lower = text.toLowerCase();
    const credibleHits = [];
    const vagueHits = [];

    this.kb.credibleAttributionPatterns.forEach(pat => {
      if (lower.includes(pat)) credibleHits.push(pat);
    });

    this.kb.vagueAttributionTriggers.forEach(pat => {
      if (lower.includes(pat)) vagueHits.push(pat);
    });

    // Quote marks check
    const quotes = text.match(/"([^"]+)"|“([^”]+)”/g) || [];

    // Attribution Quality Score (0 to 100, where 100 is excellent transparent sourcing)
    let score = 50 + (credibleHits.length * 15) + (quotes.length * 5) - (vagueHits.length * 12);
    score = Math.min(100, Math.max(0, score));

    return {
      score,
      credibleHits,
      vagueHits,
      quotesCount: quotes.length,
      level: score > 70 ? "ROBUST SOURCING" : score >= 45 ? "STANDARD / PARTIAL" : "UNSUBSTANTIATED"
    };
  }

  segmentSentences(text) {
    if (!text) return [];
    // Split by punctuation followed by whitespace or newline
    const raw = text.split(/(?<=[.?!])\s+/);
    return raw.map(s => s.trim()).filter(s => s.length > 0);
  }

  analyzeSentences(sentences) {
    return sentences.map((sent, index) => {
      const lower = sent.toLowerCase();
      let type = "neutral";
      let reason = "Contextual commentary or standard phrasing.";

      // Check clickbait/sensational in this sentence
      const hasClickbait = this.kb.clickbaitPhrases.some(p => lower.includes(p));
      const hasOutrage = this.kb.emotionalWords.some(w => new RegExp(`\\b${w}\\b`, "i").test(lower));
      const hasVague = this.kb.vagueAttributionTriggers.some(p => lower.includes(p));
      const hasCredible = this.kb.credibleAttributionPatterns.some(p => lower.includes(p));
      const hasCaps = sent.split(/\s+/).filter(w => {
        const clean = w.replace(/[^A-Za-z]/g, "");
        return clean.length >= 3 && clean === clean.toUpperCase();
      }).length >= 2;

      if (hasClickbait || (hasOutrage && (hasCaps || sent.includes("!")))) {
        type = "suspicious";
        reason = "Sensationalist language, clickbait tropes, or aggressive capitalization detected.";
      } else if (hasVague) {
        type = "unverified";
        reason = "Uses vague, anonymous attributions without verifiable citation.";
      } else if (hasCredible || (sent.includes('"') && sent.length > 25)) {
        type = "factual";
        reason = "Contains formal attribution, scientific citations, or direct quotes.";
      }

      return {
        index: index + 1,
        text: sent,
        type, // "factual", "neutral", "unverified", "suspicious"
        reason
      };
    });
  }

  calculateCompositeScore({ domainCheck, clickbaitMetrics, emotionMetrics, attributionMetrics, sentenceBreakdown, wordCount }) {
    // Base score starts at 60 (neutral assumption)
    let score = 60;

    // Sensationalism penalty (-35 to 0)
    score -= (clickbaitMetrics.score * 0.35);

    // Emotion outrage penalty (-25 to +5)
    if (emotionMetrics.score > 40) {
      score -= (emotionMetrics.score * 0.25);
    } else {
      score += 5;
    }

    // Attribution bonus/penalty (+25 to -20)
    const attrDelta = (attributionMetrics.score - 50) * 0.4;
    score += attrDelta;

    // Sentence breakdown weighting
    if (sentenceBreakdown.length > 0) {
      const suspiciousCount = sentenceBreakdown.filter(s => s.type === "suspicious").length;
      const factualCount = sentenceBreakdown.filter(s => s.type === "factual").length;
      
      score -= (suspiciousCount / sentenceBreakdown.length) * 30;
      score += (factualCount / sentenceBreakdown.length) * 20;
    }

    // Domain override/modifier
    score += domainCheck.scoreDelta;

    // Extreme penalties for high clickbait + multiple emotional words
    if (clickbaitMetrics.matches.length >= 2 && emotionMetrics.matches.length >= 2) {
      score = Math.min(score, 25);
    }

    // Clamp score between 2 and 98 to avoid unrealistic absolutes unless known satire
    if (domainCheck.status === "SATIRE") {
      score = 15;
    }

    return Math.round(Math.min(98, Math.max(4, score)));
  }

  getVerdict(score, domainCheck, clickbaitMetrics) {
    if (domainCheck.status === "SATIRE") {
      return {
        label: "SATIRE & PARODY",
        type: "satire",
        badgeClass: "badge-satire",
        color: "#f59e0b",
        icon: "🎭",
        tagline: "Humorous / Parody Content — Not Intended As Factual News",
        summary: "This article originates from or mimics a satire publication. While entertaining, it is not verified factual reporting."
      };
    }

    if (score >= 80) {
      return {
        label: "VERIFIED CREDIBLE",
        type: "verified",
        badgeClass: "badge-credible",
        color: "#10b981",
        icon: "🛡️",
        tagline: "High Epistemic Integrity & Verified Journalistic Standards",
        summary: "Clear attributions, measured vocabulary, and alignment with established scientific or reputable wire reporting."
      };
    } else if (score >= 60) {
      return {
        label: "LIKELY AUTHENTIC",
        type: "authentic",
        badgeClass: "badge-likely",
        color: "#06b6d4",
        icon: "✅",
        tagline: "Generally Reliable With Minor Stylistic Biases",
        summary: "The text demonstrates standard journalistic structure with low sensationalism, though secondary fact-checking is still encouraged."
      };
    } else if (score >= 40) {
      return {
        label: "UNVERIFIED / MIXED CLAIMS",
        type: "mixed",
        badgeClass: "badge-mixed",
        color: "#eab308",
        icon: "⚠️",
        tagline: "Needs Verification — Contains Unsubstantiated Assertions",
        summary: "Presents assertions with vague sourcing or partial emotional spin. Cross-reference with authoritative sources before sharing."
      };
    } else if (score >= 25) {
      return {
        label: "HIGHLY SENSATIONALIZED",
        type: "misleading",
        badgeClass: "badge-misleading",
        color: "#f97316",
        icon: "🚨",
        tagline: "Extreme Clickbait / High Risk of Misinformation",
        summary: "Excessive use of emotional triggers, manipulative headline phrasing, and lack of direct evidence."
      };
    } else {
      return {
        label: "HIGH RISK / FABRICATED HOAX",
        type: "fake",
        badgeClass: "badge-fake",
        color: "#ef4444",
        icon: "🛑",
        tagline: "Disinformation Alert — High Probability of Fabrication",
        summary: "Matches documented conspiracy or hoax templates. Employs urgency pressure, fabricated claims, and anti-scientific rhetoric."
      };
    }
  }

  compileRedFlags({ domainCheck, clickbaitMetrics, emotionMetrics, attributionMetrics, wordCount }) {
    const flags = [];

    if (domainCheck.status === "FLAGGED") {
      flags.push({
        severity: "danger",
        title: "Flagged Domain Origin",
        desc: domainCheck.description
      });
    }

    if (domainCheck.status === "SATIRE") {
      flags.push({
        severity: "warning",
        title: "Satirical Intent",
        desc: "Recognized as satire/parody content."
      });
    }

    if (clickbaitMetrics.matches.length > 0) {
      flags.push({
        severity: "danger",
        title: `Clickbait Triggers Detected (${clickbaitMetrics.matches.length})`,
        desc: `Used viral engagement tropes: "${clickbaitMetrics.matches.slice(0, 3).join('", "')}".`
      });
    }

    if (clickbaitMetrics.allCapsCount > 2) {
      flags.push({
        severity: "warning",
        title: "Excessive Capitalization",
        desc: `${clickbaitMetrics.allCapsCount} words in ALL-CAPS designed to provoke urgency.`
      });
    }

    if (emotionMetrics.matches.length > 1) {
      flags.push({
        severity: "warning",
        title: "Polarized / Outrage Lexicon",
        desc: `Detected loaded emotional language: "${emotionMetrics.matches.slice(0, 3).join('", "')}".`
      });
    }

    if (attributionMetrics.vagueHits.length > 0) {
      flags.push({
        severity: "warning",
        title: "Vague Anonymous Sourcing",
        desc: `Used unverified phrases like: "${attributionMetrics.vagueHits.slice(0, 2).join('", "')}".`
      });
    }

    if (wordCount < 40) {
      flags.push({
        severity: "info",
        title: "Short Sample Size",
        desc: "Short excerpts provide limited linguistic context. Consider pasting the full article for deeper scrutiny."
      });
    }

    if (flags.length === 0) {
      flags.push({
        severity: "success",
        title: "No Major Red Flags Spotted",
        desc: "Vocabulary is measured, objective, and devoid of manipulative engagement bait."
      });
    }

    return flags;
  }

  getRecommendations(verdictType) {
    switch (verdictType) {
      case "fake":
      case "misleading":
        return [
          "Do NOT share or retweet this claim on social channels.",
          "Perform a reverse search on Snopes.com, AP Fact Check, or Reuters Fact Check.",
          "Check if original scientific or government documentation actually exists.",
          "Look for coverage from at least two independent, internationally accredited news organizations."
        ];
      case "satire":
        return [
          "Enjoy the humor, but do not share as genuine factual news.",
          "Check the footer and 'About Us' page of the publication for satire disclaimers."
        ];
      case "mixed":
        return [
          "Search for the specific named individuals or statistics cited in the text.",
          "Distinguish between verified events and opinionated editorial speculation.",
          "Check whether original quotes were stripped of critical context."
        ];
      default:
        return [
          "Cross-verify breaking updates as unfolding events often produce early revisions.",
          "Inspect hyperlinked primary sources to verify data directly.",
          "Maintain healthy digital hygiene and promote responsible information sharing."
        ];
    }
  }
}

window.NewsDetector = NewsDetector;
window.newsDetector = new NewsDetector();
