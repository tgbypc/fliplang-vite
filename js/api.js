// js/api.js

export async function translateWord(word) {
  const response = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|tr`);
  const data = await response.json();

  const translatedText = data.responseData.translatedText;
  return translatedText;
}