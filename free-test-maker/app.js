"use strict";

// ── Groq API config ───────────────────────────────────
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ── DOM refs ─────────────────────────────────────────
const groqKeyInp     = document.getElementById("groq-key");
const modelSel       = document.getElementById("model-select");
const saveKeyBtn     = document.getElementById("save-key-btn");
const toggleKeyBtn   = document.getElementById("toggle-key-btn");
const keyStatus      = document.getElementById("key-status");

const subjectSel     = document.getElementById("subject");
const gradeSel       = document.getElementById("grade");
const curriculumSel  = document.getElementById("curriculum");
const difficultySel  = document.getElementById("difficulty");
const numQSel        = document.getElementById("num-q");
const qTypeSel       = document.getElementById("q-type");
const topicInp       = document.getElementById("topic");

const schoolInp      = document.getElementById("school-name");
const teacherInp     = document.getElementById("teacher-name");
const titleInp       = document.getElementById("test-title");
const dateInp        = document.getElementById("test-date");

const generateBtn    = document.getElementById("generate-btn");
const clearBtn       = document.getElementById("clear-btn");
const regenerateBtn  = document.getElementById("regenerate-btn");
const printBtn       = document.getElementById("print-btn");
const toggleAnsBtn   = document.getElementById("toggle-answers-btn");

const errorBox       = document.getElementById("error-box");
const loadingBar     = document.getElementById("loading-bar");
const loadingMsg     = document.getElementById("loading-msg");
const testPreview    = document.getElementById("test-preview");
const testOutput     = document.getElementById("test-output");
const answerKeySec   = document.getElementById("answer-key-section");
const akContent      = document.getElementById("ak-content");

// ── State ────────────────────────────────────────────
let savedKey       = "";
let currentQuestions = [];
let answersVisible = false;

// ── Init ─────────────────────────────────────────────
dateInp.value = new Date().toISOString().slice(0, 10);

// Restore saved key from sessionStorage
const stored = sessionStorage.getItem("groq_key");
if (stored) {
  savedKey = stored;
  groqKeyInp.value = stored;
  enableGenerate();
  showKeyStatus("✅ API key loaded from this session.", "success");
}

// ── Event Listeners ───────────────────────────────────
saveKeyBtn.addEventListener("click", handleSaveKey);
toggleKeyBtn.addEventListener("click", () => {
  groqKeyInp.type = groqKeyInp.type === "password" ? "text" : "password";
  toggleKeyBtn.textContent = groqKeyInp.type === "password" ? "👁" : "🙈";
});

generateBtn.addEventListener("click", handleGenerate);
clearBtn.addEventListener("click", handleClear);
regenerateBtn.addEventListener("click", handleGenerate);
printBtn.addEventListener("click", () => window.print());
toggleAnsBtn.addEventListener("click", toggleAnswerKey);

// Allow pressing Enter in key field to save
groqKeyInp.addEventListener("keydown", e => { if (e.key === "Enter") handleSaveKey(); });

// ── Save Key ──────────────────────────────────────────
function handleSaveKey() {
  const key = groqKeyInp.value.trim();
  if (!key) return showKeyStatus("Please enter your Groq API key.", "error");
  if (!key.startsWith("gsk_")) return showKeyStatus("Groq keys start with 'gsk_'. Please check your key.", "error");

  savedKey = key;
  sessionStorage.setItem("groq_key", key);
  enableGenerate();
  showKeyStatus("✅ Key saved for this session. You can now generate tests!", "success");
}

function enableGenerate() {
  generateBtn.disabled = false;
  regenerateBtn.disabled = false;
}

function showKeyStatus(msg, type) {
  keyStatus.textContent = msg;
  keyStatus.className = `key-status ${type}`;
  keyStatus.classList.remove("hidden");
}

// ── Generate ──────────────────────────────────────────
async function handleGenerate() {
  hideError();

  const subject    = subjectSel.value;
  const grade      = gradeSel.value;
  const curriculum = curriculumSel.value;

  if (!subject)    return showError("Please select a subject.");
  if (!grade)      return showError("Please select a grade.");
  if (!curriculum) return showError("Please select a curriculum.");
  if (!savedKey)   return showError("Please enter and save your Groq API key first.");

  await generateWithGroq({
    subject,
    grade,
    curriculum,
    difficulty: difficultySel.value,
    count:      parseInt(numQSel.value, 10),
    qType:      qTypeSel.value,
    topic:      topicInp.value.trim(),
    model:      modelSel.value
  });
}

// ── Groq API Call ─────────────────────────────────────
async function generateWithGroq({ subject, grade, curriculum, difficulty, count, qType, topic, model }) {
  setLoading(true, `Sending prompt to ${modelLabel(model)}…`);

  const diffLabel = { easy:"Easy", medium:"Medium", hard:"Hard", mixed:"Mixed (Easy, Medium, and Hard)" }[difficulty] || difficulty;
  const typeInstr = {
    mixed:        `Include a mix of question types: multiple choice (MCQ), true/false, and short answer questions.`,
    mcq:          `All questions must be multiple choice (MCQ) with exactly 4 options labeled A, B, C, D.`,
    true_false:   `All questions must be True/False questions.`,
    short_answer: `All questions must be short answer questions requiring 1–3 sentence answers.`
  }[qType];

  const topicLine = topic ? `\nFocus specifically on this topic/unit: "${topic}".` : "";

  const systemPrompt = `You are an expert educator who creates high-quality, curriculum-aligned test questions.
You always respond with valid JSON only — no markdown, no explanations, no preamble.`;

  const userPrompt = `Create exactly ${count} ${diffLabel} difficulty test questions for:
- Subject: ${subject}
- Grade level: ${grade}
- Curriculum: ${curriculum}${topicLine}

${typeInstr}

Return a JSON array with this exact structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["First option text", "Second option text", "Third option text", "Fourth option text"],
    "answer": "A",
    "explanation": "Brief explanation of the correct answer."
  },
  {
    "type": "true_false",
    "question": "Statement to evaluate.",
    "answer": "True",
    "explanation": "Brief explanation."
  },
  {
    "type": "short_answer",
    "question": "Question requiring a written answer?",
    "answer": "Model answer here.",
    "explanation": "Optional extra context."
  }
]

Rules:
- For MCQ: "options" is an array of 4 plain strings (no "A." prefix), "answer" is "A", "B", "C", or "D"
- For true_false: "answer" is exactly "True" or "False"
- For short_answer: "answer" is a concise model answer
- Questions must be age-appropriate for ${grade}
- Questions must align with ${curriculum} standards
- Vary the difficulty within ${diffLabel} range
- Do NOT include explanations in the question text itself`;

  try {
    setLoading(true, `Generating ${count} questions with ${modelLabel(model)}…`);

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${savedKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt }
        ],
        temperature: 0.75,
        max_tokens: 6000
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${res.status}`;
      if (res.status === 401) throw new Error("Invalid API key. Please check your Groq key and try again.");
      if (res.status === 429) throw new Error("Rate limit hit. Please wait a moment and try again.");
      throw new Error(`Groq API error: ${msg}`);
    }

    setLoading(true, "Parsing AI response…");

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content || "";

    // Extract JSON array (handle if model wraps in ```json ... ```)
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse AI response. Try regenerating or switching models.");

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("AI returned no questions. Please try again.");
    }

    currentQuestions = parsed.map(q => ({
      type:        q.type || "short_answer",
      question:    q.question || "",
      options:     Array.isArray(q.options) ? q.options : [],
      answer:      q.answer || "",
      explanation: q.explanation || ""
    }));

    setLoading(false);
    renderTest(currentQuestions, { subject, grade, curriculum, difficulty, model });

  } catch (err) {
    setLoading(false);
    showError(err.message);
  }
}

// ── Render Test ───────────────────────────────────────
function renderTest(questions, meta) {
  const school    = schoolInp.value.trim() || null;
  const teacher   = teacherInp.value.trim() || null;
  const testTitle = titleInp.value.trim() || `${meta.subject} Test`;
  const testDate  = dateInp.value ? formatDate(dateInp.value) : formatDate(new Date().toISOString().slice(0,10));

  const mcqs   = questions.filter(q => q.type === "mcq");
  const tfs    = questions.filter(q => q.type === "true_false");
  const shorts = questions.filter(q => q.type === "short_answer");

  let html = `
    <div class="test-hdr">
      ${school ? `<div class="school">${esc(school)}</div>` : ""}
      <div class="ttitle">
        ${esc(testTitle)}
        <span class="ai-tag">AI Generated</span>
      </div>
      <div class="tmeta">
        <span><span class="ml">Subject:</span> ${esc(meta.subject)}</span>
        <span><span class="ml">Grade:</span> ${esc(meta.grade)}</span>
        <span><span class="ml">Curriculum:</span> ${esc(meta.curriculum)}</span>
        <span><span class="ml">Difficulty:</span> ${capitalize(meta.difficulty)}</span>
        <span><span class="ml">Date:</span> ${testDate}</span>
        ${teacher ? `<span><span class="ml">Teacher:</span> ${esc(teacher)}</span>` : ""}
      </div>
    </div>

    <div class="stu-row">
      <div class="stu-field"><span class="stu-label">Student Name:</span><div class="stu-line"></div></div>
      <div class="stu-field"><span class="stu-label">Class:</span><div class="stu-line" style="min-width:80px"></div></div>
      <div class="stu-field"><span class="stu-label">Score:</span><div class="stu-line" style="min-width:60px"></div></div>
    </div>`;

  let qNum = 1;
  const sectionCount = [mcqs, tfs, shorts].filter(g => g.length).length;
  const letters = ["A","B","C"];
  let sIdx = 0;

  if (mcqs.length) {
    html += `<div class="sec-block">
      <h3>Section ${sectionCount > 1 ? letters[sIdx++] + " — " : ""}Multiple Choice</h3>
      <p style="font-size:.85rem;margin-bottom:12px;color:#555;">Circle the letter of the best answer.</p>`;
    mcqs.forEach(q => { html += renderMCQ(q, qNum++); });
    html += `</div>`;
  }

  if (tfs.length) {
    html += `<div class="sec-block">
      <h3>Section ${sectionCount > 1 ? letters[sIdx++] + " — " : ""}True or False</h3>
      <p style="font-size:.85rem;margin-bottom:12px;color:#555;">Write <strong>True</strong> or <strong>False</strong>.</p>`;
    tfs.forEach(q => { html += renderTF(q, qNum++); });
    html += `</div>`;
  }

  if (shorts.length) {
    html += `<div class="sec-block">
      <h3>Section ${sectionCount > 1 ? letters[sIdx++] + " — " : ""}Short Answer</h3>
      <p style="font-size:.85rem;margin-bottom:12px;color:#555;">Answer each question in complete sentences.</p>`;
    shorts.forEach(q => { html += renderShort(q, qNum++); });
    html += `</div>`;
  }

  testOutput.innerHTML = html;

  // Build answer key
  let akHtml = `<div class="ak-grid">`;
  questions.forEach((q, i) => {
    const ansDisplay = q.type === "mcq"
      ? `${q.answer}: ${q.options[letterToIdx(q.answer)] || ""}`
      : q.answer;
    akHtml += `
      <div class="ak-item">
        <div><span class="ak-q">Q${i+1}.</span> <span class="ak-a">${esc(ansDisplay)}</span></div>
        ${q.explanation ? `<div class="ak-ex">${esc(q.explanation)}</div>` : ""}
      </div>`;
  });
  akHtml += `</div>`;
  akContent.innerHTML = akHtml;

  answersVisible = false;
  answerKeySec.classList.add("hidden");
  toggleAnsBtn.textContent = "Show Answer Key";

  testPreview.classList.remove("hidden");
  testPreview.scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderMCQ(q, num) {
  const letters = ["A","B","C","D"];
  const opts = (q.options || []).map((o, i) =>
    `<li><span class="opt-ltr">${letters[i]}.</span><span>${esc(o)}</span></li>`
  ).join("");
  return `
    <div class="q-item">
      <div class="q-text"><span class="q-num">${num}.</span> ${esc(q.question)}</div>
      <ul class="opts-list">${opts}</ul>
    </div>`;
}

function renderTF(q, num) {
  return `
    <div class="q-item">
      <div class="q-text"><span class="q-num">${num}.</span> ${esc(q.question)}</div>
      <div class="tf-opts">
        <label><input type="radio" name="tf_${num}" disabled /> True</label>
        <label><input type="radio" name="tf_${num}" disabled /> False</label>
      </div>
    </div>`;
}

function renderShort(q, num) {
  return `
    <div class="q-item">
      <div class="q-text"><span class="q-num">${num}.</span> ${esc(q.question)}</div>
      <div class="ans-line"></div>
      <div class="ans-line" style="margin-top:8px"></div>
    </div>`;
}

// ── Toggle Answer Key ─────────────────────────────────
function toggleAnswerKey() {
  answersVisible = !answersVisible;
  answerKeySec.classList.toggle("hidden", !answersVisible);
  toggleAnsBtn.textContent = answersVisible ? "Hide Answer Key" : "Show Answer Key";
}

// ── Clear ─────────────────────────────────────────────
function handleClear() {
  subjectSel.value    = "";
  gradeSel.value      = "";
  curriculumSel.value = "";
  difficultySel.value = "medium";
  numQSel.value       = "10";
  qTypeSel.value      = "mixed";
  topicInp.value      = "";
  schoolInp.value     = "";
  teacherInp.value    = "";
  titleInp.value      = "";
  dateInp.value       = new Date().toISOString().slice(0, 10);
  testPreview.classList.add("hidden");
  hideError();
}

// ── Helpers ───────────────────────────────────────────
function setLoading(show, msg) {
  loadingBar.classList.toggle("hidden", !show);
  if (msg) loadingMsg.innerHTML = msg;
  generateBtn.disabled  = show;
  regenerateBtn.disabled = show;
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

function letterToIdx(l) { return { A:0, B:1, C:2, D:3 }[l] ?? 0; }

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

function modelLabel(id) {
  return {
    "llama-3.1-8b-instant":    "Llama 3.1 8B Instant",
    "llama-3.3-70b-versatile": "Llama 3.3 70B Versatile",
    "mixtral-8x7b-32768":      "Mixtral 8×7B",
    "gemma2-9b-it":            "Gemma 2 9B"
  }[id] || id;
}
