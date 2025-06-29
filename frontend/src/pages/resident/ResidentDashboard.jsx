import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaRegComment, 
  FaPaperPlane, 
  FaExclamationCircle,
  FaTimes,
  FaRegHeart
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

// PostCard Component
const PostCard = ({ post, handleAddComment, handleLike }) => {
  const [comment, setComment] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      handleAddComment(post._id, comment);
      setComment("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white w-full max-w-2xl p-5 shadow-lg mb-6 rounded-xl border border-gray-100 overflow-hidden"
    >
      {/* Header with user info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
          <img
              src={`http://localhost:5000${post.user.profile}`}
              alt={post.user.name}
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-gray-800">{post.user.name}</h3>
            <p className="text-gray-500 text-xs">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <BsThreeDotsVertical />
        </button>
      </div>

      {/* Priority Badge */}
      {post.priority && (
        <motion.span 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center shadow-sm"
        >
          <FaExclamationCircle className="mr-1" /> High Priority
        </motion.span>
      )}

      {/* Post Content */}
      <motion.p 
        className="mb-4 text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {post.description}
      </motion.p>

      {/* Location */}
      {post.location && (
        <motion.div 
          className="flex items-center text-sm text-gray-600 mb-4 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => setShowMap(!showMap)}
          whileHover={{ scale: 1.01 }}
        >
          <FaMapMarkerAlt className="mr-2" />
          <span>{post.location}</span>
          {post.isMapVisible && post.latitude && post.longitude && (
            <span className="ml-2 text-blue-500 text-xs">
              {showMap ? "Hide Map" : "View Map"}
            </span>
          )}
        </motion.div>
      )}

      {/* Map Popup - Only show if map is visible */}
      <AnimatePresence>
        {showMap && post.isMapVisible && post.latitude && post.longitude && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 mb-4 rounded-xl overflow-hidden shadow-md"
          >
            <div className="h-64 w-full">
              <MapContainer 
                center={[post.latitude, post.longitude]} 
                zoom={15} 
                style={{ height: "100%", width: "100%" }}
                className="rounded-xl"
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[post.latitude, post.longitude]}>
                  <Popup className="font-bold">{post.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      {post.image && (
        <motion.div 
          className="mt-2 rounded-xl overflow-hidden shadow-sm cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => setExpandedImage(post.image)}
        >
          <img
            src={post.image.startsWith("/uploads/") ? `http://localhost:5000${post.image}` : post.image}
            alt="Post"
            className="h-64 w-full object-cover"
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 border-t border-b border-gray-100 py-3">
        <button 
          onClick={() => handleLike(post._id)}
          className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
        >
          {post.isLiked ? (
            <FaHeart className="text-red-500 mr-1" />
          ) : (
            <FaRegHeart className="mr-1" />
          )}
          <span>{post.likesCount || 0}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
        >
          <FaRegComment className="mr-1" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {/* Existing Comments */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
              {post.comments?.length > 0 ? (
                post.comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold mr-3">
                      {comment.user.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800">{comment.user.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p 
                  className="text-center text-gray-400 py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No comments yet
                </motion.p>
              )}
            </div>

            {/* Comment Input */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCommentSubmit}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full"
                  disabled={!comment.trim()}
                >
                  <IoMdSend />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Input (when comments are collapsed) */}
      {!showComments && (
        <motion.div 
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCommentSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full"
              disabled={!comment.trim()}
            >
              <IoMdSend />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <motion.div 
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={expandedImage.startsWith("/uploads/") ? `http://localhost:5000${expandedImage}` : expandedImage}
                alt="Expanded view"
                className="max-h-[90vh] w-full object-contain rounded-lg"
              />
              <button 
                onClick={() => setExpandedImage(null)}
                className="absolute -top-12 right-0 text-white text-2xl p-2 hover:text-gray-300 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// Create Post Modal
const CreatePostModal = ({ showModal, setShowModal, handleCreatePost, newPost, setNewPost }) => {
  const [locationLoading, setLocationLoading] = useState(false);
  const [showMapConsent, setShowMapConsent] = useState(false);

  const fetchLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            const { city, principalSubdivision, postcode } = data;
            setNewPost({
              ...newPost,
              location: `${city}, ${principalSubdivision}, ${postcode}`,
              latitude,
              longitude
            });
            
            // Show consent dialog after getting location
            setShowMapConsent(true);
          } catch (error) {
            console.error("Error fetching location details:", error);
            alert("Failed to fetch location details. Please enter manually.");
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please enable location access.");
          setLocationLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-lg font-bold mb-4">Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded-lg mb-2"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            required
          />
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Location (City, State, Pincode)"
              className="w-full p-2 border rounded-lg"
              value={newPost.location}
              onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
            />
            <button
              type="button"
              onClick={fetchLocation}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
              disabled={locationLoading}
            >
              {locationLoading ? "Fetching..." : "📍"}
            </button>
          </div>
          
          <input
            type="file"
            className="w-full p-2 border rounded-lg mb-2"
            onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
          />
          
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm text-gray-600">High Priority</label>
            <input
              type="checkbox"
              checked={newPost.priority || false}
              onChange={(e) => setNewPost({ ...newPost, priority: e.target.checked })}
              className="w-4 h-4 rounded"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setShowMapConsent(false);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Post
            </button>
          </div>
        </form>

        {/* Map Visibility Consent Dialog */}
        {showMapConsent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-3">Map Visibility</h3>
              <p className="mb-4 text-gray-700">
                Do you want to make your exact location visible on a map for this post?
              </p>
              
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setNewPost(prev => ({
                      ...prev,
                      isMapVisible: false,
                      latitude: null,
                      longitude: null
                    }));
                    setShowMapConsent(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  No, just show text location
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewPost(prev => ({
                      ...prev,
                      isMapVisible: true
                    }));
                    setShowMapConsent(false);
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Yes, show on map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ResidentDashboard Component
const ResidentDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: "", location: "", image: null, priority: false });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userCity, setUserCity] = useState(null); // State to store the user's city
  const user = JSON.parse(localStorage.getItem("user"));
  const [filterPriority, setFilterPriority] = useState("all"); // "all", "high", "low"
  
  useEffect(() => {
    fetchPosts();
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const { city } = data; // Extract the city
            setUserCity(city); // Set the user's city
            setNewPost({
              ...newPost,
              location: `${city}, ${data.principalSubdivision}, ${data.postcode}`,
            });
          } catch (error) {
            console.error("Error fetching location details:", error);
            alert("Failed to fetch location details. Please enter manually.");
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please enable location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      console.log(res.data)
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", newPost.description);
    formData.append("location", newPost.location);
    formData.append("latitude", newPost.latitude);
    formData.append("longitude", newPost.longitude);
    formData.append("priority", newPost.priority);
    formData.append("isMapVisible", newPost.isMapVisible || false); // Add this line
    
    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ 
        description: "", 
        image: "",
        location: "",
        latitude: null, 
        longitude: null, 
        priority: false,
        isMapVisible: false 
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: token } }
      );
      setPosts(posts.map((post) => (post._id === postId ? res.data : post)));
    } catch (error) {
      alert("Error adding comment");
    }
  };

  // Filter posts based on the user's city
  const filteredPosts = posts.filter((post) => {
    // First filter by city
    const cityMatch = !userCity || !post.location ? false : post.location.includes(userCity);
    
    // Then apply priority filter
    if (filterPriority === "all") return cityMatch;
    if (filterPriority === "high") return cityMatch && post.priority;
    if (filterPriority === "low") return cityMatch && !post.priority;
    
    return cityMatch;
  });

  return (
    <div className="bg-gradient-to-r from-sky-200 to-green-100 min-h-screen">
      <h1 className="text-5xl text-center font-bold pt-10 mb-4">Posts</h1>
      <Navbar />

      <div className="flex justify-center items-center gap-4 mb-6">
  <div className="relative group">
    <button 
      className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:bg-white transition-all"
    >
      <FaFilter className="text-blue-500" />
      <span>Filter</span>
    </button>
    <div className="absolute right-0 w-48 bg-white rounded-lg shadow-xl z-50 hidden group-hover:block">
      <div 
        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${filterPriority === "all" ? "bg-blue-100 text-blue-600" : ""}`}
        onClick={() => setFilterPriority("all")}
      >
        All Posts
      </div>
      <div 
        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${filterPriority === "high" ? "bg-blue-100 text-blue-600" : ""}`}
        onClick={() => setFilterPriority("high")}
      >
        High Priority
      </div>
      <div 
        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${filterPriority === "low" ? "bg-blue-100 text-blue-600" : ""}`}
        onClick={() => setFilterPriority("low")}
      >
        Low Priority
      </div>
    </div>
  </div>
  
  {/* Add this badge to show active filter */}
  {filterPriority !== "all" && (
    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
      {filterPriority === "high" ? (
        <>
          <FaExclamationCircle /> High Priority
        </>
      ) : (
        "Low Priority"
      )}
      <button 
        onClick={() => setFilterPriority("all")}
        className="ml-1 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  )}
</div>

      {/* Floating Add Post Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        ➕
      </button>

      <div className="flex flex-col items-center p-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p>No posts in your city yet.</p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} handleAddComment={handleAddComment} />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleCreatePost={handleCreatePost}
        newPost={newPost}
        setNewPost={setNewPost}
      />
    </div>
  );
};

export default ResidentDashboard;