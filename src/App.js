// App.js (SETELAH DIPERBAIKI)

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"; // Import Navigate
import { useNavigate } from "react-router-dom"; // Import useNavigate (untuk ProfilePage mock)


import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TopStation from "./components/TopStation";
import MusicLibrary from "./components/MusicLibrary";
import TopArtist from "./components/TopArtist";
import TopMusic from "./components/TopMusic";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";

import LoginAdmin from "./components/LoginAdmin";
import AddMusic from "./components/AddMusic";
import ArtistList from "./components/ArtistList";
import MusicList from "./components/MusicList";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home"; // ✅ HOME BARU SETELAH LOGIN
import ProfilePage from "./components/ProfilePage";


// =========================
// MOCK PROFILE PAGE UNTUK MENUNJUKKAN DATA LOGIN
// =========================
// function ProfilePage() {
//     // Ambil data user dari localStorage
//     const userProfile = JSON.parse(localStorage.getItem("userProfile"));
//     const navigate = useNavigate();

//     const handleLogout = () => {
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("userProfile");
//       navigate("/login");
//     };

//     if (!userProfile) {
//       return (
//         <div style={{ padding: '40px', textAlign: 'center' }}>
//             <h2 style={{color: 'red'}}>Akses Ditolak. Harap Login.</h2>
//             <button onClick={() => navigate("/login")}>Go to Login</button>
//         </div>
//       );
//     }

//     return (
//         <div style={{ padding: '40px', maxWidth: '600px', margin: '50px auto', border: '1px solid #6e114b', borderRadius: '10px', background: '#f8e6f3' }}>
//             <h2 style={{ color: '#6e114b', textAlign: 'center' }}>Halaman Profile User</h2>
//             <hr style={{ borderColor: '#b84a9a' }}/>
            
//             <p><strong>Username:</strong> {userProfile.username}</p>
//             <p><strong>Email:</strong> {userProfile.email}</p>
//             <p><strong>ID User:</strong> {userProfile.id}</p>
//             <p><strong>Tanggal Daftar:</strong> {userProfile.joinDate}</p>
            
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
//                 <button 
//                   onClick={() => navigate('/home')}
//                   style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                 >
//                   Kembali ke Home
//                 </button>
//                 <button 
//                   onClick={handleLogout}
//                   style={{ padding: '10px 20px', background: '#b84a9a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                 >
//                   Logout
//                 </button>
//             </div>
//         </div>
//     );
// }


// =========================
// HOMEPAGE (SEBELUM LOGIN) - TIDAK DIUBAH
// =========================
function HomePage() {
  return (
    <>
      {/* HOME */}
      <section id="home">
        <HeroSection />
      </section>

      {/* FEATURES */}
      <section id="features">
        <TopStation />
        <MusicLibrary />
        <TopArtist />
        <TopMusic />
      </section>

      {/* ABOUT */}
      <section id="about">
        <AboutSection />
      </section>

      {/* CONTACT */}
      <section id="contact">
        <ContactSection />
      </section>
    </>
  );
}


// =========================
// WRAPPER UNTUK NAVBAR
// =========================
function AppLayout() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Cek status login
  
  // Tambahkan /profile ke rute yang menyembunyikan Navbar
  const hideNavbarRoutes = [
    "/login", 
    "/signup", 
    "/home", 
    "/profile", 
    "/loginadmin", 
    "/addmusic", 
    "/artistlist", 
    "/musiclist"
  ]; 

  const shouldHideNavbar = hideNavbarRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>

        {/* LANDING PAGE (Publik) */}
        <Route path="/" element={<HomePage />} />

        {/* AUTH (Publik) */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* ADMIN (Publik/Dilindungi terpisah) */}
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/addmusic" element={<AddMusic />} />
        <Route path="/artistlist" element={<ArtistList />} />
        <Route path="/musiclist" element={<MusicList />} />


        {/* RUTE USER TERPROTEKSI */}
        {/* Jika user sudah login, tampilkan Home, jika belum, redirect ke /login */}
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* Redirect default: jika sudah login ke /home, jika belum ke landing page */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />


      </Routes>
    </>
  );
}


// =========================
// APP
// =========================
export default function App() {
  // HAPUS PANGGILAN <Router> DI SINI KARENA SUDAH ADA DI index.js
  return (
    <AppLayout /> 
  );
}