import { getNextReviewDate } from "./leitner.js";

// Return today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Generate the front side of a flashcard
function renderCard(card) {
  return `
    <div class="bg-white text-gray-800 dark:bg-white dark:text-gray-800 shadow rounded-xl p-6 transition duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
      <p class="text-xl font-display font-bold text-yellow-600 dark:text-yellow-600 mb-6">${card.front}</p>
      <div class="flex justify-center gap-4">
        <button id="knowBtn" class="px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-full font-semibold transition">Biliyorum</button>
        <button id="dontKnowBtn" class="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-full font-semibold transition">Bilmiyorum</button>
      </div>
    </div>
  `;
}

// Generate the back side of a flashcard (shown after incorrect answer)
function renderBackCard(card) {
  return `
    <div class="bg-surface text-textMain dark:bg-gray-800 dark:text-white shadow rounded-xl p-6 text-center hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
      <p class="text-xl font-display font-bold text-red-500 mb-4">${card.front}</p>
      <p class="text-muted mb-6">${card.back}</p>
      <button id="nextBtn" class="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full font-semibold transition">Devam Et</button>
    </div>
  `;
}

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const wordContainer = document.getElementById("wordContainer");
const emptyMessage = document.getElementById("emptyMessage");

let reviewWords = JSON.parse(localStorage.getItem("cards")) || [];

const today = getTodayDate();
reviewWords = reviewWords.filter((card) => card.nextReview === today);

let currentIndex = 0;
let correctCount = 0;

// Show or hide the empty message state
function toggleEmptyMessage(show) {
  if (emptyMessage) emptyMessage.style.display = show ? "block" : "none";
}

// Update review progress bar and text
function updateProgress() {
  const percent = Math.round((correctCount / reviewWords.length) * 100);
  progressBar.style.width = `${percent}%`;

  if (percent < 50) progressBar.className = "h-2 rounded bg-red-500";
  else if (percent < 80) progressBar.className = "h-2 rounded bg-yellow-400";
  else progressBar.className = "h-2 rounded bg-green-500";

  progressText.textContent = `${correctCount} / ${reviewWords.length} kelime tekrar edildi.`;
}

// Render current card and handle user actions
function showCard() {
  const card = reviewWords[currentIndex];

  wordContainer.innerHTML = renderCard(card);

  document.getElementById("knowBtn").addEventListener("click", () => {
    const card = reviewWords[currentIndex];
    card.box = Math.min((card.box || 1) + 1, 4);
    card.nextReview = getNextReviewDate(card.box);

    correctCount++;
    currentIndex++;
    updateProgress();

    if (currentIndex < reviewWords.length) showCard();
    else finishReview();

    saveChanges();
  });

  document.getElementById("dontKnowBtn").addEventListener("click", () => {
    const wrongCard = reviewWords[currentIndex];

    wordContainer.innerHTML = renderBackCard(wrongCard);

    wrongCard.box = 1;
    wrongCard.nextReview = getNextReviewDate(1);

    saveChanges();

    document.getElementById("nextBtn").addEventListener("click", () => {
      currentIndex++;
      if (currentIndex < reviewWords.length) showCard();
      else finishReview();
      updateProgress();
    });
  });
}

// Display final message after all reviews are completed
function finishReview() {
  wordContainer.innerHTML = `
    <div class="text-center animate-fade-in-up">
      <h3 class="text-2xl font-bold text-indigo-600 dark:text-green-400 mb-4">Tebrikler!</h3>
      <p class="text-gray-800 dark:text-white drop-shadow-sm text-sm">Tüm kelimeleri başarıyla tekrar ettiniz.</p>
    </div>
  `;

  toggleEmptyMessage(true);
}

// Save updated card states back to localStorage
function saveChanges() {
  const allCards = JSON.parse(localStorage.getItem("cards")) || [];
  const updated = allCards.map((c) => {
    const match = reviewWords.find((r) => r.id === c.id);
    return match ? match : c;
  });
  localStorage.setItem("cards", JSON.stringify(updated));
}

// Initialize review session
if (reviewWords.length > 0) {
  toggleEmptyMessage(false);
  updateProgress();
  showCard();
} else {
  toggleEmptyMessage(true);
}
