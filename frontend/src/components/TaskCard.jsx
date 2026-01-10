import React from 'react';

const TaskCard = ({
  task,
  editingTask,
  setEditingTask,
  updateTask,
  deleteTask,
  toggleStatus
}) => {
  const isEditing = editingTask && editingTask.id === task.id;

  if (isEditing) {
    return (
      <div className={`task-card priority-${task.priority} ${task.status}`}>
        <form className="inline-edit" onSubmit={updateTask}>
          <input
            value={editingTask.title}
            onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
            required
            autoFocus
          />
          <textarea
            value={editingTask.description}
            onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
          />
          <div className="edit-actions">
            <button type="submit" className="save">Save</button>
            <button type="button" onClick={() => setEditingTask(null)} className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`task-card priority-${task.priority} ${task.status}`}>
      <div className="task-top">
        <div className="status-container">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => toggleStatus(task)}
          />
          <span className={`badge ${task.category}`}>{task.category}</span>
        </div>
        <div className="task-menu">
          <button onClick={() => setEditingTask(task)}>✏️</button>
          <button onClick={() => deleteTask(task.id)}>🗑️</button>
        </div>
      </div>
      <h4 className="task-title">{task.title}</h4>
      <p className="task-desc">{task.description}</p>
      <div className="task-bottom">
        {task.dueDate && <span className="due-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
        <span className={`priority-tag ${task.priority}`}>{task.priority}</span>
      </div>
    </div>
  );
};

export default TaskCard;
