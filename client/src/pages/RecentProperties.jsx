import { useAllPropertiesQuery } from "../state/api";

const RecentProperties = () => {
  const { data: recent } = useAllPropertiesQuery();
  return (
    <>
      <div className="container p-4 bg-white rounded-md">
        <h2 className="bg-teal-500 rounded-md px-6 py-3 text-[1.5rem] tracking-tighter mb-2 text-white text-md">
          Recent Properties
        </h2>

        {recent.slice(0, 3).map((property) => (
          <div
            key={property.property_id}
            className="flex gap-4 p-4 mb-2 bg-white rounded-2xl"
          >
            <img
              className=" w-[110px] h-[110px] object-cover rounded-md"
              src={
                property.image_urls && property.image_urls.length > 0
                  ? property.image_urls[0]
                  : ""
              }
              alt={property.title}
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            <div className="bg-white ">
              <h3 className="mb-2 text-lg font-semibold bg-white">
                {property.title}
              </h3>
              <p className="mb-1 text-sm text-gray-600 bg-white">
                Hosted By: {property.user_name}{" "}
              </p>
              <p className="mb-1 text-sm text-gray-600 bg-white">
                {/* Located: {property.property_region}{" "} */}
              </p>
              <p className="text-lg font-bold text-gray-800 bg-white">
                NRP {property.price}/night
              </p>
              <hr className="w-full mt-2 border-t border-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecentProperties;
