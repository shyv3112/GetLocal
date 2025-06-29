import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaHome, FaTools, FaClipboardList, FaUsersCog, FaUsers, FaBars, FaTimes, FaServer, FaStopCircle, FaStreetView, FaRadiationAlt, FaChartLine } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = {
    Resident: [
      { name: "Services", path: "/resident-services", icon: FaTools },
      { name: "Bookings", path: "/resident-bookings", icon: FaClipboardList },
    ],
    Worker: [
      { name: "Dashboard", path: "/worker-dashboard", icon: FaHome },
      { name: "Services", path: "/worker-services", icon: FaTools },
    ],

  };

  return (
    <>
      {/* Toggle Button (Visible on small screens) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 p-2 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg z-50"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen w-64 fixed top-0 left-0 bg-white/10 backdrop-blur-lg shadow-lg p-5 flex-col items-center border-r border-white/20 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <h1 className="text-3xl text-center font-bold text-sky-800 mb-8">AYAL</h1>

        {/* User Info */}
        <div className="w-full flex items-center justify-start gap-3 text-sky-800 mb-6">
          {user.profile ? (
            <img
              src={`http://localhost:5000${user.profile}`}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
            />
          ) : (
            <FaUserCircle size={28} />
          )}
          <span className="text-lg font-semibold">{user?.name}</span>
        </div>

        {/* Menu */}
        <nav className="w-full flex flex-col gap-4">
          {menuItems[user?.role]?.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white/80 text-sky-800 transition-all duration-300"
                    : "text-gray-800 hover:bg-white/60 transition-all duration-300"
                }`}
              >
                <item.icon size={24} className={isActive ? "text-blue-400" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-5 ml-1 flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/20 rounded-xl w-full"
        >
          <FaSignOutAlt size={24} /> Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;