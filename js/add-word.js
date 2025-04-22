import { showMessage } from "./app.js";

function updateLabels(langPair) {
  const frontLabel = document.querySelector('label[for="front"]');
  const backLabel = document.querySelector('label[for="back"]');

  if (langPair === "en|tr") {
    frontLabel.textContent = "İngilizce";
    backLabel.textContent = "Türkçe";
  } else if (langPair === "tr|en") {
    frontLabel.textContent = "Türkçe";
    backLabel.textContent = "İngilizce";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wordForm");
  const frontInput = document.getElementById("front");
  const backInput = document.getElementById("back");
  const translateBtn = document.getElementById("translateBtn");
  const langSelect = document.getElementById("langSelect");

  updateLabels(langSelect.value);

  langSelect.addEventListener("change", () => {
    updateLabels(langSelect.value);
  });

  // Helper: Set translate button and input UI state
  function setTranslateUIState(loading, fallbackValue = null) {
    translateBtn.disabled = loading;
    translateBtn.textContent = loading ? "⏳..." : "🔁 Çevir";
    if (loading && fallbackValue !== null) {
      backInput.value = fallbackValue;
    }
  }

  // ✅ 1. Translate butonuna basıldığında otomatik çeviri yap
  translateBtn.addEventListener("click", async () => {
    const word = frontInput.value.trim();
    if (!word) return;

    setTranslateUIState(true, "Çevriliyor...");

    try {
      const langPair = langSelect.value;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=${langPair}`);
      const data = await response.json();
      const translatedText = data.responseData.translatedText;

      backInput.value = translatedText;
      setTranslateUIState(false);
    } catch (error) {
      backInput.value = "Çeviri başarısız 😢";
      setTranslateUIState(false);
      console.error("Çeviri hatası:", error);
    }
  });

  // ✅ 2. Kelimeyi localStorage'a ekle
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const front = frontInput.value.trim();
    const back = backInput.value.trim();

    if (!front || !back) return;

    const cards = JSON.parse(localStorage.getItem("cards")) || [];

    cards.push({
      id: Date.now(),
      front,
      back,
      box: 1,
      nextReview: new Date().toISOString().split("T")[0],
      reviewedDate: new Date().toISOString().split("T")[0],
    });

    localStorage.setItem("cards", JSON.stringify(cards));

    showMessage("✅ Kelime kaydedildi!", "success");

    // Temizle
    frontInput.value = "";
    backInput.value = "";
  });
});