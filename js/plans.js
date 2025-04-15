

// plans.js
import { cards } from "./data.js";

// Progress bar ve sayacı seçiyoruz
const progressCount = document.getElementById("progress-count");
const progressTotal = document.getElementById("progress-total");
const progressBar = document.getElementById("progress-bar");
const congratsMessage = document.getElementById("congrats-message");
const progressSection = document.getElementById("progress");
const cardContainer = document.getElementById("card-container");

// Başlangıç değişkenleri
let reviewedCount = 0;
let todaysCards = [];

// Progress Bar güncelleme fonksiyonu
function updateProgress() {
  progressCount.textContent = reviewedCount;
  const percent = (reviewedCount / todaysCards.length) * 100;
  progressBar.style.width = `${percent}%`;

  if (percent < 50) {
    progressBar.className = "bg-red-500 h-4 transition-all duration-500";
  } else if (percent < 80) {
    progressBar.className = "bg-yellow-400 h-4 transition-all duration-500";
  } else {
    progressBar.className = "bg-green-500 h-4 transition-all duration-500";
  }

  if (percent === 100) {
    congratsMessage.classList.remove("hidden");
  }
}

// Kartları yükleyen fonksiyon
export function loadPlannedReview(day) {
  // Önce eski verileri temizliyoruz
  cardContainer.innerHTML = "";
  reviewedCount = 0;
  congratsMessage.classList.add("hidden");

  // Progress alanını gösteriyoruz
  progressSection.classList.remove("hidden");

  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + day);
  const targetDateString = targetDate.toISOString().split("T")[0];

  todaysCards = JSON.parse(localStorage.getItem("cards")).filter(
    (card) => card.nextReview <= targetDateString && card.box === getBoxNumber(day)
  );

  progressTotal.textContent = todaysCards.length;

  todaysCards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "bg-white p-4 rounded shadow w-64 text-center";

    cardEl.innerHTML = `
      <p class="font-bold text-lg mb-2">${card.front}</p>
      <div class="flex gap-2 justify-center">
        <button class="know-btn bg-green-400 px-3 py-1 rounded text-white">Biliyorum</button>
        <button class="dont-know-btn bg-red-400 px-3 py-1 rounded text-white">Bilmiyorum</button>
      </div>
    `;

    const knowBtn = cardEl.querySelector(".know-btn");
    const dontKnowBtn = cardEl.querySelector(".dont-know-btn");

    knowBtn.addEventListener("click", () => {
      reviewedCount++;
      updateProgress();
      cardEl.remove();
    });

    dontKnowBtn.addEventListener("click", () => {
      reviewedCount++;
      updateProgress();
      cardEl.remove();
    });

    cardContainer.appendChild(cardEl);
  });
}

// Kaç gün hangi box'a ait
function getBoxNumber(day) {
  if (day === 3) return 2;
  if (day === 7) return 3;
  if (day === 30) return 4;
  return 1;
}
window.loadPlannedReview = loadPlannedReview;
