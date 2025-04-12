// js/app.js

// Tema Değiştirme
const themeToggle = document.getElementById("themeToggle");

themeToggle?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
});

// Sayfa Yüklenince Tema Kontrolü
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Data import et — Şimdilik sadece localStorage kontrolü
import { cards } from "./data.js";

if (!localStorage.getItem("cards")) {
  localStorage.setItem("cards", JSON.stringify(cards));
}