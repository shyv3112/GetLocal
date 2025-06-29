import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const WDetails = () => {
  const [formData, setFormData] = useState({ phone: "", shop: "", proof: null, profile: null });
  const navigate = useNavigate();

  // ✅ Handle Input Change Properly
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle File Upload Properly
  const handleFileChange = (e) => setFormData({ ...formData, proof: e.target.files[0] });

  // ✅ Handle File Upload Properly
  const handleProfileChange = (e) => setFormData({ ...formData, profile: e.target.files[0] });

  // ✅ Submit Form Data Correctly
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("shop", formData.shop);
    if (formData.proof) {
      formDataToSend.append("proof", formData.proof);
    }
    if (formData.profile) {
      formDataToSend.append("profile", formData.profile);
    }

    try {
      
      await axios.put("http://localhost:5000/api/auth/complete", formDataToSend, {
        headers: {
          Authorization: token,
          "Content-Type" : "multipart/form-data"
        },
      });

      toast.success("Registration successful! Wait for admin approval.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Worker Details</h2>

        {/* ✅ File Input */}
        <label className="text-black text-sm">Upload a Profile Picture</label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg mb-2"
          onChange={handleProfileChange}
          required
        />
        

        {/* ✅ Fixed input name */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 mb-2 border rounded"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* ✅ Fixed Shop Address Input */}
        <input
          type="text"
          name="shop"
          placeholder="Shop Address"
          className="w-full p-2 mb-2 border rounded"
          value={formData.shop}
          onChange={handleChange} // ✅ Fix applied here
          required
        />


        {/* ✅ File Input */}
        <input
          type="file"
          className="w-full p-2 border rounded-lg mb-2"
          onChange={handleFileChange}
          required
        />
        <label className="text-red-500 text-sm">* Upload a Proof of Address</label>

        <button className="w-full bg-blue-500 text-white p-2 rounded mt-3 hover:bg-blue-700 transition-all">
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default WDetails;
