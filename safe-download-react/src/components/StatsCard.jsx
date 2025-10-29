import React, { useState, useEffect } from 'react';

const StatsCard = () => {
  const [stats, setStats] = useState({
    totalSoftware: 0,
    brokenLinks: 0,
    safetyPercentage: 100,
    categoryBreakdown: {
      windows: 0,
      office: 0,
      tools: 0,
      antivirus: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('${API_BASE_URL}/stats');
      
      if (!response.ok) {
        throw new Error('Không thể tải thống kê');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Lỗi khi tải thống kê');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '16px' }}>Đang tải thống kê...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '16px' }}>❌ {error}</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      margin: '20px 0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        marginBottom: '12px',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        📊 Thống kê hệ thống
      </div>
      
      <div style={{ 
        fontSize: '16px', 
        lineHeight: '1.6',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
      }}>
        Hiện có <strong>{stats.totalSoftware}</strong> phần mềm sạch –{' '}
        <strong>{stats.brokenLinks}</strong> link lỗi –{' '}
        <strong>{stats.safetyPercentage}%</strong> an toàn ✅
      </div>
      
      <div style={{ 
        marginTop: '16px', 
        fontSize: '14px', 
        opacity: 0.9,
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <span>🪟 Windows: {stats.categoryBreakdown.windows}</span>
        <span>📄 Office: {stats.categoryBreakdown.office}</span>
        <span>🔧 Tools: {stats.categoryBreakdown.tools}</span>
        <span>🛡️ Antivirus: {stats.categoryBreakdown.antivirus}</span>
      </div>
    </div>
  );
};

export default StatsCard;
