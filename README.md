# Cover Letter Generator

**Project**: A single-page web client that generates, previews and exports tailored cover letters (React 19 + Vite).

**About**: Writing a fresh cover letter for every job application is repetitive and time-consuming, and generic templates rarely match the posting. This client lets a signed-in user paste a job description, optionally attach a CV, choose a writing-style level, and receive a cover letter streamed back token-by-token from a backend language-model service. Generated letters are persisted server-side and can be re-opened, exported to PDF or DOCX, downloaded as a server-rendered PDF, or deleted. The application is the front-end only; all generation and storage are delegated to a remote API at `https://coverbe.onrender.com/api/v1`.

It should be noted that this is now discontined. Therefore sign in authorisation and content generation are both unavailable.

**Technical Expectations**

1. Layered separation of presentation, state-management and service concerns.
1. Incremental consumption of a Server-Sent-Events stream so output renders as it is produced.
1. Token-based authentication with refresh handling and `localStorage` session persistence.
1. Client-side document export to PDF and DOCX with no additional server round-trip.
1. Reproducible production build and GitHub Pages deployment pipeline.
1. Static analysis enforced through an ESLint flat configuration.

---

## Table of Contents

1. [General Description](#general-description)
   1. [Overview](#overview)
   1. [User Manual](#user-manual)
   1. [Installation Instructions](#installation-instructions)
   1. [Usage Instructions](#usage-instructions)
1. [Software Testing](#software-testing)
1. [Version Control](#version-control)
1. [References](#references)

---

## General Description

### Overview

The application is a Vite-bundled React 19 single-page app. The entry module mounts a React root in `StrictMode`; the root component wraps the page in a TanStack Query client and an authentication context, then composes the static marketing sections, the generation form and the preview. Network access is isolated behind a service layer: authentication, cover-letter generation and document storage are reached over REST and a streaming endpoint, while PDF and DOCX export are performed in the browser. The source lives entirely under `CLG/`.

```
main.jsx
   |
   v
App.jsx ── QueryClientProvider ── AuthProvider
   |
   +── components/ ........ Header, Hero, Features, CoverLetterForm,
   |        |               Preview, Footer, AuthModal, Sidebar,
   |        |               CoverLettersModal
   |        v
   +── hooks/useCoverLetter ───► services/coverLetterService ─┐
   |        |                    services/pdfService          │
   |        |                    services/docxService         │
   |        |                                                 ├─► https://coverbe.onrender.com/api/v1
   +── contexts/AuthContext ───► services/authService ────────┘
            |
            v
      localStorage (access / refresh tokens, user id + email)
```

| Layer | Folder | Responsibility |
| --- | --- | --- |
| Entry / bootstrap | `CLG/src/main.jsx` | Mounts the React root in `StrictMode`. |
| Application shell | `CLG/src/App.jsx` | Instantiates the query client, wraps providers, composes page sections and owns top-level UI flags (preview, modals, sidebar). |
| Presentation | `CLG/src/components` | Stateful and stateless UI widgets, modals and the generation form. |
| State management | `CLG/src/contexts`, `CLG/src/hooks` | Authentication context and the cover-letter generation hook, both built on TanStack Query mutations. |
| Service layer | `CLG/src/services` | HTTP and SSE calls to the backend, plus client-side PDF and DOCX rendering. |
| Static assets | `CLG/src/assets` | Bundled images (`CVtemplate.png`). |

**Main classes and modules**

Presentation layer:

- **`App`** - root component that provides the TanStack Query client and `AuthProvider`. The inner `AppContent` holds all cross-section UI state, so the preview, sidebar and both modals are siblings driven by a single component rather than by global state.
- **`Header`** - top bar with branding, login button and a menu toggle. The menu toggle is rendered only when a user is present, so the sidebar entry point is gated on authentication.
- **`Hero`** - landing banner whose call-to-action scrolls to the form via `scrollIntoView` rather than routing, because the app is a single scrolling page.
- **`Features`** - decorative strip of twenty CV thumbnails rendered as inline SVG, duplicated once per row to produce a seamless CSS marquee; the two rows scroll in opposite directions and the second is reversed so they do not mirror each other.
- **`CoverLetterForm`** - collects the job requirements, optional context, an optional CV file and a 1–10 writing-style value (`humanScale`, defaulting to 7). The CV file is held in component state and only transmitted on submit.
- **`Preview`** - renders the streamed letter and exposes PDF and DOCX export. Export reads from `streamingContent` first and falls back to the stored `coverLetter.content`, so a letter can be exported mid-stream or after completion.
- **`AuthModal`** - combined login and registration dialog; registration enforces an eight-character minimum and a confirm-password match client-side before calling the API.
- **`Sidebar`** - off-canvas menu exposing the saved-letters modal and logout; it toggles a `sidebar-open` class on `document.body` to lock background scrolling.
- **`CoverLettersModal`** - paginated list of saved letters with client-side search, per-card PDF download, view and delete. Deletion uses a TanStack Query mutation that re-fetches the list on success.
- **`Footer`** - static links and a dynamically computed copyright year.

State-management layer:

- **`AuthProvider` / `useAuth`** - context exposing login, register, logout and refresh as async mutations. On mount it restores a session only if a saved user, an access token and a non-expired token are all present.
- **`useCoverLetter`** - hook coordinating generation and PDF status. The generation mutation builds a `multipart/form-data` body and streams the response, updating `streamingContent` on every chunk; the separate PDF mutation polls a queue until the document is ready.

Service layer:

- **`authService`** - register, login and refresh calls plus token helpers. Tokens, expiry and the user identity are persisted in `localStorage`, and `isTokenExpired()` compares the stored creation time against `expires_in`.
- **`coverLetterService`** - all cover-letter REST calls and the SSE reader. `generateCoverLetter()` parses the event stream manually with a `TextDecoder`, distinguishing default message chunks from `complete` and `error` events; `downloadPDF()` follows the backend's 302 redirect to Cloudinary and opens the resolved URL.
- **`pdfService`** - browser PDF export. `generatePDFFromElement()` rasterises a DOM node with `html2canvas` at 2× scale and places it on an A4 `jsPDF` page; `generatePDFFromText()` paginates raw text instead.
- **`docxService`** - browser DOCX export via the `docx` builder and FileSaver. `generateDOCXFromContent()` applies greeting and closing spacing heuristics and appends a `Sincerely,` signature when none is detected.

**Extra (3rd-party) tools and packages**

Runtime dependencies (from `CLG/package.json`):

- `react` ^19.2.0 and `react-dom` ^19.2.0 - UI runtime.
- `@tanstack/react-query` ^5.90.12 - server-state, mutations and caching.
- `jspdf` ^4.1.0 and `html2canvas` ^1.4.1 - client-side PDF rendering.
- `docx` ^9.5.1 and `file-saver` ^2.0.5 - client-side DOCX generation and download.

Development dependencies:

- `vite` ^7.2.4 and `@vitejs/plugin-react` ^5.1.1 - build tool, dev server and React fast refresh.
- `eslint` ^9.39.1 with `@eslint/js` ^9.39.1, `eslint-plugin-react-hooks` ^7.0.1, `eslint-plugin-react-refresh` ^0.4.24 and `globals` ^16.5.0 - linting.
- `@types/react` ^19.2.5 and `@types/react-dom` ^19.2.3 - type definitions for editor tooling.

External services and CDN assets:

- Backend REST and SSE API at `https://coverbe.onrender.com/api/v1` (hardcoded in `CLG/src/services/authService.js` and `CLG/src/services/coverLetterService.js`).
- Cloudinary - destination of the backend's PDF download redirect.
- Font Awesome 6.5.1 and the Inter font, both loaded from CDNs in `CLG/index.html`.
- `gh-pages` - used by the `deploy` script to publish `dist/`; it is not listed in `devDependencies` and must be provided via `npx` or a local install.

### User Manual

The application is a single scrolling page. All generation and history features require an account.

| View / component | Purpose |
| --- | --- |
| `Header` | Branding, login trigger and (once signed in) the sidebar menu toggle. |
| `Hero` | Introduction and a "Get Started" button that scrolls to the form. |
| `Features` | Animated strip of CV cards. |
| `CoverLetterForm` | Captures CV, job requirements, optional context and writing-style level. |
| `Preview` | Shows the streamed letter and the PDF / DOCX export buttons. |
| `AuthModal` | Login and registration. |
| `Sidebar` | Profile summary, access to saved letters and logout. |
| `CoverLettersModal` | Searchable, paginated list of saved letters with view, PDF download and delete. |

**Creating an account or signing in**

1. Select **Login** in the header to open the authentication dialog.
1. To register, choose **Create an account**, enter an email and a password of at least eight characters, and confirm it.
1. On success the dialog closes and the session token is stored; the menu toggle appears in the header.

**Generating a cover letter**

1. Optionally upload a CV (`.pdf`, `.doc` or `.docx`); the file is attached to the request on submit.
1. Paste the job description into **Job Description & Requirements** (required).
1. Add any extra context in **Additional Information** (optional).
1. Drag the **Writing Style** slider between 1 (formal, AI-assisted) and 10 (natural, conversational); the default is 7.
1. Select **Generate Cover Letter**. If you are not signed in, the login dialog opens instead.
1. The preview appears and fills in as the response streams; a blinking cursor indicates generation is in progress.

**Exporting and managing letters**

1. In the preview, choose **Save as PDF** or **Save as DOCX** to download a file rendered in the browser.
1. Open the sidebar and select **My Cover Letters** to browse saved letters.
1. Within the list, use **View** to load a letter into the preview, **PDF** to download the server-rendered PDF once its status is `completed`, or the trash icon to delete (a confirmation prompt is shown).

### Installation Instructions

**Prerequisites**

- Node.js 20.19+ or 22.12+ (required by Vite 7).
- npm (bundled with Node.js).
- A modern browser with `fetch` streaming support.

**Step-by-step setup**

```powershell
git clone https://github.com/Joekrry/CoverLetterGenerator.git
cd CoverLetterGenerator\CLG
npm install
```

## References

- Grey, E. (no date) *FileSaver.js*. Available at: https://github.com/eligrey/FileSaver.js (Accessed: 15 June 2026).
- Miu, D. (no date) *docx — Easily generate .docx files with JS/TS*. Available at: https://docx.js.org (Accessed: 15 June 2026).
- Mozilla (no date) *Using server-sent events*, MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events (Accessed: 15 June 2026).
- OpenJS Foundation (no date) *ESLint — Pluggable JavaScript linter*. Available at: https://eslint.org (Accessed: 15 June 2026).
- parallax (no date) *jsPDF — Client-side JavaScript PDF generation*. Available at: https://github.com/parallax/jsPDF (Accessed: 15 June 2026).
- React (no date) *React — The library for web and native user interfaces*. Available at: https://react.dev (Accessed: 15 June 2026).
- TanStack (no date) *TanStack Query — Powerful asynchronous state management*. Available at: https://tanstack.com/query/latest (Accessed: 15 June 2026).
- Vite (no date) *Vite — Next generation frontend tooling*. Available at: https://vite.dev (Accessed: 15 June 2026).
- von Hertzen, N. (no date) *html2canvas — Screenshots with JavaScript*. Available at: https://html2canvas.hertzen.com (Accessed: 15 June 2026).
