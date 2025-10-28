import React, { useState, useEffect } from "react";

const FontSizeController = () => {
  const [fontSize, setFontSize] = useState(14);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kiểm tra admin status
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);

    // Load saved font size from localStorage
    const savedFontSize = localStorage.getItem("tableFontSize");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      applyFontSize(parseInt(savedFontSize));
    }

    // Lắng nghe sự kiện từ nút trong Header
    const handleToggleFromHeader = () => {
      setIsVisible(!isVisible);
    };

    // Lắng nghe click outside để đóng panel
    const handleClickOutside = (event) => {
      const panel = document.querySelector('[data-font-size-panel]');
      const toggleButton = document.querySelector('[data-font-size-toggle]');
      
      if (panel && !panel.contains(event.target) && 
          toggleButton && !toggleButton.contains(event.target)) {
        setIsVisible(false);
      }
    };

    // Thêm event listeners
    document.addEventListener('toggleFontSize', handleToggleFromHeader);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('toggleFontSize', handleToggleFromHeader);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  const applyFontSize = (size) => {
    // Apply font size to all table elements
    const style = document.createElement('style');
    style.id = 'dynamic-font-size';
    
    // Remove existing dynamic font size style
    const existingStyle = document.getElementById('dynamic-font-size');
    if (existingStyle) {
      existingStyle.remove();
    }

    style.textContent = `
      .enhanced-table td {
        font-size: ${size}px !important;
      }
      .enhanced-table thead th {
        font-size: ${size}px !important;
      }
      .enhanced-table th {
        font-size: ${size}px !important;
      }
      table th {
        font-size: ${size}px !important;
      }
      table td {
        font-size: ${size}px !important;
      }
    `;
    
    document.head.appendChild(style);
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem("tableFontSize", newSize.toString());
    applyFontSize(newSize);
  };

  const resetFontSize = () => {
    setFontSize(14);
    localStorage.setItem("tableFontSize", "14");
    applyFontSize(14);
  };

  // Chỉ render component khi admin đã đăng nhập
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Nút toggle để hiện/ẩn panel - ẩn vì đã có nút trong Header */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        data-font-size-toggle
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
          zIndex: 1001,
          display: "none", // Ẩn nút này vì đã có nút trong Header
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 16px rgba(0,123,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
        }}
        title="Chỉnh cỡ chữ"
      >
        🔤
      </button>

      {/* Panel chỉnh cỡ chữ - chỉ hiện khi isVisible = true */}
      {isVisible && (
        <div 
          data-font-size-panel
          style={{
            position: "fixed",
            top: "60px",
            right: "20px",
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "2px solid #007bff",
            zIndex: 1000,
            minWidth: "200px",
            maxWidth: "250px"
          }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "16px" }}>🔤</span>
              <h4 style={{ 
                margin: 0, 
                color: "#007bff",
                fontSize: "16px",
                fontWeight: "bold"
              }}>
                Kích thước chữ
              </h4>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: "#dc3545",
                padding: "2px",
                borderRadius: "3px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8d7da";
                e.target.style.color = "#721c24";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none";
                e.target.style.color = "#dc3545";
              }}
              title="Đóng"
            >
              ✕
            </button>
          </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "#666",
          marginBottom: "5px"
        }}>
          Font Size: {fontSize}px
        </label>
        
        <input
          type="range"
          min="10"
          max="24"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "#e9ecef",
            outline: "none",
            cursor: "pointer"
          }}
        />
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#999",
          marginTop: "5px"
        }}>
          <span>10px</span>
          <span>24px</span>
        </div>
      </div>

      <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => handleFontSizeChange(12)}
          style={{
            padding: "6px 10px",
            background: fontSize === 12 ? "#007bff" : "#f8f9fa",
            color: fontSize === 12 ? "white" : "#007bff",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
        >
          Nhỏ
        </button>
        
        <button
          onClick={() => handleFontSizeChange(14)}
          style={{
            padding: "6px 10px",
            background: fontSize === 14 ? "#007bff" : "#f8f9fa",
            color: fontSize === 14 ? "white" : "#007bff",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
        >
          Vừa
        </button>
        
        <button
          onClick={() => handleFontSizeChange(16)}
          style={{
            padding: "6px 10px",
            background: fontSize === 16 ? "#007bff" : "#f8f9fa",
            color: fontSize === 16 ? "white" : "#007bff",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
        >
          Lớn
        </button>
        
        <button
          onClick={() => handleFontSizeChange(18)}
          style={{
            padding: "6px 10px",
            background: fontSize === 18 ? "#007bff" : "#f8f9fa",
            color: fontSize === 18 ? "white" : "#007bff",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
        >
          Rất lớn
        </button>
      </div>

      <button
        onClick={resetFontSize}
        style={{
          width: "100%",
          padding: "8px",
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "600",
          marginTop: "10px",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#5a6268";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#6c757d";
        }}
      >
        🔄 Reset về mặc định
      </button>
        </div>
      )}
    </>
  );
};

export default FontSizeController;
