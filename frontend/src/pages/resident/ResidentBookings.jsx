import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { FaCalendarAlt, FaClock, FaUser , FaTools, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

const ResidentServices = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInfo, setRatingInfo] = useState({ bookingId: null, rating: 0, review: "" });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/bookings", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case 'Rejected':
        return <FaTimesCircle className="text-red-500 mr-1" />;
      default:
        return <FaHourglassHalf className="text-yellow-500 mr-1" />;
    }
  };

  const openRatingModal = (booking) => {
    setRatingInfo({ bookingId: booking._id, rating: 0, review: "" });
    setSelectedBookingForRating(booking);
    setShowRatingModal(true);
  };

  const handleRatingChange = (e) => {
    setRatingInfo({ ...ratingInfo, rating: Number(e.target.value) });
  };

  const handleReviewChange = (e) => {
    setRatingInfo({ ...ratingInfo, review: e.target.value });
  };

  const submitRating = async () => {
    if (!selectedBookingForRating) {
      toast.error("No booking selected for rating");
      return;
    }

    const { rating, review } = ratingInfo;
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const workerId = selectedBookingForRating.worker._id;
      console.log("Submitting rating for worker ID:", workerId);

      await axios.put(`http://localhost:5000/api/bookings/workers/${workerId}/rate`, { rating, review }, {
        headers: { Authorization: token }
      });
      toast.success("Thank you for your feedback!");
      setShowRatingModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error submitting rating");
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-200 to-green-100 min-h-screen">
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Bookings</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-lg max-w-2xl mx-auto">
            <p className="text-xl text-gray-600">You haven't made any bookings yet.</p>
            <p className="text-gray-500 mt-2">Book a service to see it appear here.</p>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                      booking.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaUser  className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Worker</p>
                        <p className="font-medium text-gray-800">{booking.worker.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Scheduled Date</p>
                        <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaClock className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Scheduled Time</p>
                        <p className="font-medium text-gray-800">{formatTime(booking.time)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCalendarAlt className="mt-1 mr-3 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Booked on</p>
                        <p className="font-medium text-gray-800">{new Date(booking.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <FaUser  className="mr-2" /> Worker Details
                      </h4>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-600">
                          <FaPhone className="mr-2" /> {booking.worker.phone || 'Not provided'}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaEnvelope className="mr-2" /> {booking.worker.email}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2" /> {booking.worker.shop || 'Shop address not provided'}
                        </p>
                      </div>
                      {booking.status === 'Accepted' && (
                        <button onClick={() => openRatingModal(booking)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                          Rate Service
                        </button>
                      )}
                    </div>

                    {booking.worker.profile && (
                      <div className="mt-4">
                        <img 
                          src={`http://localhost:5000${booking.worker.profile}`} 
                          alt={`${booking.worker.name}'s profile`} 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Rate Service</h3>
            <label className="block mb-2 font-medium">Rating (1-5)</label>
            <select
              value={ratingInfo.rating}
              onChange={handleRatingChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Review (optional)</label>
            <textarea
              value={ratingInfo.review}
              onChange={handleReviewChange}
              placeholder="Write your review here..."
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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

export default ResidentServices;