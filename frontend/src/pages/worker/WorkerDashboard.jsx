import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { FaCalendarAlt, FaClock, FaUser, FaTools, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

const WorkerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            console.error(err.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
  
    getLocation();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/worker", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
        console.log(res.data)
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status }, {
        headers: { Authorization: token }
      });

      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));

      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error("Error updating booking");
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      <ToastContainer/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Booking Requests</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No booking requests yet.</p>
            <p className="text-gray-500 mt-2">When residents book your services, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div key={booking._id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                booking.status === 'Accepted' ? 'border-l-4 border-green-500' : 
                booking.status === 'Rejected' ? 'border-l-4 border-red-500' : 
                'border-l-4 border-yellow-500'
              }`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaTools className="mr-2 text-blue-500" />
                      {booking.service}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaUser className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Booked by</p>
                        <p className="font-medium text-gray-800">{booking.resident.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaClock className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-medium text-gray-800">{formatTime(booking.time)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Requested on</p>
                        <p className="font-medium text-gray-800">{new Date(booking.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <FaUser className="mr-2" /> Customer Contact
                      </h4>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-600">
                          <FaPhone className="mr-2" /> {booking.resident.phone || 'Not provided'}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaEnvelope className="mr-2" /> {booking.resident.email}
                        </p>
                        {/* <p className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2" /> {booking.resident.address || 'Address not provided'}
                        </p> */}
                      </div>
                    </div>
                  </div>

                  {booking.status === "Pending" && (
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => handleStatusChange(booking._id, "Accepted")} 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(booking._id, "Rejected")} 
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;