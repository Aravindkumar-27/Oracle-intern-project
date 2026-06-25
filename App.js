import { useState, useMemo } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  navy:       "#0F1F3D",
  navyLight:  "#162847",
  slate:      "#2B4270",
  accent:     "#3B6FD4",
  accentSoft: "#EAF0FB",
  white:      "#FFFFFF",
  surface:    "#F4F7FC",
  border:     "#D6E0F0",
  text:       "#0F1F3D",
  textMid:    "#4A5E80",
  textLight:  "#8A9ABB",
  submitted:  { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  pending:    { bg: "#FEF9C3", text: "#713F12", dot: "#EAB308" },
  late:       { bg: "#FFE4E6", text: "#881337", dot: "#F43F5E" },
};

const STATUS_OPTIONS = ["Pending", "Submitted", "Late"];

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: "Binary Search Tree Implementation",
    subject: "Data Structures",
    dueDate: "2025-06-10",
    status: "Submitted",
  },
  {
    id: 2,
    title: "JDBC Connection Pooling Lab",
    subject: "Java Programming",
    dueDate: "2025-06-18",
    status: "Pending",
  },
  {
    id: 3,
    title: "Activity-Based Costing Report",
    subject: "Cost Accounting",
    dueDate: "2025-06-05",
    status: "Late",
  },
  {
    id: 4,
    title: "ER Diagram – Library Management",
    subject: "Database Management",
    dueDate: "2025-06-22",
    status: "Pending",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusStyle(status) {
  return COLORS[status.toLowerCase()] || COLORS.pending;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components (all inline) ─────────────────────────────────────────────

function SummaryCard({ label, count, color, icon }) {
  return (
    <div style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "24px 28px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      boxShadow: "0 2px 8px rgba(15,31,61,0.07)",
      flex: "1 1 180px",
      minWidth: 160,
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: color.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: 32,
          fontWeight: 800,
          color: color.text,
          lineHeight: 1,
          letterSpacing: "-1px",
        }}>
          {count}
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.textMid,
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = statusStyle(status);
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      borderRadius: 99,
      background: s.bg,
      color: s.text,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.04em",
    }}>
      <span style={{
        width: 7, height: 7,
        borderRadius: "50%",
        background: s.dot,
        display: "inline-block",
        flexShrink: 0,
      }} />
      {status}
    </span>
  );
}

function StatusDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 10px",
        borderRadius: 8,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
        color: COLORS.text,
        cursor: "pointer",
        outline: "none",
        appearance: "auto",
      }}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [form, setForm] = useState({ title: "", subject: "", dueDate: "" });
  const [formError, setFormError] = useState("");
  const [nextId, setNextId] = useState(INITIAL_ASSIGNMENTS.length + 1);

  // Summary counts
  const counts = useMemo(() => ({
    submitted: assignments.filter(a => a.status === "Submitted").length,
    pending:   assignments.filter(a => a.status === "Pending").length,
    late:      assignments.filter(a => a.status === "Late").length,
  }), [assignments]);

  // Unique subjects for filter
  const subjects = useMemo(() => {
    const s = [...new Set(assignments.map(a => a.subject))].sort();
    return ["All Subjects", ...s];
  }, [assignments]);

  // Filtered list
  const displayed = useMemo(() => {
    if (filterSubject === "All Subjects") return assignments;
    return assignments.filter(a => a.subject === filterSubject);
  }, [assignments, filterSubject]);

  // Handlers
  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  }

  function handleAdd() {
    if (!form.title.trim() || !form.subject.trim() || !form.dueDate) {
      setFormError("All fields are required before adding an assignment.");
      return;
    }
    setAssignments(prev => [
      ...prev,
      {
        id: nextId,
        title: form.title.trim(),
        subject: form.subject.trim(),
        dueDate: form.dueDate,
        status: "Pending",
      },
    ]);
    setNextId(n => n + 1);
    setForm({ title: "", subject: "", dueDate: "" });
    setFormError("");
  }

  function handleStatusChange(id, newStatus) {
    setAssignments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
  }

  // ── Styles ──
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 9,
    fontSize: 14,
    color: COLORS.text,
    background: COLORS.white,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.textMid,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const thStyle = {
    padding: "12px 18px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    background: COLORS.surface,
    borderBottom: `1px solid ${COLORS.border}`,
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px 18px",
    fontSize: 14,
    color: COLORS.text,
    borderBottom: `1px solid ${COLORS.border}`,
    verticalAlign: "middle",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.surface,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: COLORS.text,
    }}>

      {/* ── Top Navbar ── */}
      <nav style={{
        background: COLORS.navy,
        padding: "0 40px",
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: COLORS.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>📋</div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
              Naan Mudhalvan / Oracle University
            </div>
            <div style={{ color: COLORS.textLight, fontSize: 11, letterSpacing: "0.05em" }}>
              ASSIGNMENT SUBMISSION TRACKER
            </div>
          </div>
        </div>
        <div style={{
          color: COLORS.textLight,
          fontSize: 12,
          background: COLORS.navyLight,
          padding: "5px 14px",
          borderRadius: 99,
          border: `1px solid rgba(255,255,255,0.08)`,
        }}>
          Academic Year 2024–25
        </div>
      </nav>

      {/* ── Page Body ── */}
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: COLORS.navy,
            margin: 0,
            letterSpacing: "-0.5px",
          }}>
            Faculty Dashboard
          </h1>
          <p style={{ color: COLORS.textMid, margin: "6px 0 0", fontSize: 14 }}>
            Track, manage, and update student assignment submissions in real time.
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 32,
        }}>
          <SummaryCard
            label="Submitted"
            count={counts.submitted}
            color={COLORS.submitted}
            icon="✅"
          />
          <SummaryCard
            label="Pending"
            count={counts.pending}
            color={COLORS.pending}
            icon="⏳"
          />
          <SummaryCard
            label="Late"
            count={counts.late}
            color={COLORS.late}
            icon="🚨"
          />
          <div style={{
            background: COLORS.navy,
            border: `1px solid ${COLORS.navyLight}`,
            borderRadius: 14,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: "0 2px 8px rgba(15,31,61,0.10)",
            flex: "1 1 180px",
            minWidth: 160,
          }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: 12,
              background: "rgba(59,111,212,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>📚</div>
            <div>
              <div style={{
                fontSize: 32, fontWeight: 800,
                color: COLORS.white,
                lineHeight: 1, letterSpacing: "-1px",
              }}>
                {assignments.length}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4, textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Total
              </div>
            </div>
          </div>
        </div>

        {/* ── Add Assignment Form ── */}
        <div style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 28,
          boxShadow: "0 2px 8px rgba(15,31,61,0.06)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
            paddingBottom: 16,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 8,
              background: COLORS.accentSoft,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>➕</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy }}>
                Add New Assignment
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight }}>
                Default status will be set to <strong>Pending</strong>
              </div>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.2fr auto",
            gap: 16,
            alignItems: "end",
          }}>
            <div>
              <label style={labelStyle}>Assignment Title</label>
              <input
                style={inputStyle}
                name="title"
                placeholder="e.g. Linked List Traversal"
                value={form.title}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <input
                style={inputStyle}
                name="subject"
                placeholder="e.g. Data Structures"
                value={form.subject}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                style={inputStyle}
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <button
                onClick={handleAdd}
                style={{
                  padding: "10px 24px",
                  background: COLORS.accent,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  height: 41,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  letterSpacing: "0.02em",
                  boxShadow: "0 2px 8px rgba(59,111,212,0.30)",
                  transition: "opacity 0.15s",
                }}
                onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}
              >
                <span style={{ fontSize: 16 }}>+</span> Add Assignment
              </button>
            </div>
          </div>

          {formError && (
            <div style={{
              marginTop: 12,
              color: COLORS.late.text,
              background: COLORS.late.bg,
              borderRadius: 8,
              padding: "9px 14px",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}>
              ⚠️ {formError}
            </div>
          )}
        </div>

        {/* ── Assignment List ── */}
        <div style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(15,31,61,0.06)",
          overflow: "hidden",
        }}>
          {/* Table Header Row with Filter */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 28px",
            borderBottom: `1px solid ${COLORS.border}`,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy }}>
                All Assignments
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
                {displayed.length} record{displayed.length !== 1 ? "s" : ""} shown
                {filterSubject !== "All Subjects" ? ` — filtered by "${filterSubject}"` : ""}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: COLORS.textMid,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Filter by Subject:
              </span>
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                style={{
                  padding: "8px 14px",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  background: COLORS.surface,
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: "inherit",
                  minWidth: 160,
                }}
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
            }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, paddingLeft: 28 }}>#</th>
                  <th style={thStyle}>Assignment Title</th>
                  <th style={thStyle}>Subject</th>
                  <th style={thStyle}>Due Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{
                      ...tdStyle,
                      textAlign: "center",
                      padding: "52px 24px",
                      color: COLORS.textLight,
                      fontSize: 15,
                    }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                      No assignments found
                      {filterSubject !== "All Subjects" &&
                        <div style={{ fontSize: 13, marginTop: 4 }}>
                          Try switching the subject filter to "All Subjects"
                        </div>
                      }
                    </td>
                  </tr>
                ) : (
                  displayed.map((a, i) => (
                    <tr
                      key={a.id}
                      style={{
                        background: i % 2 === 0 ? COLORS.white : COLORS.surface,
                        transition: "background 0.12s",
                      }}
                      onMouseOver={e => e.currentTarget.style.background = COLORS.accentSoft}
                      onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? COLORS.white : COLORS.surface}
                    >
                      <td style={{ ...tdStyle, paddingLeft: 28, color: COLORS.textLight, fontWeight: 600, fontSize: 12 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.navy, maxWidth: 280 }}>
                        {a.title}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: "inline-block",
                          background: COLORS.accentSoft,
                          color: COLORS.accent,
                          borderRadius: 6,
                          padding: "3px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.03em",
                        }}>
                          {a.subject}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: COLORS.textMid }}>
                        {formatDate(a.dueDate)}
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge status={a.status} />
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <StatusDropdown
                          value={a.status}
                          onChange={newStatus => handleStatusChange(a.id, newStatus)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div style={{
            padding: "14px 28px",
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: COLORS.surface,
            flexWrap: "wrap",
            gap: 8,
          }}>
            <div style={{ display: "flex", gap: 18 }}>
              {[
                { label: "Submitted", ...COLORS.submitted },
                { label: "Pending",   ...COLORS.pending   },
                { label: "Late",      ...COLORS.late      },
              ].map(s => (
                <span key={s.label} style={{
                  display: "inline-flex", alignItems: "center",
                  gap: 6, fontSize: 12, color: COLORS.textMid, fontWeight: 600,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: s.dot, display: "inline-block",
                  }} />
                  {s.label}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textLight }}>
              Total: <strong style={{ color: COLORS.navy }}>{assignments.length}</strong> assignments
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center",
        padding: "24px 16px",
        color: COLORS.textLight,
        fontSize: 12,
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.white,
      }}>
        Naan Mudhalvan / Oracle University · Assignment Tracker · Academic Year 2024–25
      </footer>

      {/* ── Global reset ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.surface}; }
        input:focus, select:focus { outline: 2px solid ${COLORS.accent}; outline-offset: 1px; }
        @media (max-width: 760px) {
          div[style*="gridTemplateColumns"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
