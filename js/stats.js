function getStoredCards() {
  return JSON.parse(localStorage.getItem("cards")) || [];
}

function countCardsByBox(cards) {
  // Count by box
  const counts = { box1: 0, box2: 0, box3: 0, box4: 0, box5: 0 };
  cards.forEach((c) => {
    if (c.box >= 1 && c.box <= 5) {
      counts[`box${c.box}`]++;
    }
  });
  return counts;
}

function updateStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", () => {
  // Render stats
  function renderStats() {
    const storedCards = getStoredCards();
    const total = storedCards.length;
    const counts = countCardsByBox(storedCards);

    if (total === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Henüz eklenmiş kart bulunamadı.";
      emptyMessage.className =
        "mt-6 text-center text-sm text-textMuted dark:text-textMuted";
      document.querySelector("main").appendChild(emptyMessage);
    }

    updateStat("totalCards", total);
    updateStat("box1", counts.box1);
    updateStat("box2", counts.box2);
    updateStat("box3", counts.box3);
    updateStat("box4", counts.box4);
    updateStat("box5", counts.box5);

    const reviewedCount =
      counts.box2 + counts.box3 * 2 + counts.box4 * 3 + counts.box5 * 4;
    updateStat("reviewedCards", reviewedCount);
  }

  renderStats();
});
