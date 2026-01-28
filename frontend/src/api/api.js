import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token
API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const token = JSON.parse(userInfo).token;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchNotes = () => API.get('/notes');
export const createNote = (newNote) => API.post('/notes', newNote);
export const updateNote = (id, updatedNote) => API.put(`/notes/${id}`, updatedNote);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

export const login = (email, password) => API.post('/users/login', { email, password });
export const register = (name, email, password, pic) => API.post('/users', { name, email, password, pic });
export const googleLogin = (credential) => API.post('/users/google', { credential });
export const updateProfile = (user) => API.post('/users/profile', user); // Using POST as per routes, though PUT is better REST practice
