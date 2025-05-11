'use client';
import { useEffect, useState } from 'react';
import { Edit2, Trash2, PlusIcon } from 'lucide-react';
import NewTask from '@/app/components/newTask'

export default function EditTask() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
  });

  const API_BASE = 'http://localhost:5000/api/tasks';

  useEffect(() => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const deleteTask = async (id) => {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task._id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTask({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      priority: task.priority || '',
      status: task.status || '',
    });
  };

  const updateTask = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTask),
    });

    setTasks(tasks.map(t => (t._id === id ? { ...t, ...editedTask } : t)));
    setEditingId(null);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString();

   const [openTaskForm, setOpenTaskForm] = useState(false);

  return (
    <div className="bg-[#D4D5EE] min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4 text-center uppercase">Manage Your Tasks</h1>
      <div className="flex justify-between items-center mb-4">  
        <h1 className="text-2xl font-bold mb-4">Task List</h1>
        <button
          onClick={() => setOpenTaskForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
        <NewTask open={openTaskForm} setOpen={setOpenTaskForm} />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="text-sm text-center">
                {editingId === task._id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <textarea
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                        className="border rounded p-1 w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        value={editedTask.priority}
                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Select</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <select
                        value={editedTask.status}
                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                        className="border rounded p-1 w-full"
                      >
                        <option value="">Select</option>
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{task.title}</td>
                    <td className="p-2 border">{task.description}</td>
                    <td className="p-2 border">{task.dueDate?.slice(0, 10)}</td>
                    <td className="p-2 border">{task.priority}</td>
                    <td className="p-2 border">{task.status}</td>
                  </>
                )}

                <td className="p-2 border">{formatDate(task.createdAt)}</td>
                <td className="p-2 border">{formatTime(task.createdAt)}</td>
                <td className="p-2 border-b border-r flex justify-center gap-2">
                  {editingId === task._id ? (
                    <button
                      onClick={() => updateTask(task._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(task)}
                      className="bg-[#0b3676] text-white p-2 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white p-2  rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
