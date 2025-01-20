import React, { useState } from 'react';
import { 
  useGetClientsQuery, 
  useDeleteClientMutation,
  useUpdateClientMutation 
} from '../state/api';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';

const Clients = () => {
  const { data, isLoading, error } = useGetClientsQuery();
  const [deleteClient] = useDeleteClientMutation();
  const [updateClient] = useUpdateClientMutation();

  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Handle opening edit modal
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditFormData({
      user_name: client.user_name,
      user_email: client.user_email,
      user_phone_number: client.user_phone_number,
      user_address: client.user_address,
      address_zip_code: client.address_zip_code,
      user_emergency_contact: client.user_emergency_contact,
      user_role: client.user_role
    });
    setEditModalOpen(true);
  };

  // Handle opening delete modal
  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient({
        id: selectedClient.user_id,
        ...editFormData
      });
      setEditModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteClient(selectedClient.user_id);
      setDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="px-6 py-10 text-red-500">
      Error loading clients. Please try again later.
    </div>
  );

  return (
    <div className="px-6 py-10">
      <h2 className="text-[30px] font-bold mb-4">Clients</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="w-3/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="w-2/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emergency
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((client) => (
              <tr key={client.user_id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {client.user_id}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client.user_name}</div>
                  <div className="text-sm text-gray-500">{client.user_email}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    client.user_role === 'host' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {client.user_role}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {client.user_phone_number}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {client.user_address}
                  <div className="text-xs text-gray-400">
                    ZIP: {client.address_zip_code}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {client.user_emergency_contact}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(client)}
                  >
                    <FaEdit className="inline-block text-lg" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteClick(client)}
                  >
                    <FaTrash className="inline-block text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">Edit Client</h3>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="user_name"
                      value={editFormData.user_name || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="user_email"
                      value={editFormData.user_email || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="user_phone_number"
                      value={editFormData.user_phone_number || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="user_address"
                      value={editFormData.user_address || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      name="address_zip_code"
                      value={editFormData.address_zip_code || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <input
                      type="text"
                      name="user_emergency_contact"
                      value={editFormData.user_emergency_contact || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
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
          <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="relative bg-white rounded-lg max-w-sm w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-center text-red-600 mb-4">
                  <AiOutlineWarning className="text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete Client
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Are you sure you want to delete this client? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;