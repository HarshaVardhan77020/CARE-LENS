const $ = (id) => document.getElementById(id);

const menuToggle = $("menuToggle");
const mainNav = $("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

$("analyzeBtn").addEventListener("click", () => {
  $("reportResults").innerHTML = `
    <div class="result-title"><h3>Sample report explained</h3><span class="demo-tag">DEMO</span></div>
    <div class="result-item"><strong>Hemoglobin — 12.8 g/dL</strong><p>Hemoglobin is a protein in red blood cells that carries oxygen. Whether this value is within an expected range depends on factors such as age, sex, pregnancy status, and the laboratory's reference range.</p></div>
    <div class="result-item"><strong>White blood cells — 6.2 ×10⁹/L</strong><p>White blood cells help the immune system respond to infections and other conditions. A clinician interprets this alongside the lab's range and the person's symptoms.</p></div>
    <div class="result-item"><strong>Platelets — 250 ×10⁹/L</strong><p>Platelets help blood clot. The meaning of this number depends on the laboratory's reference range and the person's overall health.</p></div>
    <div class="result-summary"><strong>What to do next:</strong> These are fictional example values, not a real medical assessment. Compare real results with the reference ranges printed on the report and ask a qualified healthcare professional to interpret them.</div>
    <span class="result-note">FICTIONAL SAMPLE · NOT MEDICAL ADVICE</span>`;
  showToast("Sample explanation displayed.");
});

$("reportFile").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  $("fileStatus").textContent = file
    ? `Selected: ${file.name}. This prototype does not upload or analyze files.`
    : "No file selected. Files are not uploaded or analyzed.";
  if (file) showToast("File selected for interface preview only.");
});

document.querySelectorAll("[data-symptom]").forEach(button => {
  button.addEventListener("click", () => {
    $("symptomInput").value = button.dataset.symptom;
    $("symptomInput").focus();
  });
});

$("symptomBtn").addEventListener("click", () => {
  const query = $("symptomInput").value.trim();
  if (!query) {
    showToast("Enter a health topic or choose a suggestion first.");
    $("symptomInput").focus();
    return;
  }
  const q = query.toLowerCase();
  let title = "General health information";
  let content = "Health concerns can have many possible explanations. Note when the concern started, how it changes, and any other symptoms. A qualified healthcare professional can help assess your individual situation.";
  if (q.includes("headache") || q.includes("head pain")) {
    title = "About mild headaches";
    content = "Headaches can be associated with many factors, including stress, missed meals, dehydration, eye strain, or illness. Resting in a quiet space, drinking water if appropriate, and taking a screen break may help some people. New, severe, sudden, persistent, or worsening headaches need prompt medical advice.";
  } else if (q.includes("hydration") || q.includes("water")) {
    title = "Everyday hydration habits";
    content = "Keep water accessible, drink regularly throughout the day, and pay attention to thirst and your circumstances, including heat and activity. Hydration needs vary by person; follow medical advice if you have a condition that affects fluid intake.";
  } else if (q.includes("sleep")) {
    title = "Building a sleep routine";
    content = "A consistent sleep and wake time, a relaxing bedtime routine, and reducing bright screens near bedtime may support sleep. Sleep needs vary with age. If sleep difficulties persist or affect daily life, consider talking with a healthcare professional.";
  } else if (q.includes("chest pain") || q.includes("can't breathe") || q.includes("cannot breathe") || q.includes("severe bleeding") || q.includes("stroke")) {
    title = "Seek urgent medical help";
    content = "These may be signs of a medical emergency. Contact your local emergency service or seek urgent medical care now. Do not rely on this website for emergency assessment.";
  }
  $("symptomResult").innerHTML = `<span class="result-kicker">GENERAL EDUCATION · DEMO</span><div class="guidance-icon">✚</div><h3>${title}</h3><p>${content}</p><div class="notice">This tool cannot diagnose or assess your personal risk. For severe, sudden, or rapidly worsening symptoms, seek urgent medical care.</div>`;
});

let waterCount = 4;
$("addWater").addEventListener("click", () => {
  waterCount = Math.min(8, waterCount + 1);
  $("waterCount").textContent = waterCount;
  $("waterProgress").style.width = `${waterCount / 8 * 100}%`;
  if (waterCount === 8) showToast("Demo tracker reached 8 glasses. Personal needs vary.");
  else showToast("Demo water tracker updated.");
});

$("reminderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("reminderInput");
  const value = input.value.trim();
  if (!value) {
    showToast("Type a reminder first.");
    input.focus();
    return;
  }
  const li = document.createElement("li");
  const label = document.createElement("span");
  label.textContent = value;
  const when = document.createElement("span");
  when.className = "reminder-time";
  when.textContent = "Today";
  li.append(label, when);
  $("reminderList").prepend(li);
  input.value = "";
  showToast("Reminder added to this demo.");
});

function assistantReply(question) {
  const q = question.toLowerCase();
  if (q.includes("sleep")) return "A regular sleep and wake schedule, a calm bedtime routine, and a comfortable sleep environment may support better sleep. Sleep needs vary by age and individual. If sleep problems persist, consider speaking with a healthcare professional.";
  if (q.includes("water") || q.includes("hydrat")) return "Hydration needs vary with age, activity, climate, and health. Keeping water accessible and drinking regularly can help. If a clinician has advised you to limit fluids, follow that advice.";
  if (q.includes("report") || q.includes("blood test") || q.includes("hemoglobin")) return "I can explain common medical terms for learning, but this demo cannot interpret a real report. Reference ranges vary by laboratory and person. Please discuss your results with a qualified healthcare professional.";
  if (q.includes("diagnos") || q.includes("what disease") || q.includes("medicine") || q.includes("treatment")) return "I can't diagnose a condition or recommend a personal treatment. A qualified healthcare professional can assess your symptoms, history, and any test results.";
  if (q.includes("chest pain") || q.includes("can't breathe") || q.includes("cannot breathe") || q.includes("emergency")) return "If you may be experiencing a medical emergency, contact your local emergency service or seek urgent medical care now. Do not wait for an online response.";
  return "I can share general educational information, but I can't assess your individual health or diagnose a condition. Consider noting your questions and discussing them with a qualified healthcare professional. You can ask me about general topics such as sleep, hydration, or common medical terms.";
}

function sendChat(question) {
  const messages = $("chatMessages");
  const user = document.createElement("div");
  user.className = "message user-message";
  user.textContent = question;
  messages.appendChild(user);
  const reply = document.createElement("div");
  reply.className = "message bot-message";
  reply.textContent = assistantReply(question);
  messages.appendChild(reply);
  messages.scrollTop = messages.scrollHeight;
}
$("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("chatInput");
  const question = input.value.trim();
  if (!question) return;
  sendChat(question);
  input.value = "";
});
document.querySelectorAll("[data-question]").forEach(button => {
  button.addEventListener("click", () => sendChat(button.dataset.question));
});

$("privacyLink").addEventListener("click", (event) => {
  event.preventDefault();
  $("privacy").classList.toggle("show");
  if ($("privacy").classList.contains("show")) {
    $("privacy").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});
