import axios from "axios";
import type { AuthResponse, PostsResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL+'/api' || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// add token to request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// handle response error-401: authorization error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
) 

export const authAPI = {

    register: (data: {username: string; email: string; password: string}) => 
        api.post<AuthResponse>("/auth/register", data),
    
    login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
    
    getMe: () => api.get<AuthResponse>('/auth/me'),

    getUserInfoById: (userId: string) => {
        return api.get<AuthResponse>(`/auth/${userId}`);
    }

}

export const postAPI = {

    getAllPosts: (page = 1, limit = 10) => {
        return api.get<PostsResponse>(`/post?page=${page}&limit=${limit}`);
    },

    getPostById: (postId: string) => {
        return api.get<PostsResponse>(`/post/${postId}`);
    },

    getPostsByUserId: (userId: string, page = 1, limit = 10) => {
        return api.get<PostsResponse>(`/post/user/${userId}?page=${page}&limit=${limit}`);
    },

    create: (data: {content: string; images?: string[]}) => {
        return api.post<PostsResponse>("/post", data);
    },

    delete: (postId: string) => {
        return api.delete<PostsResponse>(`/post/${postId}`);
    },

    update: (postId: string, data: {content: string; images?: string[]}) => {
        return api.put<PostsResponse>(`/post/${postId}`,data);
    },

    like: (postId: string) => {
        return api.post<PostsResponse>(`/post/${postId}/like`);
    },

    unlike: (postId: string) => {
        return api.delete<PostsResponse>(`/post/${postId}/like`);
    },
}

export const commentsAPI = {
    getPostComments: (postId: string, page = 1, limit = 20) =>
        api.get(`/comment/post/${postId}?page=${page}&limit=${limit}`),
        
    create: (postId: string, data: { content: string }) =>
        api.post(`/comment/post/${postId}`, data),
        
    delete: (commentId: string) => api.delete(`/comment/${commentId}`),
};
export default api;
