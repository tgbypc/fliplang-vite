

# 📚 FlipLang - Language Flashcards with Leitner System

**FlipLang** is a browser-based, user-friendly language learning application designed to make vocabulary learning more effective. It combines flashcards with the proven **Leitner System** to help you move words into your long-term memory — all in a clean, simple and responsive interface.

This project was part of my journey to learn software development. It's my most comprehensive work so far, combining clean UI/UX design, structured logic, and real learning features.

---

## 🚀 What Was Built in This Project?

- ✔️ Responsive layout with HTML + Tailwind CSS
- ✔️ Full light/dark theme support across all pages
- ✔️ Unified navigation bar and footer on every screen
- ✔️ Modular, maintainable JavaScript file structure
- ✔️ Leitner-based spaced repetition system (3-day, 7-day, 30-day)
- ✔️ All user data is stored in localStorage for persistence
- ✔️ Smart learning flow with "I know / I don’t know" buttons
- ✔️ Notification system added (browser + dashboard badge)
- ✔️ Separate views for Daily Review and Scheduled Review
- ✔️ User can add custom cards or use predefined word sets
- ✔️ Full flashcard management with filtering by source
- ✔️ Realtime translation support (via Translate API)
- ✔️ Learned words page with progress bar and stats
- ✔️ Visual stats page showing total words and box distribution
- ✔️ Mobile-friendly hamburger menu toggle
- ✔️ Custom design and style optimizations for each page

---

## 📸 Screenshots

![FlipLang Screenshot](https://github.com/tgbypc/fliplang-vite/tree/main/assets/images)

---

## 🛠️ Built With

- HTML5 + Tailwind CSS
- JavaScript (ES6+)
- localStorage API
- Notification API
- Translate API (open source)

---

## 📁 Project Structure

```
fliplang/
├── index.html          # Main dashboard
├── review.html         # Daily review page
├── plans.html          # Scheduled reviews (Leitner)
├── add-word.html       # Add new word + translation
├── cards.html          # All cards + source filtering
├── learned.html        # Learned words overview
├── stats.html          # Statistics and progress
├── style.css           # Tailwind base + custom styles
├── js/
│   ├── app.js          # Navbar, theme, menu, notification
│   ├── review.js       # Daily card review logic
│   ├── plans.js        # Leitner-based repeat logic
│   ├── cards.js        # Filtering, display, source tabs
│   ├── add-word.js     # Word creation + translation API
│   ├── learned.js      # Displaying learned cards
│   ├── stats.js        # Word stats and calculations
│   ├── leitner.js      # Leitner algorithm engine
│   └── api.js          # Word API and translation
└── assets/
    └── screenshots/    # Project screenshots
```

---

## ✍️ Notes

This project started as a JavaScript assignment and turned into one of the most valuable experiences of my learning journey. It was also my very first time using **Tailwind CSS**, and I truly enjoyed it!

Through FlipLang, I practiced everything from HTML and CSS basics to advanced JavaScript structures. I implemented dark/light theme switching, browser notifications, localStorage handling, and modular file architecture — all while applying real UI/UX design principles across the project.

Most importantly, I realized that good code isn't just about making things work — it’s about writing clean, reusable, and user-friendly logic. This project became a true turning point for me.

In the future, I plan to rebuild FlipLang using **React**, taking everything I’ve learned here and bringing it to the next level. 🚀

---

💜 Let FlipLang grow with you!

Tugba – [@github.com/tgbypc](https://github.com/kullanici-adi)