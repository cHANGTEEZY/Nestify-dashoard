import { useGetPropertiesQuery } from "../state/api";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import image1 from "../assets/Properties/image1.jpg";
import image2 from "../assets/Properties/image2.jpg";
import image3 from "../assets/Properties/image3.jpg";
import image4 from "../assets/Properties/image4.jpg";
import image5 from "../assets/Properties/image5.jpg";
import image6 from "../assets/Properties/image6.jpg";

const imageMap = {
  "image1.jpg": image1,
  "image2.jpg": image2,
  "image3.jpg": image3,
  "image4.jpg": image4,
  "image5.jpg": image5,
  "image6.jpg": image6,
};

const PendingProperties = () => {
  const { data } = useGetPropertiesQuery();
  console.log(data);
  const [cookies] = useCookies(["adminToken"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectedUserId, setRejectedUserId] = useState(null);
  console.log(rejectedUserId);
  const [reason, setReason] = useState("");

  const handleAccept = async (propertyId) => {
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
    <div className="px-4 py-10">
      <div className="grid grid-cols-2 gap-6">
        {data && data.length > 0 ? (
          data.map((property) => (
            <div
              key={property.property_id}
              className="flex items-start max-w-lg p-4 space-x-4 bg-white rounded-lg card"
            >
              <div className="w-[200px] h-[200px]">
                <img
                  className="object-cover w-full h-full rounded-lg"
                  src={
                    property.image_urls && property.image_urls.length > 0
                      ? imageMap[property.image_urls[0]]
                      : image1
                  }
                  alt={property.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = image1;
                  }}
                />
              </div>

              <div className="flex-1 bg-white">
                <h2 className="text-lg font-semibold bg-white">
                  {property.title}
                </h2>
                <p className="text-sm text-gray-600 bg-white">
                  {property.property_type} located at a beautiful destination.
                </p>
                <p className="mt-3 text-sm bg-white text-primary">
                  Hosted By: {property.hosted_by}
                </p>

                <div className="mt-3">
                  <p className="text-lg font-bold bg-white">
                    NRP {property.price}/night
                  </p>
                </div>

                <div className="flex gap-2 mt-2 bg-white">
                  <button
                    className="px-4 py-1 text-white bg-green-500 rounded-lg hover:bg-green-600"
                    onClick={() => handleAccept(property.pending_property_id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    onClick={() => handleOpenModal(property)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>No Pending Properties</h1>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Reject Property</h2>
            <textarea
              className="w-full p-2 mt-3 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Reason for rejecting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                onClick={handleRejectSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProperties;
