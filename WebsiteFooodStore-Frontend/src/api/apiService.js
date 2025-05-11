import axiosInstance from "./axiosConfig";
import axios from 'axios';

function callApi(endpoint, method = "GET", body, params) {
    const token = localStorage.getItem("authToken");

    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    const config = {
        method,
        url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined,
        },
        data: body ? JSON.stringify(body) : null,
    };

    console.log("callApi url: ", url);
    console.log("callApi token: ", token);

    return axiosInstance(config)
        .then((response) => response.data)
        .catch((error) => {
            console.error("API call error:", error);
            throw error;
        });
}

export function GET_ALL(endpoint, params) {
    return callApi(endpoint, "GET", null, params);
}

const BASE_URL = 'http://localhost:8080/api';

export const GET_ID = async (endpoint, id) => {
    try {
        const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        console.log(`Calling API: ${BASE_URL}/public/products/${id}`); 
        const response = await axios.get(`${BASE_URL}/public/products/${id}`, { headers });
        
        console.log('Response:', response.data); 
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


export function POST_ADD(endpoint, data) {
    return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(endpoint, data) {
    return callApi(endpoint, "PUT", data);
}

export function DELETE_ID(endpoint) {
    return callApi(endpoint, "DELETE");
}

export function LOGIN(body) {
    const API_URL_LOGIN = "http://localhost:8080/api/login";
    return axiosInstance.post(API_URL_LOGIN, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
    .then((response) => response)
    .catch((error) => {
        console.log(error);
        throw error;
    });
}

export function GET_USER_INFO(email) {
    console.log('Getting user info for email:', email);
    const token = localStorage.getItem("authToken");
    console.log('Using token:', token);

    return axiosInstance({
        method: 'GET',
        url: `${BASE_URL}/public/users/email/${email}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ''
        }
    })
    .then(response => {
        console.log('User info response:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        throw error;
    });
}

// Nếu bạn muốn test API riêng, thêm hàm này
export function TEST_USER_INFO(email) {
    console.log('Testing user info API for email:', email);
    const token = localStorage.getItem("authToken");
    
    return fetch(`${BASE_URL}/public/users/email/${email}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include' // Thêm option này
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Test API response:', data);
        return data;
    })
    .catch(error => {
        console.error('Test API error:', error);
        throw error;
    });
}