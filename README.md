# 📋 College Assignment Submission Tracker

A faculty-facing dashboard for tracking student assignment submissions, built with React and Vite. Developed as part of the **Naan Mudhalvan / Oracle University** project requirement for Academic Year 2024–25.

---

## 🖥️ Live Features

| Feature | Description |
|---|---|
| **Summary Cards** | Real-time counts for Submitted, Pending, Late, and Total assignments |
| **Add Assignment** | Form to register new assignments with Title, Subject, and Due Date |
| **Assignment Table** | Full list view with zebra rows, subject pills, and formatted dates |
| **Status Management** | Inline dropdown per row to update status between Submitted / Pending / Late |
| **Subject Filter** | Dropdown that auto-populates from existing subjects, with an "All Subjects" reset |
| **Form Validation** | Inline error message when any field is left empty before submitting |
| **Empty State** | Contextual message when no assignments match the current filter |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (comes with Node)

### Installation

```bash
# 1. Scaffold a new Vite + React project
npm create vite@latest assignment-tracker -- --template react

# 2. Move into the project directory
cd assignment-tracker

# 3. Install dependencies
npm install

# 4. Replace the default App.jsx with the provided file
#    Copy App.jsx into src/App.jsx (overwrite the existing file)

# 5. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Optional: Inter Font (recommended)

Add the following line inside the `<head>` of `index.html` for the intended typography:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
```

---

## 📁 Project Structure

```
assignment-tracker/
├── public/
├── src/
│   ├── App.jsx          ← Entire application (single file)
│   └── main.jsx         ← Vite entry point (unchanged)
├── index.html
├── package.json
└── vite.config.js
```

The entire application lives in a single `App.jsx` file — no additional components, stylesheets, or state libraries are needed.

---

## 🗂️ Pre-loaded Sample Data

The dashboard launches with four realistic assignments so it never appears empty:

| # | Title | Subject | Due Date | Status |
|---|---|---|---|---|
| 1 | Binary Search Tree Implementation | Data Structures | 10 Jun 2025 | ✅ Submitted |
| 2 | JDBC Connection Pooling Lab | Java Programming | 18 Jun 2025 | ⏳ Pending |
| 3 | Activity-Based Costing Report | Cost Accounting | 05 Jun 2025 | 🚨 Late |
| 4 | ER Diagram – Library Management | Database Management | 22 Jun 2025 | ⏳ Pending |

---

## 🎨 Design System

The UI uses a consistent token-based color palette defined at the top of `App.jsx`:

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0F1F3D` | Navbar, headings, primary text |
| `accent` | `#3B6FD4` | Buttons, subject pills, focus rings |
| `surface` | `#F4F7FC` | Page background, table alternate rows |
| `submitted` | `#10B981` | Green badge for submitted status |
| `pending` | `#EAB308` | Amber badge for pending status |
| `late` | `#F43F5E` | Rose badge for late status |

To retheme the app, update the `COLORS` object at the top of `App.jsx` — all styles derive from it.

---

## 🧩 Component Overview

All components are defined inline within `App.jsx`:

- **`SummaryCard`** — Displays a count with an icon and colored background, used in the top summary row.
- **`StatusBadge`** — Pill-shaped read-only badge with a color-coded dot, rendered in the table's Status column.
- **`StatusDropdown`** — Controlled `<select>` element for updating an assignment's status inline.
- **`App` (default export)** — Root component holding all state, derived values, and layout.

### State shape

```js
// Each assignment object
{
  id: number,
  title: string,
  subject: string,
  dueDate: string,   // "YYYY-MM-DD"
  status: "Pending" | "Submitted" | "Late"
}
```

### Key hooks

```js
const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
const [filterSubject, setFilterSubject]  = useState("All Subjects");
const [form, setForm] = useState({ title: "", subject: "", dueDate: "" });

// Derived — recalculate only when assignments change
const counts   = useMemo(() => { ... }, [assignments]);
const subjects = useMemo(() => { ... }, [assignments]);
const displayed = useMemo(() => { ... }, [assignments, filterSubject]);
```

---

## 🔧 Extending the Project

**Add persistent storage** — swap `useState` with `localStorage`:
```js
const [assignments, setAssignments] = useState(
  () => JSON.parse(localStorage.getItem("assignments")) || INITIAL_ASSIGNMENTS
);

// Call this after every update:
localStorage.setItem("assignments", JSON.stringify(assignments));
```

**Add a delete button** — extend each table row with:
```jsx
<button onClick={() => setAssignments(prev => prev.filter(a => a.id !== row.id))}>
  Remove
</button>
```

**Add search** — add a text input and filter `displayed` by `a.title.toLowerCase().includes(query)`.

**Split into separate files** — extract `SummaryCard`, `StatusBadge`, and `StatusDropdown` into their own files under `src/components/` as the project grows.

---

## 🛠️ Built With

- [React 18](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Build tool and dev server
- CSS-in-JS via inline `style` objects — no external CSS framework required

---

## 📄 License

This project was created for educational purposes as part of the Naan Mudhalvan / Oracle University curriculum. Free to use and modify for academic submissions.
