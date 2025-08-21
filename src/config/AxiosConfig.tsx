import axios from "axios";

const API = axios.create({baseURL: "https://voicedrop-backend.onrender.com/api"});

export default API;
