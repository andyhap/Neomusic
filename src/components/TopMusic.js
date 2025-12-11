import React, { useRef, useState, useEffect } from "react";
import "./style/TopMusic.css";

/* --- IMAGES--- */
import aptImg from "../assets/images/APT.png";
import dieImg from "../assets/images/die with a smile.png";
import justImg from "../assets/images/Just the way you are.jpg";
import havanaImg from "../assets/images/Havana.png";
import collideImg from "../assets/images/Collide.jpg";
import aboutYouImg from "../assets/images/about you.jpg";
import loveImg from "../assets/images/Love.jpg";
import iheartImg from "../assets/images/i heart you.jpg";
import loseImg from "../assets/images/lose.jpg";

/* --- AUDIO --- */
import aptAudio from "../assets/audio/apt.mp3";
import dieAudio from "../assets/audio/die_with_a_smile.mp3";
import justAudio from "../assets/audio/just_the_way.mp3";

const TopMusic = () => {
  const playlist = [
    { id: 0, title: "APT.", artist: "Bruno Mars", img: aptImg, src: aptAudio },
    { id: 1, title: "Die With a Smile", artist: "Bruno Mars", img: dieImg, src: dieAudio },
    { id: 2, title: "Just The Way You Are", artist: "Bruno Mars", img: justImg, src: justAudio },
  ];

  const sidebarList = [
    { img: aptImg, title: "APT.", artist: "Bruno Mars" },
    { img: dieImg, title: "Die With a Smile", artist: "Bruno Mars" },
    { img: havanaImg, title: "Havana", artist: "Camila Cabello" },
    { img: collideImg, title: "Collide", artist: "Howie Day" },
    { img: aboutYouImg, title: "About You", artist: "The 1975" },
    { img: loveImg, title: "Love", artist: "Keyshia Cole" },
    { img: iheartImg, title: "i <3 u", artist: "Boy Pablo" },
    { img: loseImg, title: "Lose", artist: "NIKI" },
  ];

  const audioRef = useRef(new Audio(playlist[0].src));
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = playlist[index].src;
    audio.load();

    const onLoaded = () => {
      setDuration(audio.duration || 0);
    };
    const onTime = () => {
      setCurTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnd = () => {
      handleNext();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    
    if (isPlaying) {
      audio.play().catch(() => {
       
      });
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // play/pause toggle
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Playback prevented:", err);
      }
    }
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  // seek by clicking bar
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
      setProgress(ratio * 100);
    }
  };

  // change volume
  const handleVolume = (val) => {
    const audio = audioRef.current;
    const v = Math.max(0, Math.min(1, val));
    audio.volume = v;
    setVolume(v);
  };

  // format seconds -> M:SS
  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // click album card -> change song
  const onAlbumClick = (i) => {
    setIndex(i);
    setIsPlaying(true);
  };

  return (
    <div className="tm-root">
      <div className="tm-container">
        {/* SIDEBAR */}
        <aside className="tm-sidebar">
          <div className="tm-sidebar-inner">
            <h4 className="tm-recent-title">Recently Played</h4>
            <ul className="tm-recent-list">
              {sidebarList.map((s, i) => (
                <li key={i} className="tm-recent-item">
                  <div className="tm-thumb"><img src={s.img} alt={s.title} /></div>
                  <div className="tm-meta">
                    <div className="tm-song">{s.title}</div>
                    <div className="tm-artist">{s.artist}</div>
                  </div>
                  <div className="tm-like">♡</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN */}
        <main className="tm-main">
          <h1 className="tm-title">Top Music</h1>
          <p className="tm-sub">
            Discover the biggest hits and top-charting artists dominating the music scene. Keep your playlist fresh with our curated selection.
          </p>

          {/* Album cards */}
          <div className="tm-albums">
            {playlist.map((p, i) => (
              <div
                key={p.id}
                className={`tm-album ${i === index ? "active" : ""}`}
                onClick={() => onAlbumClick(i)}
                role="button"
                tabIndex={0}
              >
                <div className="tm-album-art"><img src={p.img} alt={p.title} /></div>
                <div className="tm-album-title">{p.title}</div>
                <div className="tm-album-artist">{p.artist}</div>
              </div>
            ))}
          </div>

          {/* PLAYER BAR */}
          <div className="tm-player-wrapper">
            <div className="tm-player">
              <div className="tm-left">
                <div className="tm-left-meta">
                  <div className="tm-left-title">{playlist[index].title}</div>
                  <div className="tm-left-artist">{playlist[index].artist}</div>
                </div>
              </div>

              <div className="tm-center">
                <button className="tm-btn" onClick={handlePrev} aria-label="prev">⏮</button>
                <button className="tm-btn tm-play" onClick={togglePlay} aria-label="play-pause">
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="tm-btn" onClick={handleNext} aria-label="next">⏭</button>
              </div>

              <div className="tm-right">
                <div className="tm-times">
                  <span className="tm-cur">{fmt(curTime)}</span>
                </div>

                <div className="tm-progress" onClick={handleSeek} role="button" aria-label="seek">
                  <div className="tm-bar">
                    <div className="tm-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="tm-times">
                  <span className="tm-dur">{fmt(duration)}</span>
                </div>

                <button className="tm-expand" title="Expand">⤢</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopMusic;
