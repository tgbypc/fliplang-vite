import { cards } from './data.js';

const app = document.getElementById("app");
app.classList.add("flex", "flex-wrap", "justify-center", "gap-6");

cards.forEach(card => {
  const wrapper = document.createElement("div");
  wrapper.className = "w-64 h-40 perspective";

  const inner = document.createElement("div");
  inner.className = "card-inner relative w-full h-full";

  const front = document.createElement("div");
  front.className = "front bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-between backface-hidden";
  front.innerHTML = `
    <p class="text-lg font-bold text-primary">${card.front}</p>
    <div class="flex gap-2 mt-4">
      <button class="know-btn bg-green-400 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">I Know</button>
      <button class="dont-know-btn bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded">I Don't</button>
    </div>
  `;
  

  const back = document.createElement("div");
  back.className = "back bg-accent text-white rounded-lg shadow-lg p-4 flex items-center justify-center rotate-y-180 backface-hidden";
  back.innerHTML = `<p class="text-lg font-bold">${card.back}</p>`;



  inner.appendChild(front);
  inner.appendChild(back);
  wrapper.appendChild(inner);
  app.appendChild(wrapper);

  // ✅ Flip işlemi (tıkladığında döner)
  wrapper.addEventListener("click", () => {
    inner.classList.toggle("rotate-y-180");
  });


  // Butonlara erisim (event delegation olmadan)

  const knowBtn = front.querySelector(".know-btn");
  const dontKnow = back.querySelector(".dont-know-btn");

  knowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log(`✅ "${card.front}" kelimesi BİLİNİYOR olarak işaretlendi.`);
  });

  dontKnowBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // kartın dönmesini engelle
    console.log(`❌ "${card.front}" kelimesi BİLİNMİYOR olarak işaretlendi.`);
  });
});
