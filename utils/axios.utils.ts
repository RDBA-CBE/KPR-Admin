'use client';
import axios from 'axios';

export const createApiInstance = () => {
    let baseURL = 'http://121.200.52.133:8003/api/';

    const api = axios.create({
        baseURL,
    });

    let refreshPromise = null;

    const getAccessToken = () => localStorage.getItem('token');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    const setAccessToken = (token) => localStorage.setItem('token', token);
    const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
    const clearTokens = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    const redirectToLogin = () => {
        clearTokens();
        window.location.href = '/signin';
    };
    const refreshToken = () => {
        if (!refreshPromise) {
            refreshPromise = new Promise((resolve, reject) => {
                const refreshToken = getRefreshToken();
                console.log('Stored refreshToken:', refreshToken);

                if (!refreshToken) {
                    console.log('No refresh token found. Redirecting to login...');
                    clearAuthData();
                    // redirectToLogin();
                    reject('No refresh token');
                    return;
                }

                axios
                    .post(`${baseURL}token/refresh/`, { refresh: refreshToken })
                    .then((response) => {
                        console.log('Refresh token response:', response.data);

                        setAccessToken(response.data.access);
                        setRefreshToken(response.data.refresh);

                        resolve(response.data.access);
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.error('Refresh token failed:', error.response.data);

                            if (error.response.data.code === 'token_not_valid') {
                                console.log('Token expired. Logging out...');
                                clearAuthData();
                                // redirectToLogin();
                            }
                        } else if (error.request) {
                            console.error('No response received:', error.request);
                        } else {
                            console.error('Error setting up request:', error.message);
                        }

                        reject(error);
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            });
        }

        return refreshPromise;
    };

    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    api.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;
            if (error?.response?.data) {
                return Promise.reject(error);
            } else {
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    return refreshToken()
                        .then((newAccessToken) => {
                            if (!newAccessToken) {
                                redirectToLogin();
                                return Promise.reject('Failed to refresh token');
                            }
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            return api(originalRequest);
                        })
                        .catch((err) => {
                            redirectToLogin();
                            return Promise.reject(err);
                        });
                }

                return Promise.reject(error);
            }
        }
    );

    return api;
};

export default createApiInstance;
