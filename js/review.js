const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const wordContainer = document.getElementById("wordContainer");
const emptyMessage = document.getElementById("emptyMessage");

let reviewWords = JSON.parse(localStorage.getItem("cards")) || [];

// Sadece bugünkü kartlar
const today = new Date().toISOString().split("T")[0];
reviewWords = reviewWords.filter(card => card.nextReview === today);

let currentIndex = 0;
let correctCount = 0;

function toggleEmptyMessage(show) {
  if (emptyMessage) emptyMessage.style.display = show ? "block" : "none";
}

function updateProgress() {
  const percent = Math.round((correctCount / reviewWords.length) * 100);
  progressBar.style.width = `${percent}%`;

  if (percent < 50) progressBar.className = "h-2 rounded bg-red-500";
  else if (percent < 80) progressBar.className = "h-2 rounded bg-yellow-400";
  else progressBar.className = "h-2 rounded bg-green-500";

  progressText.textContent = `${correctCount} / ${reviewWords.length} kelime tekrar edildi`;
}

function showCard() {
  const card = reviewWords[currentIndex];

  wordContainer.innerHTML = `
    <div class="bg-white shadow rounded-xl p-6 transition duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up">
      <p class="text-xl font-bold text-indigo-600 mb-6">${card.front}</p>
      <div class="flex justify-center gap-4">
        <button id="knowBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Biliyorum</button>
        <button id="dontKnowBtn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Bilmiyorum</button>
      </div>
    </div>
  `;

  document.getElementById("knowBtn").addEventListener("click", () => {
    reviewWords[currentIndex].box = Math.min((reviewWords[currentIndex].box || 1) + 1, 4);
    const nextDays = [0, 3, 7, 30][reviewWords[currentIndex].box - 1];
    const next = new Date();
    next.setDate(next.getDate() + nextDays);
    reviewWords[currentIndex].nextReview = next.toISOString().split("T")[0];

    correctCount++;
    currentIndex++;
    updateProgress();

    if (currentIndex < reviewWords.length) showCard();
    else finishReview();

    saveChanges();
  });

  document.getElementById("dontKnowBtn").addEventListener("click", () => {
    const wrongCard = reviewWords[currentIndex];

    wordContainer.innerHTML = `
      <div class="bg-white shadow rounded-xl p-6 text-center hover:scale-105 hover:shadow-lg animate-fade-in-up">
        <p class="text-xl font-bold text-red-500 mb-4">${wrongCard.front}</p>
        <p class="text-gray-700 mb-6">${wrongCard.back}</p>
        <button id="nextBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Devam Et</button>
      </div>
    `;

    wrongCard.box = 1;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    wrongCard.nextReview = tomorrow.toISOString().split("T")[0];

    saveChanges();

    document.getElementById("nextBtn").addEventListener("click", () => {
      currentIndex++;
      if (currentIndex < reviewWords.length) showCard();
      else finishReview();
      updateProgress();
    });
  });
}

function finishReview() {
  wordContainer.innerHTML = `
    <div class="text-center animate-fade-in-up">
      <h3 class="text-2xl font-bold text-indigo-600 dark:text-green-400 mb-4">Tebrikler!</h3>
      <p class="text-gray-800 dark:text-white drop-shadow-sm text-sm">Tüm kelimeleri başarıyla tekrar ettiniz.</p>
    </div>
  `;

  toggleEmptyMessage(true);
}

function saveChanges() {
  const allCards = JSON.parse(localStorage.getItem("cards")) || [];
  const updated = allCards.map(c => {
    const match = reviewWords.find(r => r.id === c.id);
    return match ? match : c;
  });
  localStorage.setItem("cards", JSON.stringify(updated));
}

if (reviewWords.length > 0) {
  toggleEmptyMessage(false);
  updateProgress();
  showCard();
} else {
  toggleEmptyMessage(true);
}