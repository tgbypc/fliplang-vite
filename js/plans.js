import { cards as defaultCards } from './data.js';

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

  const today = new Date();

  const allCards = JSON.parse(localStorage.getItem("cards")) || [];
  todaysCards = allCards.filter(
    (card) => card.nextReview === today.toISOString().split("T")[0] && card.box === getBoxNumber(day)
  );


  if (todaysCards.length === 0) {
    infoMessage.textContent = "Seçilen aralıkta tekrar edilecek kart bulunamadı.";
    cardContainer.classList.add("hidden");
    progressSection.classList.add("hidden");
    return;
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
  cardEl.className = "w-full max-w-md bg-gradient-to-r from-fuchsia-300 to-pink-400 p-6 rounded-xl shadow-xl text-white text-center mx-auto";
  
  cardEl.classList.add("opacity-0");
  setTimeout(() => {
    cardEl.classList.remove("opacity-0");
    cardEl.classList.add("transition-opacity", "duration-700", "opacity-100");
  }, 10);

  cardEl.innerHTML = `
    <p class="font-bold text-2xl mb-6">${card.front}</p>
    <div class="flex justify-center gap-4">
      <button class="know-btn bg-emerald-300 hover:bg-emerald-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow transition">
        Biliyorum
      </button>
      <button class="dont-know-btn bg-rose-300 hover:bg-rose-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow transition">
        Bilmiyorum
      </button>
    </div>
    <div class="back-section hidden mt-6">
      <p class="text-lg font-semibold">${card.back}</p>
      <p class="text-sm mt-2 text-gray-200">Anlamını gördün, şimdi tekrar et!</p>
      <button class="next-btn mt-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow transition flex items-center justify-center gap-2 mx-auto">
        Devam Et
        <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 10-1.414 1.414L13.586 9H4a1 1 0 100 2h9.586l-3.293 3.293a1 1 0 000 1.414z"/>
        </svg>
      </button>
    </div>
  `;

  const knowBtn = cardEl.querySelector(".know-btn");
  const dontKnowBtn = cardEl.querySelector(".dont-know-btn");
  const backSection = cardEl.querySelector(".back-section");

  knowBtn.addEventListener("click", () => {
    reviewedCount++;
    updateProgress();

    if (card.box === 1) {
      card.box = 2;
      const next = new Date();
      next.setDate(next.getDate() + 3);
      card.nextReview = next.toISOString().split("T")[0];
    } else if (card.box === 2) {
      card.box = 3;
      const next = new Date();
      next.setDate(next.getDate() + 7);
      card.nextReview = next.toISOString().split("T")[0];
    } else if (card.box === 3) {
      card.box = 4;
      const next = new Date();
      next.setDate(next.getDate() + 30);
      card.nextReview = next.toISOString().split("T")[0];
    } else if (card.box === 4) {
      card.box = 5; // Öğrenilen olarak işaretle
      card.nextReview = null;
    }

    // Güncellenen kartı kaydet
    const allCards = JSON.parse(localStorage.getItem("cards")) || [];
    const indexInStorage = allCards.findIndex(c => c.id === card.id);
    if (indexInStorage !== -1) {
      allCards[indexInStorage] = card;
      localStorage.setItem("cards", JSON.stringify(allCards));
    }

    showCard(index + 1);
  });

  dontKnowBtn.addEventListener("click", () => {
    backSection.classList.remove("hidden");
    // Leitner sistemine göre kutu 1'e düşür ve yarın tekrar et
    card.box = 1;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    card.nextReview = tomorrow.toISOString().split("T")[0];

    const allCards = JSON.parse(localStorage.getItem("cards")) || [];
    const indexInStorage = allCards.findIndex(c => c.id === card.id);
    if (indexInStorage !== -1) {
      allCards[indexInStorage] = card;
      localStorage.setItem("cards", JSON.stringify(allCards));
    }

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
