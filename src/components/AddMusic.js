// AddMusic.js

import React, { useEffect, useState } from "react";
import "./style/AddMusic.css";
import logo from "../assets/images/Logo Neomusic.png";
import { musics as mockMusics, artists as mockArtists } from "../data/MockData.js";
import { FiSearch, FiUploadCloud } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { FiEdit3, FiHeart, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // TAMBAHKAN INI
import { Link } from "react-router-dom"; // Pastikan Link diimpor

// Fungsi helper untuk ID unik lokal
const generateId = () => `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function AdminDashboard() {
  const navigate = useNavigate(); // TAMBAHKAN INI

  const [musics, setMusics] = useState([]);
  const [artists, setArtists] = useState([]);

  const [showAddMusic, setShowAddMusic] = useState(false);
  const [showAddArtist, setShowAddArtist] = useState(false); 

  // State untuk Loading dan Error
  const [loadingArtist, setLoadingArtist] = useState(false);
  const [errorArtist, setErrorArtist] = useState('');
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [errorMusic, setErrorMusic] = useState('');

  const [newMusic, setNewMusic] = useState({
    title: "",
    artist: "", 
    genre: "",
    audioFile: null,
    imageFile: null,
    description: "",
  });

  const [newArtist, setNewArtist] = useState({
    name: "",
    country: "",
    avatar: null,
  }); 

  useEffect(() => {
    // Proteksi rute
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Akses ditolak. Silakan login admin.");
      navigate("/loginadmin");
    }
    
    // Initial load dari MockData
    setMusics(mockMusics);
    setArtists(mockArtists);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/loginadmin");
  }


  // =======================================================
  // LOGIKA ADD ARTIST (Penyimpanan ke localStorage)
  // =======================================================
  const handleAddArtist = () => {
    setLoadingArtist(true);
    setErrorArtist('');

    if (!newArtist.name || !newArtist.country) {
      setErrorArtist("Artist Name dan Country harus diisi.");
      setLoadingArtist(false);
      return;
    }

    const artistToAdd = {
      id: generateId(),
      name: newArtist.name,
      location: newArtist.country,
      avatar: newArtist.avatar ? `file://${newArtist.avatar.name}` : "https://via.placeholder.com/80?text=Artist", // Placeholder
    };

    try {
      const existingArtists = JSON.parse(localStorage.getItem('artists')) || [];
      const updatedArtists = [...existingArtists, artistToAdd];
      localStorage.setItem('artists', JSON.stringify(updatedArtists));

      setNewArtist({ name: "", country: "", avatar: null });
      setShowAddArtist(false);
      alert(`Artist '${artistToAdd.name}' berhasil ditambahkan!`);
      navigate("/artistlist"); // NAVIGASI SETELAH BERHASIL

    } catch (e) {
      console.error("Gagal menyimpan artist:", e);
      setErrorArtist("Gagal menyimpan data ke Local Storage.");
    } finally {
      setLoadingArtist(false);
    }
  };


  // =======================================================
  // LOGIKA ADD MUSIC (Penyimpanan ke localStorage)
  // =======================================================
  const handleAddMusic = () => {
    setLoadingMusic(true);
    setErrorMusic('');

    if (!newMusic.title || !newMusic.artist || !newMusic.genre || !newMusic.description) {
      setErrorMusic("Semua field teks harus diisi.");
      setLoadingMusic(false);
      return;
    }
    
    const musicToAdd = {
      id: generateId(),
      title: newMusic.title,
      artist: newMusic.artist,
      genre: newMusic.genre,
      description: newMusic.description,
      cover: newMusic.imageFile ? `file://${newMusic.imageFile.name}` : "https://via.placeholder.com/80?text=Music",
      audio: newMusic.audioFile ? `file://${newMusic.audioFile.name}` : null,
    };

    try {
      const existingMusics = JSON.parse(localStorage.getItem('addedMusics')) || [];
      const updatedMusics = [...existingMusics, musicToAdd];
      localStorage.setItem('addedMusics', JSON.stringify(updatedMusics));

      setNewMusic({ title: "", artist: "", genre: "", audioFile: null, imageFile: null, description: "" });
      setShowAddMusic(false);
      alert(`Music '${musicToAdd.title}' berhasil ditambahkan!`);
      navigate("/musiclist"); // NAVIGASI SETELAH BERHASIL

    } catch (e) {
      console.error("Gagal menyimpan music:", e);
      setErrorMusic("Gagal menyimpan data ke Local Storage.");
    } finally {
      setLoadingMusic(false);
    }
  };


  return (
    <div className="admin-dashboard">
      {/* LEFT NAV (Struktur Tidak Berubah) */}
      <aside className="left-nav">
        <div className="nav-top">
          <img src={logo} alt="NeoMusic" className="nav-logo" />
        </div>

        <nav className="nav-links">
          <button className="nav-link active">Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/artistlist")}>Artist/Music</button>
          <button className="nav-link" onClick={handleLogout}>Log Out</button>
        </nav>
      </aside>
      
      {/* MAIN CONTENT (Struktur Tidak Berubah) */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h3>
            Update The Latest Songs And Artists To Add To The User's Collection.
          </h3>
        </header>

        <section className="top-cards">
          <div className="card music-card">
            <div className="card-title">Music</div>

            {/* List Music (Menggunakan mock data awal) */}
            <div className="music-list">
              {musics.slice(0, 3).map((m) => (
                <div className="music-item" key={m.id}>
                  <div className="music-left">
                    <img
                      src={m.cover.default || m.cover}
                      alt={m.title}
                      className="music-cover"
                    />
                    <div className="music-meta">
                      <div className="music-title">{m.title}</div>
                      <div className="music-artist">{m.artist}</div>
                    </div>
                  </div>

                  <div className="music-right">
                    <span className="genre-pill">{m.genre}</span>

                    <div className="music-actions">
                      <button className="icon-btn">
                        <FiEdit3 />
                      </button>

                      <button className="icon-btn">
                        <FiHeart />
                      </button>

                      <button className="icon-btn">
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-footer">
              <button className="primary-btn" onClick={() => setShowAddMusic(true)}>
                + Music
              </button>
            </div>
          </div>

          <div className="artist-card-top">
            <div className="card-title">Artist List</div>

            {/* List Artist (Menggunakan mock data awal) */}
            <div className="artist-list-right">
              {artists.slice(0, 4).map((a) => (
                <div className="artist-item" key={a.id}>
                  <img
                    src={a.avatar.default || a.avatar}
                    alt={a.name}
                    className="artist-avatar"
                  />
                  <div className="artist-meta">
                    <div className="artist-name">{a.name}</div>
                    <div className="artist-loc">{a.location}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-footer">
              <button className="primary-btn" onClick={() => setShowAddArtist(true)}>
                + Artist
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM CARDS (Struktur Tidak Berubah) */}
        {/* ... (bagian bottom cards tetap sama) ... */}
        
        {/* POPUP ADD MUSIC */}
        {showAddMusic && (
          <div className="popup-overlay" onClick={() => setShowAddMusic(false)}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <h1 className="popup-title">Add Music</h1>
              {errorMusic && <p style={{ color: '#ffb3b3', fontSize: '12px', textAlign: 'center' }}>{errorMusic}</p>}

              <label className="label">Title</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Enter Music Title" value={newMusic.title} onChange={(e) => setNewMusic({ ...newMusic, title: e.target.value })} />
              </div>

              <label className="label">Artist Name</label> 
              <div className="input-wrapper">
                <input type="text" placeholder="Enter Artist Name" value={newMusic.artist} onChange={(e) => setNewMusic({ ...newMusic, artist: e.target.value })} />
              </div>

              <label className="label">Genre</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Enter Music Genre" value={newMusic.genre} onChange={(e) => setNewMusic({ ...newMusic, genre: e.target.value })} />
              </div>

              <label className="label">Description</label>
              <div className="input-wrapper">
                <textarea placeholder="Enter description..." value={newMusic.description} onChange={(e) => setNewMusic({ ...newMusic, description: e.target.value })} rows="3"></textarea>
              </div>


              <label className="label" style={{ marginTop: 20 }}>Audio File</label>
              <div className="input-wrapper upload">
                <FiUploadCloud className="icon-left" />
                <span>{newMusic.audioFile ? newMusic.audioFile.name : "Upload Audio File Here"}</span>
                <input type="file" accept="audio/*" className="file-input" onChange={(e) => setNewMusic({ ...newMusic, audioFile: e.target.files[0] })} />
              </div>

              <label className="label">Image Cover</label>
              <div className="input-wrapper upload">
                <FiUploadCloud className="icon-left" />
                <span>{newMusic.imageFile ? newMusic.imageFile.name : "Upload Image Cover Here"}</span>
                <input type="file" accept="image/*" className="file-input" onChange={(e) => setNewMusic({ ...newMusic, imageFile: e.target.files[0] })} />
              </div>


              <div className="btn-row">
                <button className="cancel-btn" onClick={() => setShowAddMusic(false)}>
                  Cancel
                </button>
                <button
                  className="addmusic-btn"
                  onClick={handleAddMusic}
                  disabled={loadingMusic}
                >
                  {loadingMusic ? "Adding..." : "Add Music"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP ADD ARTIST */}
        {showAddArtist && (
          <div className="popup-overlay" onClick={() => setShowAddArtist(false)}>
            <div className="popup-container small" onClick={(e) => e.stopPropagation()}>
              <h1 className="popup-title">Add Artist</h1>
              {errorArtist && <p style={{ color: '#ffb3b3', fontSize: '12px', textAlign: 'center' }}>{errorArtist}</p>}

              <label className="label">Artist Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Artist Name"
                  value={newArtist.name}
                  onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                />
              </div>

              <label className="label">Country</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Enter Country"
                  value={newArtist.country}
                  onChange={(e) => setNewArtist({ ...newArtist, country: e.target.value })}
                />
              </div>
              
              <label className="label" style={{ marginTop: 20 }}>Avatar</label>
              <div className="input-wrapper upload">
                <FiUploadCloud className="icon-left" />
                <span>{newArtist.avatar ? newArtist.avatar.name : "Upload Here"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => setNewArtist({ ...newArtist, avatar: e.target.files[0] })}
                />
              </div>

              <div className="btn-row">
                <button className="cancel-btn small-btn" onClick={() => setShowAddArtist(false)}>
                  Cancel
                </button>
                <button
                  className="addmusic-btn small-btn"
                  onClick={handleAddArtist}
                  disabled={loadingArtist}
                >
                  {loadingArtist ? "Adding..." : "Add Artist"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




