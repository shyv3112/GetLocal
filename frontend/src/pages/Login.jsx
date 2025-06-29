import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      
      // Redirect based on role
      if (res.data.user.role === "Admin") navigate("/admin");
      else if(res.data.user.role === "Worker") {
        setTimeout(() => {
          navigate("/worker-dashboard");
        }, 2000); 
      }
      else if(res.data.user.role === "Resident"){
        setTimeout(() => {
          navigate("/resident-services");
        }, 2000); 
      }else{
        setTimeout(() => {
          navigate("/super-admin");
        }, 2000);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400">
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="bg-white/20 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-white font-bold mb-4">Login</h2>
        <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-2 border rounded-xl" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-2 border rounded-xl" onChange={handleChange} required />
        <button className="w-full bg-green-500/50 hover:bg-green-500 transition-all duration-300 text-white p-2 rounded">Login</button>
        <p className="mt-2">New Here? <a className="text-blue-600 hover:underline " href="/signup"> Sign Up </a></p>
      </form>
    </div>
  );
};

export default Login;
