// js/review.js

// Data.js'den kart verilerini alıyoruz
import { cards } from "./data.js";

// Gün içinde tekrar edilen kelime sayısını tutacak değişken
let reviewedToday = 0;

// HTML Elementlerini seçiyoruz
const progressCount = document.getElementById("progress-count");
const progressTotal = document.getElementById("progress-total");
const progressBar = document.getElementById("progress-bar");
const congratsMessage = document.getElementById("congrats-message");
const app = document.getElementById("app");

// LocalStorage'dan kart verisini çekiyoruz
if (!localStorage.getItem("cards")) {
  localStorage.setItem("cards", JSON.stringify(cards));
}
let storedCards = JSON.parse(localStorage.getItem("cards"));

// Bugünün tarihini al
const today = new Date().toISOString().split("T")[0];

// Sadece bugünkü tekrar edilecek kartları filtrele
const todaysCards = storedCards.filter(card => card.nextReview <= today);

// Toplam kart sayısını yaz
progressTotal.textContent = todaysCards.length;

// Progress bar ve ilerleme yazısını güncelleyen fonksiyon
function updateProgress() {
  progressCount.textContent = reviewedToday;
  const percent = (reviewedToday / todaysCards.length) * 100;
  progressBar.style.width = `${percent}%`;

  // Renk değişimi
  if (percent < 50) {
    progressBar.className = "bg-red-500 h-4 transition-all duration-500";
  } else if (percent < 80) {
    progressBar.className = "bg-yellow-400 h-4 transition-all duration-500";
  } else {
    progressBar.className = "bg-green-500 h-4 transition-all duration-500";
  }

  // %100 olunca mesaj göster
  if (percent === 100) {
    congratsMessage.classList.remove("hidden");
  }
}

// HTML'e kartları bastığımız yer
todaysCards.forEach(card => {
  const wrapper = document.createElement("div");
  wrapper.className = "w-64 h-40 perspective";

  const inner = document.createElement("div");
  inner.className = "card-inner relative w-full h-full";

  const front = document.createElement("div");
  front.className = "front bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-between backface-hidden";
  front.innerHTML = `
    <p class="text-lg font-bold text-primary">${card.front}</p>
    <div class="flex gap-2 mt-4">
      <button class="know-btn bg-green-400 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">I Know</button>
      <button class="dont-know-btn bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded">I Don't</button>
    </div>
  `;

  const back = document.createElement("div");
  back.className = "back bg-accent text-white rounded-lg shadow-lg p-4 flex items-center justify-center rotate-y-180 backface-hidden";
  back.innerHTML = `<p class="text-lg font-bold">${card.back}</p>`;

  inner.appendChild(front);
  inner.appendChild(back);
  wrapper.appendChild(inner);
  app.appendChild(wrapper);

  // Kartı döndürme (flip)
  wrapper.addEventListener("click", () => {
    inner.classList.toggle("rotate-y-180");
  });

  // Butonlara tıklama işlemi
  const knowBtn = front.querySelector(".know-btn");
  const dontKnowBtn = front.querySelector(".dont-know-btn");

  knowBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Kart döndürmeyi engelle
    reviewedToday++;
    updateProgress();
    console.log(`✅ "${card.front}" kelimesi BİLİNİYOR olarak işaretlendi.`);
  });

  dontKnowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    reviewedToday++;
    updateProgress();
    inner.classList.add("rotate-y-180");
    console.log(`❌ "${card.front}" kelimesi BİLİNMİYOR olarak işaretlendi.`);
  });

});