const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// Set Slide Layout
pptx.layout = "LAYOUT_16x9";

// --- Slide 1: Title Slide ---
let slide1 = pptx.addSlide();
slide1.background = { color: "111111" };
slide1.addText("FlickPick", { x: 1, y: 2, w: "80%", fontSize: 60, color: "E50914", bold: true, align: "center" });
slide1.addText("Your AI Movie Best Friend", { x: 1, y: 3.5, w: "80%", fontSize: 24, color: "FFFFFF", align: "center" });
slide1.addText("Stop searching. Start watching.", { x: 1, y: 4.5, w: "80%", fontSize: 18, color: "AAAAAA", italic: true, align: "center" });

// --- Slide 2: The Problem ---
let slide2 = pptx.addSlide();
slide2.background = { color: "111111" };
slide2.addText("Why FlickPick? (The Problem)", { x: 0.5, y: 0.5, fontSize: 32, color: "E50914", bold: true });
slide2.addText([
    { text: "• Generic Recommendations: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Netflix/Prime just show 'Trending Now'.", options: { color: "CCCCCC" } },
    { text: "\n\n• No Memory: ", options: { bold: true, color: "FFFFFF" } },
    { text: "ChatGPT forgets what you watched last week.", options: { color: "CCCCCC" } },
    { text: "\n\n• Decision Paralysis: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Scrolling for 30 mins only to re-watch The Office.", options: { color: "CCCCCC" } },
    { text: "\n\n• Boring UIs: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Static grids are uninspiring.", options: { color: "CCCCCC" } }
], { x: 0.5, y: 1.5, w: "90%", h: 5, fontSize: 18 });

// --- Slide 3: The Solution ---
let slide3 = pptx.addSlide();
slide3.background = { color: "111111" };
slide3.addText("The Solution (Our Features)", { x: 0.5, y: 0.5, fontSize: 32, color: "E50914", bold: true });
slide3.addText([
    { text: "1. Elephant Memory: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Remembers watch history and preferences forever.", options: { color: "CCCCCC" } },
    { text: "\n\n2. 'Best Bro' Persona: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Casual slang, deep movie knowledge, and hot takes.", options: { color: "CCCCCC" } },
    { text: "\n\n3. Indian Cinema First: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Optimized for Bollywood, Tollywood, etc. (~70% mix).", options: { color: "CCCCCC" } },
    { text: "\n\n4. Vertical Movie Spinner: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Gamified discovery with a casino-style wheel.", options: { color: "CCCCCC" } }
], { x: 0.5, y: 1.5, w: "90%", h: 5, fontSize: 18 });

// --- Slide 4: Tech Stack ---
let slide4 = pptx.addSlide();
slide4.background = { color: "111111" };
slide4.addText("Tech Stack", { x: 0.5, y: 0.5, fontSize: 32, color: "E50914", bold: true });

// Frontend Column
slide4.addText("Frontend (The Face)", { x: 0.5, y: 1.5, fontSize: 20, color: "FFFFFF", bold: true });
slide4.addText([
    { text: "• React (Vite)", options: { color: "CCCCCC" } },
    { text: "\n• TailwindCSS", options: { color: "CCCCCC" } },
    { text: "\n• Framer Motion", options: { color: "CCCCCC" } },
    { text: "\n• Lucide React", options: { color: "CCCCCC" } }
], { x: 0.5, y: 2.2, w: 4, fontSize: 16 });

// Backend Column
slide4.addText("Backend (The Brain)", { x: 5, y: 1.5, fontSize: 20, color: "FFFFFF", bold: true });
slide4.addText([
    { text: "• Node.js & Express", options: { color: "CCCCCC" } },
    { text: "\n• MongoDB & Mongoose", options: { color: "CCCCCC" } },
    { text: "\n• JWT Auth", options: { color: "CCCCCC" } }
], { x: 5, y: 2.2, w: 4, fontSize: 16 });

// AI Column
slide4.addText("AI & Data (The Magic)", { x: 9.5, y: 1.5, fontSize: 20, color: "FFFFFF", bold: true });
slide4.addText([
    { text: "• Groq API (Llama 3.3 70B)", options: { color: "CCCCCC" } },
    { text: "\n• TMDB API (Multi-Endpoint)", options: { color: "CCCCCC" } }
], { x: 9.5, y: 2.2, w: 3.5, fontSize: 16 });

// --- Slide 5: Workflow ---
let slide5 = pptx.addSlide();
slide5.background = { color: "111111" };
slide5.addText("How It Works", { x: 0.5, y: 0.5, fontSize: 32, color: "E50914", bold: true });
slide5.addText([
    { text: "1. Onboarding: ", options: { bold: true, color: "FFFFFF" } },
    { text: "User sets genres and mood.", options: { color: "CCCCCC" } },
    { text: "\n\n2. The Chat: ", options: { bold: true, color: "FFFFFF" } },
    { text: "User asks for recommendations.", options: { color: "CCCCCC" } },
    { text: "\n\n3. The Memory: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Backend injects history + preferences into AI prompt.", options: { color: "CCCCCC" } },
    { text: "\n\n4. The Spin: ", options: { bold: true, color: "FFFFFF" } },
    { text: "User spins the wheel for a random movie pick.", options: { color: "CCCCCC" } }
], { x: 0.5, y: 1.5, w: "90%", h: 5, fontSize: 18 });

// --- Slide 6: Future Scope ---
let slide6 = pptx.addSlide();
slide6.background = { color: "111111" };
slide6.addText("Future Scope", { x: 0.5, y: 0.5, fontSize: 32, color: "E50914", bold: true });
slide6.addText([
    { text: "• Voice Mode: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Talk to FlickPick directly.", options: { color: "CCCCCC" } },
    { text: "\n\n• Watch Parties: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Spin the wheel with friends.", options: { color: "CCCCCC" } },
    { text: "\n\n• Streaming Links: ", options: { bold: true, color: "FFFFFF" } },
    { text: "Direct deep links to Netflix/Prime.", options: { color: "CCCCCC" } }
], { x: 0.5, y: 1.5, w: "90%", h: 5, fontSize: 18 });

// Save the Presentation
pptx.writeFile({ fileName: "FlickPick_Presentation.pptx" })
    .then(fileName => {
        console.log(`Created file: ${fileName}`);
    })
    .catch(err => {
        console.error(err);
    });
