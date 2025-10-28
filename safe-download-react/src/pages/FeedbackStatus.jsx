import React, { useState, useEffect } from "react";
import "../styles/table.css";

export default function FeedbackStatus() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [filter, setFilter] = useState({
    category: "all",
    status: "all"
  });

  useEffect(() => {
    loadReports();
    checkFeatureStatus();
    // Kiểm tra admin
    const token = localStorage.getItem("token");
    if (token) setIsAdmin(true);
  }, []);

  const checkFeatureStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin-info/public");
      const data = await response.json();
      setIsEnabled(data.enableFeedback !== undefined ? data.enableFeedback : true);
    } catch (error) {
      console.error("Error checking feature status:", error);
      setIsEnabled(true); // Default to enabled on error
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports/public");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          responseStatus: newStatus === "resolved" ? "fixed" : 
                        newStatus === "in_progress" ? "responded" : 
                        newStatus === "pending" ? "no_response" : "wont_fix"
        }),
      });

      if (response.ok) {
        alert("✅ Cập nhật trạng thái thành công!");
        loadReports();
      } else {
        alert("❌ Có lỗi khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      alert("❌ Có lỗi khi cập nhật!");
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "windows": return "🪟 Windows";
      case "office": return "📄 Office";
      case "tools": return "🔧 Tools";
      case "antivirus": return "🛡️ Antivirus";
      default: return "❓ Không rõ";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "broken_link": return "🔗 Link hỏng";
      case "version_update": return "🔄 Cập nhật phiên bản";
      case "general_feedback": return "💬 Phản hồi chung";
      default: return "❓ Không rõ";
    }
  };

  const getResponseStatusText = (status) => {
    switch (status) {
      case "no_response": return "⏳ Chưa phản hồi";
      case "responded": return "💬 Đã phản hồi";
      case "fixed": return "✅ Đã sửa";
      case "wont_fix": return "🚫 Không thể sửa";
      default: return "❓ Không rõ";
    }
  };

  const getResponseStatusColor = (status) => {
    switch (status) {
      case "no_response": return "#ffc107";
      case "responded": return "#17a2b8";
      case "fixed": return "#28a745";
      case "wont_fix": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter.category !== "all" && report.category !== filter.category) return false;
    if (filter.status !== "all" && (report.responseStatus || "no_response") !== filter.status) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>⏳ Đang tải dữ liệu...</h2>
      </div>
    );
  }

  // Admin always has access
  if (!isEnabled && !isAdmin) {
    return (
      <div style={{ padding: "20px 40px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#b84e00", textAlign: "center", marginBottom: "30px" }}>
          📊 TRẠNG THÁI PHẢN HỒI
        </h2>
        <div style={{
          background: "#fff3cd",
          border: "2px solid #ffc107",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          marginTop: "40px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🚫</div>
          <h3 style={{ color: "#856404", marginBottom: "15px" }}>
            Chức năng xem phản hồi hiện đang tạm thời ngưng hoạt động
          </h3>
          <p style={{ color: "#856404", fontSize: "16px", lineHeight: "1.6" }}>
            Admin đã tạm thời tắt chức năng này. Vui lòng quay lại sau hoặc liên hệ với admin để biết thêm chi tiết.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px" }}>
      <h2 style={{ color: "#b84e00", textAlign: "center", marginBottom: "30px" }}>
        📊 TRẠNG THÁI PHẢN HỒI
      </h2>

      {!isEnabled && isAdmin && (
        <div style={{
          background: "#fff3cd",
          border: "2px solid #ffc107",
          color: "#856404",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <div>
            <strong>Cảnh báo:</strong> Chức năng này đang bị TẮT cho người dùng thường. Chỉ admin mới có thể xem trang này.
            <div style={{ fontSize: "14px", marginTop: "5px" }}>
              Để bật lại, vào Admin Panel → Cấu hình hệ thống
            </div>
          </div>
        </div>
      )}

      {isAdmin && isEnabled && (
        <div style={{
          background: "#d1ecf1",
          border: "1px solid #bee5eb",
          color: "#0c5460",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>👨‍💼</span>
          <div>
            <strong>Chế độ Admin:</strong> Bạn có thể cập nhật trạng thái báo cáo trực tiếp bằng cách click vào các nút trạng thái.
            <div style={{ fontSize: "14px", marginTop: "5px" }}>
              ⏳ Chưa fix | 🔄 Đang fix | ✅ Đã fix xong
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        background: "#e3f2fd", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        border: "1px solid #bbdefb"
      }}>
        <h3 style={{ color: "#1976d2", margin: "0 0 15px 0" }}>
          💡 Thông tin về phản hồi
        </h3>
        <div style={{ color: "#1565c0", lineHeight: "1.6" }}>
          <p>📝 <strong>Báo cáo của bạn:</strong> Tất cả báo cáo và đề xuất của bạn sẽ được admin xem xét và phản hồi.</p>
          <p>⏰ <strong>Thời gian phản hồi:</strong> Admin sẽ phản hồi trong vòng 24-48 giờ.</p>
          <p>🔄 <strong>Cập nhật trạng thái:</strong> Trạng thái sẽ được cập nhật khi admin xử lý báo cáo của bạn.</p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Danh mục:</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="all">Tất cả</option>
            <option value="windows">🪟 Windows</option>
            <option value="office">📄 Office</option>
            <option value="tools">🔧 Tools</option>
            <option value="antivirus">🛡️ Antivirus</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Trạng thái:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
          >
            <option value="all">Tất cả</option>
            <option value="no_response">⏳ Chưa phản hồi</option>
            <option value="responded">💬 Đã phản hồi</option>
            <option value="fixed">✅ Đã sửa</option>
            <option value="wont_fix">🚫 Không thể sửa</option>
          </select>
        </div>
        <button
          onClick={loadReports}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Bảng báo cáo */}
      <div style={{ overflowX: "auto" }}>
        <table className="enhanced-table">
          <thead>
            <tr>
              <th style={thStyle}>Loại</th>
              <th style={thStyle}>Danh mục</th>
              <th style={thStyle}>Sản phẩm</th>
              <th style={thStyle}>Mô tả</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Phản hồi admin</th>
              <th style={thStyle}>Ngày tạo</th>
              {isAdmin && <th style={thStyle}>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id}>
                <td style={tdStyle}>
                  {getTypeText(report.reportType)}
                </td>
                <td style={tdStyle}>
                  {getCategoryText(report.category)}
                </td>
                <td style={tdStyle}>
                  <div>
                    <strong>{report.productName}</strong>
                    {report.version && <div><small>v{report.version}</small></div>}
                    {report.edition && <div><small>{report.edition}</small></div>}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>
                    {report.description}
                  </div>
                </td>
                <td style={tdStyle}>
                  {isAdmin ? (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => updateReportStatus(report._id, "pending")}
                        style={{
                          background: report.status === "pending" ? "#ffc107" : "#f8f9fa",
                          color: report.status === "pending" ? "#212529" : "#6c757d",
                          border: "1px solid #ffc107",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: report.status === "pending" ? "bold" : "normal"
                        }}
                      >
                        ⏳ Chưa fix
                      </button>
                      <button
                        onClick={() => updateReportStatus(report._id, "in_progress")}
                        style={{
                          background: report.status === "in_progress" ? "#17a2b8" : "#f8f9fa",
                          color: report.status === "in_progress" ? "white" : "#6c757d",
                          border: "1px solid #17a2b8",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: report.status === "in_progress" ? "bold" : "normal"
                        }}
                      >
                        🔄 Đang fix
                      </button>
                      <button
                        onClick={() => updateReportStatus(report._id, "resolved")}
                        style={{
                          background: report.status === "resolved" ? "#28a745" : "#f8f9fa",
                          color: report.status === "resolved" ? "white" : "#6c757d",
                          border: "1px solid #28a745",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: report.status === "resolved" ? "bold" : "normal"
                        }}
                      >
                        ✅ Đã fix xong
                      </button>
                    </div>
                  ) : (
                    <span style={{
                      background: getResponseStatusColor(report.responseStatus || "no_response"),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      {getResponseStatusText(report.responseStatus || "no_response")}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  {report.publicResponse ? (
                    <div style={{ 
                      background: "#f8f9fa", 
                      padding: "10px", 
                      borderRadius: "5px",
                      border: "1px solid #e9ecef",
                      maxWidth: "300px",
                      wordWrap: "break-word"
                    }}>
                      <div style={{ fontSize: "12px", color: "#6c757d", marginBottom: "5px" }}>
                        <strong>Phản hồi từ admin:</strong>
                      </div>
                      <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                        {report.publicResponse}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "#6c757d", fontStyle: "italic" }}>
                      Chưa có phản hồi
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  <small>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</small>
                </td>
                {isAdmin && (
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => window.open(`/admin-feedback?id=${report._id}`, '_blank')}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "11px"
                          }}
                        >
                          📝 Chi tiết
                        </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
          <h3>📭 Không có báo cáo nào</h3>
          <p>Thử thay đổi bộ lọc để xem thêm báo cáo.</p>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #e2e8f0",
  background: "#ffe08a",
  color: "#000",
  padding: "8px 12px",
  textAlign: "center",
  fontWeight: "bold",
  fontFamily: "Times New Roman, serif",
};

const tdStyle = {
  border: "1px solid #eee",
  padding: "8px 10px",
  verticalAlign: "top",
  fontWeight: "bold",
  fontFamily: "Times New Roman, serif",
};
