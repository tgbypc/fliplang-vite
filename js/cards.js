import { getBoxLabel } from "./leitner.js";
const myCardsSection = document.getElementById("myCardsSection");
const apiCardsSection = document.getElementById("apiCardsSection");
const myCardsTab = document.getElementById("myCardsTab");
const apiCardsTab = document.getElementById("apiCardsTab");

import { showMessage } from "./app.js";

function getStoredCards() {
  return JSON.parse(localStorage.getItem("cards")) || [];
}

function addCardToStorage(card) {
  const stored = getStoredCards();
  stored.push(card);
  localStorage.setItem("cards", JSON.stringify(stored));
}

function toggleTabs(showMyCards) {
  if (showMyCards) {
    myCardsSection.classList.remove("hidden");
    apiCardsSection.classList.add("hidden");
    myCardsTab.classList.add("bg-primary", "text-white");
    apiCardsTab.classList.remove("bg-primary", "text-white");
  } else {
    apiCardsSection.classList.remove("hidden");
    myCardsSection.classList.add("hidden");
    apiCardsTab.classList.add("bg-primary", "text-white");
    myCardsTab.classList.remove("bg-primary", "text-white");
  }
}

function createMyCard(card) {
  const div = document.createElement("div");
  div.className = "flex justify-between items-center bg-white text-gray-900 dark:bg-white dark:text-gray-800 border border-gray-200 dark:border-gray-300 p-4 rounded-lg shadow hover:shadow-md transition";

  div.innerHTML = `
    <div>
      <p class="font-medium text-primary">📘 ${card.front} ➜ ${card.back}</p>
      <p class="text-sm text-gray-500">📅 Eklendi: ${card.reviewedDate || "-"} | 🔁 ${getBoxLabel(card.box)}</p>
    </div>
    <button class="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition">🗑 Sil</button>
  `;

  div.querySelector("button").addEventListener("click", () => {
    const updated = getStoredCards().filter(c => c.id !== card.id);
    localStorage.setItem("cards", JSON.stringify(updated));
    div.remove();
  });

  return div;
}

function createApiCard(item) {
  const div = document.createElement("div");
  div.className = "flex justify-between items-center bg-white text-gray-900 dark:bg-white dark:text-gray-800 border border-gray-200 dark:border-gray-300 p-4 rounded-lg shadow hover:shadow-md transition";

  div.innerHTML = `
    <div>
      <p class="font-bold text-primary text-base">${item.en} ➜ ${item.tr}</p>
    </div>
    <button class="ml-4 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">➕ Ekle</button>
  `;

  div.querySelector("button").addEventListener("click", () => {
    const stored = getStoredCards();
    const exists = stored.find(c => c.front === item.en);
    if (!exists) {
      addCardToStorage({
        id: Date.now(),
        front: item.en,
        back: item.tr,
        box: 1,
        reviewedDate: new Date().toISOString().split("T")[0],
        nextReview: new Date().toISOString().split("T")[0]
      });
      showMessage(`✅ "${item.en}" kelimesi eklendi!`, "success");
    } else {
      showMessage(`⚠️ "${item.en}" zaten eklenmiş.`, "warning");
    }
  });

  return div;
}

myCardsTab.addEventListener("click", () => toggleTabs(true));
apiCardsTab.addEventListener("click", () => toggleTabs(false));

// LocalStorage Kartları
const myCardsWrapper = document.getElementById("myCardsWrapper");

getStoredCards().forEach(card => {
  myCardsWrapper.appendChild(createMyCard(card));
});

async function fetchApiWords() {
  try {
    const response = await fetch("sample_word_sets.json");
    const data = await response.json();

    const greetingWrapper = document.getElementById("setGreeting");
    const dailyWrapper = document.getElementById("setDaily");
    const phrasesWrapper = document.getElementById("apiPhrasesWrapper");

    // Selamlaşma ve Günlük Hayat örnek ayrımı
    const greetings = data.words.slice(0, 5);
    const daily = data.words.slice(5, 10);
    const phrases = data.phrases;

    greetings.forEach(item => greetingWrapper.appendChild(createApiCard(item)));
    daily.forEach(item => dailyWrapper.appendChild(createApiCard(item)));
    phrases.forEach(item => phrasesWrapper.appendChild(createApiCard(item)));

  } catch (error) {
    console.error("API verisi alınamadı:", error);
  }
}
fetchApiWords();

// Accordion toggles
document.querySelectorAll(".toggle-set").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    target.classList.toggle("hidden");
  });
});
