import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

// Component Imports
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

const API_BASE = '/api';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, urgent: 0 });
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', dueDate: '', priority: 'medium', category: 'general' });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters and Sidebar
  const [view, setView] = useState('all'); // 'all', 'pending', 'completed', 'category-work', etc.
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPrevPage: false
  });

  const authHeader = useMemo(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchTasks = useCallback(async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      let statusFilter = '&status=pending';
      if (view === 'completed') statusFilter = '&status=completed';

      let categoryFilter = '';
      if (view.startsWith('category-')) categoryFilter = `&category=${view.split('-')[1]}`;

      const priorityFilter = filterPriority ? `&priority=${filterPriority}` : '';
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

      const response = await fetch(`${API_BASE}/tasks?page=${page}&limit=${pagination.itemsPerPage}${statusFilter}${categoryFilter}${priorityFilter}${searchParam}`, {
        headers: authHeader
      });

      if (response.status === 403 || response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setTasks(data.tasks || []);
      setStats(data.stats || stats);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        hasNextPage: data.pagination.hasNextPage,
        hasPrevPage: data.pagination.hasPrevPage
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  }, [token, authHeader, pagination.itemsPerPage, view, searchQuery, filterPriority]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTasks(1);
  }, [view, searchQuery, filterPriority, fetchTasks]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchTasks(currentPage);
    }
  }, [currentPage, fetchTasks]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please ensure the backend server is running.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      // Clear inputs upon success
      setAuthData({ email: '', password: '', name: '' });
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTasks([]);
    setStats({ total: 0, pending: 0, completed: 0, urgent: 0 });
    // Clear inputs upon logout
    setAuthData({ email: '', password: '', name: '' });
  };

  const addTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Failed to add task');
      setNewTask({ title: '', description: '', status: 'pending', dueDate: '', priority: 'medium', category: 'general' });
      setShowModal(false);
      fetchTasks(1);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [newTask, fetchTasks, authHeader]);

  const updateTask = useCallback(async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(editingTask)
      });
      if (!response.ok) throw new Error('Failed to update task');
      setEditingTask(null);
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [editingTask, currentPage, fetchTasks, authHeader]);

  const deleteTask = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: authHeader
      });
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [currentPage, fetchTasks, authHeader]);

  const toggleStatus = useCallback(async (task) => {
    const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' };
    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(updatedTask)
      });
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, [currentPage, fetchTasks, authHeader]);

  if (!token) {
    return <Auth
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      authData={authData}
      setAuthData={setAuthData}
      handleAuth={handleAuth}
      authError={authError}
    />;
  }

  return (
    <div className={`App dashboard ${isMobileMenuOpen ? 'mobile-nav-active' : ''}`}>
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        view={view}
        setView={setView}
        setCurrentPage={setCurrentPage}
        stats={stats}
        user={user}
        handleLogout={handleLogout}
      />

      <main className="main-content">
        <Header
          view={view}
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowModal={setShowModal}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <StatsGrid stats={stats} />

        <div className="toolbar">
          <div className="filters">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <section className="task-container">
          {loading ? (
            <div className="loader">Refreshing tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-img">🌌</div>
              <h3>Everything is clear!</h3>
              <p>Looks like you don't have any tasks in this view.</p>
              <button onClick={() => setShowModal(true)}>Create One Now</button>
            </div>
          ) : (
            <div className="task-list-modern">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  toggleStatus={toggleStatus}
                />
              ))}
            </div>
          )}
        </section>

        {pagination.totalPages > 1 && (
          <div className="footer-pagination">
            <button disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span className="page-numbers">Page {currentPage} of {pagination.totalPages}</span>
            <button disabled={!pagination.hasNextPage} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </main>

      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        addTask={addTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />
    </div>
  );
}

export default App;
