import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ResidentEvents = () => {
  const [events, setEvents] = useState([]); // List of all events
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); // Get user from local storage

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/events/user-events", {
          headers: { Authorization: token },
        });

        console.log("Fetched Events:", res.data);

        // **Fix: Check if user is already in the event & update state**
        const updatedEvents = res.data.map(event => {
          const userEntry = event.users.find(u => u.id?._id === user._id);
          return { ...event, attending: userEntry?.attending || null };
        });

        setEvents(updatedEvents);
      } catch (error) {
        toast.error("Error fetching events");
      }
    };
    fetchEvents();
  }, [user._id]);

  // Join or update attendance
  const handleAttendance = async (eventId, attending) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/events/join/${eventId}`,
        { attending },
        { headers: { Authorization: token } }
      );

      // ✅ Fix: Update event status correctly in state
      setEvents(events.map(event =>
        event._id === eventId ? { ...event, attending } : event
      ));

      toast.success(`Marked as ${attending ? "Attending" : "Not Attending"}`);
    } catch (error) {
      toast.error("Error updating attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-50 min-h-screen">
      <Navbar />
      <ToastContainer />
      <h1 className="text-5xl text-center font-bold text-gray-800 pt-10 mb-6">Events</h1>

      <div className="flex flex-col items-center p-6">
        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 text-lg text-center"
          >
            No events available.
          </motion.div>
        ) : (
          <div className="space-y-6 w-full max-w-3xl">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="p-6 border rounded-xl shadow-lg bg-white transition-shadow duration-300"
              >
                {/* Event Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" /> {event.name}
                  </h2>
                  <p className="text-sm text-gray-500">{new Date(event.createdAt).toDateString()}</p>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">{event.description}</p>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Created by: <span className="font-semibold">{event.admin?.name || "Admin"}</span>
                  </p>

                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        event.attending === true ? "bg-green-500 hover:bg-green-600" : "bg-gray-200 hover:bg-gray-300"
                      } text-white transition-all duration-300`}
                      onClick={() => handleAttendance(event._id, true)}
                      disabled={loading}
                    >
                      <FaCheckCircle /> Attending
                    </button>

                    <button
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        event.attending === false ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"
                      } text-white transition-all duration-300`}
                      onClick={() => handleAttendance(event._id, false)}
                      disabled={loading}
                    >
                      <FaTimesCircle /> Not Attending
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentEvents;
