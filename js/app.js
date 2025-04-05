import { cards } from "./data.js";
let reviewedToday = 0;
const progressCount = document.getElementById("progress-count");

if (!localStorage.getItem("cards")) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

let storedCards = JSON.parse(localStorage.getItem("cards"));

// Tarih
const today = new Date().toISOString().split("T")[0];
const todaysCards = storedCards.filter(card => card.nextReview <= today);
todaysCards.forEach((card) => {

});

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

  // ✅ Flip işlemi 
  wrapper.addEventListener("click", () => {
    inner.classList.toggle("rotate-y-180");
  });

  // Butonlara erisim (event delegation olmadan)

  const knowBtn = front.querySelector(".know-btn");
  const dontKnowBtn = front.querySelector(".dont-know-btn");

  knowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    reviewedToday++;
    progressCount.textContent = reviewedToday;
    console.log(`✅ "${card.front}" kelimesi BİLİNİYOR olarak işaretlendi.`);
  });

  dontKnowBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    reviewedToday++;
    progressCount.textContent = reviewedToday;
    inner.classList.add("rotate-y-180");
    console.log(`❌ "${card.front}" kelimesi BİLİNMİYOR olarak işaretlendi.`);
  });
});

// Biliyorum secildiyse kutuyu artir
function handleKnow(cardId) {
  const today = new Date();

  storedCards = storedCards.map((card) => {
    if (card.id === cardId) {
      const newBox = Math.min(card.box + 1, 4);
      let daysToAdd = 0;

      if (newBox === 1) daysToAdd = 0;
      if (newBox === 2) daysToAdd = 3;
      if (newBox === 3) daysToAdd = 7;
      if (newBox === 4) daysToAdd = 30;

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysToAdd);

      return {
        ...card,
        box: Math.min(card.box + 1, 4), // max box: 4
        nextReview: nextDate.toISOString().split("T")[0],
      };
    }
    return card;
  });

  localStorage.setItem("cards", JSON.stringify(storedCards));
}
 
// "Bilmiyorum" secildeyse kutuya geri don
function handleDontKnow(cardId) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+ 1); // Bugune bir gun ekle!

  const nextReviewDate = tomorrow.toISOString().split("T")[0];

  storedCards = storedCards.map((card) => {
    if (card.id === cardId) {
      return {
        ...card, 
        box: 1,
        nextReview: nextReviewDate
      };
    }
    return card;
  });
  localStorage.setItem("cards", JSON.stringify(storedCards));
}