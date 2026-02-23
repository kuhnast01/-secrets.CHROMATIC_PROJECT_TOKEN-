import axios from 'axios';

// Shared API client instance
export const apiClient = axios.create({
	baseURL: process.env.API_BASE_URL || '/api',
	timeout: 10000,
});
export * from './vipApi';
// API client entry point
export * from './playerApi';
export * from './authApi';
export * from './authService';
export * from './summonApi';
export * from './summonActionApi';
export * from './battlePassApi';
export * from './battlePassMissionsApi';
export { getBattlePassMissions, claimBattlePassMission } from './battlePassMissionsApi';
export { equipCosmetic } from './cosmeticsApi';
export * from './shopApi';
