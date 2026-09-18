import { Marked } from 'marked';
import hljs from 'highlight.js';
import { TEMPLATES } from './templates.js';

// Initialize Marked with Highlight.js code highlighting
const marked = new Marked({
  gfm: true,
  breaks: true,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

// Custom Marked Extension for GitHub-style Callout Alerts
marked.use({
  hooks: {
    postprocess(html) {
      // Transform > [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT]
      return html
        .replace(/<blockquote>\s*<p>\s*\[!NOTE\]/gi, '<div class="callout callout-note"><strong>💡 Note:</strong><p>')
        .replace(/<blockquote>\s*<p>\s*\[!WARNING\]/gi, '<div class="callout callout-warning"><strong>⚠️ Warning:</strong><p>')
        .replace(/<blockquote>\s*<p>\s*\[!TIP\]/gi, '<div class="callout callout-note"><strong>💡 Tip:</strong><p>')
        .replace(/<blockquote>\s*<p>\s*\[!IMPORTANT\]/gi, '<div class="callout callout-warning"><strong>❗ Important:</strong><p>')
        .replace(/<\/blockquote>/gi, '</div>');
    }
  }
});

// DOM Elements
const editorTextarea = document.getElementById('editor-textarea');
const previewContent = document.getElementById('preview-content');
const docTitleInput = document.getElementById('doc-title');

// Stats Elements
const statWords = document.getElementById('stat-words');
const statChars = document.getElementById('stat-chars');
const statReadtime = document.getElementById('stat-readtime');
const statLines = document.getElementById('stat-lines');
const statParagraphs = document.getElementById('stat-paragraphs');
const statSentences = document.getElementById('stat-sentences');
const statAvgSentence = document.getElementById('stat-avg-sentence');
const statReadability = document.getElementById('stat-readability');
const tocContainer = document.getElementById('toc-container');

// Status Bar
const statusCursor = document.getElementById('status-cursor');
const statusSelection = document.getElementById('status-selection');
const statusAutosave = document.getElementById('status-autosave');

// View Switcher Buttons
const btnViewSplit = document.getElementById('btn-view-split');
const btnViewEditor = document.getElementById('btn-view-editor');
const btnViewPreview = document.getElementById('btn-view-preview');
const paneEditor = document.getElementById('pane-editor');
const panePreview = document.getElementById('pane-preview');
const paneDivider = document.getElementById('pane-divider');

// Sidebar Drawer
const sidebarAnalytics = document.getElementById('sidebar-analytics');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

// Dropdowns & Export Buttons
const templateDropdownBtn = document.getElementById('template-dropdown-btn');
const templateMenu = document.getElementById('template-menu');
const exportDropdownBtn = document.getElementById('export-dropdown-btn');
const exportMenu = document.getElementById('export-menu');

const btnExportMd = document.getElementById('export-md');
const btnExportHtml = document.getElementById('export-html');
const btnExportPdf = document.getElementById('export-pdf');
const btnCopyHtml = document.getElementById('copy-html');
const btnClear = document.getElementById('btn-clear');

const STORAGE_KEY_CONTENT = 'markpulse_content';
const STORAGE_KEY_TITLE = 'markpulse_title';

// Initialize App
function init() {
  // Load saved draft or default template
  const savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);
  const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);

  if (savedTitle) docTitleInput.value = savedTitle;

  if (savedContent !== null) {
    editorTextarea.value = savedContent;
  } else {
    editorTextarea.value = TEMPLATES.readme;
  }

  updateAll();
  setupEventListeners();
}

// Update Preview, Analytics & TOC
function updateAll() {
  const text = editorTextarea.value;

  // 1. Render Markdown Preview
  try {
    const renderedHtml = marked.parse(text);
    previewContent.innerHTML = renderedHtml;

    // Apply Highlight.js to code blocks inside preview
    previewContent.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } catch (err) {
    console.error('Render error:', err);
    previewContent.innerHTML = `<div style="color:var(--danger-color)">Error rendering preview: ${err.message}</div>`;
  }

  // 2. Compute Document Analytics
  updateAnalytics(text);

  // 3. Generate Table of Contents
  generateTOC();

  // 4. Save to LocalStorage
  saveToLocalStorage();
}

// Calculate Document Analytics
function updateAnalytics(text) {
  const trimmed = text.trim();
  
  // Word Count
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  statWords.textContent = words.toLocaleString();

  // Character Count
  statChars.textContent = text.length.toLocaleString();

  // Estimated Reading Time (200 wpm)
  const readTimeMin = Math.ceil(words / 200);
  statReadtime.textContent = `${readTimeMin} min`;

  // Line Count
  const lines = text.split('\n').length;
  statLines.textContent = lines.toLocaleString();

  // Paragraph Count
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  statParagraphs.textContent = paragraphs;

  // Sentence Count
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  statSentences.textContent = sentences;

  // Avg Sentence Length
  const avgSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
  statAvgSentence.textContent = `${avgSentence} words`;

  // Readability Classification
  let readability = 'Easy';
  if (avgSentence > 20) readability = 'Advanced';
  else if (avgSentence > 14) readability = 'Moderate';
  statReadability.textContent = readability;
}

// Generate Table of Contents from rendered headings
function generateTOC() {
  const headings = previewContent.querySelectorAll('h1, h2, h3');
  tocContainer.innerHTML = '';

  if (headings.length === 0) {
    tocContainer.innerHTML = '<span class="toc-empty">No headings found in document.</span>';
    return;
  }

  headings.forEach((heading, idx) => {
    const id = `heading-${idx}`;
    heading.id = id;

    const level = heading.tagName.toLowerCase();
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.className = `toc-item ${level}`;
    link.textContent = heading.textContent;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    tocContainer.appendChild(link);
  });
}

// Save Content to LocalStorage
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY_CONTENT, editorTextarea.value);
  localStorage.setItem(STORAGE_KEY_TITLE, docTitleInput.value);

  statusAutosave.innerHTML = '<span class="dot green"></span> Autosaved to LocalStorage';
}

// Event Listeners Setup
function setupEventListeners() {
  // Input events
  editorTextarea.addEventListener('input', updateAll);
  docTitleInput.addEventListener('input', saveToLocalStorage);

  // Cursor position tracking
  editorTextarea.addEventListener('keyup', updateCursorPosition);
  editorTextarea.addEventListener('click', updateCursorPosition);

  // Toolbar button formatting actions
  document.querySelectorAll('.tb-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleToolbarAction(action);
    });
  });

  // Clear button
  btnClear.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      editorTextarea.value = '';
      updateAll();
      showToast('Editor cleared');
    }
  });

  // View Switcher Modes
  btnViewSplit.addEventListener('click', () => setViewMode('split'));
  btnViewEditor.addEventListener('click', () => setViewMode('editor'));
  btnViewPreview.addEventListener('click', () => setViewMode('preview'));

  // Sidebar Toggle
  toggleSidebarBtn.addEventListener('click', () => {
    sidebarAnalytics.classList.toggle('closed');
    toggleSidebarBtn.classList.toggle('active');
  });
  closeSidebarBtn.addEventListener('click', () => {
    sidebarAnalytics.classList.add('closed');
    toggleSidebarBtn.classList.remove('active');
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
    const isDark = document.documentElement.classList.contains('dark');
    moonIcon.classList.toggle('hidden', !isDark);
    sunIcon.classList.toggle('hidden', isDark);

    // Toggle highlight.js theme stylesheet
    const hljsTheme = document.getElementById('hljs-theme');
    if (isDark) {
      hljsTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    } else {
      hljsTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
  });

  // Dropdown toggles
  setupDropdown(templateDropdownBtn, templateMenu);
  setupDropdown(exportDropdownBtn, exportMenu);

  // Template loader actions
  templateMenu.querySelectorAll('[data-template]').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateKey = btn.getAttribute('data-template');
      if (TEMPLATES[templateKey]) {
        if (confirm('Replace current editor content with selected template?')) {
          editorTextarea.value = TEMPLATES[templateKey];
          updateAll();
          templateMenu.classList.add('hidden');
          showToast(`Loaded ${btn.textContent.trim()}`);
        }
      }
    });
  });

  // Export handlers
  btnExportMd.addEventListener('click', exportMarkdown);
  btnExportHtml.addEventListener('click', exportHTML);
  btnExportPdf.addEventListener('click', exportPDF);
  btnCopyHtml.addEventListener('click', copyHTMLToClipboard);

  // Pane resizing drag handle
  setupPaneResizer();
}

// Toolbar Insert/Format Logic
function handleToolbarAction(action) {
  const start = editorTextarea.selectionStart;
  const end = editorTextarea.selectionEnd;
  const text = editorTextarea.value;
  const selectedText = text.substring(start, end);

  let replacement = '';
  let cursorOffset = 0;

  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'bold text'}**`;
      cursorOffset = 2;
      break;
    case 'italic':
      replacement = `*${selectedText || 'italic text'}*`;
      cursorOffset = 1;
      break;
    case 'strike':
      replacement = `~~${selectedText || 'strikethrough text'}~~`;
      cursorOffset = 2;
      break;
    case 'h1':
      replacement = `# ${selectedText || 'Heading 1'}`;
      break;
    case 'h2':
      replacement = `## ${selectedText || 'Heading 2'}`;
      break;
    case 'h3':
      replacement = `### ${selectedText || 'Heading 3'}`;
      break;
    case 'ul':
      replacement = `- ${selectedText || 'List item'}`;
      break;
    case 'ol':
      replacement = `1. ${selectedText || 'List item'}`;
      break;
    case 'task':
      replacement = `- [ ] ${selectedText || 'Task item'}`;
      break;
    case 'quote':
      replacement = `> ${selectedText || 'Blockquote'}`;
      break;
    case 'code':
      replacement = `\`${selectedText || 'code'}\``;
      cursorOffset = 1;
      break;
    case 'codeblock':
      replacement = `\`\`\`javascript\n${selectedText || '// Write your code here'}\n\`\`\``;
      break;
    case 'table':
      replacement = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | Data 1 | $10.00 |\n| Item B | Data 2 | $20.00 |\n`;
      break;
    case 'link':
      replacement = `[${selectedText || 'Link Title'}](https://example.com)`;
      break;
    case 'image':
      replacement = `![${selectedText || 'Alt text'}](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)`;
      break;
    case 'hr':
      replacement = `\n---\n`;
      break;
    case 'callout-note':
      replacement = `> [!NOTE]\n> ${selectedText || 'This is an important note notification.'}`;
      break;
    case 'callout-warning':
      replacement = `> [!WARNING]\n> ${selectedText || 'Proceed with caution.'}`;
      break;
  }

  editorTextarea.setRangeText(replacement, start, end, 'select');
  editorTextarea.focus();
  updateAll();
}

// Track Cursor Line & Column
function updateCursorPosition() {
  const text = editorTextarea.value;
  const pos = editorTextarea.selectionStart;
  const lines = text.substring(0, pos).split('\n');
  const lineNum = lines.length;
  const colNum = lines[lines.length - 1].length + 1;

  statusCursor.textContent = `Line ${lineNum}, Col ${colNum}`;

  const selectedChars = Math.abs(editorTextarea.selectionEnd - editorTextarea.selectionStart);
  statusSelection.textContent = `${selectedChars} selected`;
}

// Set View Layout Mode
function setViewMode(mode) {
  btnViewSplit.classList.toggle('active', mode === 'split');
  btnViewEditor.classList.toggle('active', mode === 'editor');
  btnViewPreview.classList.toggle('active', mode === 'preview');

  if (mode === 'split') {
    paneEditor.style.display = 'flex';
    panePreview.style.display = 'flex';
    paneDivider.style.display = 'block';
  } else if (mode === 'editor') {
    paneEditor.style.display = 'flex';
    panePreview.style.display = 'none';
    paneDivider.style.display = 'none';
  } else if (mode === 'preview') {
    paneEditor.style.display = 'none';
    panePreview.style.display = 'flex';
    paneDivider.style.display = 'none';
  }
}

// Dropdown Helper
function setupDropdown(btn, menu) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown-menu').forEach(m => {
      if (m !== menu) m.classList.add('hidden');
    });
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

// Export Functions
function exportMarkdown() {
  const title = docTitleInput.value.replace(/[^a-z0-9_-]/gi, '_') || 'document';
  const blob = new Blob([editorTextarea.value], { type: 'text/markdown;charset=utf-8;' });
  downloadBlob(blob, `${title}.md`);
  showToast('Exported Markdown file');
}

function exportHTML() {
  const title = docTitleInput.value || 'MarkPulse Document';
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
  <style>
    body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
    @media (max-width: 767px) { body { padding: 15px; } }
  </style>
</head>
<body class="markdown-body">
  ${previewContent.innerHTML}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  downloadBlob(blob, `${title.replace(/[^a-z0-9_-]/gi, '_')}.html`);
  showToast('Exported HTML document');
}

function exportPDF() {
  setViewMode('preview');
  window.print();
}

function copyHTMLToClipboard() {
  navigator.clipboard.writeText(previewContent.innerHTML).then(() => {
    showToast('Copied HTML to clipboard!');
  }).catch(err => {
    showToast('Failed to copy HTML');
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Toast Notification Popup
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Pane Splitter Resizer
function setupPaneResizer() {
  let isDragging = false;

  paneDivider.addEventListener('mousedown', () => {
    isDragging = true;
    paneDivider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const containerWidth = document.querySelector('.workspace-main').clientWidth;
    const newEditorWidth = (e.clientX / containerWidth) * 100;

    if (newEditorWidth > 15 && newEditorWidth < 85) {
      paneEditor.style.flex = `0 0 ${newEditorWidth}%`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      paneDivider.classList.remove('dragging');
      document.body.style.cursor = 'default';
    }
  });
}

// Run application initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
