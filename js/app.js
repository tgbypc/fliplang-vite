import { cards } from "./data.js";

let reviewedToday = 0;
const progressCount = document.getElementById("progress-count");
const progressTotal = document.getElementById("progress-total");
const progressBar = document.getElementById("progress-bar");
const congratsMessage = document.getElementById("congrats-message");

if (!localStorage.getItem("cards")) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

let storedCards = JSON.parse(localStorage.getItem("cards"));

// Tarih
const today = new Date().toISOString().split("T")[0];
const todaysCards = storedCards.filter(card => card.nextReview <= today);

progressTotal.textContent = todaysCards.length;

// Progress Bar güncelleme fonksiyonu
function updateProgress() {
  progressCount.textContent = reviewedToday;
  const percent = (reviewedToday / todaysCards.length) * 100;
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

const app = document.getElementById("app");
app.classList.add("flex", "flex-wrap", "justify-center", "gap-6");

todaysCards.forEach((card) => {
  const wrapper = document.createElement("div");
  wrapper.className = "w-64 h-40 perspective";

  const inner = document.createElement("div");
  inner.className = "card-inner relative w-full h-full";

  const front = document.createElement("div");
  front.className =
    "front bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-between backface-hidden";
  front.innerHTML = `
    <p class="text-lg font-bold text-primary">${card.front}</p>
    <div class="flex gap-2 mt-4">
      <button class="know-btn bg-green-400 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">I Know</button>
      <button class="dont-know-btn bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded">I Don't</button>
    </div>
  `;

  const back = document.createElement("div");
  back.className =
    "back bg-accent text-white rounded-lg shadow-lg p-4 flex items-center justify-center rotate-y-180 backface-hidden";
  back.innerHTML = `<p class="text-lg font-bold">${card.back}</p>`;

  inner.appendChild(front);
  inner.appendChild(back);
  wrapper.appendChild(inner);
  app.appendChild(wrapper);

  // Kart Dönme
  wrapper.addEventListener("click", () => {
    inner.classList.toggle("rotate-y-180");
  });

  // Butonlar
  const knowBtn = front.querySelector(".know-btn");
  const dontKnowBtn = front.querySelector(".dont-know-btn");

  knowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
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