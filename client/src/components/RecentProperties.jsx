import React from 'react'
import { useAllPropertiesQuery } from '../state/api';

const RecentProperties = () => {

    const{data:recent} = useAllPropertiesQuery();
    return (
        <>
          <div className='container bg-white p-4 rounded-md'>
            <h2 className='bg-teal-500 rounded-md px-6 py-3 text-[1.5rem] tracking-tighter mb-2 text-white text-md'>Recent Properties</h2>
      
            {recent.slice(0, 3).map((property) => (
              <div key={property.property_id} className="rounded-2xl flex bg-white p-4 mb-2 gap-4">
                <img className="bg-black w-[110px] h-[110px] object-cover rounded-md" />
                <div className=" bg-white">
                  <h3 className="text-lg font-semibold mb-2 bg-white">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-1 bg-white">Hosted By: {property.user_name} </p>
                  <p className="text-gray-600 text-sm mb-1 bg-white">Located: {property.property_region} </p>
                  <p className="text-lg font-bold text-gray-800 bg-white">NRP {property.price}/night</p>
                  <hr className="w-full border-t border-gray-300 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </>
      );
      
}

export default RecentProperties
