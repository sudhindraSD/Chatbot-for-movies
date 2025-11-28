# FlickPick Presentation Generator

This directory contains a script to automatically generate a PowerPoint presentation (`.pptx`) for the FlickPick project.

## 📂 Contents

-   `generate_ppt.js`: The Node.js script that uses `pptxgenjs` to create the slides.
-   `package.json`: Manages dependencies.

## 🚀 How to Generate the PPT

1.  **Open a terminal** in this directory:
    ```bash
    cd presentation
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the generator**:
    ```bash
    npm run generate
    ```

4.  **Find your file**:
    The script will create a file named `FlickPick_Presentation.pptx` in this directory.

## 📝 What's Included in the PPT?

The presentation covers the following aspects of the project (based on the main `README.md`):

1.  **Title Slide**: Project name and tagline.
2.  **The Problem**: Why current movie apps fail (Generic recs, no memory, etc.).
3.  **The Solution**: FlickPick's unique features (Elephant Memory, Best Bro Persona, Indian Cinema focus, Vertical Spinner).
4.  **Tech Stack**:
    -   **Frontend**: React, TailwindCSS, Framer Motion.
    -   **Backend**: Node.js, Express, MongoDB.
    -   **AI**: Groq API (Llama 3.3), TMDB API.
5.  **Workflow**: How the user interacts with the app.
6.  **Future Scope**: Voice mode, watch parties, etc.
