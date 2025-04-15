// js/add.js

const addWordForm = document.getElementById("addWordForm");
const frontInput = document.getElementById("frontInput");
const backInput = document.getElementById("backInput");
const successMessage = document.getElementById("successMessage");

// LocalStorage'dan kartları al
let storedCards = JSON.parse(localStorage.getItem("cards")) || [];

addWordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCard = {
    id: Date.now(),
    front: frontInput.value,
    back: backInput.value,
    box: 1,
    nextReview: new Date().toISOString().split("T")[0]
  };

  storedCards.push(newCard);
  localStorage.setItem("cards", JSON.stringify(storedCards));

  // Form temizle
  frontInput.value = "";
  backInput.value = "";

  // Başarı mesajı göster
  successMessage.classList.remove("hidden");

  setTimeout(() => {
    successMessage.classList.add("hidden");
  }, 2000);
});