import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaRegComment,
  FaExclamationCircle,
  FaTimes,
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { 
  IoMdSend,
  IoMdClose,
  IoMdCheckmark
} from "react-icons/io";
import { 
  BsThreeDotsVertical,
  BsPencilSquare,
  BsTrash
} from "react-icons/bs";
import { 
  RiDeleteBin6Line,
  RiEdit2Line
} from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResidentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    location: "",
    priority: false
  });

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts/my-posts", {
        headers: { Authorization: token }
      });
      setPosts(res.data);
    } catch (err) {
      toast.error("Failed to fetch your posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: token }
      });
      setPosts(posts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
      console.error(err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditForm({
      description: post.description,
      location: post.location,
      priority: post.priority
    });
  };

  const handleUpdate = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        editForm,
        { headers: { Authorization: token } }
      );
      
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, ...editForm } : post
      ));
      setEditingPost(null);
      toast.success("Post updated successfully");
    } catch (err) {
      toast.error("Failed to update post");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="bg-gradient-to-r from-sky-200 to-green-100 min-h-screen">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl text-center font-bold pt-10 mb-8 text-gray-800"
        >
          Your Posts
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-xl mb-4">
              You haven't created any posts yet.
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md"
            >
              Create Your First Post
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6 max-w-3xl mx-auto">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Header with edit/delete options */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-md"
                    >
                      <img
                        src={`http://localhost:5000${post.user.profile}`}
                        alt={post.user.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                      <motion.div 
                        className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white"></div>
                      </motion.div>
                    </motion.div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-800">{post.user.name}</h3>
                      <p className="text-gray-500 text-xs">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <RiEdit2Line className="text-lg" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteConfirm(post._id)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <RiDeleteBin6Line className="text-lg" />
                    </motion.button>
                  </div>
                </div>

                {/* Edit Form (when editing) */}
{editingPost === post._id && (
  <motion.div
    initial={{ opacity: 0, scaleY: 0.5, transformOrigin: "top" }}
    animate={{ opacity: 1, scaleY: 1 }}
    exit={{ opacity: 0, scaleY: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="mb-4"
  >
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={4}
                    />
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        placeholder="Location"
                      />
                      <label className="flex items-center gap-2 bg-gray-100 px-4 rounded-lg cursor-pointer">
                        <span className="text-sm text-gray-700">Priority</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={editForm.priority || false}
                            onChange={(e) => setEditForm({...editForm, priority: e.target.checked})}
                            className="sr-only"
                          />
                          <div className={`block w-12 h-6 rounded-full ${editForm.priority ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${editForm.priority ? 'transform translate-x-6 bg-white' : 'bg-white'}`}></div>
                        </div>
                      </label>
                    </div>
                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                      >
                        <IoMdClose /> Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdate(post._id)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        <IoMdCheckmark /> Save Changes
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Post Content (when not editing) */}
                {editingPost !== post._id && (
                  <>
                    {/* Priority Badge */}
                    {post.priority && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md mb-3"
                      >
                        <FaExclamationCircle className="mr-1" /> High Priority
                      </motion.div>
                    )}

                    <motion.p 
                      className="mb-4 text-gray-700 leading-relaxed text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {post.description}
                    </motion.p>

                    {/* Location */}
                    {post.location && (
                      <motion.div 
                        className="flex items-center text-sm text-gray-600 mb-4"
                        whileHover={{ x: 5 }}
                      >
                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                        <span>{post.location}</span>
                      </motion.div>
                    )}

                    {/* Image */}
                    {post.image && (
                      <motion.div 
                        className="mt-3 rounded-xl overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.01 }}
                      >
                        <img
                          src={post.image.startsWith("/uploads/") ? `http://localhost:5000${post.image}` : post.image}
                          alt="Post"
                          className="w-full h-80 object-cover"
                        />
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <RiDeleteBin6Line className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Post</h3>
                  <p className="text-gray-500 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(deleteConfirm)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <RiDeleteBin6Line /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResidentPosts;