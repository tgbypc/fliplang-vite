import { cards as defaultCards } from './data.js';
import { getNextReviewDate, getBoxLabel } from './leitner.js';

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getStoredCards() {
  return JSON.parse(localStorage.getItem("cards")) || [];
}

function updateCardInStorage(card) {
  const allCards = getStoredCards();
  const indexInStorage = allCards.findIndex(c => c.id === card.id);
  if (indexInStorage !== -1) {
    allCards[indexInStorage] = card;
    localStorage.setItem("cards", JSON.stringify(allCards));
  }
}

function renderCardHTML(card) {
  return `
    <div class="bg-white dark:bg-white text-gray-800 p-6 rounded-lg shadow-md">
      <p class="font-bold text-2xl mb-6 text-center">${card.front}</p>
      <div class="flex justify-center gap-4">
        <button class="know-btn bg-primary text-white hover:bg-primary/80 font-semibold px-4 py-2 rounded-lg shadow transition">
          Biliyorum
        </button>
        <button class="dont-know-btn bg-rose-400 text-white hover:bg-rose-500 font-semibold px-4 py-2 rounded-lg shadow transition">
          Bilmiyorum
        </button>
      </div>
      <div class="back-section hidden mt-6 text-center">
        <p class="text-lg font-semibold">${card.back}</p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-300">Anlamını gördün, şimdi tekrar et!</p>
        <button class="next-btn mt-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow transition flex items-center justify-center gap-2 mx-auto">
          Devam Et
          <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 10-1.414 1.414L13.586 9H4a1 1 0 100 2h9.586l-3.293 3.293a1 1 0 000 1.414z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

if (!localStorage.getItem("cards")) {
  localStorage.setItem("cards", JSON.stringify(defaultCards));
}

// Progress ve kart alanlarını seçiyoruz
const progressCount = document.getElementById("progressCount");
const progressBar = document.getElementById("progressBar");
const congratsMessage = document.getElementById("completionMessage");
const progressSection = document.getElementById("progressContainer");
const cardContainer = document.getElementById("cardContainer");
const infoMessage = document.getElementById("infoMessage");

// Başlangıç değişkenleri
let reviewedCount = 0;
let todaysCards = [];

// Progress Bar güncelleme
function updateProgress() {
  progressCount.textContent = reviewedCount;
  const percent = (reviewedCount / todaysCards.length) * 100;
  progressBar.style.width = `${percent}%`;

  if (percent < 50) {
    progressBar.className = "h-3 bg-red-500 rounded-full transition-all";
  } else if (percent < 80) {
    progressBar.className = "h-3 bg-yellow-400 rounded-full transition-all";
  } else {
    progressBar.className = "h-3 bg-green-500 rounded-full transition-all";
  }

  if (percent === 100) {
    congratsMessage.classList.remove("hidden");
  }
}

// Kartları yükleyen fonksiyon
export function loadPlannedReview(day) {
  cardContainer.innerHTML = "";
  reviewedCount = 0;
  congratsMessage.classList.add("hidden");
  progressSection.classList.remove("hidden");
  cardContainer.classList.remove("hidden");
  cardContainer.classList.remove("opacity-0");

  const today = new Date(getTodayDate());

  const allCards = getStoredCards();
  todaysCards = allCards.filter(
    (card) => card.nextReview === today.toISOString().split("T")[0] && card.box === getBoxNumber(day)
  );


  if (todaysCards.length === 0) {
    infoMessage.textContent = "Seçilen aralıkta tekrar edilecek kart bulunamadı.";
    infoMessage.classList.remove("hidden");
    cardContainer.classList.add("hidden");
    progressSection.classList.add("hidden");
    return;
  } else {
    infoMessage.classList.add("hidden");
  }

  showCard(0);
}

// Kartları sırayla göster
function showCard(index) {
  const card = todaysCards[index];
  if (!card) {
    cardContainer.innerHTML = "";
    congratsMessage.classList.remove("hidden");
    return;
  }

  cardContainer.innerHTML = "";

  const cardEl = document.createElement("div");
  cardEl.className = "w-full max-w-md bg-purple-100 dark:bg-purple-300 text-gray-800 dark:text-gray-900 p-6 rounded-xl shadow-xl text-center mx-auto transition-all";
  
  cardEl.classList.add("opacity-0");
  setTimeout(() => {
    cardEl.classList.remove("opacity-0");
    cardEl.classList.add("transition-opacity", "duration-700", "opacity-100");
  }, 10);

  cardEl.innerHTML = renderCardHTML(card);

  const knowBtn = cardEl.querySelector(".know-btn");
  const dontKnowBtn = cardEl.querySelector(".dont-know-btn");
  const backSection = cardEl.querySelector(".back-section");

  knowBtn.addEventListener("click", () => {
    reviewedCount++;
    updateProgress();

    if (card.box === 1) {
      card.box = 2;
      card.nextReview = getNextReviewDate(2);
    } else if (card.box === 2) {
      card.box = 3;
      card.nextReview = getNextReviewDate(3);
    } else if (card.box === 3) {
      card.box = 4;
      card.nextReview = getNextReviewDate(4);
    } else if (card.box === 4) {
      card.box = 5; // Öğrenilen olarak işaretle
      card.nextReview = null;
    }

    // Güncellenen kartı kaydet
    updateCardInStorage(card);

    showCard(index + 1);
  });

  dontKnowBtn.addEventListener("click", () => {
    backSection.classList.remove("hidden");
    // Leitner sistemine göre kutu 1'e düşür ve yarın tekrar et
    card.box = 1;
    card.nextReview = getNextReviewDate(1);

    updateCardInStorage(card);

    dontKnowBtn.disabled = true;
    knowBtn.disabled = true;

    const nextBtn = cardEl.querySelector(".next-btn");
    nextBtn.addEventListener("click", () => {
      reviewedCount++;
      updateProgress();
      showCard(index + 1);
    });
  });

  cardContainer.appendChild(cardEl);
}

// Gün sayısına göre Leitner kutusu
function getBoxNumber(day) {
  if (day === 3) return 2;
  if (day === 7) return 3;
  if (day === 30) return 4;
  return 1;
}

// URL'den gün parametresini kontrol et
const urlParams = new URLSearchParams(window.location.search);
const autoDay = parseInt(urlParams.get("day"));
if ([3, 7, 30].includes(autoDay)) {
  loadPlannedReview(autoDay);
}

// Dropdown değiştiğinde kartları yükle
document.querySelectorAll(".day-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedDay = parseInt(btn.value);
    loadPlannedReview(selectedDay);
  });
});
