import { getBoxLabel } from "./leitner.js";
const { jsPDF } = window.jspdf;

function getStoredCards() {
  return JSON.parse(localStorage.getItem("cards")) || [];
}

function createLearnedCard(card) {
  const div = document.createElement("div");
  div.className = "flex justify-between items-center bg-white dark:bg-white text-gray-900 dark:text-gray-800 p-4 rounded-md shadow border border-gray-200 dark:border-gray-300 transition-all duration-300 hover:shadow-md";

  div.innerHTML = `
    <div>
      <h3 class="text-base font-semibold text-primary">${card.front} ➜ ${card.back}</h3>
      <p class="text-xs text-gray-500 mt-1">📦 ${getBoxLabel(card.box)} | 📅 Öğrenildi: ${card.reviewedDate || "-"}</p>
    </div>
  `;
  return div;
}

// LocalStorage'dan kartları al
const allCards = getStoredCards();
const learnedCards = allCards.filter(card => card.box === 5);

const container = document.getElementById("learnedContainer");
const progressBar = document.getElementById("learnedProgressBar");
const progressText = document.getElementById("progressText");
const emptyMessage = document.getElementById("emptyMessage");

// Öğrenilen kartları göster
function renderLearnedCards() {
  if (learnedCards.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  learnedCards.forEach(card => {
    container.appendChild(createLearnedCard(card));
  });

  const percent = Math.round((learnedCards.length / allCards.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", percent);
  progressText.textContent = `${learnedCards.length}/${allCards.length} kelime öğrenildi`;
}

renderLearnedCards();

// JSON olarak dışa aktar
document.getElementById("exportJson").addEventListener("click", () => {
  const json = JSON.stringify(learnedCards, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fliplang_learned_words.json";
  a.click();

  URL.revokeObjectURL(url);
});

// PDF olarak dışa aktar
document.getElementById("exportPdf").addEventListener("click", () => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("FlipLang - Öğrenilen Kelimeler", 10, 10);

  learnedCards.forEach((card, index) => {
    doc.text(`${index + 1}. ${card.front} - ${card.back}`, 10, 20 + index * 8);
  });

  doc.save("fliplang_ogrenilenler.pdf");
});