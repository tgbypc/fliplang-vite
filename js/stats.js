document.addEventListener("DOMContentLoaded", () => {
  function calculateStats() {
    const storedCards = JSON.parse(localStorage.getItem("cards")) || [];

    const total = storedCards.length;
    const box1 = storedCards.filter(c => c.box === 1).length;
    const box2 = storedCards.filter(c => c.box === 2).length;
    const box3 = storedCards.filter(c => c.box === 3).length;
    const box4 = storedCards.filter(c => c.box === 4).length;
    const box5 = storedCards.filter(c => c.box === 5).length;

    return { total, box1, box2, box3, box4, box5 };
  }

  function renderStats() {
    const stats = calculateStats();

    document.getElementById("totalCards").textContent = stats.total;
    document.getElementById("box1").textContent = stats.box1;
    document.getElementById("box2").textContent = stats.box2;
    document.getElementById("box3").textContent = stats.box3;
    document.getElementById("box4").textContent = stats.box4;
    document.getElementById("box5").textContent = stats.box5;

    const reviewedCount = stats.box2 + stats.box3 * 2 + stats.box4 * 3 + stats.box5 * 4;
    document.getElementById("reviewedCards").textContent = reviewedCount;
  }

  renderStats();
});
