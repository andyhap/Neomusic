import axios from "./axiosInstance";

/**
 * GET semua artist (public)
 * /api/public/artists?page=&limit=
 */
export const getAllArtists = async (page = 1, limit = 50) => {
    const res = await axios.get(`/api/public/artists`, {
        params: { page, limit }
    });
    return res.data; // { success, data, pagination }
};

/**
 * GET detail satu artist
 * /api/public/artists/:id
 */
export const getArtistById = async (id) => {
    const res = await axios.get(`/api/public/artists/${id}`);
    return res.data;
};

/**
 * SEARCH artist + songs
 * /api/public/search?query=...&page=&limit=
 */
export const searchPublic = async (query, page = 1, limit = 20) => {
    const res = await axios.get(`/api/public/search`, {
        params: { query, page, limit }
    });
    return res.data; // { success, data: { artists, songs }, pagination }
};
