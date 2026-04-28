import axios from 'axios';

// Replace '192.168.1.X' with your actual local IPv4 address.
// You can find your IP address by running `ipconfig` in your terminal.
// E.g. 'http://172.16.33.96:5000/api'
const BASE_URL = 'http://172.16.33.96:5000/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;