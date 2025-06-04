import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    },
    timeout: 10000 // 10초 타임아웃 설정
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            hour12: false
        });

        console.log(`[${timestamp}] API Request:`, {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            hour12: false
        });

        console.log(`[${timestamp}] API Response:`, {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
            hour12: false
        });

        console.error(`[${timestamp}] API Error:`, {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;