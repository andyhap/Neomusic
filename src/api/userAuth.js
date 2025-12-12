import axios from "./axiosInstance";

// REGISTER
export const apiRegister = async (payload) => {
    const res = await axios.post("/api/auth/users/register", payload);
    return res.data;
};

// LOGIN
export const apiLogin = async (payload) => {
    const res = await axios.post("/api/auth/users/login", payload);
    return res.data;
};
