// Login.js

import React, { useState } from "react";
import "./style/SignUp.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

import LogoNeomusic from "../assets/images/Logo Neomusic.png";

import { apiLogin } from "../api/userAuth.js";


export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(""); // State untuk pesan error
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // const handleLogin = (e) => { // FUNGSI LOGIN
  //   e.preventDefault();

  //   const { username, password } = form;

  //   if (!username || !password) {
  //       setError("username dan password harus diisi.");
  //       return;
  //   }
    
  //   // 1. Ambil data user dari "backend" (localStorage)
  //   const storedUsers = JSON.parse(localStorage.getItem("appUsers")) || [];
    
  //   // 2. Cari user yang cocok
  //   const user = storedUsers.find(
  //     (u) => u.username === username && u.password === password
  //   );

  //   if (user) {
  //     // 3. Login Berhasil: Set status dan data profile
  //     localStorage.setItem("isLoggedIn", "true");
  //     // Simpan data user yang akan diakses oleh Profile Page
  //     const userProfile = {
  //         id: user.id,
  //         username: user.username,
  //         username: user.username,
  //         joinDate: user.joinDate
  //         // HINDARI MENYIMPAN PASSWORD DI localStorage
  //     };
  //     localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
  //     // 4. Navigasi ke halaman Home
  //     console.log("Login berhasil, navigasi ke /home");
  //     navigate("/home"); 

  //   } else {
  //     // Login gagal
  //     setError("username atau password tidak ditemukan.");
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiLogin({
        username: form.username,
        password: form.password
      });

      if (!res.success) {
        setError(res.message);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");

      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  return (
    <div className="signup-container">
      {/* LEFT (Struktur Tidak Diubah) */}
      <div className="signup-left">
        <div className="signup-logo">
          <img src={LogoNeomusic} alt="logo" />
        </div>
      </div>

      {/* RIGHT (Struktur Tidak Diubah) */}
      <div className="signup-right">
        <div className="signup-card">

          <h2>LOGIN</h2>
          <p>Welcome back!</p>
          
          {/* Menampilkan Error */}
          {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button className="btn-signup" onClick={handleLogin}> {/* Tambahkan onClick */}
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