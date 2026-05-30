"use strict";

// ── DOM refs ──────────────────────────────────────────
const generateBtn   = document.getElementById("generate-btn");
const clearBtn      = document.getElementById("clear-btn");
const regenerateBtn = document.getElementById("regenerate-btn");
const printBtn      = document.getElementById("print-btn");
const toggleAnswers = document.getElementById("toggle-answers");
const toggleKey     = document.getElementById("toggle-key");

const subjectSel    = document.getElementById("subject");
const gradeSel      = document.getElementById("grade");
const curriculumSel = document.getElementById("curriculum");
const difficultySel = document.getElementById("difficulty");
const numQSel       = document.getElementById("num-questions");
const qTypeSel      = document.getElementById("question-type");

const schoolInp     = document.getElementById("school-name");
const teacherInp    = document.getElementById("teacher-name");
const titleInp      = document.getElementById("test-title");
const dateInp       = document.getElementById("test-date");

const apiKeyInp     = document.getElementById("api-key");
const topicInp      = document.getElementById("custom-topic");

const errorMsg      = document.getElementById("error-msg");
const loading       = document.getElementById("loading");
const testPreview   = document.getElementById("test-preview");
const testContent   = document.getElementById("test-content");
const answerKeyDiv  = document.getElementById("answer-key");
const answerKeyContent = document.getElementById("answer-key-content");

// ── State ─────────────────────────────────────────────
let currentQuestions = [];
let answersVisible = false;

// ── Init ──────────────────────────────────────────────
dateInp.value = new Date().toISOString().slice(0, 10);

// ── Event Listeners ───────────────────────────────────
generateBtn.addEventListener("click", handleGenerate);
clearBtn.addEventListener("click", handleClear);
regenerateBtn.addEventListener("click", handleGenerate);
printBtn.addEventListener("click", handlePrint);
toggleAnswers.addEventListener("click", toggleAnswerKey);
toggleKey.addEventListener("click", () => {
  apiKeyInp.type = apiKeyInp.type === "password" ? "text" : "password";
  toggleKey.textContent = apiKeyInp.type === "password" ? "👁" : "🙈";
});

// ── Generate ──────────────────────────────────────────
async function handleGenerate() {
  hideError();

  const subject    = subjectSel.value;
  const grade      = gradeSel.value;
  const curriculum = curriculumSel.value;
  const difficulty = difficultySel.value;
  const count      = parseInt(numQSel.value, 10);
  const qType      = qTypeSel.value;
  const apiKey     = apiKeyInp.value.trim();
  const topic      = topicInp.value.trim();

  // Validate required fields
  if (!subject)    return showError("Please select a subject.");
  if (!grade)      return showError("Please select a grade.");
  if (!curriculum) return showError("Please select a curriculum.");

  if (apiKey) {
    await generateWithClaude({ subject, grade, curriculum, difficulty, count, qType, topic, apiKey });
  } else {
    generateLocally({ subject, grade, curriculum, difficulty, count, qType });
  }
}

// ── Local Generation ──────────────────────────────────
function generateLocally({ subject, grade, curriculum, difficulty, count, qType }) {
  const questions = getQuestions({ subject, grade, difficulty, curriculum, type: qType, count });

  if (questions.length === 0) {
    return showError(
      `No questions found for the selected combination. Try changing the difficulty, question type, or use AI generation with an API key.`
    );
  }

  if (questions.length < count) {
    showError(
      `Only ${questions.length} question(s) available for these settings. Showing all available questions. You can use AI generation for more.`,
      "warning"
    );
  }

  currentQuestions = questions;
  renderTest(questions);
}

// ── Claude API Generation ─────────────────────────────
async function generateWithClaude({ subject, grade, curriculum, difficulty, count, qType, topic, apiKey }) {
  showLoading(true);

  const gradeLabel   = gradeDisplay(grade);
  const subjectLabel = labelOf(subjectSel);
  const currLabel    = labelOf(curriculumSel);
  const diffLabel    = labelOf(difficultySel);
  const typeLabel    = qType === "all" ? "a mix of multiple choice, true/false, and short answer" : labelOf(qTypeSel);

  const topicClause = topic ? ` Focus specifically on the topic: "${topic}".` : "";

  const prompt = `You are an expert educator. Generate exactly ${count} ${diffLabel.toLowerCase()} difficulty ${typeLabel} questions for:
- Subject: ${subjectLabel}
- Grade: ${gradeLabel}
- Curriculum: ${currLabel}${topicClause}

Return ONLY a valid JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "type": "mcq" | "true_false" | "short_answer",
    "question": "...",
    "options": ["A text", "B text", "C text", "D text"],  // only for mcq
    "answer": "A" | "B" | "C" | "D" | "True" | "False" | "short answer text",
    "explanation": "brief explanation"
  }
]

Rules:
- For MCQ: provide exactly 4 options as strings (just the text, not "A." prefix), answer is the letter A/B/C/D
- For true_false: answer is exactly "True" or "False"
- For short_answer: answer is a concise model answer
- Questions must be age-appropriate for ${gradeLabel}
- Questions must align with ${currLabel} standards`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-calls": "true"
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";

    // Extract JSON array from response
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse AI response. Please try again.");

    const parsed = JSON.parse(jsonMatch[0]);

    // Normalize to internal format
    currentQuestions = parsed.map((q, i) => ({
      subject,
      type: q.type || "short_answer",
      difficulty,
      question: q.question,
      options: q.options || [],
      answer: q.answer,
      explanation: q.explanation || "",
      _idx: i
    }));

    showLoading(false);
    renderTest(currentQuestions);

  } catch (err) {
    showLoading(false);
    showError("AI generation failed: " + err.message + "\n\nFalling back to local question bank.");
    generateLocally({
      subject: subjectSel.value,
      grade: gradeSel.value,
      curriculum: curriculumSel.value,
      difficulty: difficultySel.value,
      count: parseInt(numQSel.value, 10),
      qType: qTypeSel.value
    });
  }
}

// ── Render Test ───────────────────────────────────────
function renderTest(questions) {
  // Group by type for sectioned display
  const mcqs    = questions.filter(q => q.type === "mcq");
  const tfs     = questions.filter(q => q.type === "true_false");
  const shorts  = questions.filter(q => q.type === "short_answer");

  const school    = schoolInp.value.trim() || null;
  const teacher   = teacherInp.value.trim() || null;
  const testTitle = titleInp.value.trim() || `${labelOf(subjectSel)} Test`;
  const testDate  = dateInp.value ? formatDate(dateInp.value) : formatDate(new Date().toISOString().slice(0, 10));
  const gradeStr  = gradeDisplay(gradeSel.value);
  const currStr   = labelOf(curriculumSel);

  let html = `
    <div class="test-header">
      ${school ? `<div class="school-name">${esc(school)}</div>` : ""}
      <div class="test-main-title">${esc(testTitle)}</div>
      <div class="test-meta">
        <span class="meta-item"><span class="meta-label">Grade:</span> ${gradeStr}</span>
        <span class="meta-item"><span class="meta-label">Subject:</span> ${labelOf(subjectSel)}</span>
        <span class="meta-item"><span class="meta-label">Curriculum:</span> ${currStr}</span>
        <span class="meta-item"><span class="meta-label">Difficulty:</span> ${labelOf(difficultySel)}</span>
        <span class="meta-item"><span class="meta-label">Date:</span> ${testDate}</span>
        ${teacher ? `<span class="meta-item"><span class="meta-label">Teacher:</span> ${esc(teacher)}</span>` : ""}
      </div>
    </div>

    <div class="student-info">
      <div class="student-field"><span class="field-label">Student Name:</span><div class="field-line"></div></div>
      <div class="student-field"><span class="field-label">Class:</span><div class="field-line" style="min-width:80px"></div></div>
      <div class="student-field"><span class="field-label">Score:</span><div class="field-line" style="min-width:60px"></div></div>
    </div>`;

  let qNum = 1;

  if (mcqs.length) {
    html += `<div class="section-block"><h3>Section A — Multiple Choice</h3><p style="font-size:.85rem;margin-bottom:12px;color:#555;">Circle the letter of the best answer.</p>`;
    mcqs.forEach(q => { html += renderMCQ(q, qNum++); });
    html += `</div>`;
  }

  if (tfs.length) {
    html += `<div class="section-block"><h3>Section ${mcqs.length ? "B" : "A"} — True or False</h3><p style="font-size:.85rem;margin-bottom:12px;color:#555;">Write <strong>True</strong> or <strong>False</strong> in the space provided.</p>`;
    tfs.forEach(q => { html += renderTrueFalse(q, qNum++); });
    html += `</div>`;
  }

  if (shorts.length) {
    const sectionLetter = ["A","B","C"][mcqs.length > 0 && tfs.length > 0 ? 2 : (mcqs.length > 0 || tfs.length > 0 ? 1 : 0)];
    html += `<div class="section-block"><h3>Section ${sectionLetter} — Short Answer</h3><p style="font-size:.85rem;margin-bottom:12px;color:#555;">Answer each question in complete sentences.</p>`;
    shorts.forEach(q => { html += renderShortAnswer(q, qNum++); });
    html += `</div>`;
  }

  testContent.innerHTML = html;

  // Build answer key
  let akHtml = `<div class="answer-grid">`;
  questions.forEach((q, i) => {
    const answerDisplay = q.type === "mcq"
      ? `${q.answer}: ${(q.options[letterIndex(q.answer)] || "").replace(/^[ABCD]\.\s*/,"")}`
      : q.answer;
    akHtml += `
      <div class="answer-item">
        <div><span class="q-num">Q${i + 1}.</span> <span class="q-ans">${esc(answerDisplay)}</span></div>
        ${q.explanation ? `<div class="q-explanation">${esc(q.explanation)}</div>` : ""}
      </div>`;
  });
  akHtml += `</div>`;
  answerKeyContent.innerHTML = akHtml;

  // Reset answer key visibility
  answersVisible = false;
  answerKeyDiv.classList.add("hidden");
  toggleAnswers.textContent = "Show Answer Key";

  testPreview.classList.remove("hidden");
  testPreview.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMCQ(q, num) {
  const optLetters = ["A", "B", "C", "D"];
  const optHtml = (q.options || []).map((opt, i) => `
    <li>
      <span class="option-letter">${optLetters[i]}.</span>
      <span>${esc(opt.replace(/^[ABCD]\.\s*/,""))}</span>
    </li>`).join("");

  return `
    <div class="question-item">
      <div class="question-text"><span class="question-num">${num}.</span> ${esc(q.question)}</div>
      <ul class="options-list">${optHtml}</ul>
    </div>`;
}

function renderTrueFalse(q, num) {
  return `
    <div class="question-item">
      <div class="question-text"><span class="question-num">${num}.</span> ${esc(q.question)}</div>
      <div class="true-false-options">
        <label><input type="radio" name="tf_${num}" disabled /> True</label>
        <label><input type="radio" name="tf_${num}" disabled /> False</label>
      </div>
    </div>`;
}

function renderShortAnswer(q, num) {
  return `
    <div class="question-item">
      <div class="question-text"><span class="question-num">${num}.</span> ${esc(q.question)}</div>
      <div class="answer-line"></div>
      <div class="answer-line" style="margin-top:8px"></div>
    </div>`;
}

// ── Print ─────────────────────────────────────────────
function handlePrint() {
  window.print();
}

// ── Toggle Answers ────────────────────────────────────
function toggleAnswerKey() {
  answersVisible = !answersVisible;
  answerKeyDiv.classList.toggle("hidden", !answersVisible);
  toggleAnswers.textContent = answersVisible ? "Hide Answer Key" : "Show Answer Key";
}

// ── Clear Form ────────────────────────────────────────
function handleClear() {
  subjectSel.value = "";
  gradeSel.value = "";
  curriculumSel.value = "";
  difficultySel.value = "medium";
  numQSel.value = "10";
  qTypeSel.value = "all";
  schoolInp.value = "";
  teacherInp.value = "";
  titleInp.value = "";
  dateInp.value = new Date().toISOString().slice(0, 10);
  apiKeyInp.value = "";
  topicInp.value = "";
  testPreview.classList.add("hidden");
  hideError();
}

// ── Helpers ───────────────────────────────────────────
function showError(msg, type = "error") {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  errorMsg.style.background = type === "warning" ? "#fefce8" : "#fef2f2";
  errorMsg.style.borderColor = type === "warning" ? "#fde047" : "#fecaca";
  errorMsg.style.color = type === "warning" ? "#854d0e" : "#dc2626";
}

function hideError() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
}

function showLoading(show) {
  loading.classList.toggle("hidden", !show);
  generateBtn.disabled = show;
  regenerateBtn.disabled = show;
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelOf(selectEl) {
  const opt = selectEl.options[selectEl.selectedIndex];
  return opt ? opt.text : "";
}

function gradeDisplay(grade) {
  if (grade === "0") return "Kindergarten";
  return `Grade ${grade}`;
}

function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function letterIndex(letter) {
  return { A: 0, B: 1, C: 2, D: 3 }[letter] ?? 0;
}
