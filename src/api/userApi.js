import axios from "./axiosInstance";

/**
* GET profile
* GET /api/users/profile (requires Bearer token)
*/
export const getProfile = async () => {
    const res = await axios.get("/api/users/me");
    return res.data; // { success: true, message, data: { user: ... } }
};

/**
* UPDATE profile
* PUT /api/users/profile
* payload: { username, email, gender, birthdate }
*/
export const updateProfile = async (payload) => {
    const res = await axios.put("/api/users/me", payload);
    return res.data;
};

/**
* UPDATE avatar
* PUT /api/users/avatar  (multipart/form-data)
* formData must contain file under key 'file'
*/
export const updateAvatar = async (formData) => {
    const res = await axios.put("/api/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
* LOGOUT
* POST /api/users/logout
*/
export const apiLogout = async () => {
    try {
        const res = await axios.post("/api/users/logout");
        return res.data;
    } catch (err) {
        console.warn("apiLogout error:", err);
        return { success: false, message: err.message };
    }
};