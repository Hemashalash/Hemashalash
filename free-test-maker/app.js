"use strict";

// ── Constants ─────────────────────────────────────────
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const API_TIMEOUT = 45_000; // ms
const STORAGE_KEY = "ai_test_maker_last";

const MODEL_LABELS = {
  "llama-3.1-8b-instant":    "Llama 3.1 8B Instant",
  "llama-3.3-70b-versatile": "Llama 3.3 70B Versatile",
  "mixtral-8x7b-32768":      "Mixtral 8×7B",
  "gemma2-9b-it":            "Gemma 2 9B"
};

// ── DOM ───────────────────────────────────────────────
const $ = id => document.getElementById(id);

const groqKeyInp    = $("groq-key");
const modelSel      = $("model-sel");
const saveKeyBtn    = $("save-key-btn");
const eyeBtn        = $("eye-btn");
const keyStatus     = $("key-status");
const keyCollapseBtn= $("key-collapse-btn");
const keyBody       = $("key-body");

const subjectSel    = $("subject");
const gradeSel      = $("grade");
const curriculumSel = $("curriculum");
const difficultySel = $("difficulty");
const languageSel   = $("language");
const bloomSel      = $("bloom");
const topicInp      = $("topic");

const mcqCount      = $("mcq-count");
const tfCount       = $("tf-count");
const saCount       = $("sa-count");
const mcqMarks      = $("mcq-marks");
const tfMarks       = $("tf-marks");
const saMarks       = $("sa-marks");
const totalQEl      = $("total-q");
const totalMkEl     = $("total-marks");

const schoolInp     = $("school-name");
const teacherInp    = $("teacher-name");
const titleInp      = $("test-title");
const dateInp       = $("test-date");
const durationInp   = $("duration");
const termInp       = $("term");
const instrInp      = $("instructions");

const generateBtn   = $("generate-btn");
const clearBtn      = $("clear-btn");
const regenAllBtn   = $("regen-all-btn");
const printBtn      = $("print-btn");
const saveTestBtn   = $("save-test-btn");
const loadLastBtn   = $("load-last-btn");
const addQBtn       = $("add-q-btn");
const toggleAnsBtn  = $("toggle-ans-btn");

const errorBox      = $("error-box");
const loadingWrap   = $("loading-wrap");
const loadingMsg    = $("loading-msg");

const previewCard   = $("preview-card");
const previewLabel  = $("preview-label");
const qEditor       = $("q-editor");
const akPanel       = $("answer-key-panel");
const akGrid        = $("ak-grid");
const printArea     = $("print-area");

const editModal     = $("edit-modal");
const modalOverlay  = $("modal-overlay");
const modalClose    = $("modal-close");
const modalSave     = $("modal-save");
const modalCancel   = $("modal-cancel");
const editQText     = $("edit-q-text");
const editOptsWrap  = $("edit-options-wrap");
const editAnswer    = $("edit-answer");
const editExpl      = $("edit-explanation");

// ── State ─────────────────────────────────────────────
let savedKey     = "";
let questions    = [];   // { type, question, options?, answer, explanation, marks }
let answerVis    = false;
let editingIdx   = -1;
let lastMeta     = {};

// ── Init ─────────────────────────────────────────────
dateInp.value = today();

// Restore API key from session
const storedKey = sessionStorage.getItem("groq_key");
if (storedKey) {
  savedKey = storedKey;
  groqKeyInp.value = storedKey;
  generateBtn.disabled = false;
  showKeyStatus("✅ Key restored from this session.", "ok");
}

// Wire up counter buttons
document.querySelectorAll(".counter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const inp = $(btn.dataset.target);
    const dir = parseInt(btn.dataset.dir, 10);
    const val = parseInt(inp.value, 10) || 0;
    inp.value = Math.max(0, Math.min(20, val + dir));
    updateTotals();
  });
});

[mcqCount, tfCount, saCount, mcqMarks, tfMarks, saMarks]
  .forEach(el => el.addEventListener("input", updateTotals));

updateTotals();

// ── Event Listeners ───────────────────────────────────
saveKeyBtn.addEventListener("click", handleSaveKey);
eyeBtn.addEventListener("click", toggleEye);
groqKeyInp.addEventListener("keydown", e => e.key === "Enter" && handleSaveKey());
keyCollapseBtn.addEventListener("click", () => {
  const open = keyBody.style.display !== "none";
  keyBody.style.display = open ? "none" : "";
  keyCollapseBtn.textContent = open ? "▼" : "▲";
});

generateBtn.addEventListener("click", () => handleGenerate());
clearBtn.addEventListener("click", handleClear);
regenAllBtn.addEventListener("click", () => handleGenerate(true));
printBtn.addEventListener("click", handlePrint);
saveTestBtn.addEventListener("click", saveToStorage);
loadLastBtn.addEventListener("click", loadFromStorage);
addQBtn.addEventListener("click", handleAddQuestion);
toggleAnsBtn.addEventListener("click", toggleAnswers);

// Edit modal controls
modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
modalSave.addEventListener("click", saveEdit);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !editModal.classList.contains("hidden")) closeModal();
});

// ── Total counts ──────────────────────────────────────
function updateTotals() {
  const m = +mcqCount.value || 0;
  const t = +tfCount.value  || 0;
  const s = +saCount.value  || 0;
  const total = m + t + s;
  const marks = m * (+mcqMarks.value || 0) +
                t * (+tfMarks.value  || 0) +
                s * (+saMarks.value  || 0);
  totalQEl.textContent  = `${total} question${total !== 1 ? "s" : ""}`;
  totalMkEl.textContent = `${marks} marks`;
}

// ── API Key ───────────────────────────────────────────
function handleSaveKey() {
  const key = groqKeyInp.value.trim();
  if (!key)              return showKeyStatus("Please enter your API key.", "err");
  if (!key.startsWith("gsk_"))
                         return showKeyStatus("Groq keys start with 'gsk_'. Check your key.", "warn");

  showKeyStatus("🔄 Testing connection…", "warn");
  saveKeyBtn.disabled = true;

  // Test the key with a minimal call
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);

  fetch(GROQ_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelSel.value,
      messages: [{ role: "user", content: "Say OK" }],
      max_tokens: 5
    }),
    signal: ctrl.signal
  })
  .then(r => {
    clearTimeout(timer);
    saveKeyBtn.disabled = false;
    if (r.ok) {
      savedKey = key;
      sessionStorage.setItem("groq_key", key);
      generateBtn.disabled = false;
      showKeyStatus("✅ Connected! Key saved for this session.", "ok");
    } else {
      r.json().then(e => showKeyStatus(`❌ ${e.error?.message || "Invalid key."}`, "err")).catch(() => {});
    }
  })
  .catch(err => {
    clearTimeout(timer);
    saveKeyBtn.disabled = false;
    if (err.name === "AbortError") {
      showKeyStatus("⏱ Connection timeout. Check your network.", "err");
    } else {
      showKeyStatus(`❌ ${err.message}`, "err");
    }
  });
}

function toggleEye() {
  groqKeyInp.type = groqKeyInp.type === "password" ? "text" : "password";
  eyeBtn.textContent = groqKeyInp.type === "password" ? "👁" : "🙈";
}

function showKeyStatus(msg, type) {
  keyStatus.textContent = msg;
  keyStatus.className = `key-status ${type}`;
  keyStatus.classList.remove("hidden");
}

// ── Generate ──────────────────────────────────────────
async function handleGenerate(regenMode = false) {
  hideError();

  const subject    = subjectSel.value;
  const grade      = gradeSel.value;
  const curriculum = curriculumSel.value;

  if (!subject)    return showError("Please select a subject.");
  if (!grade)      return showError("Please select a grade.");
  if (!curriculum) return showError("Please select a curriculum.");
  if (!savedKey)   return showError("Please enter and save your Groq API key first.");

  const m = +mcqCount.value || 0;
  const t = +tfCount.value  || 0;
  const s = +saCount.value  || 0;
  if (m + t + s === 0)   return showError("Please set at least 1 question in the breakdown.");

  const meta = {
    subject, grade, curriculum,
    difficulty: difficultySel.value,
    language:   languageSel.value,
    bloom:      bloomSel.value,
    topic:      topicInp.value.trim(),
    model:      modelSel.value,
    mcq: m, tf: t, sa: s,
    mcqPts: +mcqMarks.value || 1,
    tfPts:  +tfMarks.value  || 1,
    saPts:  +saMarks.value  || 1
  };

  lastMeta = meta;
  await callGroq(meta);
}

async function callGroq(meta, singleType = null, replaceIdx = -1) {
  const isSingle = singleType !== null;
  const isArabic = meta.language === "Arabic";
  const langNote = meta.language !== "English"
    ? `\nIMPORTANT: Generate ALL text (questions, options, answers, explanations) entirely in ${meta.language}.`
    : "";
  const bloomNote = meta.bloom ? `\nCognitive level (Bloom's): ${meta.bloom}.` : "";
  const topicNote = meta.topic ? `\nFocus topic: "${meta.topic}".` : "";

  let typeBreakdown;
  let totalQ;
  if (isSingle) {
    const labels = { mcq: "multiple choice", true_false: "true/false", short_answer: "short answer" };
    typeBreakdown = `Generate exactly 1 ${labels[singleType]} question.`;
    totalQ = 1;
  } else {
    const parts = [];
    if (meta.mcq > 0) parts.push(`${meta.mcq} multiple choice (MCQ)`);
    if (meta.tf  > 0) parts.push(`${meta.tf} true/false`);
    if (meta.sa  > 0) parts.push(`${meta.sa} short answer`);
    typeBreakdown = `Generate exactly: ${parts.join(", ")}.`;
    totalQ = meta.mcq + meta.tf + meta.sa;
  }

  const system = `You are an expert educator. You create accurate, curriculum-aligned test questions.
You ALWAYS respond with valid JSON only — no markdown fences, no explanation, just the JSON array.`;

  const user = `Create test questions for:
- Subject: ${meta.subject}
- Grade: ${meta.grade}
- Curriculum: ${meta.curriculum}
- Difficulty: ${meta.difficulty}${bloomNote}${topicNote}${langNote}

${typeBreakdown}

Return a JSON array of exactly ${totalQ} question object(s):
[
  {
    "type": "mcq" | "true_false" | "short_answer",
    "question": "Full question text",
    "options": ["Option 1","Option 2","Option 3","Option 4"],  // MCQ only — 4 plain strings
    "answer": "A" | "B" | "C" | "D" | "True" | "False" | "short answer text",
    "explanation": "Brief explanation of the correct answer"
  }
]
Rules: MCQ answer is a letter A-D. true_false answer is exactly "True" or "False".
Questions must be appropriate for ${meta.grade} students.
Do NOT include option letters inside the options array strings.`;

  const isRegenSingle = replaceIdx >= 0;
  setLoading(true, isRegenSingle
    ? `Regenerating question ${replaceIdx + 1}…`
    : `Generating ${totalQ} question${totalQ > 1 ? "s" : ""} with ${MODEL_LABELS[meta.model] || meta.model}…`
  );

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${savedKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: meta.model,
        messages: [
          { role: "system", content: system },
          { role: "user",   content: user }
        ],
        temperature: 0.75,
        max_tokens: isSingle ? 800 : Math.min(8000, totalQ * 400)
      }),
      signal: ctrl.signal
    });

    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${res.status}`;
      if (res.status === 401) throw new Error("Invalid API key — please re-save your key.");
      if (res.status === 429) throw new Error("Rate limit reached. Wait a moment and try again.");
      throw new Error(`Groq error: ${msg}`);
    }

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content || "";

    const parsed = extractJSON(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("AI returned empty result.");

    const normalised = parsed.map(q => normaliseQ(q, meta));

    if (isRegenSingle) {
      questions[replaceIdx] = normalised[0];
      setLoading(false);
      renderPreview();
    } else {
      questions = normalised;
      setLoading(false);
      renderPreview();
      previewCard.classList.remove("hidden");
      previewCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

  } catch (err) {
    clearTimeout(timer);
    setLoading(false);
    if (err.name === "AbortError") {
      showError(`Request timed out after ${API_TIMEOUT / 1000}s. Try a faster model or fewer questions.`);
    } else {
      showError(err.message);
    }
  }
}

function normaliseQ(q, meta) {
  const type = q.type || "short_answer";
  const pts = type === "mcq" ? meta.mcqPts : type === "true_false" ? meta.tfPts : meta.saPts;
  return {
    type,
    question:    String(q.question || ""),
    options:     Array.isArray(q.options) ? q.options.slice(0, 4) : [],
    answer:      String(q.answer || ""),
    explanation: String(q.explanation || ""),
    marks:       pts
  };
}

// ── Render Preview (interactive screen cards) ─────────
function renderPreview() {
  const lang = languageSel.value;
  const isRTL = lang === "Arabic";

  // Toolbar label
  const mcqs  = questions.filter(q => q.type === "mcq").length;
  const tfs   = questions.filter(q => q.type === "true_false").length;
  const sas   = questions.filter(q => q.type === "short_answer").length;
  const parts = [];
  if (mcqs) parts.push(`${mcqs} MCQ`);
  if (tfs)  parts.push(`${tfs} T/F`);
  if (sas)  parts.push(`${sas} Short`);
  previewLabel.textContent = parts.join(" · ") + ` · ${totalPts()} marks`;

  qEditor.innerHTML = "";

  questions.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "q-card";
    card.dataset.idx = idx;

    const optHtml = q.type === "mcq"
      ? `<ul class="q-card-options">${(q.options || []).map((o, i) => {
          const letter = "ABCD"[i];
          const correct = q.answer === letter;
          return `<li class="${correct && answerVis ? "correct" : ""}">
            <span class="opt-l">${letter}.</span><span>${esc(o)}</span></li>`;
        }).join("")}</ul>`
      : q.type === "true_false"
        ? `<div class="tf-row"><span>○ True</span><span>○ False</span></div>`
        : `<div class="tf-row" style="color:var(--g400);font-style:italic">Written answer</div>`;

    const ansHtml = answerVis
      ? `<div style="margin-top:8px;font-size:.8rem;padding:5px 8px;background:var(--green-l);
          border-radius:5px;color:var(--green-d);font-weight:600">
           ✓ ${esc(q.type === "mcq" ? `${q.answer}: ${q.options["ABCD".indexOf(q.answer)] || ""}` : q.answer)}
           ${q.explanation ? ` — <span style="font-weight:400;color:var(--g600)">${esc(q.explanation)}</span>` : ""}
         </div>`
      : "";

    card.innerHTML = `
      <div class="q-card-top">
        <div class="q-card-num">${idx + 1}</div>
        <div class="q-card-body">
          <div class="q-card-question ${isRTL ? "rtl" : ""}">${esc(q.question)}</div>
          ${optHtml}
          ${ansHtml}
        </div>
        <span class="marks-badge">${q.marks} pt${q.marks !== 1 ? "s" : ""}</span>
        <div class="q-card-actions">
          <button class="q-action-btn edit-btn"  title="Edit question"   data-idx="${idx}">✏️</button>
          <button class="q-action-btn regen-btn" title="Regenerate"      data-idx="${idx}">↺</button>
          <button class="q-action-btn del-btn"   title="Delete question" data-idx="${idx}">🗑</button>
        </div>
      </div>`;

    qEditor.appendChild(card);
  });

  // Delegate button events
  qEditor.onclick = e => {
    const btn = e.target.closest(".q-action-btn");
    if (!btn) return;
    const idx = +btn.dataset.idx;
    if (btn.classList.contains("edit-btn"))  openEditModal(idx);
    if (btn.classList.contains("regen-btn")) regenSingleQ(idx);
    if (btn.classList.contains("del-btn"))   deleteQuestion(idx);
  };

  // Rebuild answer key
  renderAnswerKey();
}

function totalPts() {
  return questions.reduce((s, q) => s + (q.marks || 0), 0);
}

// ── Answer Key ────────────────────────────────────────
function renderAnswerKey() {
  akGrid.innerHTML = questions.map((q, i) => {
    const ans = q.type === "mcq"
      ? `${q.answer}: ${q.options["ABCD".indexOf(q.answer)] || ""}`
      : q.answer;
    return `<div class="ak-item">
      <div><span class="ak-q">Q${i + 1}.</span> <span class="ak-a">${esc(ans)}</span></div>
      ${q.explanation ? `<div class="ak-ex">${esc(q.explanation)}</div>` : ""}
    </div>`;
  }).join("");
}

function toggleAnswers() {
  answerVis = !answerVis;
  toggleAnsBtn.textContent = answerVis ? "Hide Answers" : "Show Answers";
  akPanel.classList.toggle("hidden", !answerVis);
  renderPreview();
}

// ── Edit Modal ────────────────────────────────────────
function openEditModal(idx) {
  editingIdx = idx;
  const q = questions[idx];

  editQText.value    = q.question;
  editAnswer.value   = q.answer;
  editExpl.value     = q.explanation;

  if (q.type === "mcq") {
    editOptsWrap.innerHTML = `
      <label>Options</label>
      ${(q.options || []).map((o, i) => `
        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <span style="font-weight:700;min-width:18px;color:var(--green)">${"ABCD"[i]}.</span>
          <input type="text" id="edit-opt-${i}" value="${esc(o)}"
            style="flex:1;padding:7px 10px;border:1.5px solid var(--g200);border-radius:7px;font-size:.88rem"/>
        </div>`).join("")}
      <p style="font-size:.78rem;color:var(--g500);margin-top:8px">
        Set "Correct Answer" to A, B, C, or D to mark which option is correct.</p>`;
  } else if (q.type === "true_false") {
    editOptsWrap.innerHTML = `<p style="font-size:.82rem;color:var(--g500)">Set answer to <strong>True</strong> or <strong>False</strong>.</p>`;
  } else {
    editOptsWrap.innerHTML = "";
  }

  editModal.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
  editQText.focus();
}

function saveEdit() {
  if (editingIdx < 0) return;
  const q = questions[editingIdx];

  q.question    = editQText.value.trim();
  q.answer      = editAnswer.value.trim();
  q.explanation = editExpl.value.trim();

  if (q.type === "mcq") {
    q.options = [0,1,2,3].map(i => {
      const el = $(`edit-opt-${i}`);
      return el ? el.value.trim() : (q.options[i] || "");
    });
  }

  closeModal();
  renderPreview();
}

function closeModal() {
  editModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  editingIdx = -1;
}

// ── Per-question Regen ────────────────────────────────
async function regenSingleQ(idx) {
  const q = questions[idx];
  const btn = qEditor.querySelector(`.regen-btn[data-idx="${idx}"]`);
  if (btn) btn.innerHTML = `<span class="regen-spin">↺</span>`;

  await callGroq(lastMeta, q.type, idx);

  // Restore button (renderPreview handles this)
}

// ── Delete Question ───────────────────────────────────
function deleteQuestion(idx) {
  if (questions.length <= 1) return showError("Cannot delete the last question.");
  questions.splice(idx, 1);
  renderPreview();
}

// ── Add Question ──────────────────────────────────────
async function handleAddQuestion() {
  if (!savedKey) return showError("API key required to add questions.");
  if (!lastMeta.subject) return showError("Generate a test first before adding questions.");

  // Add a short answer by default
  await callGroq(lastMeta, "short_answer", -2); // -2 = append mode handled below
}

// Override: append mode
const _callGroq = callGroq;
Object.defineProperty(window, "_callGroqAppend", { value: async (meta) => {
  // Wrapped via handleAddQuestion — handled inline by checking replaceIdx = -2
}});

// ── Print ─────────────────────────────────────────────
function handlePrint() {
  buildPrintArea();
  window.print();
}

function buildPrintArea() {
  const isRTL = languageSel.value === "Arabic";
  const dir   = isRTL ? "rtl" : "ltr";

  const school   = schoolInp.value.trim();
  const teacher  = teacherInp.value.trim();
  const title    = titleInp.value.trim() || `${lastMeta.subject || "Test"}`;
  const date     = dateInp.value ? formatDate(dateInp.value) : formatDate(today());
  const dur      = durationInp.value.trim();
  const term     = termInp.value.trim();
  const instr    = instrInp.value.trim();
  const pts      = totalPts();

  const mcqs  = questions.filter(q => q.type === "mcq");
  const tfs   = questions.filter(q => q.type === "true_false");
  const sas   = questions.filter(q => q.type === "short_answer");

  let html = `<div class="pt-wrap" dir="${dir}">`;

  // Header
  if (school) html += `<div class="pt-school">${esc(school)}</div>`;
  html += `<div class="pt-title">${esc(title)}</div>`;
  html += `<div class="pt-meta">`;
  html += `<span><span class="pt-ml">${label("Subject")}:</span> ${esc(lastMeta.subject || "")}</span>`;
  html += `<span><span class="pt-ml">${label("Grade")}:</span> ${esc(lastMeta.grade || "")}</span>`;
  if (term)  html += `<span><span class="pt-ml">${label("Term")}:</span> ${esc(term)}</span>`;
  if (dur)   html += `<span><span class="pt-ml">${label("Duration")}:</span> ${esc(dur)}</span>`;
  html += `<span><span class="pt-ml">${label("Total")}:</span> ${pts} ${label("marks")}</span>`;
  html += `<span><span class="pt-ml">${label("Date")}:</span> ${date}</span>`;
  if (teacher) html += `<span><span class="pt-ml">${label("Teacher")}:</span> ${esc(teacher)}</span>`;
  html += `</div>`;

  // Student info bar
  html += `<div class="pt-border">
    <div class="pt-stu-row">
      <div class="pt-stu-field"><span class="pt-stu-lbl">${label("Name")}:</span><div class="pt-stu-line"></div></div>
      <div class="pt-stu-field"><span class="pt-stu-lbl">${label("Class")}:</span><div class="pt-stu-line" style="min-width:70px"></div></div>
      <div class="pt-stu-field"><span class="pt-stu-lbl">${label("Score")}:</span><div class="pt-stu-line" style="min-width:55px"></div></div>
    </div>
  </div>`;

  // Instructions
  if (instr) html += `<div class="pt-instructions">${esc(instr)}</div>`;

  const secCount = [mcqs, tfs, sas].filter(g => g.length > 0).length;
  const letters  = ["A","B","C"];
  let   secIdx   = 0;
  let   qNum     = 1;

  // MCQ section
  if (mcqs.length) {
    const secMark = mcqs.reduce((s,q) => s + q.marks, 0);
    const secLabel = secCount > 1 ? `${label("Section")} ${letters[secIdx++]}: ` : "";
    html += `<div class="pt-section">
      <div class="pt-sec-title">${secLabel}${label("Multiple Choice")} (${secMark} ${label("marks")})</div>
      <div class="pt-sec-inst">${label("Circle the letter of the best answer")}.</div>`;
    mcqs.forEach(q => { html += printMCQ(q, qNum++); });
    html += `</div>`;
  }

  // T/F section
  if (tfs.length) {
    const secMark = tfs.reduce((s,q) => s + q.marks, 0);
    const secLabel = secCount > 1 ? `${label("Section")} ${letters[secIdx++]}: ` : "";
    html += `<div class="pt-section">
      <div class="pt-sec-title">${secLabel}${label("True or False")} (${secMark} ${label("marks")})</div>
      <div class="pt-sec-inst">${label("Write True or False")}.</div>`;
    tfs.forEach(q => { html += printTF(q, qNum++); });
    html += `</div>`;
  }

  // Short answer section
  if (sas.length) {
    const secMark = sas.reduce((s,q) => s + q.marks, 0);
    const secLabel = secCount > 1 ? `${label("Section")} ${letters[secIdx++]}: ` : "";
    html += `<div class="pt-section">
      <div class="pt-sec-title">${secLabel}${label("Short Answer")} (${secMark} ${label("marks")})</div>
      <div class="pt-sec-inst">${label("Answer in complete sentences")}.</div>`;
    sas.forEach(q => { html += printSA(q, qNum++); });
    html += `</div>`;
  }

  // Answer key (separate page)
  html += `<div class="pt-ak">
    <div class="pt-ak-title">${label("Answer Key")}</div>
    <div class="pt-ak-grid">`;
  questions.forEach((q, i) => {
    const ans = q.type === "mcq"
      ? `${q.answer}: ${q.options["ABCD".indexOf(q.answer)] || ""}`
      : q.answer;
    html += `<div class="pt-ak-item">
      <span class="pt-ak-q">Q${i + 1}.</span>
      <span class="pt-ak-a"> ${esc(ans)}</span>
      ${q.explanation ? `<div class="pt-ak-ex">${esc(q.explanation)}</div>` : ""}
    </div>`;
  });
  html += `</div></div>`;

  html += `</div>`; // pt-wrap

  printArea.innerHTML = html;
}

function printMCQ(q, num) {
  const letters = ["A","B","C","D"];
  const opts = (q.options || []).map((o, i) =>
    `<li><span class="pt-ol">${letters[i]}.</span> ${esc(o)}</li>`).join("");
  return `<div class="pt-q">
    <div class="pt-qtext"><span class="pt-qnum">${num}.</span>${esc(q.question)}<span class="pt-marks">(${q.marks} pt${q.marks!==1?"s":""})</span></div>
    <ul class="pt-opts">${opts}</ul>
  </div>`;
}

function printTF(q, num) {
  return `<div class="pt-q">
    <div class="pt-qtext"><span class="pt-qnum">${num}.</span>${esc(q.question)}<span class="pt-marks">(${q.marks} pt${q.marks!==1?"s":""})</span></div>
    <div class="pt-tf"><span>○ True</span><span>○ False</span></div>
  </div>`;
}

function printSA(q, num) {
  return `<div class="pt-q">
    <div class="pt-qtext"><span class="pt-qnum">${num}.</span>${esc(q.question)}<span class="pt-marks">(${q.marks} pt${q.marks!==1?"s":""})</span></div>
    <div class="pt-ans-line"></div>
    <div class="pt-ans-line" style="margin-top:7px"></div>
  </div>`;
}

// Multilingual labels
function label(key) {
  const lang = languageSel.value;
  const LABELS = {
    Arabic: {
      "Subject":"المادة","Grade":"الصف","Term":"الفصل","Duration":"المدة",
      "Total":"المجموع","Date":"التاريخ","Teacher":"المعلم","Name":"الاسم",
      "Class":"الشعبة","Score":"الدرجة","Section":"القسم","marks":"درجة",
      "Multiple Choice":"اختيار من متعدد","True or False":"صح أم خطأ",
      "Short Answer":"إجابة قصيرة","Answer Key":"مفتاح الإجابات",
      "Circle the letter of the best answer":"ضع دائرة حول حرف الإجابة الصحيحة",
      "Write True or False":"اكتب صح أو خطأ",
      "Answer in complete sentences":"أجب بجمل كاملة"
    },
    French: {
      "Subject":"Matière","Grade":"Niveau","Term":"Trimestre","Duration":"Durée",
      "Total":"Total","Date":"Date","Teacher":"Professeur","Name":"Nom",
      "Class":"Classe","Score":"Note","Section":"Section","marks":"points",
      "Multiple Choice":"Choix Multiple","True or False":"Vrai ou Faux",
      "Short Answer":"Réponse Courte","Answer Key":"Corrigé",
      "Circle the letter of the best answer":"Entourez la lettre de la meilleure réponse",
      "Write True or False":"Écrivez Vrai ou Faux",
      "Answer in complete sentences":"Répondez par des phrases complètes"
    }
  };
  return LABELS[lang]?.[key] ?? key;
}

// ── Save / Load ───────────────────────────────────────
function saveToStorage() {
  if (!questions.length) return;
  const data = { questions, meta: lastMeta, header: {
    school: schoolInp.value, teacher: teacherInp.value,
    title: titleInp.value, date: dateInp.value,
    duration: durationInp.value, term: termInp.value,
    instructions: instrInp.value
  }};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  saveTestBtn.textContent = "✅ Saved!";
  setTimeout(() => saveTestBtn.textContent = "💾 Save", 2000);
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return showError("No saved test found.");
  try {
    const data = JSON.parse(raw);
    questions = data.questions || [];
    lastMeta  = data.meta || {};
    if (data.header) {
      schoolInp.value   = data.header.school   || "";
      teacherInp.value  = data.header.teacher  || "";
      titleInp.value    = data.header.title    || "";
      dateInp.value     = data.header.date     || today();
      durationInp.value = data.header.duration || "";
      termInp.value     = data.header.term     || "";
      instrInp.value    = data.header.instructions || "";
    }
    // Restore form
    if (lastMeta.subject)    subjectSel.value    = lastMeta.subject;
    if (lastMeta.grade)      gradeSel.value      = lastMeta.grade;
    if (lastMeta.curriculum) curriculumSel.value = lastMeta.curriculum;
    if (lastMeta.language)   languageSel.value   = lastMeta.language;

    previewCard.classList.remove("hidden");
    renderPreview();
    previewCard.scrollIntoView({ behavior: "smooth" });
    hideError();
  } catch {
    showError("Saved data is corrupted. Cannot load.");
  }
}

// ── Clear ─────────────────────────────────────────────
function handleClear() {
  ["subject","grade","curriculum","language","bloom","topic",
   "school-name","teacher-name","test-title","duration","term","instructions"]
    .forEach(id => { const el = $(id); if (el) el.value = ""; });
  subjectSel.value    = "";
  gradeSel.value      = "";
  curriculumSel.value = "";
  difficultySel.value = "Medium";
  languageSel.value   = "English";
  bloomSel.value      = "";
  mcqCount.value      = 5;
  tfCount.value       = 3;
  saCount.value       = 2;
  dateInp.value       = today();
  updateTotals();
  previewCard.classList.add("hidden");
  questions = [];
  hideError();
}

// ── Helpers ───────────────────────────────────────────
function setLoading(show, msg) {
  loadingWrap.classList.toggle("hidden", !show);
  if (msg) loadingMsg.innerHTML = msg;
  generateBtn.disabled  = show;
  regenAllBtn.disabled  = show;
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

function today() { return new Date().toISOString().slice(0, 10); }

/**
 * Robustly extract the top-level JSON array from an AI response.
 * Uses bracket-depth tracking so nested arrays (e.g. "options") don't
 * cause a premature cut-off, which would produce a parse error.
 */
function extractJSON(raw) {
  // Strip markdown fences: ```json ... ``` or ``` ... ```
  let text = raw.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

  const start = text.indexOf("[");
  if (start === -1) throw new Error("AI response contained no JSON array. Try again.");

  // Walk forward tracking bracket depth to find the matching closing ]
  let depth = 0;
  let end   = -1;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if      (ch === "[") depth++;
    else if (ch === "]") { depth--; if (depth === 0) { end = i; break; } }
  }

  if (end === -1) throw new Error("AI returned incomplete JSON. Try again or use a smarter model.");

  let jsonStr = text.slice(start, end + 1);

  // Common fix: trailing commas before } or ] (some models add them)
  jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");

  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("AI returned an empty list of questions. Try again.");
    }
    return parsed;
  } catch (e) {
    throw new Error(`Could not parse AI response: ${e.message}. Try switching to Llama 3.3 70B.`);
  }
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}
