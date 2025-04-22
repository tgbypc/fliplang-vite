// Get cards from localStorage
function getStoredCards() {
  return JSON.parse(localStorage.getItem("cards")) || [];
}

// Get today's date (YYYY-MM-DD)
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Set theme from localStorage
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

// Toggle theme
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const newTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", newTheme);
}

// Show notifications for due cards
function checkDailyReviews() {
  const storedCards = getStoredCards();
  const today = getTodayDate();
  const dueCards = storedCards.filter((card) => card.nextReview === today);

  const notificationEl = document.getElementById("notification");
  const notificationCount = document.getElementById("notificationCount");

  // Show in-app dashboard notification
  if (dueCards.length > 0 && notificationEl) {
    notificationEl.classList.remove("hidden");
    if (notificationCount) {
      notificationCount.textContent = dueCards.length;
    }
  }

  // Show browser notification (if permission is granted)
  if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted" && dueCards.length > 0) {
        new Notification("📚 FlipLang", {
          body: `You have ${dueCards.length} word(s) to review today.`,
          icon: "assets/icon.png",
        });
      }
    });
  }
}

// Run after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme preference
  initTheme();

  // Theme toggle button listener
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Prevent form submission reload if add-word form exists
  const addForm = document.getElementById("wordForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  // Check notifications if notification element exists
  if (document.getElementById("notification")) {
    checkDailyReviews();
  }

  // Load dashboard mini stats if dashboard is present
  if (document.getElementById("statToday")) {
    loadDashboardStats();
  }

  // Mobile menu toggle (hamburger)
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});

// Toast message handler
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

// Load mini stats to dashboard
function loadDashboardStats() {
  const storedCards = getStoredCards();
  const today = getTodayDate();

  const todayCount = storedCards.filter(
    (card) => card.nextReview === today,
  ).length;
  const learnedCount = storedCards.filter((card) => card.box === 4).length;
  const totalCount = storedCards.length;
  const progressPercent =
    totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  const todayEl = document.getElementById("statToday");
  const learnedEl = document.getElementById("statLearned");
  const progressEl = document.getElementById("statProgress");

  if (todayEl) todayEl.textContent = todayCount;
  if (learnedEl) learnedEl.textContent = learnedCount;
  if (progressEl) progressEl.textContent = `%${progressPercent}`;
}
