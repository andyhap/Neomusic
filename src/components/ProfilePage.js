import React, { useState, useRef, useEffect } from 'react';
import './style/ProfilePage.css';
import { useNavigate } from 'react-router-dom'; 

import { apiLogout } from "../api/userApi";

// Import Icons
import { 
  FaHome, FaSearch, FaThLarge, FaHeart, FaRegHeart, FaEllipsisH, 
  FaVolumeUp, FaCamera, FaTimes, FaPen, FaCopy, FaTimesCircle 
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';

// --- IMPORT GAMBAR ---
import imgProfileUser from '../assets/images/img_profile.png';
import imgApt from '../assets/images/img_apt.png';
import imgDieWithSmile from '../assets/images/img_die_with_smile.png';
import imgLocked from '../assets/images/img_locked.png';
import imgJustthewayyouare from '../assets/images/img_just_the_way.png';
import imgHavana from '../assets/images/img_havana.png';
import imgAboutyou from '../assets/images/img_about_you.png';
import imgLoveyourself from '../assets/images/img_Loveyourself.png';
import imgFirstPlaylist from '../assets/images/img_first_playlist.png';
import imgIYah from '../assets/images/img_iyah.png';
import imgLikedSongs from '../assets/images/img_liked_songs.png';
import imgTopSongs from '../assets/images/img_top_song.png'; 
import imgCollide from '../assets/images/img_collide.png';
import imgLove from '../assets/images/img_love.png';
import imgiloveyou from '../assets/images/img_iloveu.png';
import imgLose from '../assets/images/img_lose.png';

// --- IMPORT AUDIO ---
import aptAudio from "../assets/audio/apt.mp3";
import dieAudio from "../assets/audio/die_with_a_smile.mp3";
import havanaAudio from "../assets/audio/havana.mp3";
import collideAudio from "../assets/audio/collide.mp3";
import aboutYouAudio from "../assets/audio/about.mp3";
import loveAudio from "../assets/audio/love.mp3";
import iHeartAudio from "../assets/audio/i3.mp3";
import loseAudio from "../assets/audio/lose.mp3";

// --- DATABASE LAGU ---
const allDatabaseSongs = [
  { id: 1, title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars", plays: "3.1B", img: imgDieWithSmile, audioUrl: dieAudio },
  { id: 2, title: "APT.", artist: "ROSÉ, Bruno Mars", plays: "2.1B", img: imgApt, audioUrl: aptAudio },
  { id: 3, title: "Locked out of Heaven", artist: "Bruno Mars", plays: "2.8B", img: imgLocked },
  { id: 4, title: "Just the Way You Are", artist: "Bruno Mars", plays: "2.9B", img: imgJustthewayyouare },
  { id: 5, title: "Havana", artist: "Camila Cabello", plays: "1.8B", img: imgHavana, audioUrl: havanaAudio },
  { id: 6, title: "Collide", artist: "Howie Day", plays: "500M", img: imgCollide, audioUrl: collideAudio },
  { id: 7, title: "About You", artist: "The 1975", plays: "800M", img: imgAboutyou, audioUrl: aboutYouAudio },
  { id: 8, title: "Love", artist: "Keyshia Cole", plays: "400M", img: imgLove, audioUrl: loveAudio },
  { id: 9, title: "i <3 u", artist: "Boy Pablo", plays: "300M", img: imgiloveyou, audioUrl: iHeartAudio },
  { id: 10, title: "Lose", artist: "NIKI", plays: "600M", img: imgLose, audioUrl: loseAudio },
  { id: 11, title: "Love Yourself", artist: "Justin Bieber", plays: "2.5B", img: imgLoveyourself },
];

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  return (
    <div className="heart-btn-wrapper" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
      {liked ? <FaHeart style={{ color: '#ff4d4d', fontSize: '16px' }} /> : <FaRegHeart style={{ color: 'var(--text-secondary)', fontSize: '16px' }} />}
    </div>
  );
};

const ProfilePage = ({ onPlay }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Playlist');
  
  // --- STATES UI ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSeeAllOpen, setIsSeeAllOpen] = useState(false);

  // --- STATES LOGIC ---
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  
  const [recentSearchHistory, setRecentSearchHistory] = useState([
    { id: 101, title: "APT.", artist: "Bruno Mars", img: imgApt },
    { id: 102, title: "Havana", artist: "Camila Cabello", img: imgHavana },
  ]);
  
  const [recentlyPlayedList, setRecentlyPlayedList] = useState([
    { id: 2, title: "APT.", artist: "ROSÉ, Bruno Mars", img: imgApt },
    { id: 5, title: "Havana", artist: "Camila Cabello", img: imgHavana },
    { id: 6, title: "Collide", artist: "Howie Day", img: imgCollide },
  ]);

  const [profileData, setProfileData] = useState({ name: "Jane Doe", img: imgProfileUser });
  const [tempData, setTempData] = useState({ name: "", img: "" });

  const fileInputRef = useRef(null);
  const menuRef = useRef(null); 
  const searchRef = useRef(null);
  const seeAllRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (seeAllRef.current && !seeAllRef.current.contains(event.target)) setIsSeeAllOpen(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) setIsMoreMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const results = allDatabaseSongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchQuery]);

  const handlePlayMusic = (song) => {
    if (onPlay) {
      onPlay({
        ...song,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      }, allDatabaseSongs);
    }
    setRecentlyPlayedList(prev => {
      const filtered = prev.filter(item => item.id !== song.id);
      return [song, ...filtered].slice(0, 10);
    });
    if (searchQuery) {
        setRecentSearchHistory(prev => {
            const filtered = prev.filter(item => item.id !== song.id);
            return [song, ...filtered].slice(0, 5);
        });
        setSearchQuery("");
        setIsSearchFocused(false);
    }
  };

  const handleClearHistory = () => {
    setRecentSearchHistory([]);
  };

  const libraryItems = [
    { id: 1, title: "Liked Songs", type: "Playlist · 2 songs", img: imgLikedSongs, special: true, path: "/liked" },
    { id: 2, title: "Top Songs - Global", type: "Playlist · 2 songs", img: imgTopSongs, path: "/top" },
    { id: 3, title: "The First Playlist", type: "Album · H.O.T", img: imgFirstPlaylist, path: "/playlist" },
    { id: 4, title: "Iyah! - The 4th Album", type: "Playlist · 24 songs", img: imgIYah, path: "/iyah" }
  ];

  const tracks = allDatabaseSongs.slice(0, 4);

  const handleOpenMoreProfile = () => { setIsMoreMenuOpen(true); setIsMenuOpen(false); };
  const handleOpenModal = () => { setTempData({ ...profileData }); setIsModalOpen(true); setIsMenuOpen(false); };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveProfile = () => { setProfileData({ ...tempData }); setIsModalOpen(false); };
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { const imageUrl = URL.createObjectURL(file); setTempData(prev => ({ ...prev, img: imageUrl })); } };
  const handleTriggerFile = () => fileInputRef.current.click();
  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); setIsMenuOpen(false); };

  return (
    <div className="app-container">
      {/* SIDEBAR KIRI */}
      <aside className="sidebar-left">
        <div className="nav-menu">
          {/* PERBAIKAN 1: Tombol Home mengarah ke /home */}
          <div 
            className="nav-item" 
            onClick={() => navigate('/home')} 
            style={{ cursor: "pointer" }}
          >
            <FaHome /> Home
          </div>
          
          <div className="nav-item"><FaSearch /> Search</div>
          <div className="nav-item"><FaThLarge /> Explore</div>
        </div>
        <div className="library-menu">
          <div className="library-header"><span><BiLibrary /> Your Library</span><FaSearch /></div>
          <div className="tags">
            <span className="tag active">Playlist</span><span className="tag">Albums</span><span className="tag">Artist</span>
          </div>
          <div className="playlist-list">
            {libraryItems.map((item) => (
              <div className="playlist-item" key={item.id} onClick={() => navigate(item.path)}>
                <img src={item.img} alt={item.title} className="playlist-cover" />
                <div className="playlist-info">
                  <h4 style={{ color: item.special ? '#a78bfa' : 'white' }}>{item.title}</h4>
                  <p>{item.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="new-playlist-btn">+ New Playlist</button>
        </div>
      </aside>

      {/* KONTEN TENGAH */}
      <main className="main-content glass-panel">
        
        {/* --- SEARCH BAR & HEADER KANAN --- */}
        <div className="search-bar-container">
          <div className="search-input-wrapper" ref={searchRef}>
            <FaSearch />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by artist, songs or albums" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            
            {/* POPUP HISTORY */}
            {isSearchFocused && searchQuery === "" && (
              <div className="search-popup">
                <div className="search-popup-header">
                  <h3>Recent Searches</h3>
                  {recentSearchHistory.length > 0 && (
                    <button className="clear-search-btn" onClick={handleClearHistory}>
                      Clear All
                    </button>
                  )}
                </div>

                <div className="search-results-list">
                  {recentSearchHistory.length === 0 ? (
                    <div className="empty-state">No recent searches</div>
                  ) : (
                    recentSearchHistory.map((item) => (
                      <div className="search-item" key={item.id} onClick={() => handlePlayMusic(item)}>
                        <img src={item.img} alt={item.title} className="search-item-img" />
                        <div className="search-item-info">
                          <span className="search-item-title">{item.title}</span>
                          <span className="search-item-artist">{item.artist}</span>
                        </div>
                        <FaTimesCircle 
                            className="remove-history-icon" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setRecentSearchHistory(prev => prev.filter(i => i.id !== item.id));
                            }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PERBAIKAN 2: Header Kanan (Volume & Foto Profil) */}
          <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
             {/* Ikon Volume */}
              <div style={{width:40, height:40, background:'white', borderRadius:'50%', display:'grid', placeItems:'center', color:'black', cursor:'pointer'}}>
                  <FaVolumeUp/>
              </div>
              
              {/* Foto Profil (Mengisi lingkaran putih sebelumnya) */}
              <div style={{width:40, height:40, borderRadius:'50%', cursor:'pointer', overflow:'hidden', border: '2px solid white'}}>
                  <img src={imgProfileUser} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
              </div>
          </div>
        </div>

        {/* --- KONTEN UTAMA --- */}
        {searchQuery ? (
          <div className="search-results-fullscreen">
            <h2 className="section-title">Search Results</h2>
            {searchResults.length > 0 ? (
              <div className="search-grid">
                {searchResults.map((song) => (
                  <div 
                    className="music-card" 
                    key={song.id}
                    onClick={() => handlePlayMusic(song)}
                  >
                    <img src={song.img} alt={song.title} />
                    <div className="music-meta">
                      <h4>{song.title}</h4>
                      <p>{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-result">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="profile-header">
              <img src={profileData.img} alt="Profile" className="avatar-large" />
              <div className="profile-details">
                <h2>My Profile</h2>
                <h1 className="profile-name" onClick={handleOpenModal}>{profileData.name}</h1>
                <p className="profile-stats">2 Public Playlist · 3 Following</p>
              </div>
            </div>
            
            <div className="profile-actions">
              <div className="dots-container" ref={menuRef}>
                  <div className="dots-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}><FaEllipsisH /></div>
                  {isMenuOpen && (
                    <div className="dropdown-menu">
                      <div className="menu-item" onClick={handleOpenMoreProfile}><FaPen /> Edit Profile</div>
                      <div className="menu-item" onClick={handleCopyLink}><FaCopy /> Copy link to profile</div>
                    </div>
                  )}
              </div>
              <div className="action-divider"></div>
            </div>

            <div className="profile-tabs">
              {['Playlist', 'Artist', 'Albums'].map((tab) => (
                <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
              ))}
            </div>

            <div className="track-list">
              {tracks.map((track, index) => (
                <div 
                  className="track-row" 
                  key={track.id}
                  onClick={() => handlePlayMusic(track)}
                >
                  <span className="track-num">{index + 1}</span>
                  <img src={track.img} alt={track.title} className="track-img" />
                  <div className="track-title-col">
                    <span className="track-name">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <span className="track-plays">{track.plays}</span>
                  <div className="track-actions">
                    <LikeButton />
                    <FaEllipsisH style={{cursor:'pointer'}} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* SIDEBAR KANAN */}
      <aside className="sidebar-right">
        <div className="section-title">
          <span>Recently Played</span>
          <span className="see-all" onClick={() => setIsSeeAllOpen(true)}>See All</span>
        </div>
        
        <div className="recent-list">
          {recentlyPlayedList.map((item, idx) => (
            <div 
              className="recent-item" 
              key={`${item.id}-${idx}`}
              onClick={() => handlePlayMusic(item)}
            >
              <div className="recent-info">
                <img src={item.img} alt={item.title} className="recent-img" />
                <div className="recent-info-text">
                  <h4>{item.title}</h4>
                  <p>{item.artist}</p>
                </div>
              </div>
              <LikeButton />
            </div>
          ))}
        </div>
      </aside>

      {/* --- POPUPS & MODALS --- */}
      {isMoreMenuOpen && (
        <div className="more-menu-overlay" onClick={() => setIsMoreMenuOpen(false)}>
            <div 
              className="more-menu-container"
              ref={moreMenuRef}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="more-menu-item" onClick={() => navigate('/account')}><span>Account</span><div className="more-menu-icon-box"><FiArrowUpRight /></div></div>
            <div className="more-menu-item" onClick={() => navigate('/edit-profile')}><span>Profile</span><div className="more-menu-icon-box"><FiArrowUpRight /></div></div>
            <div className="more-menu-item" onClick={() => navigate('/settings')}><span>Settings</span><div className="more-menu-icon-box"><FiArrowUpRight /></div></div>
            <div 
              className="more-menu-item logout-item"
              onClick={async () => {
                try {
                  await apiLogout(); // PENTING! panggil backend untuk hapus token Redis
                } catch (err) {
                  console.warn("Backend logout error:", err);
                }

                // bersihkan sesi login FE
                localStorage.removeItem("token");
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userProfile");

                setIsMoreMenuOpen(false);

                // redirect ke login
                navigate("/login");
              }}
            >
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleCloseModal}><FaTimes /></button>
            <h2 className="modal-title">Profile details</h2>
            <div className="edit-avatar-wrapper" onClick={handleTriggerFile}>
              <img src={tempData.img} alt="Preview" className="edit-avatar" />
              <div className="edit-avatar-overlay"><FaCamera /></div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}} accept="image/*"/>
            </div>
            <div className="edit-input-group">
              <input type="text" className="edit-input" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} placeholder="Name"/>
              <button className="save-modal-btn" onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {isSeeAllOpen && (
          <div className="see-all-popup" ref={seeAllRef}>
            <div className="see-all-header">
              <h3>Recently Played</h3>
              <button className="close-see-all-btn" onClick={() => setIsSeeAllOpen(false)}><FaTimes /></button>
            </div>
            <div className="see-all-list">
              {recentlyPlayedList.map((item, idx) => (
                <div className="see-all-item" key={idx} onClick={() => handlePlayMusic(item)}>
                  <div className="see-all-info">
                    <img src={item.img} alt={item.title} className="see-all-img" />
                    <div className="see-all-text"><h4>{item.title}</h4><p>{item.artist}</p></div>
                  </div>
                  <LikeButton />
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfilePage;