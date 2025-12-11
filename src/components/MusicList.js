// MusicList.js

import React, { useEffect, useState } from "react";
// Menggunakan style yang sama dengan ArtistList (diasumsikan sudah disinkronkan)
import "../components/style/MusicList.css"; 
import logo from "../assets/images/Logo Neomusic.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { musics as mockMusics, artists as mockArtists } from "../data/MockData.js"; 
// Import ikon hapus
import { FiTrash } from "react-icons/fi"; // Tambahkan FiTrash

export default function MusicList() {
  const [musics, setMusics] = useState([]);
  const [artistCount, setArtistCount] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    // Proteksi rute
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Akses ditolak. Silakan login admin.");
      navigate("/loginadmin");
    }

    fetchAndMerge();
    fetchArtistCount(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  function fetchArtistCount() {
    const savedArtists = JSON.parse(localStorage.getItem("artists")) || [];
    const totalArtist = savedArtists.length + mockArtists.length;
    setArtistCount(totalArtist);
  } 

  async function fetchAndMerge() {
    setLoading(true);
    setError("");
    
    let serverMusics = mockMusics; 
    const addedMusics = JSON.parse(localStorage.getItem("addedMusics")) || [];

    const allMusics = [...addedMusics, ...serverMusics]; 
    setMusics(allMusics);
    setLoading(false);
  }

  const handleDeleteLocal = (id) => {
    if (id.startsWith('local-')) {
        if (!window.confirm("Hapus lagu ini dari Local Storage?")) return;
        
        let existingMusics = JSON.parse(localStorage.getItem("addedMusics")) || [];
        const updatedMusics = existingMusics.filter(m => m.id !== id);
        
        if (existingMusics.length !== updatedMusics.length) {
            localStorage.setItem("addedMusics", JSON.stringify(updatedMusics));
            setMusics(prev => prev.filter(m => m.id !== id));
            alert("Lagu berhasil dihapus dari daftar lokal!");
        }
    } else {
        if (!window.confirm("Lagu ini adalah Mock Data. Lanjutkan menghapus dari tampilan?")) return;
        setMusics(prev => prev.filter(m => m.id !== id));
        alert("Lagu dihapus dari tampilan.");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/loginadmin");
  }
  
  const handleAddToPlaylist = () => {
    alert("Fungsi Tambahkan ke Playlist diimplementasikan di sini.");
  }


  return (
    <div className="musiclist-container">
      <aside className="left-nav">
        <div className="nav-top">
          <img src={logo} alt="NeoMusic" className="nav-logo" />
        </div>

        <nav className="nav-links">
          <Link to="/addmusic" className="nav-link">Dashboard</Link>
          <button className="nav-link active">Artist/Music</button>
          <button className="nav-link" onClick={handleLogout}>Log Out</button>
        </nav>
      </aside>

      <main className="artist-main">
        {/* TOP STATS */}
        <div className="top-stats">
          
          <div 
            className="stat-box purple1"
            onClick={() => navigate("/musiclist")} 
            style={{ cursor: 'pointer' }}
          >
            <p className="stat-title">Music Successfully Added</p>
            <h1 className="stat-value">{musics.length}</h1> 
            <div className="stat-line"></div>
          </div>

          <div 
            className="stat-box purple2"
            onClick={() => navigate("/artistlist")} 
            style={{ cursor: 'pointer' }}
          >
            <p className="stat-title">Artists Successfully Added</p>
            <h1 className="stat-value">{artistCount}</h1> 
            <div className="stat-line"></div>
          </div>
        </div>

        {/* LIST MUSIC */}
        <div className="artist-card"> 
          <div className="artist-card-header">
            <h3>List Music</h3>
            
            <button 
              className="playlist-btn" 
              onClick={handleAddToPlaylist} 
            >
              + Add To Playlist
            </button>
            
          </div>

          {/* PERUBAHAN DI SINI: MENGGUNAKAN artist-grid UNTUK KESAMAAN TAMPILAN */}
          <div className="artist-grid">
            {loading ? (
                <p className="empty-text">Loading music data...</p>
            ) : musics.length === 0 ? (
              <p className="empty-text">No musics added yet.</p>
            ) : (
              musics.map((m) => {
                const isLocal = m.id.startsWith('local-');

                return (
                <div className="artist-item" key={m.id} style={{ position: 'relative' }}>
                  <img
                    // Gunakan class artist-avatar agar stylingnya sama
                    src={m.cover || "https://via.placeholder.com/60?text=No+Cover"}
                    alt={m.title}
                    className="artist-avatar" 
                    style={{ borderRadius: 6 }} 
                  />
                  
                  {/* METADATA - Susunan Mirip Artist List */}
                  <div style={{ marginLeft: 5, flexGrow: 1 }}>
                    {/* Judul sebagai nama utama */}
                    <p className="artist-name" style={{ marginBottom: '4px' }}>{m.title}</p> 
                    
                    {/* Artis dan Genre sebagai detail */}
                    <small style={{ color: "rgba(255,255,255,0.7)", fontSize: '12px', display: 'block' }}>
                        {m.artist} ({m.genre})
                    </small>
                    
                    {/* Status Data */}
                    <small style={{ 
                      color: isLocal ? '#90EE90' : 'lightgray', 
                      fontSize: '10px', 
                      marginTop: '4px' 
                    }}>
                      {isLocal ? 'ADMIN ADDED' : 'MOCK DATA'}
                    </small>
                  </div>

                  {/* TOMBOL HAPUS - Mirip ArtistList */}
                  <button
                      onClick={() => handleDeleteLocal(m.id)}
                      title={isLocal ? "Hapus Lagu Lokal" : "Hapus dari Tampilan"}
                      style={{ 
                        position: 'absolute', 
                        right: 15, 
                        top: 15,
                        background: 'none',
                        border: 'none',
                        color: isLocal ? '#FF6347' : 'gray',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <FiTrash size={18} />
                    </button>
                </div>
              )})
            )}
          </div>
        </div>
      </main>
    </div>
  );
}