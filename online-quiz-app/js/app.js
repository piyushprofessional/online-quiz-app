"use strict";

const QUESTION_KEY = "quizmaster_questions_v1";
const LEADERBOARD_KEY = "quizmaster_leaderboard_v1";
const THEME_KEY = "quizmaster_theme_v1";
const ADMIN_KEY = "quizmaster_admin_logged_in";
const ADMIN_PASSWORD = "admin123";

const defaultQuestions = [
  {
    id: makeId(),
    category: "Web Development",
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correct: 1
  },
  {
    id: makeId(),
    category: "Web Development",
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-style", "color", "background-color"],
    correct: 2
  },
  {
    id: makeId(),
    category: "Web Development",
    question: "Which CSS layout is best for making responsive columns?",
    options: ["Grid", "Alert", "Cookie", "Prompt"],
    correct: 0
  },
  {
    id: makeId(),
    category: "Web Development",
    question: "Which attribute gives alternative text for an image?",
    options: ["src", "alt", "title", "href"],
    correct: 1
  },
  {
    id: makeId(),
    category: "JavaScript",
    question: "Which keyword is used to declare a constant variable?",
    options: ["var", "let", "const", "static"],
    correct: 2
  },
  {
    id: makeId(),
    category: "JavaScript",
    question: "Which method converts JSON text into a JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
    correct: 0
  },
  {
    id: makeId(),
    category: "JavaScript",
    question: "Which event runs when a user clicks an element?",
    options: ["mouseover", "keydown", "click", "submit"],
    correct: 2
  },
  {
    id: makeId(),
    category: "JavaScript",
    question: "Where is browser local data commonly stored for small projects?",
    options: ["localStorage", "Router", "CSS", "Header"],
    correct: 0
  },
  {
    id: makeId(),
    category: "Computer Basics",
    question: "CPU stands for what?",
    options: ["Central Processing Unit", "Control Program Utility", "Computer Power Unit", "Central Print Unit"],
    correct: 0
  },
  {
    id: makeId(),
    category: "Computer Basics",
    question: "Which device is used to store data permanently?",
    options: ["RAM", "Hard Disk / SSD", "Keyboard", "Monitor"],
    correct: 1
  },
  {
    id: makeId(),
    category: "Computer Basics",
    question: "Which one is an operating system?",
    options: ["Chrome", "Windows", "HTML", "Python"],
    correct: 1
  },
  {
    id: makeId(),
    category: "Computer Basics",
    question: "Which memory is temporary?",
    options: ["ROM", "RAM", "SSD", "DVD"],
    correct: 1
  },
  {
    id: makeId(),
    category: "General Knowledge",
    question: "What is the capital of India?",
    options: ["Mumbai", "Pune", "New Delhi", "Jaipur"],
    correct: 2
  },
  {
    id: makeId(),
    category: "General Knowledge",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    correct: 1
  },
  {
    id: makeId(),
    category: "General Knowledge",
    question: "How many states are there in India?",
    options: ["26", "27", "28", "30"],
    correct: 2
  },
  {
    id: makeId(),
    category: "General Knowledge",
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correct: 2
  }
];

let questions = loadQuestions();
let leaderboard = loadLeaderboard();

let currentQuiz = [];
let currentIndex = 0;
let selectedAnswers = [];
let quizTimer = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let currentPlayer = null;
let lastResult = null;

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
const goButtons = document.querySelectorAll("[data-go]");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");

const setupForm = document.getElementById("setupForm");
const playerName = document.getElementById("playerName");
const playerEmail = document.getElementById("playerEmail");
const categorySelect = document.getElementById("categorySelect");
const limitSelect = document.getElementById("limitSelect");

const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const questionMap = document.getElementById("questionMap");
const quizCategoryLabel = document.getElementById("quizCategoryLabel");
const questionTitle = document.getElementById("questionTitle");
const optionsBox = document.getElementById("optionsBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const quitQuizBtn = document.getElementById("quitQuizBtn");

const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultPercent = document.getElementById("resultPercent");
const resultGrade = document.getElementById("resultGrade");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const totalCount = document.getElementById("totalCount");
const timeTaken = document.getElementById("timeTaken");
const retryBtn = document.getElementById("retryBtn");
const reviewBtn = document.getElementById("reviewBtn");
const printResultBtn = document.getElementById("printResultBtn");
const reviewBox = document.getElementById("reviewBox");

const leaderboardTable = document.getElementById("leaderboardTable");
const leaderboardEmpty = document.getElementById("leaderboardEmpty");
const clearLeaderboardBtn = document.getElementById("clearLeaderboardBtn");

const adminLoginCard = document.getElementById("adminLoginCard");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPassword = document.getElementById("adminPassword");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const questionForm = document.getElementById("questionForm");
const questionId = document.getElementById("questionId");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const optionC = document.getElementById("optionC");
const optionD = document.getElementById("optionD");
const correctAnswer = document.getElementById("correctAnswer");
const resetQuestionBtn = document.getElementById("resetQuestionBtn");
const resetDefaultQuestionsBtn = document.getElementById("resetDefaultQuestionsBtn");
const questionList = document.getElementById("questionList");
const adminSearch = document.getElementById("adminSearch");

function makeId() {
  return "id_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

function loadQuestions() {
  const saved = localStorage.getItem(QUESTION_KEY);
  if (!saved) {
    localStorage.setItem(QUESTION_KEY, JSON.stringify(defaultQuestions));
    return [...defaultQuestions];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultQuestions];
  } catch {
    return [...defaultQuestions];
  }
}

function saveQuestions() {
  localStorage.setItem(QUESTION_KEY, JSON.stringify(questions));
}

function loadLeaderboard() {
  const saved = localStorage.getItem(LEADERBOARD_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveLeaderboard() {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function setPage(pageId) {
  pages.forEach(page => page.classList.toggle("active", page.id === pageId));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.go === pageId));
  window.location.hash = pageId;
  nav.classList.remove("open");

  if (pageId === "leaderboard") renderLeaderboard();
  if (pageId === "admin") renderAdminState();
}

function renderHomeStats() {
  document.getElementById("heroQuestionCount").textContent = questions.length;
  document.getElementById("heroAttempts").textContent = leaderboard.length;
  const best = leaderboard.length ? Math.max(...leaderboard.map(item => item.percent)) : 0;
  document.getElementById("heroBestScore").textContent = best + "%";
}

function renderCategorySelect() {
  const categories = [...new Set(questions.map(q => q.category))].sort();
  categorySelect.innerHTML = `<option value="">Select quiz category</option>` +
    categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz(event) {
  event.preventDefault();

  document.getElementById("nameError").textContent = "";
  document.getElementById("categoryError").textContent = "";

  const name = playerName.value.trim();
  const email = playerEmail.value.trim();
  const category = categorySelect.value;
  const limit = limitSelect.value;

  if (name.length < 3) {
    document.getElementById("nameError").textContent = "Name must be at least 3 characters.";
    return;
  }

  if (!category) {
    document.getElementById("categoryError").textContent = "Please select a category.";
    return;
  }

  const categoryQuestions = questions.filter(q => q.category === category);
  const selectedLimit = limit === "all" ? categoryQuestions.length : Number(limit);

  currentQuiz = shuffleArray(categoryQuestions).slice(0, selectedLimit);
  if (!currentQuiz.length) {
    showToast("No questions available in this category.");
    return;
  }

  currentPlayer = { name, email, category };
  currentIndex = 0;
  selectedAnswers = Array(currentQuiz.length).fill(null);

  totalSeconds = currentQuiz.length * 45;
  remainingSeconds = totalSeconds;

  setPage("quizPage");
  renderQuestion();
  startTimer();
}

function startTimer() {
  clearInterval(quizTimer);
  updateTimer();

  quizTimer = setInterval(() => {
    remainingSeconds--;
    updateTimer();

    if (remainingSeconds <= 0) {
      clearInterval(quizTimer);
      submitQuiz(true);
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = formatTime(remainingSeconds);

  if (remainingSeconds <= 30) {
    timerEl.style.color = "var(--danger)";
  } else {
    timerEl.style.color = "var(--text)";
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function renderQuestion() {
  const q = currentQuiz[currentIndex];

  quizCategoryLabel.textContent = q.category;
  questionTitle.textContent = `${currentIndex + 1}. ${q.question}`;

  optionsBox.innerHTML = q.options.map((option, index) => `
    <button class="option-btn ${selectedAnswers[currentIndex] === index ? "selected" : ""}" type="button" data-option="${index}">
      ${String.fromCharCode(65 + index)}. ${escapeHtml(option)}
    </button>
  `).join("");

  document.querySelectorAll(".option-btn").forEach(button => {
    button.addEventListener("click", () => {
      selectedAnswers[currentIndex] = Number(button.dataset.option);
      renderQuestion();
    });
  });

  const progress = ((currentIndex + 1) / currentQuiz.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Question ${currentIndex + 1} of ${currentQuiz.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === currentQuiz.length - 1;

  renderQuestionMap();
}

function renderQuestionMap() {
  questionMap.innerHTML = currentQuiz.map((_, index) => `
    <button class="map-btn ${index === currentIndex ? "active" : ""} ${selectedAnswers[index] !== null ? "answered" : ""}" type="button" data-index="${index}">
      ${index + 1}
    </button>
  `).join("");

  document.querySelectorAll(".map-btn").forEach(button => {
    button.addEventListener("click", () => {
      currentIndex = Number(button.dataset.index);
      renderQuestion();
    });
  });
}

function submitQuiz(autoSubmit = false) {
  const unanswered = selectedAnswers.filter(answer => answer === null).length;

  if (!autoSubmit && unanswered > 0) {
    const ok = confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`);
    if (!ok) return;
  }

  clearInterval(quizTimer);

  let correct = 0;
  currentQuiz.forEach((question, index) => {
    if (selectedAnswers[index] === question.correct) correct++;
  });

  const total = currentQuiz.length;
  const wrong = total - correct;
  const percent = Math.round((correct / total) * 100);
  const grade = getGrade(percent);
  const usedSeconds = totalSeconds - remainingSeconds;

  lastResult = {
    id: makeId(),
    name: currentPlayer.name,
    email: currentPlayer.email,
    category: currentPlayer.category,
    correct,
    wrong,
    total,
    percent,
    grade,
    time: usedSeconds,
    date: new Date().toLocaleString(),
    questions: currentQuiz,
    answers: selectedAnswers
  };

  leaderboard.push({
    id: lastResult.id,
    name: lastResult.name,
    category: lastResult.category,
    score: `${correct}/${total}`,
    percent,
    grade,
    date: lastResult.date
  });

  leaderboard.sort((a, b) => b.percent - a.percent);
  leaderboard = leaderboard.slice(0, 50);
  saveLeaderboard();

  renderResult();
  renderHomeStats();
  setPage("resultPage");
}

function getGrade(percent) {
  if (percent >= 90) return "A+";
  if (percent >= 75) return "A";
  if (percent >= 60) return "B";
  if (percent >= 40) return "C";
  return "Fail";
}

function renderResult() {
  if (!lastResult) return;

  resultTitle.textContent = lastResult.percent >= 40 ? "Congratulations!" : "Keep Practicing!";
  resultMessage.textContent = `${lastResult.name}, you scored ${lastResult.score || `${lastResult.correct}/${lastResult.total}`} in ${lastResult.category}.`;
  resultPercent.textContent = `${lastResult.percent}%`;
  resultGrade.textContent = `Grade ${lastResult.grade}`;
  correctCount.textContent = lastResult.correct;
  wrongCount.textContent = lastResult.wrong;
  totalCount.textContent = lastResult.total;
  timeTaken.textContent = formatTime(lastResult.time);

  reviewBox.classList.remove("show");
  reviewBox.innerHTML = lastResult.questions.map((q, index) => {
    const userAnswer = lastResult.answers[index];
    const isCorrect = userAnswer === q.correct;
    return `
      <article class="review-item">
        <h4>${index + 1}. ${escapeHtml(q.question)}</h4>
        <p>Your Answer: <span class="${isCorrect ? "correct" : "incorrect"}">
          ${userAnswer === null ? "Not Answered" : escapeHtml(q.options[userAnswer])}
        </span></p>
        <p>Correct Answer: <span class="correct">${escapeHtml(q.options[q.correct])}</span></p>
      </article>
    `;
  }).join("");
}

function renderLeaderboard() {
  leaderboardEmpty.style.display = leaderboard.length ? "none" : "block";

  leaderboardTable.innerHTML = leaderboard.map((item, index) => `
    <tr>
      <td>#${index + 1}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td><strong>${item.score}</strong> (${item.percent}%)</td>
      <td><span class="badge">${escapeHtml(item.grade)}</span></td>
      <td>${escapeHtml(item.date)}</td>
    </tr>
  `).join("");
}

function renderAdminState() {
  const loggedIn = sessionStorage.getItem(ADMIN_KEY) === "true";
  adminLoginCard.classList.toggle("hidden", loggedIn);
  adminDashboard.classList.toggle("hidden", !loggedIn);

  if (loggedIn) renderQuestionList();
}

function resetQuestionForm() {
  questionForm.reset();
  questionId.value = "";
  document.getElementById("saveQuestionBtn").textContent = "Save Question";
  document.querySelectorAll("#questionForm .error").forEach(el => el.textContent = "");
}

function validateQuestionForm() {
  const errors = {};

  const options = [optionA.value.trim(), optionB.value.trim(), optionC.value.trim(), optionD.value.trim()];

  if (!questionCategory.value.trim()) errors.questionCategory = "Category is required.";
  if (questionText.value.trim().length < 8) errors.questionText = "Question must be at least 8 characters.";
  if (options.some(option => !option)) errors.questionText = "All four options are required.";
  if (correctAnswer.value === "") errors.correctAnswer = "Select correct answer.";

  document.querySelectorAll("#questionForm .error").forEach(el => el.textContent = "");
  Object.entries(errors).forEach(([key, value]) => {
    const el = document.getElementById(key + "Error");
    if (el) el.textContent = value;
  });

  return Object.keys(errors).length === 0;
}

function saveQuestion(event) {
  event.preventDefault();

  if (!validateQuestionForm()) return;

  const data = {
    id: questionId.value || makeId(),
    category: questionCategory.value.trim(),
    question: questionText.value.trim(),
    options: [optionA.value.trim(), optionB.value.trim(), optionC.value.trim(), optionD.value.trim()],
    correct: Number(correctAnswer.value)
  };

  if (questionId.value) {
    questions = questions.map(item => item.id === questionId.value ? data : item);
    showToast("Question updated.");
  } else {
    questions.unshift(data);
    showToast("Question added.");
  }

  saveQuestions();
  resetQuestionForm();
  renderQuestionList();
  renderCategorySelect();
  renderHomeStats();
}

function renderQuestionList() {
  const query = adminSearch.value.toLowerCase().trim();

  const filtered = questions.filter(q =>
    q.question.toLowerCase().includes(query) ||
    q.category.toLowerCase().includes(query)
  );

  questionList.innerHTML = filtered.map(q => `
    <article class="question-item">
      <span class="badge">${escapeHtml(q.category)}</span>
      <h3>${escapeHtml(q.question)}</h3>
      <p>Correct: <strong>${escapeHtml(q.options[q.correct])}</strong></p>
      <div class="question-actions">
        <button class="mini-btn edit" type="button" onclick="editQuestion('${q.id}')">Edit</button>
        <button class="mini-btn delete" type="button" onclick="deleteQuestion('${q.id}')">Delete</button>
      </div>
    </article>
  `).join("") || `<p class="empty-message" style="display:block;">No questions found.</p>`;
}

function editQuestion(id) {
  const q = questions.find(item => item.id === id);
  if (!q) return;

  questionId.value = q.id;
  questionCategory.value = q.category;
  questionText.value = q.question;
  optionA.value = q.options[0];
  optionB.value = q.options[1];
  optionC.value = q.options[2];
  optionD.value = q.options[3];
  correctAnswer.value = String(q.correct);
  document.getElementById("saveQuestionBtn").textContent = "Update Question";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteQuestion(id) {
  const q = questions.find(item => item.id === id);
  if (!q) return;

  if (!confirm("Delete this question?")) return;

  questions = questions.filter(item => item.id !== id);
  saveQuestions();
  renderQuestionList();
  renderCategorySelect();
  renderHomeStats();
  showToast("Question deleted.");
}

function resetDefaultQuestions() {
  if (!confirm("Reset all questions to default? Your custom questions will be removed.")) return;

  questions = [...defaultQuestions].map(q => ({ ...q, id: makeId() }));
  saveQuestions();
  renderQuestionList();
  renderCategorySelect();
  renderHomeStats();
  showToast("Default questions restored.");
}

function clearLeaderboard() {
  if (!leaderboard.length) return;
  if (!confirm("Clear all leaderboard records?")) return;

  leaderboard = [];
  saveLeaderboard();
  renderLeaderboard();
  renderHomeStats();
  showToast("Leaderboard cleared.");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

goButtons.forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    setPage(button.dataset.go);
  });
});

setupForm.addEventListener("submit", startQuiz);

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < currentQuiz.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

submitQuizBtn.addEventListener("click", () => submitQuiz(false));

quitQuizBtn.addEventListener("click", () => {
  if (!confirm("Quit this quiz? Your progress will not be saved.")) return;
  clearInterval(quizTimer);
  setPage("home");
});

retryBtn.addEventListener("click", () => {
  setPage("startQuiz");
});

reviewBtn.addEventListener("click", () => {
  reviewBox.classList.toggle("show");
});

printResultBtn.addEventListener("click", () => window.print());

clearLeaderboardBtn.addEventListener("click", clearLeaderboard);

adminLoginForm.addEventListener("submit", event => {
  event.preventDefault();

  if (adminPassword.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    adminPassword.value = "";
    showToast("Admin login successful.");
    renderAdminState();
  } else {
    showToast("Invalid admin password.");
  }
});

adminLogoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(ADMIN_KEY);
  renderAdminState();
});

questionForm.addEventListener("submit", saveQuestion);
resetQuestionBtn.addEventListener("click", resetQuestionForm);
resetDefaultQuestionsBtn.addEventListener("click", resetDefaultQuestions);
adminSearch.addEventListener("input", renderQuestionList);

menuBtn.addEventListener("click", () => nav.classList.toggle("open"));

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  themeToggle.textContent = next === "dark" ? "☀️ Light" : "🌙 Dark";
});

document.addEventListener("click", event => {
  if (window.innerWidth > 720) return;
  if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
    nav.classList.remove("open");
  }
});

window.editQuestion = editQuestion;
window.deleteQuestion = deleteQuestion;

const savedTheme = localStorage.getItem(THEME_KEY) || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "☀️ Light" : "🌙 Dark";

renderCategorySelect();
renderLeaderboard();
renderHomeStats();

const initialPage = window.location.hash.replace("#", "");
if (initialPage && document.getElementById(initialPage)) {
  setPage(initialPage);
}
