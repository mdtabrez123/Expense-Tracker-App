import axios from 'axios';
import Constants from 'expo-constants';

// Dynamically get the host IP from Expo's manifest.
// This auto-detects your laptop's IP, so you never need to hardcode it again.
// Works on both physical devices (via Expo Go) and web.
const getBaseURL = () => {
  // When running in Expo Go on a physical device, the debuggerHost
  // contains the laptop IP (e.g., "172.16.33.130:8081")
  const host = Constants.expoConfig?.hostUri
    ?? Constants.manifest?.debuggerHost
    ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (host) {
    // Strip the port from the host and append backend port 5000
    const ip = host.split(':')[0];
    return `http://${ip}:5000/api`;
  }

  // Fallback for web browser (localhost)
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseURL();

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default instance;