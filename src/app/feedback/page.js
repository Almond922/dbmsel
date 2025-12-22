'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [formData, setFormData] = useState({
    from_user: '', to_user: '', listing_id: '', rating: '', comments: ''
  });

  const columns = [
    { key: 'feedback_id', label: 'ID' },
    { key: 'from_user_name', label: 'From' },
    { key: 'to_user_name', label: 'To' },
    { key: 'rating', label: 'Rating' },
    { key: 'comments', label: 'Comments' },
  ];

  useEffect(() => {
    fetchFeedback();
    fetchUsers();
  }, []);

  const fetchFeedback = async () => {
    const res = await fetch('/api/feedback');
    const data = await res.json();
    setFeedback(data.map(f => ({
      ...f,
      rating: '⭐'.repeat(f.rating)
    })));
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingFeedback ? 'PUT' : 'POST';
    const body = editingFeedback ? { ...formData, feedback_id: editingFeedback.feedback_id } : formData;

    await fetch('/api/feedback', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsModalOpen(false);
    setEditingFeedback(null);
    setFormData({ from_user: '', to_user: '', listing_id: '', rating: '', comments: '' });
    fetchFeedback();
  };

  const handleEdit = (fb) => {
    setEditingFeedback(fb);
    const ratingNum = fb.rating ? fb.rating.length : 0;
    setFormData({
      from_user: fb.from_user || '',
      to_user: fb.to_user || '',
      listing_id: fb.listing_id || '',
      rating: ratingNum || '',
      comments: fb.comments || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (fb) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      await fetch(`/api/feedback?id=${fb.feedback_id}`, { method: 'DELETE' });
      fetchFeedback();
    }
  };

  const openAddModal = () => {
    setEditingFeedback(null);
    setFormData({ from_user: '', to_user: '', listing_id: '', rating: '5', comments: '' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Feedback
        </button>
      </div>

      <Table columns={columns} data={feedback} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFeedback ? 'Edit Feedback' : 'Add Feedback'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From User</label>
            <select
              required
              value={formData.from_user}
              onChange={(e) => setFormData({ ...formData, from_user: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To User</label>
            <select
              required
              value={formData.to_user}
              onChange={(e) => setFormData({ ...formData, to_user: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Rating</option>
              <option value="1">⭐ (1)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              className="mt-1 w-full border rounded px-3 py-2"
            />
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
              {editingFeedback ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
