import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export default function ColumnManager({ 
  columns, 
  setColumns, 
  data, 
  setData, 
  isAdmin,
  category,
  isLoading = false
}) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  
  // No longer need bit options - URL columns will use database mechanism like fshare, drive, oneDrive

  // Thêm cột mới - Optimized version
  const addColumn = async () => {
    if (!newColumnName.trim()) return;
    
    setIsAddingColumn(true);
    
    try {
      // Tạo key duy nhất bằng cách thêm timestamp
      const baseKey = newColumnName.toLowerCase().replace(/\s+/g, '_');
      const newKey = `${baseKey}_${Date.now()}`;
      const newColumn = {
        key: newKey,
        label: newColumnName,
        type: newColumnType
      };
      
      const updatedColumns = [...columns, newColumn];
      const token = localStorage.getItem("token");
      
      // Step 1: Add column to actual data in database
      const addColumnResponse = await fetch(`${API_BASE_URL}/admin/columns/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          columnKey: newKey,
          columnType: newColumnType
        }),
      });

      if (!addColumnResponse.ok) {
        let addResult;
        try {
          addResult = await addColumnResponse.json();
        } catch (parseError) {
          console.error("Failed to parse add column response:", parseError);
          throw new Error(`Server error: ${addColumnResponse.status} ${addColumnResponse.statusText}`);
        }
        throw new Error(addResult.message || "Failed to add column to database");
      }

      // Step 2: Save column configuration
      console.log("💾 Saving column config:", { category, columns: updatedColumns });
      const saveConfigResponse = await fetch(`${API_BASE_URL}/column-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          columns: updatedColumns
        }),
      });

      if (!saveConfigResponse.ok) {
        let saveResult;
        try {
          saveResult = await saveConfigResponse.json();
          console.error("❌ Save config error:", saveResult);
        } catch (parseError) {
          console.error("Failed to parse save config response:", parseError);
          throw new Error(`Server error: ${saveConfigResponse.status} ${saveConfigResponse.statusText}`);
        }
        throw new Error(saveResult.message || "Failed to save column configuration");
      }

      const saveResult = await saveConfigResponse.json();
      console.log("✅ Column config saved successfully:", saveResult);

      // Step 3: Update local state and reload data
      setColumns(updatedColumns);
      
      // Reload data to get the new column from database
      const dataResponse = await fetch(`${API_BASE_URL}/${category}`);
      if (dataResponse.ok) {
        const freshData = await dataResponse.json();
        setData(freshData);
      } else {
        // Fallback: update local data with new column
        const updatedData = data.map(item => {
          const newItem = { ...item };
          if (newColumnType === 'url') {
            // For URL columns, add the 32bit, 64bit, Common, and Show fields
            newItem[`${newKey}32`] = "";
            newItem[`${newKey}64`] = "";
            newItem[`${newKey}Common`] = "";
            newItem[`${newKey}Show`] = "both";
          } else {
            newItem[newKey] = newColumnType === 'number' ? 0 : "";
          }
          return newItem;
        });
        setData(updatedData);
      }

      // Save to localStorage as backup
      const configKey = `column_config_${category}`;
      const configData = {
        category,
        columns: updatedColumns,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(configKey, JSON.stringify(configData));
      
      console.log("✅ Column added successfully");
      alert("✅ Cột mới đã được thêm thành công!");
      
    } catch (error) {
      console.error("❌ Error adding column:", error);
      alert(`❌ Lỗi khi thêm cột: ${error.message}`);
    } finally {
      setIsAddingColumn(false);
      setNewColumnName("");
      setNewColumnType("text");
      setShowColumnModal(false);
    }
  };

  // Xóa cột - Optimized version
  const _deleteColumn = async (columnKey) => {
    // Cho phép xóa cột cuối cùng vì đây là bảng động giống Excel
    
    if (!confirm(`Bạn có chắc chắn muốn xóa cột "${columnKey}"? Hành động này không thể hoàn tác.`)) {
      return;
    }
    
    setIsAddingColumn(true);
    
    try {
      const updatedColumns = columns.filter(col => col.key !== columnKey);
      const token = localStorage.getItem("token");
      
      // Step 1: Delete column from actual data in database
      // For URL columns, we need to delete the 32bit, 64bit, and Show fields
      const columnToDelete = columns.find(col => col.key === columnKey);
      const isUrlColumn = columnToDelete && columnToDelete.type === 'url';
      
      const deleteResponse = await fetch(`${API_BASE_URL}/admin/columns/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          columnKey,
          isUrlColumn,
          urlFields: isUrlColumn ? [`${columnKey}32`, `${columnKey}64`, `${columnKey}Common`, `${columnKey}Show`] : undefined
        }),
      });

      if (!deleteResponse.ok) {
        const deleteResult = await deleteResponse.json();
        throw new Error(deleteResult.message || "Failed to delete column from database");
      }

      // Step 2: Save updated column configuration
      const saveConfigResponse = await fetch(`${API_BASE_URL}/column-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          columns: updatedColumns
        }),
      });

      if (!saveConfigResponse.ok) {
        const saveResult = await saveConfigResponse.json();
        throw new Error(saveResult.message || "Failed to save column configuration");
      }

      // Step 3: Update local state and reload data
      setColumns(updatedColumns);
      
      // Reload data to ensure column is completely removed
      const dataResponse = await fetch(`${API_BASE_URL}/${category}`);
      if (dataResponse.ok) {
        const freshData = await dataResponse.json();
        setData(freshData);
      } else {
        // Fallback: update local data by removing the column
        const updatedData = data.map(item => {
          const newItem = { ...item };
          delete newItem[columnKey];
          
          // For URL columns, also remove the 32bit, 64bit, Common, and Show fields
          if (isUrlColumn) {
            delete newItem[`${columnKey}32`];
            delete newItem[`${columnKey}64`];
            delete newItem[`${columnKey}Common`];
            delete newItem[`${columnKey}Show`];
          }
          
          return newItem;
        });
        setData(updatedData);
      }

      // Save to localStorage as backup
      const configKey = `column_config_${category}`;
      const configData = {
        category,
        columns: updatedColumns,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(configKey, JSON.stringify(configData));
      
      console.log("✅ Column deleted successfully");
      alert("✅ Cột đã được xóa thành công!");
      
    } catch (error) {
      console.error("❌ Error deleting column:", error);
      alert(`❌ Lỗi khi xóa cột: ${error.message}`);
    } finally {
      setIsAddingColumn(false);
    }
  };

  // Handle column type change
  const handleColumnTypeChange = (type) => {
    setNewColumnType(type);
  };

  return (
    <>
      {/* Nút thêm cột */}
      {isAdmin && (
        <button 
          onClick={() => setShowColumnModal(true)}
          disabled={isLoading}
          style={{
            padding: "8px 16px",
            background: isLoading ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginRight: "10px",
            opacity: isLoading ? 0.6 : 1
          }}
        >
           {(isAddingColumn || isLoading) ? "⏳ Đang xử lý..." : "➕ Thêm cột"}
        </button>
      )}

      {/* Modal thêm cột */}
      {showColumnModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 300,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: 15 }}>
              ➕ Thêm cột mới
            </h3>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Tên cột:</label>
              <input
                type="text"
                placeholder="Nhập tên cột"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Loại dữ liệu:</label>
              <select
                value={newColumnType}
                onChange={(e) => handleColumnTypeChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="url">URL</option>
              </select>
            </div>
            
            {/* URL columns will automatically use database mechanism like fshare, drive, oneDrive */}
            
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={addColumn}
                disabled={isAddingColumn || isLoading}
                style={{
                  flex: 1,
                  padding: 8,
                  background: (isAddingColumn || isLoading) ? "#6c757d" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: (isAddingColumn || isLoading) ? "not-allowed" : "pointer",
                  opacity: (isAddingColumn || isLoading) ? 0.6 : 1
                }}
              >
                 {(isAddingColumn || isLoading) ? "⏳ Đang thêm..." : "Thêm cột"}
              </button>
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  setNewColumnName("");
                  setNewColumnType("text");
                }}
                style={{
                  flex: 1,
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  background: "#fafafa",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Export delete function for use in other components
export const deleteColumn = async (columnKey, { columns, setColumns, data, setData, category }) => {
  // Cho phép xóa cột cuối cùng vì đây là bảng động giống Excel
  
  if (!confirm(`Bạn có chắc chắn muốn xóa cột "${columnKey}"? Hành động này không thể hoàn tác.`)) {
    return;
  }
  
  try {
    const updatedColumns = columns.filter(col => col.key !== columnKey);
    const token = localStorage.getItem("token");
    
    // Step 1: Delete column from actual data in database
    // For URL columns, we need to delete the 32bit, 64bit, and Show fields
    const columnToDelete = columns.find(col => col.key === columnKey);
    const isUrlColumn = columnToDelete && columnToDelete.type === 'url';
    
    const deleteResponse = await fetch(`${API_BASE_URL}/admin/columns/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
          category,
          columnKey,
          isUrlColumn,
          urlFields: isUrlColumn ? [`${columnKey}32`, `${columnKey}64`, `${columnKey}Common`, `${columnKey}Show`] : undefined
        }),
    });

    if (!deleteResponse.ok) {
      let deleteResult;
      try {
        deleteResult = await deleteResponse.json();
      } catch (parseError) {
        console.error("Failed to parse delete response:", parseError);
        throw new Error(`Server error: ${deleteResponse.status} ${deleteResponse.statusText}`);
      }
      throw new Error(deleteResult.message || "Failed to delete column from database");
    }

    // Step 2: Save updated column configuration
    const saveConfigResponse = await fetch(`${API_BASE_URL}/column-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        columns: updatedColumns
      }),
    });

    if (!saveConfigResponse.ok) {
      let saveResult;
      try {
        saveResult = await saveConfigResponse.json();
      } catch (parseError) {
        console.error("Failed to parse save response:", parseError);
        throw new Error(`Server error: ${saveConfigResponse.status} ${saveConfigResponse.statusText}`);
      }
      throw new Error(saveResult.message || "Failed to save column configuration");
    }

    // Step 3: Update local state and reload data
    setColumns(updatedColumns);
    
    // Reload data to ensure column is completely removed
    const dataResponse = await fetch(`${API_BASE_URL}/${category}`);
    if (dataResponse.ok) {
      const freshData = await dataResponse.json();
      setData(freshData);
    } else {
      // Fallback: update local data by removing the column
      const updatedData = data.map(item => {
        const newItem = { ...item };
        delete newItem[columnKey];
        
        // For URL columns, also remove the 32bit, 64bit, Common, and Show fields
        if (isUrlColumn) {
          delete newItem[`${columnKey}32`];
          delete newItem[`${columnKey}64`];
          delete newItem[`${columnKey}Common`];
          delete newItem[`${columnKey}Show`];
        }
        
        return newItem;
      });
      setData(updatedData);
    }

    // Save to localStorage as backup
    const configKey = `column_config_${category}`;
    const configData = {
      category,
      columns: updatedColumns,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(configKey, JSON.stringify(configData));
    
    console.log("✅ Column deleted successfully");
    alert("✅ Cột đã được xóa thành công!");
    
  } catch (error) {
    console.error("❌ Error deleting column:", error);
    alert(`❌ Lỗi khi xóa cột: ${error.message}`);
  }
};

// Component để render header với 2 nút riêng biệt
export function ColumnHeader({ column, onDelete, onEdit, isAdmin, isLoading, headerStyle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(column.label);

  // Reset editValue when column.label changes
  useEffect(() => {
    setEditValue(column.label);
  }, [column.label]);

  const handleEdit = () => {
    if (isEditing && editValue.trim() && editValue !== column.label) {
      onEdit(column.key, editValue.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditValue(column.label);
      setIsEditing(false);
    }
  };

  return (
    <th className="column-header" style={{ position: 'relative', ...headerStyle }}>
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleEdit}
          autoFocus
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '2px solid #007bff',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            outline: 'none',
            background: '#fff'
          }}
        />
      ) : (
        <span style={{ display: 'block', textAlign: 'center' }}>
          {column.label}
        </span>
      )}
      
      {isAdmin && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          right: '8px', 
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}>
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="column-edit-btn"
            title={isEditing ? "Lưu thay đổi" : "Chỉnh sửa tên cột"}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              background: isEditing ? '#28a745' : '#007bff',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.5 : 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              flexShrink: 0,
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.background = isEditing ? '#218838' : '#0056b3';
                e.target.style.transform = 'scale(1.1)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = isEditing ? '#28a745' : '#007bff';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isEditing ? '✓' : '✏️'}
          </button>
          
          <button
            onClick={() => onDelete(column.key)}
            disabled={isLoading}
            className="column-delete-btn"
            title={isLoading ? "Đang xử lý..." : "Xóa cột"}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              background: '#dc3545',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.5 : 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              flexShrink: 0,
              position: 'relative'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.background = '#c82333';
                e.target.style.transform = 'scale(1.1)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isLoading ? "⏳" : "✕"}
          </button>
        </div>
      )}
    </th>
  );
}
