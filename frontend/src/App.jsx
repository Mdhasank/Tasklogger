import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPrevPage: false
  });

  const API_BASE = '/api';

  const fetchTasks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks?page=${page}&limit=${pagination.itemsPerPage}`);
      const data = await response.json();
      setTasks(data.tasks || []);
      setPagination({
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        itemsPerPage: data.pagination.itemsPerPage,
        hasNextPage: data.pagination.hasNextPage,
        hasPrevPage: data.pagination.hasPrevPage
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  }, [pagination.itemsPerPage]);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  }, [pagination.totalPages]);

  const addTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      setNewTask({ title: '', description: '', status: 'pending', dueDate: '' });
      // Refetch current page to show updated list
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [newTask, currentPage, fetchTasks]);

  const updateTask = useCallback(async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      await fetch(`${API_BASE}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask)
      });
      setEditingTask(null);
      // Refetch current page to show updated list
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [editingTask, currentPage, fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      // Refetch current page to show updated list
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [currentPage, fetchTasks]);

  const toggleStatus = useCallback(async (task) => {
    const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' };
    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      // Refetch current page to show updated list
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, [currentPage, fetchTasks]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskLogger</h1>
        <p>Organize your tasks with style</p>
      </header>
      <main className="content-wrapper">
        <div className="task-form">
          <h2>Add New Task</h2>
          <form onSubmit={addTask}>
            <div className="form-group">
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                placeholder="Add a description..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <button type="submit">Add Task</button>
          </form>
        </div>

        <div className="task-list">
          <h2>Your Tasks</h2>
          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.status}`}>
                  {editingTask && editingTask.id === task.id ? (
                    <form onSubmit={updateTask}>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        required
                      />
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      />
                      <select
                        value={editingTask.status}
                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                      <input
                        type="date"
                        value={editingTask.dueDate || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      />
                      <div className="task-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="task-content">
                      <span className={`status-badge ${task.status}`}>
                        {task.status}
                      </span>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta">
                        {task.dueDate && (
                          <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                        <span>🕐 Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => toggleStatus(task)}>
                          {task.status === 'pending' ? '✓ Complete' : '↻ Reopen'}
                        </button>
                        <button onClick={() => setEditingTask(task)}>✏️ Edit</button>
                        <button onClick={() => deleteTask(task.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          {!loading && tasks.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} tasks
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!pagination.hasPrevPage}
                  className="pagination-btn"
                  title="First page"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="pagination-btn"
                  title="Previous page"
                >
                  ‹
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="pagination-btn"
                  title="Next page"
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className="pagination-btn"
                  title="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
