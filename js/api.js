export async function translateWord(text, source = "en", target = "tr") {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: "text"
      })
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Çeviri başarısız:", error);
    return "";
  }
}