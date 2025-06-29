import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Resident" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      const { token, user } = res.data;
      // ✅ Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      
      if (formData.role=="Resident") {
        toast.success("Signup successful! Complete Registration Now");
        setTimeout(() => {
      navigate("/resident-details");
    }, 2000);
      }else if (formData.role=="Worker"){
        toast.success("Signup successful! Complete Registration & Login.");
        setTimeout(() => {
          navigate("/worker-details");
        }, 2000);
      }else{
        toast.success("Signup successful! You can Login Now");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400">
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="bg-white/20 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input type="text" name="name" placeholder="Name" className="w-full p-2 mb-2 border" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-2 border" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-2 border" onChange={handleChange} required />
        <select name="role" className="w-full p-2 mb-2 border" onChange={handleChange}>
          <option>Resident</option>
          <option>Worker</option>
        </select>
        <button className="w-full bg-blue-500/50 hover:bg-sky-500 transition-all duration-300 text-white p-2 rounded">Signup</button>
        <p className="mt-2">Already Registered?<a className="text-blue-600 hover:underline" href="/"> Log In </a></p>
      </form>
    </div>
  );
};

export default Signup;
