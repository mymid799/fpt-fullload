/**
 * API Configuration - Tự động detect môi trường
 * Cần Thơ Safe Download Portal
 */

// Tự động lấy API Base URL
const getApiBaseUrl = () => {
  // 1. Ưu tiên env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // 3. Tự động detect từ hostname
  const hostname = window.location.hostname;
  
  // Cần Thơ Gov domain
  if (hostname === 'safe.cantho.gov.vn') {
    return 'http://safe.cantho.gov.vn:5000/api';
  }
  
  // Localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Network IP
  return `http://${hostname}:5000/api`;
};

// Export API configuration
export const API_BASE_URL = getApiBaseUrl();
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// App configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Safe Download Portal',
  title: import.meta.env.VITE_APP_TITLE || 'Cổng tải xuống an toàn',
  organization: {
    name: import.meta.env.VITE_ORG_NAME || 'UBND Thành phố Cần Thơ',
    address: import.meta.env.VITE_ORG_ADDRESS || 'Số 2 Hòa Bình, Ninh Kiều, Cần Thơ',
    hotline: import.meta.env.VITE_ORG_HOTLINE || '0292.3812.785',
    email: import.meta.env.VITE_ORG_EMAIL || 'ubnd@cantho.gov.vn'
  }
};

// Log configuration (chỉ trong development)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    environment: import.meta.env.MODE
  });
}

