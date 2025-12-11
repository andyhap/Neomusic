// LoginAdmin.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style/LoginAdmin.css";

import logo from "../assets/images/Logo Neomusic.png";

// === MOCK ADMIN DATA ===
const MOCK_ADMIN = {
  username: "adminneo",
  password: "adminpassword",
  adminId: "A101",
  token: "mock-admin-token-12345" // Token mock
};

// Key untuk menyimpan mock data di localStorage
const ADMIN_KEY = "mock_admin_data";

const LoginAdmin = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const [form, setForm] = useState({
    username: "",
    password: "",
    adminId: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Efek untuk memastikan mock data ada di localStorage saat komponen dimuat
  useEffect(() => {
    if (!localStorage.getItem(ADMIN_KEY)) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(MOCK_ADMIN));
    }

    // Cek jika admin sudah login, langsung redirect ke dashboard (AddMusic.js)
    if (localStorage.getItem("admin_token")) {
        navigate("/addmusic");
    }

  }, [navigate]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError(""); // Bersihkan error saat input berubah
  };

  // HANDLE LOGIN MENGGUNAKAN MOCK LOCALSTORAGE
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // 1. Ambil mock data dari localStorage
    const storedAdminRaw = localStorage.getItem(ADMIN_KEY);
    const storedAdmin = storedAdminRaw ? JSON.parse(storedAdminRaw) : {};
    
    // Validasi sederhana
    if (!form.username || !form.password || !form.adminId) {
        setError("Semua kolom harus diisi.");
        setLoading(false);
        return;
    }

    // 2. Simulasi validasi kredensial (Local Storage)
    if (
        form.username === storedAdmin.username &&
        form.password === storedAdmin.password &&
        form.adminId === storedAdmin.adminId
    ) {
        // Login berhasil (Mock)
        localStorage.setItem("admin_token", storedAdmin.token);
        localStorage.setItem("admin_user", JSON.stringify({ 
            username: storedAdmin.username, 
            adminId: storedAdmin.adminId 
        }));
        
        // 3. Navigasi ke AddMusic.js
        console.log("Admin Login berhasil, navigasi ke /addmusic");
        navigate("/addmusic");

    } else {
        // Login gagal (Mock)
        setError("Username, Password, atau ID Admin salah.");
    }

    setLoading(false);
    
    /* // === LOGIKA API ===
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login", 
        {
          username: form.username,
          password: form.password,
          adminId: form.adminId
        }
      );

      const data = response.data;
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }
      navigate("/addmusic"); // Navigasi ke AddMusic.js setelah API berhasil

    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal. Cek data kamu."
      );
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <img src={logo} alt="Logo" className="admin-logo" />
        <button
          className="header-login-btn"
          onClick={() => setShowLogin(true)}
        >
          Log in
        </button>
      </div>

      {/* HERO */}
      <div className="admin-hero">
        <h1>Update Music</h1>
        <p>
          Latest music updates to add to the more enjoyable user experience,
          varied songs add new color to every activity
        </p>

        <button
          className="hero-login-btn"
          onClick={() => setShowLogin(true)}
        >
          Log In
        </button>
      </div>

      {/* POPUP LOGIN */}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div
            className="login-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>LOG IN</h2>
            <p>
              Complete below to proceed to the home page (Mock Credential: 
              **adminneo/adminpassword/A101**)
            </p> {/* Tambahkan Credential Mock untuk kemudahan tes */}

            {error && <div style={{ color: "#ffb3b3", fontSize: "12px", marginBottom: "10px" }}>
              {error}
            </div>}

            <input
              type="text"
              name="username"
              placeholder="Username"
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

            <input
              type="text"
              name="adminId"
              placeholder="ID Admin"
              value={form.adminId}
              onChange={handleChange}
            />

            <button
              className="popup-login-btn"
              onClick={handleLogin}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Loading..." : "Log In"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAdmin;