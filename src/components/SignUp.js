// SignUp.js

import React, { useState } from "react";
import "./style/SignUp.css";
import { Link, useNavigate } from "react-router-dom"; 
// Import ikon mata dari react-icons/fi
import { FiEye, FiEyeOff } from "react-icons/fi"; // TAMBAHKAN INI

import LogoNeomusic from "../assets/images/Logo Neomusic.png";

// ... (Imports gambar tetap sama)

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  
  // STATE BARU UNTUK TOGGLE PASSWORD VISIBILITY
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    const { username, email, password, confirm } = form;

    // ... (Logika validasi dan pendaftaran tetap sama)

    if (!username || !email || !password || !confirm) {
      setError("Semua kolom harus diisi.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 6) {
        setError("Password minimal 6 karakter.");
        return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("appUsers")) || [];
    if (storedUsers.some(user => user.email === email)) {
      setError("Email sudah terdaftar. Silakan login.");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, 
      joinDate: new Date().toLocaleDateString(),
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("appUsers", JSON.stringify(updatedUsers));
    
    alert("Registrasi berhasil! Silakan login.");
    navigate("/login");
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

          <h2>SIGN UP</h2>
          <p>Just some details to get you in!</p>
          
          {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}


          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
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
          

          {/* INPUT CONFIRM PASSWORD */}
          <div className="input-group">
            <input
              type={showConfirm ? "text" : "password"} // TOGGLE TYPE
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
            />
            <span 
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>


          <button className="btn-signup" onClick={handleSignUp}>
            Signup
          </button>

          <div className="signup-divider">
            <span></span>
            <span></span>
          </div>

          <p className="login-text">
            Already Registered? <Link to="/login">Login</Link>
          </p>
          
        
        </div>
      </div>
    </div>
  );
}