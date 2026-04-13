import React, { useState, useEffect } from 'react';
import './App.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('tasks');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUser(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:8080/user', { credentials: 'include' });
      const data = await res.json();
      if (data.name) {
        setUser(data);
        fetchTasks();
        fetchDeletedTasks();
      }
    } catch (e) {
      console.log('Not logged in');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8080/tasks', { credentials: 'include' });
    const data = await res.json();
    setTasks(data);
  };

  const fetchDeletedTasks = async () => {
    const res = await fetch('http://localhost:8080/tasks/deleted', { credentials: 'include' });
    const data = await res.json();
    setDeletedTasks(data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, status: 'PENDING' }),
    });
    setTitle('');
    fetchTasks();
  };

  const completeTask = async (task) => {
    await fetch(`http://localhost:8080/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...task, status: 'COMPLETED' }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchTasks();
    fetchDeletedTasks();
  };

  const filtered = tasks.filter(t =>
    filter === 'ALL' ? true : t.status === filter
  );

  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚡</div>
        <h1>TaskFlow</h1>
        <p>Manage your work, effortlessly.</p>
        <a href="http://localhost:8080/oauth2/authorization/google" className="google-btn">
          <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
          Sign in with Google
        </a>
      </div>
    </div>
  );

  const allTasksCombined = [
    ...tasks.map(t => ({ ...t, isDeleted: false })),
    ...deletedTasks.map(t => ({ ...t, isDeleted: true }))
  ].filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'DELETED') return t.isDeleted;
    if (filter === 'PENDING') return !t.isDeleted && t.status === 'PENDING';
    if (filter === 'COMPLETED') return !t.isDeleted && t.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand">⚡ TaskFlow</div>
        <div className="nav-links">
          <span
            className={view === 'tasks' ? 'active-link' : ''}
            onClick={() => { setView('tasks'); setFilter('ALL'); }}>
            My Tasks
          </span>
          <span
            className={view === 'all' ? 'active-link' : ''}
            onClick={() => { setView('all'); setFilter('ALL'); }}>
            All Tasks
          </span>
        </div>
        <div className="nav-user">
          {user.picture && <img src={user.picture} alt="avatar" className="avatar" />}
          <span className="user-name">{user.name}</span>
          <a href="http://localhost:8080/logout" className="logout-btn">Logout</a>
        </div>
      </nav>

      <div className="hero">
        <h1>Welcome back, <span>{user.name.split(' ')[0]}</span>!</h1>
        <p>Here's what's on your plate today.</p>
      </div>

      <div className="container">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pending}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {view === 'tasks' ? (
          <div className="main-card">
            <div className="card-header">
              <h2>My Tasks</h2>
              <div className="filter-tabs">
                {['ALL', 'PENDING', 'COMPLETED'].map(f => (
                  <button key={f}
                    className={`tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}>
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'In Progress' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-row">
              <input type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()} />
              <button className="add-btn" onClick={addTask}>+ Add Task</button>
            </div>

            <div className="task-list">
              {filtered.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No tasks here. Add one above!</p>
                </div>
              )}
              {filtered.map((task) => (
                <div key={task.id}
                  className={`task-item ${task.status === 'COMPLETED' ? 'done' : ''}`}>
                  <div className="task-left">
                    <div
                      className={`checkbox ${task.status === 'COMPLETED' ? 'checked' : ''}`}
                      onClick={() => task.status === 'PENDING' && completeTask(task)}>
                      {task.status === 'COMPLETED' && '✓'}
                    </div>
                    <div>
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className={`task-badge ${task.status === 'COMPLETED' ? 'badge-done' : 'badge-pending'}`}>
                          {task.status === 'PENDING' ? 'In Progress' : 'Completed'}
                        </span>
                        <span className="task-date">📅 {formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="delete-btn"
                    onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>

        ) : (
          <div className="main-card">
            <div className="card-header">
              <h2>All Tasks</h2>
              <div className="filter-tabs">
                {['ALL', 'PENDING', 'COMPLETED', 'DELETED'].map(f => (
                  <button key={f}
                    className={`tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}>
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'In Progress' : f === 'COMPLETED' ? 'Completed' : '🗑 Deleted'}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-list" style={{ padding: '20px 28px' }}>
              {allTasksCombined.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No tasks found!</p>
                </div>
              ) : (
                allTasksCombined.map((task) => (
                  <div key={`${task.isDeleted ? 'del' : 'act'}-${task.id}`}
                    className={`task-item ${task.status === 'COMPLETED' || task.isDeleted ? 'done' : ''}`}>
                    <div className="task-left">
                      <div className={`checkbox ${task.status === 'COMPLETED' || task.isDeleted ? 'checked' : ''}`}>
                        {(task.status === 'COMPLETED' || task.isDeleted) && '✓'}
                      </div>
                      <div>
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                          {task.isDeleted ? (
                            <span className="task-badge badge-deleted">🗑 Deleted</span>
                          ) : (
                            <span className={`task-badge ${task.status === 'COMPLETED' ? 'badge-done' : 'badge-pending'}`}>
                              {task.status === 'PENDING' ? 'In Progress' : 'Completed'}
                            </span>
                          )}
                          <span className="task-date">📅 Created: {formatDate(task.createdAt)}</span>
                          {task.isDeleted && (
                            <span className="task-date">🗑 Deleted: {formatDate(task.deletedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;