// js/app.js

// Tema Başlatma
function initTheme() {
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = "light";
    localStorage.setItem("theme", currentTheme);
  }

  const target = document.documentElement;

  if (currentTheme === "dark") {
    target.classList.add("dark");
  } else {
    target.classList.remove("dark");
  }
}

// Tema Toggle
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const newTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
}

// Günlük tekrar kontrolü (Bildirim)
function checkDailyReviews() {
  const storedCards = JSON.parse(localStorage.getItem("cards")) || [];
  const today = new Date().toISOString().split("T")[0];
  const hasTodayCards = storedCards.some(card => card.nextReview === today);

  const notificationEl = document.getElementById("notification");
  if (hasTodayCards && notificationEl) {
    notificationEl.classList.remove("hidden");
  }
}

// DOM yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", () => {
  // Tema kontrolü ve uygulanması (her sayfada)
  initTheme();

  // Tema butonu varsa dinleyici ekle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Bildirim kontrolü sadece notification elementi varsa çalışsın
  if (document.getElementById("notification")) {
    checkDailyReviews();
  }

  loadDashboardStats(); // Load mini stats on dashboard
});

// Ortak mesaj gösterimi
export function showMessage(message, type = "success") {
  const existing = document.getElementById("apiMessage");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.id = "apiMessage";
  msg.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white ${
    type === "success" ? "bg-green-500" : "bg-yellow-500"
  }`;
  msg.textContent = message;
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}

function loadDashboardStats() {
  const storedCards = JSON.parse(localStorage.getItem("cards")) || [];
  const today = new Date().toISOString().split("T")[0];

  const todayCount = storedCards.filter(card => card.nextReview === today).length;
  const learnedCount = storedCards.filter(card => card.box === 4).length;
  const totalCount = storedCards.length;
  const progressPercent = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  const todayEl = document.getElementById("statToday");
  const learnedEl = document.getElementById("statLearned");
  const progressEl = document.getElementById("statProgress");

  if (todayEl) todayEl.textContent = todayCount.toString();
  if (learnedEl) learnedEl.textContent = learnedCount.toString();
  if (progressEl) progressEl.textContent = `%${progressPercent}`;
}
