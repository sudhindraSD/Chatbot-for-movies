# 🎬 FlickPick - Your AI Movie Best Friend

> **"Stop searching. Start watching."**

FlickPick is not just another movie recommendation app. It's an **intelligent, memory-driven AI companion** that learns your taste, remembers your conversations, and recommends movies like a best friend would—with a "best bro" personality and a deep love for cinema (especially Indian Cinema! 🇮🇳).

---

## 🚀 Why FlickPick? (The Problem)
- **Generic Recommendations:** Netflix/Prime just show you "Trending Now" or generic lists.
- **No Memory:** ChatGPT forgets what you watched last week.
- **Decision Paralysis:** Scrolling for 30 minutes only to watch *The Office* again.
- **Boring UIs:** Static grids are uninspiring.

## 💡 The Solution (Our Features)

### 1. 🧠 **Elephant Memory (Persistent Context)**
FlickPick **remembers everything**.
- **Watch History:** "I watched *Inception* last week." -> *Stored.*
- **Preferences:** "I hate horror movies." -> *Remembered forever.*
- **Contextual Callbacks:** "Yo, since you loved *RRR* last time, you gotta check out *Baahubali*!"

### 2. 🎭 **"Best Bro" Persona**
- **No Robotic Talk:** The AI speaks in casual, enthusiastic slang ("Yo!", "Banger", "Honestly...").
- **Deep Knowledge:** Knows directors, actors, and trivia.
- **Hot Takes:** Will roast you if you have bad taste.

### 3. 🇮🇳 **Indian Cinema First**
- **Desi-Optimized:** We tweaked the algorithms to prioritize **Bollywood, Tollywood, Kollywood, and Sandalwood**.
- **Ratio:** ~70% Indian Cinema / 30% World Cinema.
- **Language Support:** Knows Hindi, Telugu, Tamil, Kannada, and Malayalam hits.

### 4. 🎰 **Vertical Movie Spinner**
- **Gamified Discovery:** Can't decide? Spin the wheel!
- **Casino Style:** A vertical, slot-machine animation built with **Framer Motion**.
- **Smart Shuffle:** Uses a Fisher-Yates shuffle to ensure a perfect mix of genres every time.

---

## 🛠️ Tech Stack

### **Frontend (The Face)**
- **React (Vite):** Blazing fast UI.
- **TailwindCSS:** Modern, glassmorphism designs.
- **Framer Motion:** Smooth, complex animations (Spinner, Chat bubbles).
- **Lucide React:** Beautiful icons.

### **Backend (The Brain)**
- **Node.js & Express:** Robust REST API.
- **MongoDB & Mongoose:**
  - Stores `UserPreferences` (Genres, Moods).
  - Stores `MovieHistory` (What you watched).
  - Stores `ChatLogs` (For memory).
- **JWT Auth:** Secure user sessions.

### **AI & Data (The Magic)**
- **Groq API (Llama 3.3 70B):** The intelligence engine. Extremely fast inference for real-time chat.
- **TMDB API:** The movie database. We use a **Multi-Endpoint Strategy** (firing 30+ parallel requests) to fetch a massive variety of movies.

---

## 📸 Workflow

1.  **Onboarding:** User sets basic vibes (Genres, Mood).
2.  **The Chat:** User talks to FlickPick. "I want a thriller."
3.  **The Memory:** Backend fetches user's past history + preferences -> Injects into AI System Prompt -> AI generates personalized response.
4.  **The Spin:** User clicks "Browse" -> Backend fetches 100+ movies -> Frontend shuffles -> User spins -> Movie picked!

---

## 🔮 Future Scope
- **Voice Mode:** Talk to FlickPick directly.
- **Watch Parties:** Spin the wheel with friends.
- **Streaming Links:** Direct deep links to Netflix/Prime.

---

## 📊 Project Presentation

Want a quick summary? You can generate a PowerPoint presentation for this project.

1.  Navigate to the `presentation` folder.
2.  Run `npm install` to install dependencies.
3.  Run `npm run generate` to create `FlickPick_Presentation.pptx`.

---

### 👨‍💻 Setup & Run

1.  **Clone Repo**
2.  **Backend:**
    ```bash
    cd Backend
    npm install
    npm run dev
    ```
3.  **Frontend:**
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```
4.  **Enjoy!**
