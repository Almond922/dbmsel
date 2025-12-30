'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    from_user: '', to_user: '', listing_id: '', rating: '5', comments: ''
  });

  const columns = [
    { key: 'feedback_id', label: 'ID' },
    { key: 'from_user_name', label: 'From' },
    { key: 'to_user_name', label: 'To' },
    { key: 'rating', label: 'Rating' },
    { key: 'comments', label: 'Comments' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchFeedback(), fetchUsers()]);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      setFeedback(Array.isArray(data) ? data.map(f => ({
        ...f,
        rating: '⭐'.repeat(f.rating || 0)
      })) : []);
    } catch (err) {
      console.error('Feedback fetch error:', err);
      setFeedback([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      // API returns { data: [...] }
      setUsers(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Users fetch error:', err);
      setUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingFeedback ? 'PUT' : 'POST';
      const body = editingFeedback ? { ...formData, feedback_id: editingFeedback.feedback_id } : formData;

      const res = await fetch('/api/feedback', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save feedback');

      setIsModalOpen(false);
      setEditingFeedback(null);
      setFormData({ from_user: '', to_user: '', listing_id: '', rating: '5', comments: '' });
      await fetchFeedback();
    } catch (err) {
      setError('Failed to save feedback. Please try again.');
      console.error(err);
    }
  };

  const handleEdit = (fb) => {
    setEditingFeedback(fb);
    const ratingNum = fb.rating ? fb.rating.length : 5;
    setFormData({
      from_user: fb.from_user || '',
      to_user: fb.to_user || '',
      listing_id: fb.listing_id || '',
      rating: ratingNum || '5',
      comments: fb.comments || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (fb) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        const res = await fetch(`/api/feedback?id=${fb.feedback_id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete feedback');
        await fetchFeedback();
      } catch (err) {
        setError('Failed to delete feedback. Please try again.');
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setEditingFeedback(null);
    setFormData({ from_user: '', to_user: '', listing_id: '', rating: '5', comments: '' });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Feedback</h1>
          <p className="text-gray-600">Manage and review user feedback on donations and deliveries</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
            <p className="text-gray-600 text-sm mb-2">Total Feedback</p>
            <p className="text-3xl font-bold text-gray-900">{feedback.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
            <p className="text-gray-600 text-sm mb-2">5-Star Ratings</p>
            <p className="text-3xl font-bold text-green-600">{feedback.filter(f => f.rating && f.rating.length === 5).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
            <p className="text-gray-600 text-sm mb-2">Average Rating</p>
            <p className="text-3xl font-bold text-blue-600">
              {feedback.length > 0 
                ? (feedback.reduce((sum, f) => sum + (f.rating ? f.rating.length : 0), 0) / feedback.length).toFixed(1)
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Feedback List</h2>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
          >
            + Add Feedback
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {feedback.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No feedback yet. Create one to get started!</p>
            </div>
          ) : (
            <Table columns={columns} data={feedback} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFeedback ? 'Edit Feedback' : 'Add Feedback'}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From User *</label>
              <select
                required
                value={formData.from_user}
                onChange={(e) => setFormData({ ...formData, from_user: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To User *</label>
              <select
                required
                value={formData.to_user}
                onChange={(e) => setFormData({ ...formData, to_user: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star.toString() })}
                    className={`text-3xl transition-transform ${
                      parseInt(formData.rating) >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Share your feedback here..."
                rows={4}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                {editingFeedback ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
