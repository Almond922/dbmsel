'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

export default function FoodListingsPage() {
  const [listings, setListings] = useState([]);
  const [options, setOptions] = useState({ categories: [], statuses: [], donors: [], locations: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '', category_id: '', quantity: '', prepared_time: '', expiry_time: '', status_id: '', pickup_location_id: ''
  });

  const columns = [
    { key: 'listing_id', label: 'ID' },
    { key: 'donor_name', label: 'Donor' },
    { key: 'category_name', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'status_name', label: 'Status' },
    { key: 'pickup_address', label: 'Pickup Location' },
  ];

  useEffect(() => {
    fetchListings();
    fetchOptions();
  }, []);

  const fetchListings = async () => {
    const res = await fetch('/api/food-listings');
    const data = await res.json();
    setListings(data);
  };

  const fetchOptions = async () => {
    const res = await fetch('/api/food-listings/options');
    const data = await res.json();
    setOptions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingListing ? 'PUT' : 'POST';
    const body = editingListing ? { ...formData, listing_id: editingListing.listing_id } : formData;

    await fetch('/api/food-listings', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsModalOpen(false);
    setEditingListing(null);
    setFormData({ user_id: '', category_id: '', quantity: '', prepared_time: '', expiry_time: '', status_id: '', pickup_location_id: '' });
    fetchListings();
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      user_id: listing.user_id || '',
      category_id: listing.category_id || '',
      quantity: listing.quantity || '',
      prepared_time: listing.prepared_time ? listing.prepared_time.slice(0, 16) : '',
      expiry_time: listing.expiry_time ? listing.expiry_time.slice(0, 16) : '',
      status_id: listing.status_id || '',
      pickup_location_id: listing.pickup_location_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (listing) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await fetch(`/api/food-listings?id=${listing.listing_id}`, { method: 'DELETE' });
      fetchListings();
    }
  };

  const openAddModal = () => {
    setEditingListing(null);
    setFormData({ user_id: '', category_id: '', quantity: '', prepared_time: '', expiry_time: '', status_id: '1', pickup_location_id: '' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Food Listings</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add Listing
        </button>
      </div>

      <Table columns={columns} data={listings} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingListing ? 'Edit Listing' : 'Add Listing'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Donor</label>
            <select
              required
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Donor</option>
              {options.donors?.map((donor) => (
                <option key={donor.user_id} value={donor.user_id}>{donor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Category</option>
              {options.categories?.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prepared Time</label>
            <input
              type="datetime-local"
              value={formData.prepared_time}
              onChange={(e) => setFormData({ ...formData, prepared_time: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Time</label>
            <input
              type="datetime-local"
              value={formData.expiry_time}
              onChange={(e) => setFormData({ ...formData, expiry_time: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status_id}
              onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Status</option>
              {options.statuses?.map((status) => (
                <option key={status.status_id} value={status.status_id}>{status.status_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <select
              value={formData.pickup_location_id}
              onChange={(e) => setFormData({ ...formData, pickup_location_id: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select Location</option>
              {options.locations?.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>{loc.address}</option>
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
              {editingListing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
