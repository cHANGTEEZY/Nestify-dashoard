import { Link } from 'react-router-dom';
import StayNestLogo from '../assets/Logos/staynest_final.png'
import { FaHome, FaRegUser } from "react-icons/fa";
import { PiBuildingsBold } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { UserCog } from "lucide-react"

// Sidebar component
const Sidebar = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["adminToken"]);

  const getAdminDetails = async () => {
    try {
      const response = await fetch("http://localhost:3100/admin/admin-details", {
        headers: {
          "Authorization": `Bearer ${cookies.adminToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch admin details");
      }
      setAdminDetails(data.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookie("adminToken", { path: "/" });
    window.location.href = "http://localhost:5173/login";
  };

  useEffect(() => {
    getAdminDetails();
  }, []);

  return (
    <>
      <div className='h-screen bg-white w-[320px] px-8 py-8'>
        <div className='Logo w-[140px] bg-white'>
          <img className="bg-transparent" src={StayNestLogo} alt="" />
        </div>
        <hr className='mt-5' />

        <div className='h-[600px] flex flex-col justify-between bg-inherit'>
          <nav className="justify-between mt-4 tracking-tighter">
            <ul>
              <h3 className='text-sm bg-white text-grey-400'>Main</h3>

              <li className="bg-white">
                <Link to="/" className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 bg-white rounded-xl hover:bg-teal-100 hover:text-primary">
                  <FaHome className="text-xl bg-transparent" /> Dashboard
                </Link>
              </li>

              <li className="bg-white">
                <Link to="properties" className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 bg-white rounded-xl hover:bg-teal-100 hover:text-primary">
                  <PiBuildingsBold className="text-xl bg-transparent" /> Properties
                </Link>
              </li>

              <li className="bg-white">
                <Link to="clients" className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 bg-white rounded-xl hover:bg-teal-100 hover:text-primary">
                  <FaRegUser className="text-xl bg-transparent" /> Clients
                </Link>
              </li>

              <li className="bg-white">
                <Link to="transactions" className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 bg-white rounded-xl hover:bg-teal-100 hover:text-primary">
                  <GrTransaction className="text-xl bg-transparent" /> Transactions
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start w-full space-y-4 bg-white">
            <div
              className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${toggle ? 'opacity-100 h-auto' : 'opacity-0 h-0'
                }`}
            >
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <div
              className="flex items-center w-full gap-3 p-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={handleToggle}
            >
              <UserCog size={48} strokeWidth={1.25} />
              <div className="flex-grow min-w-0">
                {adminDetails ? (
                  <>
                    <h2 className="text-sm font-semibold text-gray-900 capitalize truncate">
                      {adminDetails.user_name}
                    </h2>
                    <p className="text-xs text-gray-500 truncate">
                      {adminDetails.user_email}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
