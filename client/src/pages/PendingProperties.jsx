import { useGetPropertiesQuery } from "../state/api";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";
import image1 from "../assets/Properties/image1.jpg";


const PendingProperties = () => {
  const { data } = useGetPropertiesQuery();
  const [cookies] = useCookies(["adminToken"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectedUserId, setRejectedUserId] = useState(null);
  const [reason, setReason] = useState("");
  const [currentPropertyDetails, setCurrentPropertyDetails] = useState(null);

  const handleAccept = async (propertyId) => {
    const confirmAccept = window.confirm(
      "Are you sure you want to accept this property?"
    );

    if (!confirmAccept) return;

    try {
      const token = cookies.adminToken;
      if (!token) {
        toast.error("Unauthorized");
        window.location.href = "http://localhost:5173/login";
        return;
      }

      const response = await fetch(
        `http://localhost:3100/properties/accept/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Something went wrong.");
    }
  };

  const handleOpenModal = (property) => {
    setSelectedProperty(property.pending_property_id);
    setRejectedUserId(property.user_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setRejectedUserId(null);
    setReason("");
  };

  const handleViewDetails = (property) => {
    setCurrentPropertyDetails(property);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setCurrentPropertyDetails(null);
  };

  const handleRejectSubmit = async () => {
    try {
      const token = cookies.adminToken;
      if (!token) {
        toast.error("Unauthorized");
        window.location.href = "http://localhost:5173/login";
        return;
      }

      const response = await fetch(
        `http://localhost:3100/properties/reject/${selectedProperty}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason, userId: rejectedUserId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Something went wrong.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-white sm:px-6 lg:px-8">
      <div className="mx-auto bg-white max-w-7xl">
        <h1 className="mb-10 text-3xl font-extrabold text-center text-gray-900 bg-white">
          Pending Property Listings
        </h1>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 bg-white sm:grid-cols-2 lg:grid-cols-3">
            {data.map((property) => (
              <div
                key={property.pending_property_id}
                className="overflow-hidden transition duration-300 ease-in-out transform bg-white shadow-lg rounded-2xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative w-full h-48">
                  <img
                    className="absolute inset-0 object-cover w-full h-full"
                    src={
                      property.image_urls && property.image_urls.length > 0
                        ? property.image_urls[0] // Directly use the first image URL from API
                        : image1
                    }
                    alt={property.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = image1;
                    }}
                  />
                  <div className="absolute inset-0 transition duration-300 ease-in-out bg-black bg-opacity-25 opacity-0 hover:opacity-100">
                    <div className="flex items-center justify-center h-full">
                      <button
                        onClick={() => handleViewDetails(property)}
                        className="px-4 py-2 font-semibold text-gray-800 transition duration-300 ease-in-out transform bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    {property.title}
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    {property.property_type} | Hosted by {property.hosted_by}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      NRP {property.price}/night
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(property.pending_property_id)}
                      className="flex-1 px-4 py-2 text-white transition duration-300 ease-in-out transform bg-green-500 rounded-lg hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleOpenModal(property)}
                      className="flex-1 px-4 py-2 text-white transition duration-300 ease-in-out transform bg-red-500 rounded-lg hover:bg-red-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white">
            <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 bg-white" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 bg-white">
              No Pending Properties
            </h3>
            <p className="mt-1 text-sm text-gray-500 bg-white">
              There are currently no properties pending review.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
     {/* Details Modal */}
{isDetailsModalOpen && currentPropertyDetails && (
  <div
    className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50"
    onClick={handleCloseDetailsModal}
  >
    <div
      className="relative w-full max-w-3xl p-8 mx-auto border rounded-md shadow-lg top-20 bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mt-3 text-center">
        <h3 className="text-2xl font-medium leading-6 text-gray-900 mb-6">
          {currentPropertyDetails.title}
        </h3>
        
        {/* Image Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {currentPropertyDetails.image_urls?.map((imageUrl, index) => (
            <div 
              key={index}
              className="relative h-48 w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                src={imageUrl}
                alt={`Property ${index + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = image1;
                }}
              />
            </div>
          ))}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong className="text-gray-800">Hosted By:</strong>{" "}
              {currentPropertyDetails.hosted_by}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Property Type:</strong>{" "}
              {currentPropertyDetails.property_type}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Region:</strong>{" "}
              {currentPropertyDetails.property_region}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong className="text-gray-800">Location:</strong>{" "}
              {currentPropertyDetails.approximate_location}
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Price:</strong>{" "}
              NRP {currentPropertyDetails.price}/night
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">Property ID:</strong>{" "}
              {currentPropertyDetails.pending_property_id}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-4 py-3">
          <button
            onClick={handleCloseDetailsModal}
            className="w-full md:w-auto px-6 py-2 text-base font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 w-full h-full bg-gray-600 bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-md p-5 mx-auto bg-white border rounded-md shadow-lg top-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Reject Property
              </h3>
              <div className="py-3 mt-2 px-7">
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  rows="4"
                  placeholder="Reason for rejecting..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end px-4 py-3 space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-base font-medium text-white bg-gray-500 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProperties;
