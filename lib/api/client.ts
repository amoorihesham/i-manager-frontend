import axios from 'axios';

const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error.response?.data ?? error)
);

export default client;
