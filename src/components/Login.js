
import React, { useState } from "react";
import "./style/Login.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// Import ikon mata dari react-icons/fi
import { FiEye, FiEyeOff } from "react-icons/fi"; // TAMBAHKAN INI

import LogoNeomusic from "../assets/images/Logo Neomusic.png";

// ... (Imports gambar tetap sama)

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // STATE BARU UNTUK TOGGLE PASSWORD VISIBILITY
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const { email, password } = form;

    if (!email || !password) {
        setError("Email dan password harus diisi.");
        return;
    }
    
    const storedUsers = JSON.parse(localStorage.getItem("appUsers")) || [];
    
    const user = storedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      const userProfile = {
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.joinDate
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      console.log("Login berhasil, navigasi ke /home");
      navigate("/home"); 

    } else {
      setError("Email atau password tidak ditemukan.");
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT */}
      <div className="signup-left">
        <div className="signup-logo">
          <img src={LogoNeomusic} alt="logo" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="signup-right">
        <div className="signup-card">

          <h2>LOGIN</h2>
          <p>Welcome back!</p>

          {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}

          <input
            type="text"
            name="email"
            placeholder="Email / Phone"
            value={form.email}
            onChange={handleChange}
          />

          {/* INPUT PASSWORD */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"} // TOGGLE TYPE
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <span 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>


          <button className="btn-signup" onClick={handleLogin}>
            Login
          </button>

          <div className="signup-divider">
            <span></span>
            <span></span>
          </div>

          <p className="login-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}