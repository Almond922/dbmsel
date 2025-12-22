'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [options, setOptions] = useState({ listings: [], users: [], statuses: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    listing_id: '', requested_by: '', request_status_id: ''
  });

  const columns = [
    { key: 'request_id', label: 'ID' },
    { key: 'listing_id', label: 'Listing ID' },
    { key: 'requester_name', label: 'Requester' },
    { key: 'request_time', label: 'Request Time' },
    { key: 'status_name', label: 'Status' },
  ];

  useEffect(() => {
    fetchRequests();
    fetchOptions();
  }, []);

  const fetchRequests = async () => {
    const res = await fetch('/api/requests');
    const data = await res.json();
    setRequests(data.map(r => ({
      ...r,
      request_time: r.request_time ? new Date(r.request_time).toLocaleString() : ''
    })));
  };

  const fetchOptions = async () => {
    const res = await fetch('/api/requests/options');
    const data = await res.json();
    setOptions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingRequest ? 'PUT' : 'POST';
    const body = editingRequest ? { ...formData, request_id: editingRequest.request_id } : formData;

    await fetch('/api/requests', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsModalOpen(false);
    setEditingRequest(null);
    setFormData({ listing_id: '', requested_by: '', request_status_id: '' });
    fetchRequests();
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      listing_id: request.listing_id || '',
      requested_by: request.requested_by || '',
      request_status_id: request.request_status_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (request) => {
    if (confirm('Are you sure you want to delete this request?')) {
      await fetch(`/api/requests?id=${request.request_id}`, { method: 'DELETE' });
      fetchRequests();
    }
  };

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({ listing_id: '', requested_by: '', request_status_id: '1' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Requests</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Request
        </button>
      </div>

      <Table columns={columns} data={requests} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRequest ? 'Edit Request' : 'Add Request'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Listing</label>
            <select
              required
              value={formData.listing_id}
              onChange={(e) => setFormData({ ...formData, listing_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Listing</option>
              {options.listings?.map((listing) => (
                <option key={listing.listing_id} value={listing.listing_id}>
                  Listing #{listing.listing_id} (Qty: {listing.quantity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Requested By</label>
            <select
              required
              value={formData.requested_by}
              onChange={(e) => setFormData({ ...formData, requested_by: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select User</option>
              {options.users?.map((user) => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.request_status_id}
              onChange={(e) => setFormData({ ...formData, request_status_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Status</option>
              {options.statuses?.map((status) => (
                <option key={status.request_status_id} value={status.request_status_id}>
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
              {editingRequest ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
