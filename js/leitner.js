// Calculate next review date based on Leitner box
export function getNextReviewDate(box) {
  const days = { 1: 3, 2: 7, 3: 30, 4: 60 };
  const d = new Date();
  d.setDate(d.getDate() + (days[box] || 0));
  return d.toISOString().split("T")[0];
}

// Get display label for a Leitner box
export function getBoxLabel(box) {
  return (
    {
      1: "3 Günlük Tekrar",
      2: "1 Haftalık Tekrar",
      3: "1 Aylık Tekrar",
      4: "2 Aylık Tekrar",
      5: "Öğrenildi",
    }[box] || "Bilinmeyen"
  );
}
