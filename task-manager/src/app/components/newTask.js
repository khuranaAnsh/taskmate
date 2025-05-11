'use client';

import React from 'react';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';



export default function NewTask({ open, setOpen, userRole }) {
const [teamMembers, setTeamMembers] = useState([]);

useEffect(() => {
    fetch('http://localhost:5000/api/users/team-members') // adjust URL as needed
      .then(res => res.json())
      .then(data => setTeamMembers(data))
      .catch(err => console.error('Failed to load team members:', err));
  }, []);

  const router = useRouter()
  console.log(userRole)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Todo',
    assignedTo: 'Myself',
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', formData, {

        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Task created successfully!');
      setOpen(false);
      router.push('/dashboard')
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Task creation failed');
    }
  }


  

  return (
    <div className="fixed   border-2 mx-auto inset-0 bg-gray-800 opacity-80 flex justify-end z-50">
      <div className="bg-[#dfdfee] w-96 max-w-md h-fit my-auto mx-auto  p-6 shadow-lg rounded-xl ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <button onClick={() => setOpen(false)} className="text-red-500 font-bold hover:text-red-600 text-xl cursor-pointer">✕</button>
        </div>

        <form className="space-y-4  cursor-pointer" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text"
              name='title'
              value={formData.title}
              onChange={handleChange}

              className="w-full border rounded-md px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              name='description'
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" required></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              name='dueDate'
              value={formData.dueDate}
              onChange={handleChange}
              type="date" className="w-full border rounded-md px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2">
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          {(userRole === 'manager', 'team leader') && (
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Team Member</option>
            <option value="myself">Myself</option>
            {teamMembers.map(member => (
              <option key={member._id} value={member._id}>
                {member.name} (ID: {member.employeeId})
              </option>
            ))}
          </select>
            </div>

          )}

          <button
            type="submit"
            className="w-full mt-4 bg-[#3667B1] text-white py-2.5 font-semibold hover:text-black px-4 rounded-md hover:bg-purple-300 transition"
          >
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}
