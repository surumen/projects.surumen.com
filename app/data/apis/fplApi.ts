import axios from 'axios';

const credentials = {
    username: process.env.NEXT_PUBLIC_FPL_USERNAME,
    password: process.env.NEXT_PUBLIC_FPL_PASSWORD,
    base_url: process.env.NEXT_PUBLIC_FPL_API_URL
};


const API_BASE = `${credentials.base_url}/api`;
const TOKEN_ENDPOINT = `${credentials.base_url}/token`;

let authToken: string | null = null;

export const authenticate = async () => {
    if (authToken) return authToken;

    const formData = new URLSearchParams();
    formData.append('username', credentials.username!);
    formData.append('password', credentials.password!);
    formData.append('grant_type', 'password');

    const response = await axios.post(TOKEN_ENDPOINT, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    authToken = response.data.access_token;
    return authToken;
};

const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: false, // set this false unless explicitly using cookies
});

apiClient.interceptors.request.use(async (config) => {
    const token = await authenticate();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getAllPlayers = () =>
    apiClient.get(`/players`).then(res => res.data);

export const getPlayerById = (playerId: number) =>
    apiClient.get(`/players/${playerId}`).then(res => res.data);

export const getLeague = (leagueId: number) =>
    apiClient.get(`/leagues/${leagueId}`).then(res => res.data);

export const getLeagueStandings = (leagueId: number, page = 1) =>
    apiClient.get(`/leagues/${leagueId}/standings?page=${page}`).then(res => res.data);

export const getLeagueEntry = (leagueId: number, entryId: number) =>
    apiClient.get(`/leagues/${leagueId}/entry/${entryId}`).then(res => res.data);

export const getManagerInfo = (managerId: number) =>
    apiClient.get(`/managers/${managerId}`).then(res => res.data);

export const getManagerTeam = (managerId: number, gameweek: number) =>
    apiClient.get(`/managers/${managerId}/team?gameweek=${gameweek}`)
        .then(res => res.data);

export const getManagerHistory = (managerId: number) =>
    apiClient.get(`/managers/${managerId}/history`).then(res => res.data);

export const getManagerTransfers = (managerId: number) =>
    apiClient.get(`/managers/${managerId}/transfers`).then(res => res.data);
