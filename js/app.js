/**
 * VeritasAI - Main UI Controller & Interactivity Hub
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const inputTabButtons = document.querySelectorAll(".input-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const articleTextInput = document.getElementById("articleTextInput");
  const articleUrlInput = document.getElementById("articleUrlInput");
  const scanBtn = document.getElementById("scanBtn");
  const clearBtn = document.getElementById("clearBtn");
  const charCounter = document.getElementById("charCounter");
  const scannerStatus = document.getElementById("scannerStatus");
  const resultsContainer = document.getElementById("resultsContainer");
  const presetsGrid = document.getElementById("presetsGrid");
  const historyList = document.getElementById("historyList");
  const emptyHistory = document.getElementById("emptyHistory");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");

  // Gauge & Result Elements
  const gaugeCircle = document.getElementById("gaugeCircle");
  const gaugeScoreText = document.getElementById("gaugeScoreText");
  const verdictBadge = document.getElementById("verdictBadge");
  const verdictTitle = document.getElementById("verdictTitle");
  const verdictSummary = document.getElementById("verdictSummary");
  const clickbaitBar = document.getElementById("clickbaitBar");
  const clickbaitVal = document.getElementById("clickbaitVal");
  const emotionBar = document.getElementById("emotionBar");
  const emotionVal = document.getElementById("emotionVal");
  const attributionBar = document.getElementById("attributionBar");
  const attributionVal = document.getElementById("attributionVal");
  const domainStatusTag = document.getElementById("domainStatusTag");
  const domainDesc = document.getElementById("domainDesc");
  const redFlagsList = document.getElementById("redFlagsList");
  const recommendationsList = document.getElementById("recommendationsList");
  const claimsHighlightBox = document.getElementById("claimsHighlightBox");
  const claimFilterButtons = document.querySelectorAll(".claim-filter-btn");
  const copyReportBtn = document.getElementById("copyReportBtn");
  const printReportBtn = document.getElementById("printReportBtn");

  // Quiz Elements
  const quizContainer = document.getElementById("quizContainer");
  const quizCategory = document.getElementById("quizCategory");
  const quizHeadline = document.getElementById("quizHeadline");
  const quizHint = document.getElementById("quizHint");
  const quizRealBtn = document.getElementById("quizRealBtn");
  const quizFakeBtn = document.getElementById("quizFakeBtn");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizExplanation = document.getElementById("quizExplanation");
  const quizNextBtn = document.getElementById("quizNextBtn");
  const quizScoreCount = document.getElementById("quizScoreCount");
  const quizProgress = document.getElementById("quizProgress");

  // State
  let currentScanResult = null;
  let activeClaimFilter = "all";
  let quizIndex = 0;
  let quizScore = 0;
  let activeTab = "text";

  // Initialize
  initPresets();
  initQuiz();
  renderHistory();
  setupLiveFeed();

  // Tab switching
  inputTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.soundEngine.playClick();
      inputTabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      const targetPane = document.getElementById(`tab-${activeTab}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Character counter
  if (articleTextInput) {
    articleTextInput.addEventListener("input", () => {
      const len = articleTextInput.value.length;
      const words = articleTextInput.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      charCounter.textContent = `${len} characters | ${words} words`;
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      window.soundEngine.playClick();
      if (articleTextInput) articleTextInput.value = "";
      if (articleUrlInput) articleUrlInput.value = "";
      charCounter.textContent = "0 characters | 0 words";
      resultsContainer.classList.add("hidden");
    });
  }

  // Scan Button Trigger
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      handleScan();
    });
  }

  function handleScan(customText = null, customUrl = null) {
    let text = customText !== null ? customText : (articleTextInput ? articleTextInput.value : "");
    let url = customUrl !== null ? customUrl : (articleUrlInput ? articleUrlInput.value : "");

    if (!text.trim() && !url.trim()) {
      alert("Please paste article text or enter a news URL to verify.");
      return;
    }

    // Enter Scanning State
    window.soundEngine.playScanPulse();
    scanBtn.disabled = true;
    scanBtn.innerHTML = `<span class="spinner"></span> SCANNING REAL-TIME VECTORS...`;
    scannerStatus.classList.remove("hidden");
    resultsContainer.classList.add("hidden");

    // Scroll to status
    scannerStatus.scrollIntoView({ behavior: "smooth", block: "center" });

    // Simulate multi-stage scanning animation for high-tech aesthetic
    const statusSteps = [
      "Parsing linguistic features and syntactic density...",
      "Analyzing sensationalism, clickbait, and capitalization patterns...",
      "Querying domain reputation registry and peer-reviewed journals...",
      "Synthesizing multi-vector truth index..."
    ];

    let stepIdx = 0;
    const statusTextEl = scannerStatus.querySelector(".scanner-text");
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < statusSteps.length && statusTextEl) {
        statusTextEl.textContent = statusSteps[stepIdx];
        window.soundEngine.playScanPulse();
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      try {
        const result = window.newsDetector.analyze(text, url);
        currentScanResult = result;
        renderResults(result, text, url);
        saveToHistory(result, text, url);

        if (result.score >= 60) {
          window.soundEngine.playSuccess();
        } else {
          window.soundEngine.playWarning();
        }
      } catch (err) {
        console.error(err);
        alert("Analysis error: " + err.message);
      } finally {
        scanBtn.disabled = false;
        scanBtn.innerHTML = `<span>⚡</span> ANALYZE FOR FAKE NEWS`;
        scannerStatus.classList.add("hidden");
      }
    }, 1800);
  }

  // Render Full Results
  function renderResults(result, text, url) {
    resultsContainer.classList.remove("hidden");
    resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });

    // Animate Circular SVG Gauge
    const score = result.score;
    const circumference = 2 * Math.PI * 54; // r=54 in svg
    const offset = circumference - (score / 100) * circumference;

    gaugeCircle.style.strokeDasharray = `${circumference}`;
    gaugeCircle.style.strokeDashoffset = `${circumference}`;
    
    // Set color based on score
    let strokeColor = "#10b981"; // green
    if (result.verdict.type === "satire") strokeColor = "#f59e0b";
    else if (score < 30) strokeColor = "#ef4444";
    else if (score < 50) strokeColor = "#f97316";
    else if (score < 75) strokeColor = "#06b6d4";

    gaugeCircle.style.stroke = strokeColor;

    // Trigger transition
    setTimeout(() => {
      gaugeCircle.style.strokeDashoffset = `${offset}`;
    }, 50);

    // Number counter animation
    animateScoreCounter(score);

    // Verdict Badge & Summary
    verdictBadge.className = `verdict-badge ${result.verdict.badgeClass}`;
    verdictBadge.innerHTML = `<span>${result.verdict.icon}</span> ${result.verdict.label}`;
    verdictTitle.textContent = result.verdict.tagline;
    verdictTitle.style.color = strokeColor;
    verdictSummary.textContent = result.verdict.summary;

    // Breakdown Metrics
    // 1. Clickbait (Lower is better)
    const cbScore = result.metrics.clickbait.score;
    clickbaitBar.style.width = `${cbScore}%`;
    clickbaitBar.style.backgroundColor = cbScore > 50 ? "#ef4444" : cbScore > 20 ? "#f59e0b" : "#10b981";
    clickbaitVal.textContent = `${cbScore}% (${result.metrics.clickbait.level})`;

    // 2. Emotional Polarization (Lower is better)
    const emScore = result.metrics.emotion.score;
    emotionBar.style.width = `${emScore}%`;
    emotionBar.style.backgroundColor = emScore > 50 ? "#ef4444" : emScore > 20 ? "#f59e0b" : "#10b981";
    emotionVal.textContent = `${emScore}% (${result.metrics.emotion.level})`;

    // 3. Attribution (Higher is better)
    const atScore = result.metrics.attribution.score;
    attributionBar.style.width = `${atScore}%`;
    attributionBar.style.backgroundColor = atScore > 65 ? "#10b981" : atScore >= 40 ? "#06b6d4" : "#ef4444";
    attributionVal.textContent = `${atScore}% (${result.metrics.attribution.level})`;

    // 4. Domain
    const dom = result.metrics.domain;
    domainStatusTag.textContent = dom.label;
    domainStatusTag.className = `domain-badge status-${dom.status.toLowerCase()}`;
    domainDesc.textContent = dom.description;

    // Render Red Flags List
    redFlagsList.innerHTML = "";
    result.redFlags.forEach(flag => {
      const li = document.createElement("li");
      li.className = `flag-item severity-${flag.severity}`;
      li.innerHTML = `
        <div class="flag-icon">${flag.severity === 'danger' ? '🚨' : flag.severity === 'warning' ? '⚠️' : flag.severity === 'success' ? '✅' : 'ℹ️'}</div>
        <div class="flag-content">
          <strong>${flag.title}</strong>
          <p>${flag.desc}</p>
        </div>
      `;
      redFlagsList.appendChild(li);
    });

    // Render Recommendations
    recommendationsList.innerHTML = "";
    result.recommendations.forEach(rec => {
      const li = document.createElement("li");
      li.innerHTML = `<span>✓</span> <div>${rec}</div>`;
      recommendationsList.appendChild(li);
    });

    // Render Claim Highlighter
    renderClaimHighlights(result.sentenceBreakdown);
  }

  function animateScoreCounter(target) {
    let current = 0;
    const duration = 1200;
    const stepTime = 20;
    const increment = Math.ceil(target / (duration / stepTime)) || 1;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      gaugeScoreText.textContent = `${current}%`;
    }, stepTime);
  }

  // Claim Highlighter & Filter Handling
  function renderClaimHighlights(sentences) {
    claimsHighlightBox.innerHTML = "";
    if (!sentences || sentences.length === 0) {
      claimsHighlightBox.innerHTML = "<p class='text-muted'>No text provided for sentence-level breakdown.</p>";
      return;
    }

    sentences.forEach(s => {
      const span = document.createElement("span");
      span.className = `claim-chunk claim-${s.type}`;
      span.dataset.type = s.type;
      span.setAttribute("title", s.reason);
      span.innerHTML = `${s.text} <sup class="claim-tag">${s.type.toUpperCase()}</sup> `;
      claimsHighlightBox.appendChild(span);
    });

    filterClaims(activeClaimFilter);
  }

  claimFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.soundEngine.playClick();
      claimFilterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeClaimFilter = btn.dataset.filter;
      filterClaims(activeClaimFilter);
    });
  });

  function filterClaims(filter) {
    const chunks = claimsHighlightBox.querySelectorAll(".claim-chunk");
    chunks.forEach(c => {
      if (filter === "all") {
        c.style.display = "inline";
        c.style.opacity = "1";
      } else if (filter === "suspicious") {
        if (c.dataset.type === "suspicious" || c.dataset.type === "unverified") {
          c.style.display = "inline";
          c.style.opacity = "1";
        } else {
          c.style.opacity = "0.2";
        }
      } else if (filter === "factual") {
        if (c.dataset.type === "factual") {
          c.style.display = "inline";
          c.style.opacity = "1";
        } else {
          c.style.opacity = "0.2";
        }
      }
    });
  }

  // Initialize Presets Grid
  function initPresets() {
    if (!presetsGrid) return;
    presetsGrid.innerHTML = "";

    window.KNOWLEDGE_BASE.presets.forEach(p => {
      const card = document.createElement("div");
      card.className = "preset-card";
      card.innerHTML = `
        <div class="preset-header">
          <span class="preset-tag tag-${p.tagType}">${p.tag}</span>
          <span class="preset-cta">Test This ⚡</span>
        </div>
        <h4 class="preset-title">${p.title}</h4>
        <p class="preset-excerpt">${p.text.substring(0, 140)}...</p>
      `;

      card.addEventListener("click", () => {
        window.soundEngine.playClick();
        // Switch to text tab and populate
        const textTabBtn = document.querySelector('[data-tab="text"]');
        if (textTabBtn) textTabBtn.click();

        if (articleTextInput) {
          articleTextInput.value = p.text;
          const len = p.text.length;
          const words = p.text.trim().split(/\s+/).length;
          charCounter.textContent = `${len} characters | ${words} words`;
        }
        if (articleUrlInput) {
          articleUrlInput.value = p.source;
        }

        handleScan(p.text, p.source);
      });

      presetsGrid.appendChild(card);
    });
  }

  // Copy & Print Report
  if (copyReportBtn) {
    copyReportBtn.addEventListener("click", () => {
      if (!currentScanResult) return;
      window.soundEngine.playClick();
      const textSummary = `🛡️ VeritasAI Fact Verification Report\n` +
        `Truth Index: ${currentScanResult.score}%\n` +
        `Verdict: ${currentScanResult.verdict.label} - ${currentScanResult.verdict.tagline}\n` +
        `Clickbait Index: ${currentScanResult.metrics.clickbait.score}%\n` +
        `Sensationalism/Emotional Bias: ${currentScanResult.metrics.emotion.score}%\n` +
        `Source Transparency: ${currentScanResult.metrics.attribution.score}%\n` +
        `Domain: ${currentScanResult.metrics.domain.label}\n` +
        `Verified with VeritasAI Sentinel`;

      navigator.clipboard.writeText(textSummary).then(() => {
        copyReportBtn.textContent = "✅ Copied Summary!";
        setTimeout(() => {
          copyReportBtn.textContent = "📋 Copy Verification Card";
        }, 2000);
      });
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener("click", () => {
      window.soundEngine.playClick();
      window.print();
    });
  }

  // History Management
  function saveToHistory(result, text, url) {
    const history = JSON.parse(localStorage.getItem("veritas_history") || "[]");
    const title = text ? text.split("\n")[0].substring(0, 60) : (url || "Untitled Scan");
    
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      score: result.score,
      verdict: result.verdict.label,
      badgeClass: result.verdict.badgeClass,
      text,
      url
    };

    history.unshift(entry);
    if (history.length > 8) history.pop();
    localStorage.setItem("veritas_history", JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;
    const history = JSON.parse(localStorage.getItem("veritas_history") || "[]");
    
    if (history.length === 0) {
      if (emptyHistory) emptyHistory.style.display = "block";
      historyList.innerHTML = "";
      return;
    }

    if (emptyHistory) emptyHistory.style.display = "none";
    historyList.innerHTML = "";

    history.forEach(item => {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <div class="history-info">
          <span class="history-badge ${item.badgeClass}">${item.score}% - ${item.verdict}</span>
          <span class="history-title">${item.title}...</span>
          <span class="history-time">${item.date}</span>
        </div>
        <button class="history-retest-btn" title="Reload Scan">Reload ↺</button>
      `;

      li.querySelector(".history-retest-btn").addEventListener("click", () => {
        window.soundEngine.playClick();
        if (articleTextInput) articleTextInput.value = item.text || "";
        if (articleUrlInput) articleUrlInput.value = item.url || "";
        handleScan(item.text, item.url);
      });

      historyList.appendChild(li);
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      window.soundEngine.playClick();
      localStorage.removeItem("veritas_history");
      renderHistory();
    });
  }

  // Spot the Fake Quiz Game
  function initQuiz() {
    quizIndex = 0;
    quizScore = 0;
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = window.KNOWLEDGE_BASE.quizQuestions[quizIndex];
    if (!q) return;

    quizCategory.textContent = `${q.category} (Question ${quizIndex + 1}/${window.KNOWLEDGE_BASE.quizQuestions.length})`;
    quizHeadline.textContent = `"${q.headline}"`;
    quizHint.textContent = q.imageHint;
    quizFeedback.classList.add("hidden");
    quizRealBtn.disabled = false;
    quizFakeBtn.disabled = false;
    quizNextBtn.classList.add("hidden");
    quizScoreCount.textContent = `Score: ${quizScore}/${window.KNOWLEDGE_BASE.quizQuestions.length}`;
    
    const percent = ((quizIndex) / window.KNOWLEDGE_BASE.quizQuestions.length) * 100;
    quizProgress.style.width = `${percent}%`;
  }

  function handleQuizAnswer(userGuessFake) {
    const q = window.KNOWLEDGE_BASE.quizQuestions[quizIndex];
    quizRealBtn.disabled = true;
    quizFakeBtn.disabled = true;
    quizFeedback.classList.remove("hidden");
    quizNextBtn.classList.remove("hidden");

    const isCorrect = (userGuessFake === q.isFake);
    if (isCorrect) {
      quizScore++;
      window.soundEngine.playSuccess();
      quizFeedback.className = "quiz-feedback-box feedback-correct";
      quizFeedback.querySelector(".feedback-status").innerHTML = "🎯 CORRECT! Sharp critical thinking!";
    } else {
      window.soundEngine.playWarning();
      quizFeedback.className = "quiz-feedback-box feedback-incorrect";
      quizFeedback.querySelector(".feedback-status").innerHTML = `❌ INCORRECT! This headline was actually ${q.isFake ? 'FAKE' : 'REAL'}.`;
    }

    quizExplanation.textContent = q.explanation;
    quizScoreCount.textContent = `Score: ${quizScore}/${window.KNOWLEDGE_BASE.quizQuestions.length}`;
  }

  if (quizRealBtn && quizFakeBtn) {
    quizRealBtn.addEventListener("click", () => handleQuizAnswer(false));
    quizFakeBtn.addEventListener("click", () => handleQuizAnswer(true));
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener("click", () => {
      window.soundEngine.playClick();
      quizIndex++;
      if (quizIndex < window.KNOWLEDGE_BASE.quizQuestions.length) {
        renderQuizQuestion();
      } else {
        showQuizResults();
      }
    });
  }

  function showQuizResults() {
    quizProgress.style.width = "100%";
    quizContainer.innerHTML = `
      <div class="quiz-completion">
        <div class="completion-icon">🏆</div>
        <h3>Challenge Complete!</h3>
        <p class="completion-score">Final Score: <strong>${quizScore} / ${window.KNOWLEDGE_BASE.quizQuestions.length}</strong></p>
        <p class="completion-msg">${quizScore >= 4 ? "Outstanding! You possess top-tier media literacy and spot manipulation tricks effortlessly!" : "Good effort! Remember to always verify emotional headlines, check sources, and inspect author citations."}</p>
        <button id="restartQuizBtn" class="btn-primary" style="margin-top: 1.5rem;">Play Again ↺</button>
      </div>
    `;
    const restartBtn = document.getElementById("restartQuizBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        location.reload();
      });
    }
  }

  // Live Fact Feed Ticker
  function setupLiveFeed() {
    const liveFeedContainer = document.getElementById("liveFactFeed");
    if (!liveFeedContainer) return;

    const liveItems = [
      { tag: "HEALTH", title: "Claim: Vitamin D supplements replace prescription cardiac medicine", verdict: "DEBUNKED FALSE", color: "#ef4444" },
      { tag: "TECH", title: "Claim: Deepfake video of mayor announcing fake curfew circulating", verdict: "FABRICATED AI", color: "#ef4444" },
      { tag: "SCIENCE", title: "Claim: Fusion reactor sustains net positive energy milestone in Oxford", verdict: "VERIFIED ACCURATE", color: "#10b981" },
      { tag: "CLIMATE", title: "Claim: 2025 recorded warmest global ocean surface temperatures in NOAA database", verdict: "CONFIRMED FACTUAL", color: "#10b981" },
      { tag: "POLITICS", title: "Claim: Viral quote attributing fabricated war declaration to diplomat", verdict: "MISQUOTED / OUT OF CONTEXT", color: "#f97316" }
    ];

    liveFeedContainer.innerHTML = "";
    liveItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "live-ticker-item";
      div.innerHTML = `
        <span class="ticker-cat">${item.tag}</span>
        <span class="ticker-title">${item.title}</span>
        <span class="ticker-verdict" style="color:${item.color}">${item.verdict}</span>
      `;
      liveFeedContainer.appendChild(div);
    });
  }

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      window.soundEngine.playClick();
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      themeToggleBtn.innerHTML = isLight ? "🌙 <span>Dark</span>" : "☀️ <span>Light</span>";
      localStorage.setItem("veritas_theme", isLight ? "light" : "dark");
    });

    if (localStorage.getItem("veritas_theme") === "light") {
      document.body.classList.add("light-theme");
      themeToggleBtn.innerHTML = "🌙 <span>Dark</span>";
    }
  }

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      const isMuted = window.soundEngine.toggleMute();
      soundToggleBtn.innerHTML = isMuted ? "🔇 <span>Muted</span>" : "🔊 <span>Sound On</span>";
    });
  }
});
