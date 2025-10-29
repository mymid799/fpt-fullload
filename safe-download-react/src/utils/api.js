/**
 * API Helper Functions
 * Cần Thơ Safe Download Portal
 */

import { API_BASE_URL, API_TIMEOUT } from '../config/api';

/**
 * Helper function để gọi API với config đầy đủ
 */
export const apiCall = async (endpoint, options = {}) => {
  // Tạo full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Thêm Authorization token nếu có
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  // Merge options
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...finalOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * API methods
 */
export const api = {
  /**
   * GET request
   */
  get: async (endpoint) => {
    const response = await apiCall(endpoint, { method: 'GET' });
    return response.json();
  },
  
  /**
   * POST request
   */
  post: async (endpoint, data) => {
    const response = await apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  /**
   * PUT request
   */
  put: async (endpoint, data) => {
    const response = await apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  /**
   * DELETE request
   */
  delete: async (endpoint) => {
    const response = await apiCall(endpoint, { method: 'DELETE' });
    return response.json();
  },
  
  /**
   * Upload file
   */
  upload: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData, // FormData tự set Content-Type
    });
    
    return response.json();
  }
};

/**
 * Error handler helper
 */
export const handleApiError = (error) => {
  if (error.message === 'Request timeout') {
    return 'Kết nối quá chậm. Vui lòng thử lại.';
  }
  
  if (error.message === 'Failed to fetch') {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
  }
  
  return error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};

