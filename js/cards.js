// js/cards.js

// HTML Elementlerini Seçiyoruz
const myCardsSection = document.getElementById("myCardsSection");
const apiCardsSection = document.getElementById("apiCardsSection");
const myCardsTab = document.getElementById("myCardsTab");
const apiCardsTab = document.getElementById("apiCardsTab");

// LocalStorage'dan Kartları Alıyoruz
const storedCards = JSON.parse(localStorage.getItem("cards")) || [];

// TAB GEÇİŞİ
myCardsTab.addEventListener("click", () => {
  myCardsSection.classList.remove("hidden");
  apiCardsSection.classList.add("hidden");
  myCardsTab.classList.add("bg-primary", "text-white");
  apiCardsTab.classList.remove("bg-primary", "text-white");
});

apiCardsTab.addEventListener("click", () => {
  myCardsSection.classList.add("hidden");
  apiCardsSection.classList.remove("hidden");
  apiCardsTab.classList.add("bg-primary", "text-white");
  myCardsTab.classList.remove("bg-primary", "text-white");
});

// Benim Kartlarım - SLIDE Yapısı
const myCardsWrapper = document.createElement("div");
myCardsWrapper.className = "flex overflow-x-auto gap-4 py-4";

storedCards.forEach(card => {
  const div = document.createElement("div");
  div.className = "min-w-[200px] bg-white p-4 rounded-xl shadow";
  div.innerHTML = `
    <p class="font-bold text-primary">${card.front}</p>
    <p class="text-gray-500">${card.back}</p>
  `;
  myCardsWrapper.appendChild(div);
});

myCardsSection.appendChild(myCardsWrapper);

// API'den Hazır Kelime Seti Çekme
async function fetchApiWords() {
  const response = await fetch('https://dummyjson.com/products?limit=10');
  const data = await response.json();

  const apiCardsWrapper = document.getElementById("apiCardsWrapper");

  data.products.forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-xl shadow";
    div.innerHTML = `
      <p class="font-bold text-primary">${item.title}</p>
      <p class="text-gray-500">${item.description}</p>
    `;
    apiCardsWrapper.appendChild(div);
  });
}

fetchApiWords();