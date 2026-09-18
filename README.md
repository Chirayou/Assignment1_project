# MarkPulse Studio — Interactive Markdown Editor & Document Workbench

MarkPulse Studio is a modern, high-performance Markdown Editor and Document Studio built from scratch using modern web standards (Vite, HTML5, Vanilla CSS, and JavaScript). 

It is designed to empower technical writers, developers, and content creators with real-time synchronized rendering, rich document analytics, template libraries, and multi-format export capabilities.

---

## 📌 Open-Source Reference Project

- **Reference Project Name**: EasyMDE (Easy Markdown Editor)
- **Reference Project GitHub URL**: [https://github.com/Ionaru/easy-markdown-editor](https://github.com/Ionaru/easy-markdown-editor)
- **Scope & Functional Comparison**: 
  EasyMDE is a widely used embeddable JavaScript Markdown editor offering basic toolbars, live rendering, auto-save, and simple document statistics. **MarkPulse Studio** was created as an original software implementation that captures and enhances the core feature set of EasyMDE. While maintaining functional parity with EasyMDE's split-preview, autosave, and text editing workflows, MarkPulse Studio introduces enhanced callout rendering (`[!NOTE]`, `[!WARNING]`), automatic Table of Contents (TOC) structure trees, advanced document readability analytics, multi-format file exports (Markdown, HTML, PDF), and modern glassmorphic aesthetic design.

---

## 🤖 AI Tool(s) Used

- **AI Assistant**: [Google Antigravity](https://antigravity.google) powered by **Gemini 3.6 Flash**.
- **Role of AI**: 
  - Architectural design & project planning.
  - Generating core application files (`index.html`, `style.css`, `src/main.js`, `src/templates.js`).
  - Implementing GFM parsing extensions, live analytics algorithms, and responsive CSS tokens.
  - Build validation, testing, and git repository deployment.

---

## 🌟 Major Functionalities

### 1. Dual-Pane Real-Time Editor & Synchronized Live Preview
- **Live GFM Rendering**: Instant split-view editing with GitHub Flavored Markdown (GFM) parsing.
- **Code Syntax Highlighting**: Syntax highlighting powered by `highlight.js`.
- **Custom Callouts & Formatting**: Render GitHub alert boxes (`NOTE`, `WARNING`, `TIP`, `IMPORTANT`), task checkboxes, and data tables.
- **Dynamic Table of Contents (TOC)**: Auto-generated heading hierarchy outline in the sidebar with smooth click-to-scroll navigation.

### 2. Document Analytics & Quality Dashboard
- **Real-Time Metrics**: Instant tracking of word count, character count, total line count, and estimated reading time.
- **Readability & Sentence Insights**: Detailed breakdown of paragraph counts, sentence counts, average sentence length, and reading difficulty scoring.

### 3. Multi-Format Export, Templates & Local Persistence
- **Multi-Format Export**: Export your document as a raw Markdown file (`.md`), a standalone styled HTML file (`.html`), or print-ready PDF layout (`window.print()`).
- **Template Library**: Instant loadable starter templates for Technical Specs, Project READMEs, Release Notes, and Team Sync agendas.
- **LocalStorage Auto-Save**: Automatic background draft saving to `localStorage` with instant session restoration upon page reloads.

---

## 💻 Building and Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Chirayou/Assignment1_project.git
   cd Assignment1_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to interact with MarkPulse Studio.

4. **Build production bundle**:
   ```bash
   npm run build
   ```
   The compiled production output will be generated in the `dist/` directory.

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📁 Repository Structure

```
Assignment1_project/
├── index.html            # Main application UI structure & layout
├── style.css             # Design system, CSS variables, dark/light themes & GFM styles
├── package.json          # Node dependencies and build scripts
├── README.md             # Project documentation & reference details
└── src/
    ├── main.js           # Marked parsing, analytics engine, event listeners & exports
    └── templates.js      # Built-in document starter templates
```

---

*Developed using Google Antigravity & AI Tools for Assignment 1.*