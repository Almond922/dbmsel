'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [options, setOptions] = useState({ requests: [], volunteers: [], statuses: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    request_id: '', assigned_to: '', pickup_time: '', delivery_time: '', assignment_status_id: ''
  });

  const columns = [
    { key: 'assignment_id', label: 'ID' },
    { key: 'request_id', label: 'Request ID' },
    { key: 'volunteer_name', label: 'Volunteer' },
    { key: 'status_name', label: 'Status' },
  ];

  useEffect(() => {
    fetchAssignments();
    fetchOptions();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch('/api/assignments');
    const data = await res.json();
    setAssignments(data);
  };

  const fetchOptions = async () => {
    const res = await fetch('/api/assignments/options');
    const data = await res.json();
    setOptions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingAssignment ? 'PUT' : 'POST';
    const body = editingAssignment ? { ...formData, assignment_id: editingAssignment.assignment_id } : formData;

    await fetch('/api/assignments', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormData({ request_id: '', assigned_to: '', pickup_time: '', delivery_time: '', assignment_status_id: '' });
    fetchAssignments();
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      request_id: assignment.request_id || '',
      assigned_to: assignment.assigned_to || '',
      pickup_time: assignment.pickup_time ? assignment.pickup_time.slice(0, 16) : '',
      delivery_time: assignment.delivery_time ? assignment.delivery_time.slice(0, 16) : '',
      assignment_status_id: assignment.assignment_status_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (assignment) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      await fetch(`/api/assignments?id=${assignment.assignment_id}`, { method: 'DELETE' });
      fetchAssignments();
    }
  };

  const openAddModal = () => {
    setEditingAssignment(null);
    setFormData({ request_id: '', assigned_to: '', pickup_time: '', delivery_time: '', assignment_status_id: '1' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Assignment
        </button>
      </div>

      <Table columns={columns} data={assignments} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Request</label>
            <select
              required
              value={formData.request_id}
              onChange={(e) => setFormData({ ...formData, request_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Request</option>
              {options.requests?.map((req) => (
                <option key={req.request_id} value={req.request_id}>
                  Request #{req.request_id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Volunteer</label>
            <select
              required
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Volunteer</option>
              {options.volunteers?.map((vol) => (
                <option key={vol.user_id} value={vol.user_id}>{vol.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
            <input
              type="datetime-local"
              value={formData.pickup_time}
              onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
            <input
              type="datetime-local"
              value={formData.delivery_time}
              onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.assignment_status_id}
              onChange={(e) => setFormData({ ...formData, assignment_status_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Status</option>
              {options.statuses?.map((status) => (
                <option key={status.assignment_status_id} value={status.assignment_status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingAssignment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
