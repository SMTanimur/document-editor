# 📚 Project Plan: Document Import & Editor with Tiptap

This plan outlines the steps to build a document editor using **React** and **Tiptap**, allowing users to import documents (PDF, DOCX, TXT), edit them, and optionally export them.

---

## ✅ Prerequisites (Already Installed)

- `@tiptap/react` and `@tiptap/starter-kit`
- `pdfjs-dist` for PDF parsing
- `mammoth` for DOCX parsing
- `html2pdf.js` for PDF export (optional)

---

## 🧩 Features Breakdown

### 📥 1. File Import Functionality

- Add file input (`accept=".pdf,.docx,.txt"`)
- Detect file type and extract text:
  - `.pdf` → Use `pdfjs-dist`
  - `.docx` → Use `mammoth`
  - `.txt` → Use `FileReader` or `.text()`

### 🛠️ 2. Content Parsing Functions

- `extractTextFromPDF(file)`
- `extractTextFromDocx(file)`
- `.txt`: use `await file.text()`

Each should return a plain text string that will be injected into Tiptap editor using:
```js