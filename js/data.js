// Başlangıçta yüklenecek örnek kelime kartları (demo verisi)
export const cards = [
  {
    id: 1,
    front: "Hello",
    back: "Merhaba",
    box: 1,
    nextReview: new Date().toISOString().split("T")[0]
  },
  {
    id: 2,
    front: "Goodbye",
    back: "Hoşçakal",
    box: 2,
    nextReview: new Date().toISOString().split("T")[0]
  },
];