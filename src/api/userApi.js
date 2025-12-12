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
    try {
        const res = await axios.put("/api/users/me", payload);
        return res.data;
    } catch (err) {
        console.error("updateProfile error:", err);
        return { success: false, message: err.message };
    }
};

/**
 * UPDATE avatar
 * POST /api/users/avatar  (multipart/form-data)
 * formData must contain file under key 'file'
 */
export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        // ----- PENTING: gunakan key 'file' karena BE mengharapkan itu -----
        formData.append("file", file);

        // ----- PENTING: gunakan POST (kamu bilang methodnya POST) -----
        const res = await axios.post("/api/users/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    } catch (err) {
        console.error("Upload avatar error:", err.response || err);
        // Usahakan return bentuk yang konsisten untuk FE
        const message = err?.response?.data?.message || err.message || "Unknown error";
        return { success: false, message };
    }
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