import React, { useState } from 'react'
import PendingProperties from './PendingProperties';
import AllProperties from './allProperties';


const Properties = () => {

  const [activeTab, setActiveTab] = useState('all');

  const handlePendingPropertiesCLick = () => {
    setActiveTab('pending');
  }

  const handleallPropertiesClick = () => {
    setActiveTab("all")
  }

  return (
    <div>
      <div className="px-4 py-4">
        <h2 className="text-[30px] font-bold mb-4">Properties</h2>
        <div className='flex gap-4 mb-0'>

          <button className='text-sm font-bold text-green-500 hover:text-green-700' onClick={handleallPropertiesClick}>All Properties</button>
          <button className='text-sm font-bold text-orange-500 hover:text-orange-700' onClick={handlePendingPropertiesCLick}>Pending Properties</button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <PendingProperties />
      ) : (
        <AllProperties />
      )}
    </div>
  )
}

export default Properties
