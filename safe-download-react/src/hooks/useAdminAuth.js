import { useState, useEffect } from 'react';

import { API_BASE_URL } from "../config/api";
export default function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Kiểm tra token với backend để xác thực quyền admin
        const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setIsAdmin(result.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
}
