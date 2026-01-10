import React from 'react';

const TaskModal = ({
  showModal,
  setShowModal,
  addTask,
  newTask,
  setNewTask
}) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
        </div>
        <form onSubmit={addTask} className="modal-form">
          <div className="form-group">
            <label htmlFor="taskTitle">Task Title</label>
            <input
              id="taskTitle"
              type="text"
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-row-multi">
            <div className="form-group">
              <label htmlFor="priority">Importance</label>
              <select id="priority" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Workspace</label>
              <select id="category" value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Deadline (Optional)</label>
            <input
              id="dueDate"
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desc">Write some details</label>
            <textarea
              id="desc"
              placeholder="Context, links, or sub-tasks..."
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="primary-btn">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
