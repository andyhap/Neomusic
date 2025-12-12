import axios from "./axiosInstance";

export const getAllSongs = async () => {
    const res = await axios.get("/api/public/songs");
    return res.data;
};

export const getAllArtists = async () => {
    const res = await axios.get("/api/public/artists");
    return res.data;
};
