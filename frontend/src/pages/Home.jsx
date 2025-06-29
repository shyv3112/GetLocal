import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/Navbar";

const HomePage = () => {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // Trigger animations when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="bg-gradient-to-r from-sky-100 to-purple-50 min-h-screen">
      
      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center text-center bg-[url('https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/75"></div>
        <motion.h1
        ref={ref}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-white z-10"
        >
          Welcome to <span className="text-sky-400">Smart Neighborhood</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl text-gray-200 mt-4 z-10"
        >
          Your one-stop solution for seamless community living and services.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 z-10"
        >
          <Link
            to="/login"
            className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors duration-300"
          >
            Get Started <FaArrowRight />
          </Link>
        </motion.div>
      </div>
 
      {/* Features Section */}
      <div className="py-16 px-4">
        <motion.h2
         
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-sky-800 mb-8"
        >
          Why Choose Us?
        </motion.h2>
        <div  ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "👥",
              title: "Community Living",
              description: "Connect with your neighbors and build a strong community.",
            },
            {
              icon: "🛠️",
              title: "Seamless Services",
              description: "Access a wide range of services tailored to your needs.",
            },
            {
              icon: "📱",
              title: "Easy Booking",
              description: "Book services and manage your requests with ease.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-sky-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-white">
        <motion.h2
          
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-sky-800 mb-8"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "John Doe",
              role: "Resident",
              testimonial: "AYAL has made community living so much easier and enjoyable!",
              image: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
            },
            {
              name: "Jane Smith",
              role: "Worker",
              testimonial: "The platform is intuitive and helps me manage my services efficiently.",
              image: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
            },
            {
              name: "Alice Johnson",
              role: "Admin",
              testimonial: "AYAL has streamlined our operations and improved communication.",
              image: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-sky-800">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.testimonial}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-sky-100 to-purple-50">
        <motion.h2
          
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-sky-800 mb-8"
        >
          Ready to Join?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/login"
            className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors duration-300 mx-auto w-fit"
          >
            Get Started <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;