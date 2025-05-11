'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import axios from 'axios';

export default function RoleSelector({ onClose }) {
  const [role, setRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/users/set-role', {
        method: 'POST',
        credentials: 'include', // this ensures cookie is sent
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, employeeId }) // fixed this line
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(result.message || 'Failed to set role');
        return;
      }
  
      alert('Role set successfully! Dashboard loading...');
      onClose();
  
      // Redirect based on role
      const normalizedRole = role.toLowerCase();
    //  await localStorage.setItem('role', normalizedRole); // Store role in local storage for later use
      if (['manager', 'admin', 'team leader'].includes(normalizedRole)) {
      router.push('/dashboard');
      } else if (normalizedRole === 'team member') {
        router.push('/dashboard/userDashboard');
      } else {
        alert('Invalid role selected');
      }
    } catch (error) {
      console.error('Error setting role:', error);
      alert('Failed to set role');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-blue-100 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-blue-200 shadow-lg p-6 w-[90%] max-w-md h-52"
      >
        <h2 className="text-2xl font-bold mb-4 font-serif">Select Your Role</h2>
        <select
          className="w-full border p-2 rounded mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">-- Select Role --</option>
          <option value="team member">Team Member</option>
          <option value="manager">Manager / Team Leader</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5  bg-[#3667B1] text-white rounded"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
