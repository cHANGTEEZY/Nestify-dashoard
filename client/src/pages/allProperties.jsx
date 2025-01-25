import React, { useState } from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';
import { useAllPropertiesQuery, useUpdatePropertyMutation, useDeletePropertyMutation } from '../state/api';

// Import fallback image
import image1 from '../assets/Properties/image1.jpg';

const AllProperties = () => {
  const { data, isLoading } = useAllPropertiesQuery();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetPropertyId, setTargetPropertyId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000); // Hide after 3 seconds
  };

  const handleEditClick = (property) => {
    setEditingProperty({
      property_id: property.property_id,
      title: property.title,
      price: property.price,
      property_type: property.property_type,
      guests: property.guests,
      bedrooms: property.bedrooms,
    });
  };

  const handleDeleteClick = (propertyId) => {
    setTargetPropertyId(propertyId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetPropertyId) return;

    try {
      await deleteProperty(targetPropertyId).unwrap();
      showNotification('Property deleted successfully!', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Error deleting property', 'error');
    } finally {
      setDeleteModalOpen(false);
      setTargetPropertyId(null);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProperty?.property_id) return;

    try {
      const updateData = {
        id: editingProperty.property_id,
        title: editingProperty.title,
        price: editingProperty.price,
        property_type: editingProperty.property_type,
        approximate_location: editingProperty.approximate_location,
        guests: editingProperty.guests,
        bedrooms: editingProperty.bedrooms,
      };

      await updateProperty(updateData).unwrap();
      setEditingProperty(null);
      showNotification('Property updated successfully!', 'success');
    } catch (error) {
      console.error('Update error:', error);
      showNotification('Error updating property', 'error');
    }
  };

  if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <div className="relative  p-4">
      {/* Notification Banner */}
      {notification.visible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-md ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

<div className="relative w-full sm:rounded-lg">
  <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
    <thead className="text-xs text-black uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-4 py-3 w-20">P_ID</th>
        <th scope="col" className="px-4 py-3 w-40">Image</th>
        <th scope="col" className="py-3 w-40">Property Name</th>
        <th scope="col" className="px-6 py-3 w-32">Price</th>
        <th scope="col" className="px-6 py-3 w-40">Location</th>
        <th scope="col" className="px-6 py-3 w-32">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((property) => (
              <tr key={property.property_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{property.property_id}</td>
                <td className="px-4 py-3">
                  <img
                    className="h-16 w-16 object-cover rounded-lg"
                    src={property.image_urls?.[0] || image1}
                    alt={property.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = image1;
                    }}
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{property.title}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  NPR {parseFloat(property.price).toLocaleString()}/night
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{property.property_region}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(property)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FaEdit className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(property.property_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Property</h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={editingProperty.price}
                  onChange={(e) => setEditingProperty({...editingProperty, price: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={editingProperty.approximate_location}
                  onChange={(e) => setEditingProperty({...editingProperty, approximate_location: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  value={editingProperty.bedrooms}
                  onChange={(e) => setEditingProperty({...editingProperty, bedrooms: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Guests</label>
                <input
                  type="number"
                  value={editingProperty.guests}
                  onChange={(e) => setEditingProperty({...editingProperty, guests: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select
                  value={editingProperty.property_type}
                  onChange={(e) => setEditingProperty({...editingProperty, property_type: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Cottage">Cottage</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <AiOutlineWarning className="mx-auto text-4xl text-red-600 mb-3" />
              <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
