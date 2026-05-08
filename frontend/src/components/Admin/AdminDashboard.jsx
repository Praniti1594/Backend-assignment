import { useState, useEffect, useCallback } from "react";
import "./admin.css";

// ── helpers ──────────────────────────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

function getToken() {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  in_progress: "In Progress",
  completed: "Completed",
};

// ── sub-components ────────────────────────────────────────────────────────────
function StatPill({ label, value, accent }) {
  return (
    <span className="ad-stat-pill" style={{ "--accent": accent }}>
      <strong>{value}</strong> {label}
    </span>
  );
}

function UserCard({ user, isSelected, onClick }) {
  const total = user.task_count ?? user.taskCount ?? 0;
  const done = user.completed_tasks ?? user.completedTasks ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className={`ad-user-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(user)}
    >
      <div className="ad-avatar">
        {(user.username || user.name || "?")[0].toUpperCase()}
      </div>
      <div className="ad-user-info">
        <h3>{user.username || user.name}</h3>
        <p className="ad-email">{user.email}</p>
        <div className="ad-pills">
          <StatPill label="tasks" value={total} accent="#6366f1" />
          <StatPill label="done" value={done} accent="#22c55e" />
          <StatPill label="%" value={pct} accent="#f59e0b" />
        </div>
        <div className="ad-progress-bar">
          <div className="ad-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="ad-chevron">{isSelected ? "▲" : "▼"}</div>
    </div>
  );
}

function TaskBadge({ status }) {
  const cls =
    status === "completed"
      ? "badge-done"
      : status === "in-progress" || status === "in_progress"
      ? "badge-wip"
      : "badge-pending";
  return (
    <span className={`ad-badge ${cls}`}>{STATUS_LABELS[status] || status}</span>
  );
}

function TaskRow({ task }) {
  return (
    <div className="ad-task-row">
      <div className="ad-task-left">
        <span
          className="ad-priority-dot"
          style={{ background: PRIORITY_COLORS[task.priority] || "#94a3b8" }}
        />
        <div>
          <p className="ad-task-title">{task.title}</p>
          {task.description && (
            <p className="ad-task-desc">{task.description}</p>
          )}
        </div>
      </div>
      <div className="ad-task-right">
        <TaskBadge status={task.status} />
        {task.due_date && (
          <span className="ad-due">
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

function AssignTaskForm({ userId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Try the most common endpoint patterns
      await apiFetch(`/admin/users/${userId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ ...form, user_id: userId }),
      });
      onSuccess();
    } catch (e1) {
      try {
        await apiFetch(`/admin/assign-task`, {
          method: "POST",
          body: JSON.stringify({ ...form, user_id: userId }),
        });
        onSuccess();
      } catch (e2) {
        try {
          await apiFetch(`/tasks`, {
            method: "POST",
            body: JSON.stringify({ ...form, user_id: userId }),
          });
          onSuccess();
        } catch (e3) {
          setError(e3.message || "Failed to assign task.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-assign-form">
      <h4>Assign New Task</h4>
      {error && <p className="ad-form-error">{error}</p>}
      <input
        name="title"
        placeholder="Task title *"
        value={form.title}
        onChange={handle}
        className="ad-input"
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handle}
        className="ad-input ad-textarea"
        rows={3}
      />
      <div className="ad-form-row">
        <select name="priority" value={form.priority} onChange={handle} className="ad-input">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select name="status" value={form.status} onChange={handle} className="ad-input">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <input
        name="due_date"
        type="date"
        value={form.due_date}
        onChange={handle}
        className="ad-input"
      />
      <div className="ad-form-actions">
        <button className="ad-btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button className="ad-btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Assigning…" : "Assign Task"}
        </button>
      </div>
    </div>
  );
}

function UserTaskPanel({ user, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Try multiple endpoint patterns
      let data;
      try {
        data = await apiFetch(`/admin/users/${user.id}/tasks`);
      } catch {
        data = await apiFetch(`/admin/tasks?user_id=${user.id}`);
      }
      // Normalise response shape
      setTasks(
        Array.isArray(data) ? data : data.tasks || data.data || []
      );
    } catch (e) {
      setError(e.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAssignSuccess = () => {
    setShowForm(false);
    fetchTasks();
  };

  return (
    <div className="ad-task-panel">
      <div className="ad-task-panel-header">
        <div>
          <h3>{user.username || user.name}'s Tasks</h3>
          <p className="ad-email">{user.email}</p>
        </div>
        <div className="ad-panel-actions">
          <button
            className="ad-btn-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "✕ Cancel" : "+ Assign Task"}
          </button>
          <button className="ad-btn-icon" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      {showForm && (
        <AssignTaskForm
          userId={user.id}
          onSuccess={handleAssignSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <p className="ad-loading">Loading tasks…</p>}
      {error && <p className="ad-error">{error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <p className="ad-empty">No tasks yet. Assign one above!</p>
      )}
      {!loading && tasks.map((t) => <TaskRow key={t.id} task={t} />)}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("[AdminDashboard] loaded");
    (async () => {
      try {
        let data;
        try {
          data = await apiFetch("/admin/users");
        } catch {
          data = await apiFetch("/admin/dashboard");
        }
        setUsers(
          Array.isArray(data) ? data : data.users || data.data || []
        );
      } catch (e) {
        setError(e.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.username || u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const handleUserClick = (user) => {
    setSelectedUser((prev) => (prev?.id === user.id ? null : user));
  };

  return (
    <div className="ad-root">
      {/* ── header ── */}
      <div className="ad-header">
        <div>
          <h1 className="ad-title">Admin Dashboard</h1>
          <p className="ad-subtitle">
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <input
          className="ad-search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── states ── */}
      {loading && <p className="ad-loading">Loading users…</p>}
      {error && (
        <div className="ad-error-box">
          <strong>Error:</strong> {error}
          <br />
          <small>Make sure the backend is running and you are logged in as admin.</small>
        </div>
      )}

      {/* ── layout ── */}
      {!loading && !error && (
        <div className={`ad-layout ${selectedUser ? "has-panel" : ""}`}>
          {/* user list */}
          <div className="ad-user-list">
            {filtered.length === 0 && (
              <p className="ad-empty">No users found.</p>
            )}
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                isSelected={selectedUser?.id === u.id}
                onClick={handleUserClick}
              />
            ))}
          </div>

          {/* task panel */}
          {selectedUser && (
            <UserTaskPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}