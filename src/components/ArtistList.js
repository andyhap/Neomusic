// ArtistList.js

import React, { useEffect, useState } from "react";
import "./style/ArtistList.css";
import logo from "../assets/images/Logo Neomusic.png";
import { Link, useNavigate } from "react-router-dom"; 
import { artists as mockArtists } from "../data/MockData.js";
import { musics as mockMusics } from "../data/MockData.js"; 
// Import ikon hapus (misalnya: FiTrash)
import { FiTrash } from "react-icons/fi"; // TAMBAHKAN INI

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [musicCount, setMusicCount] = useState(0); 
  const navigate = useNavigate(); 

  // Fungsi untuk mengambil dan menggabungkan data artis
  const fetchArtists = () => {
    // 1. Ambil dan gabungkan data Artist: data lokal baru + mock data
    const savedArtists = JSON.parse(localStorage.getItem("artists")) || [];
    setArtists([...mockArtists, ...savedArtists]); 
    
    // 2. Hitung jumlah Music
    const savedMusics = JSON.parse(localStorage.getItem("addedMusics")) || [];
    const totalMusic = savedMusics.length + mockMusics.length; 
    setMusicCount(totalMusic);
  };
  
  useEffect(() => {
    // Proteksi rute
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Akses ditolak. Silakan login admin.");
      navigate("/loginadmin");
      return;
    }

    fetchArtists(); // Panggil fungsi fetch saat mount
  }, [navigate]);

  // =======================================================
  // FUNGSI BARU: MENGHAPUS ARTIS DARI LOCALSTORAGE
  // =======================================================
  const handleDeleteArtist = (id) => {
    // Pastikan hanya artis yang ditambahkan lokal (id dimulai dengan 'local-') yang bisa dihapus
    if (!id.startsWith('local-')) {
        alert("Artis ini adalah data Mock awal dan tidak dapat dihapus.");
        return;
    }

    if (!window.confirm("Apakah Anda yakin ingin menghapus artis ini?")) {
        return;
    }
    
    try {
        // 1. Ambil daftar artis lokal yang tersimpan
        let existingArtists = JSON.parse(localStorage.getItem("artists")) || [];
        
        // 2. Filter (hapus) artis dengan ID yang cocok
        const updatedArtists = existingArtists.filter(a => a.id !== id);
        
        // 3. Simpan kembali ke localStorage
        localStorage.setItem("artists", JSON.stringify(updatedArtists));
        
        // 4. Perbarui state untuk refresh tampilan
        fetchArtists(); 

        alert("Artis berhasil dihapus!");

    } catch (e) {
        console.error("Gagal menghapus artis:", e);
        alert("Terjadi kesalahan saat menghapus artis.");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/loginadmin");
  }

  return (
    <div className="artistlist-container">

      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <main className="artist-main">
        
        {/* TOP STATS (tetap sama) */}
        <div className="top-stats">
          
          <div 
            className="stat-box purple1"
            onClick={() => navigate("/musiclist")} 
            style={{ cursor: 'pointer' }}
          >
            <p className="stat-title">Music Successfully Added</p>
            <h1 className="stat-value">{musicCount}</h1> 
            <div className="stat-line"></div>
          </div>

          <div 
            className="stat-box purple2"
            onClick={() => navigate("/artistlist")} 
            style={{ cursor: 'pointer' }}
          >
            <p className="stat-title">Artists Successfully Added</p>
            <h1 className="stat-value">{artists.length}</h1> 
            <div className="stat-line"></div>
          </div>
        </div>

        {/* LIST ARTIST */}
        <div className="artist-card">
          <div className="artist-card-header">
            <h3>List Artist</h3>
            <button className="playlist-btn">+ Add To Playlist</button>
          </div>

          <div className="artist-grid">
            {artists.length === 0 ? (
              <p className="empty-text">No artists added yet.</p>
            ) : (
              artists.map((a) => {
                const isLocal = a.id.startsWith('local-');

                return (
                <div className="artist-item" key={a.id} style={{ position: 'relative' }}>
                  <img
                    src={a.avatar || "https://via.placeholder.com/80?text=No+Image"} 
                    alt={a.name}
                    className="artist-avatar"
                  />
                  <p className="artist-name">{a.name}</p>
                  
                  {/* METADATA TAMBAHAN */}
                  <div style={{ marginLeft: 10 }}>
                    <small style={{ color: "rgba(255,255,255,0.7)", fontSize: '12px', display: 'block' }}>{a.location}</small>
                    <small style={{ 
                      color: isLocal ? '#90EE90' : 'lightgray', 
                      fontSize: '10px', 
                      marginTop: '4px' 
                    }}>
                      {isLocal ? 'ADMIN ADDED' : 'MOCK DATA'}
                    </small>
                  </div>

                  {/* TOMBOL HAPUS - HANYA MUNCUL JIKA ARTIS LOKAL */}
                  {isLocal && (
                    <button
                      onClick={() => handleDeleteArtist(a.id)}
                      title="Hapus Artis Lokal"
                      style={{ 
                        position: 'absolute', 
                        right: 15, 
                        top: 15,
                        background: 'none',
                        border: 'none',
                        color: '#FF6347',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <FiTrash size={18} />
                    </button>
                  )}
                </div>
              )})
            )}
          </div>
        </div>
      </main>
    </div>
  );
}