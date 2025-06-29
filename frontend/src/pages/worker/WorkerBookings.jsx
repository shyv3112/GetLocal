import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar"

const WorkerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    
    // Function to get location
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
            setError(err.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
  
    getLocation(); // Call function on component mount
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/bookings/worker-all", {
      headers: { Authorization: token }
    })
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
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
    } catch (error) {
      alert("Error updating booking");
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <h1 className="text-5xl pt-10 text-center font-bold mb-4">All Bookings</h1>

      {/* Booking List */}
      {bookings.length === 0 ? <p className="text-center text-gray-600 ">No Requests.</p> : bookings.map(booking => (
        <div key={booking._id} className="bg-white w-fit justify-self-center p-4 shadow-lg mb-4 rounded-lg">
          <p><strong>Service:</strong> {booking.service}</p>
          <p><strong>Booked By:</strong> {booking.resident.name}</p>
          <p><strong>Status:</strong> {booking.status}</p>

          {booking.status === "Pending" && (
            <div className="mt-2">
              <button onClick={() => handleStatusChange(booking._id, "Accepted")} className="bg-green-500 text-white px-4 py-2 mr-2 rounded">Accept</button>
              <button onClick={() => handleStatusChange(booking._id, "Rejected")} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkerBookings;
