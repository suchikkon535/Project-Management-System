// Centralized API service for TaskFlow
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

/**
 * Generic fetch wrapper with auth headers and error handling.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data;
}

// ─── Color name → hex mapping ────────────────────────────────────────────────
const colorMap = {
  blue: '#4F46E5',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  orange: '#F97316',
  teal: '#14B8A6',
  indigo: '#6366F1',
};

function resolveColor(color) {
  if (!color) return '#4F46E5';
  // If already a hex value, return as-is
  if (color.startsWith('#')) return color;
  return colorMap[color.toLowerCase()] || '#4F46E5';
}

// ─── Projects ────────────────────────────────────────────────────────────────

/**
 * Fetch lightweight project list (for sidebar).
 * GET /api/projects/GetAllProjects
 */
export async function fetchSidebarProjects() {
  const data = await apiFetch('/api/projects/GetAllProjects');
  return data.map((p) => ({
    _id: p._id,
    id: p._id,
    name: p.name,
    color: resolveColor(p.color),
    status: p.status,
  }));
}

/**
 * Fetch full project details (for /projects page).
 * GET /api/projects/fullStatus
 */
export async function fetchFullProjects() {
  const data = await apiFetch('/api/projects/fullStatus');
  return data.map((p) => ({
    _id: p._id,
    id: p._id,
    name: p.name,
    description: p.description || '',
    color: resolveColor(p.color),
    status: p.status,
    members: p.members || [],
    taskCount: p.taskCount || 0,
    completedTaskCount: p.completedTaskCount || 0,
    visibility: p.visibility || 'private',
  }));
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

/**
 * Fetch tasks for a project.
 * POST /api/tasks/GetTasks  — sends { projectId } in body
 * If no projectId is provided, fetches all tasks.
 */
export async function fetchTasks(projectId) {
  const data = await apiFetch('/api/tasks/GetTasks', {
    method: 'POST',
    body: JSON.stringify(projectId ? { projectId } : {}),
  });
  return data.map((t) => ({
    _id: t._id,
    id: t._id,
    title: t.title,
    description: t.description || '',
    status: t.status,
    priority: t.priority,
    startDate: t.startDate,
    dueDate: t.dueDate,
    completed: t.completed,
    assignedTo: t.assignedTo || [],
    // Derive assignee display info
    assigneeName: t.assignedTo?.[0]?.fullname || null,
    assigneeEmail: t.assignedTo?.[0]?.email || null,
    assigneeInitials: t.assignedTo?.[0]?.fullname
      ? t.assignedTo[0].fullname
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : null,
  }));
}
