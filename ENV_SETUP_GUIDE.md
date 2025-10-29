# 📝 Hướng dẫn tạo file .env

## ⚠️ Quan trọng

File `.env` chứa thông tin nhạy cảm và đã được thêm vào `.gitignore`. 
**KHÔNG BAO GIỜ** commit file `.env` vào Git!

---

## 🔧 Backend: File `backend/.env`

Tạo file `backend/.env` với nội dung:

```env
# Server Configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

# MongoDB Atlas Connection
# Thay YOUR_CONNECTION_STRING bằng connection string thực tế
MONGODB_URI=mongodb+srv://safewed:safewed123@cluster0.nspa5o1.mongodb.net/safedownload

# Frontend URLs (CORS)
# Thêm tất cả địa chỉ có thể truy cập web (domain, IP LAN, localhost)
FRONTEND_URL=http://192.168.1.22:3000
CORS_ORIGINS=http://192.168.1.22:3000,http://localhost:3000,http://safe.cantho.gov.vn:3000

# Security
# ⚠️ THAY ĐỔI secret key này trước khi deploy production!
JWT_SECRET=cantho-safe-download-portal-secret-key-2024-minimum-32-chars
```

### 📌 Giải thích từng biến:

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `PORT` | Port backend chạy | `5000` |
| `HOST` | Bind address (0.0.0.0 = tất cả interfaces) | `0.0.0.0` |
| `NODE_ENV` | Môi trường chạy | `production` hoặc `development` |
| `MONGODB_URI` | Connection string MongoDB Atlas | `mongodb+srv://...` |
| `FRONTEND_URL` | URL frontend chính | `http://192.168.1.22:3000` |
| `CORS_ORIGINS` | Danh sách origins cho phép (phân cách bằng dấu phẩy) | Nhiều URL |
| `JWT_SECRET` | Secret key cho JWT authentication | Chuỗi ngẫu nhiên dài |

### 🔍 Cách lấy MONGODB_URI:

1. Vào [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Connect** → **Connect your application**
3. Copy connection string
4. Thay `<password>` bằng password thực tế

---

## 🎨 Frontend: File `safe-download-react/.env`

Tạo file `safe-download-react/.env` với nội dung:

```env
# API Configuration
# Để trống để tự động detect, hoặc set cụ thể nếu cần:
VITE_API_BASE_URL=

# ⚠️ Nếu muốn force một địa chỉ cố định, uncomment và sửa:
# VITE_API_BASE_URL=http://192.168.1.22:5000/api

# App Information
VITE_APP_NAME=Safe Download Portal - Cần Thơ
VITE_APP_TITLE=Cổng tải xuống an toàn
VITE_ORG_NAME=UBND Thành phố Cần Thơ
VITE_ORG_ADDRESS=Số 2 Hòa Bình, Ninh Kiều, Cần Thơ
VITE_ORG_HOTLINE=0292.3812.785
VITE_ORG_EMAIL=ubnd@cantho.gov.vn

# API Timeout (milliseconds)
VITE_API_TIMEOUT=30000
```

### 📌 Giải thích:

| Biến | Mô tả | Ghi chú |
|------|-------|---------|
| `VITE_API_BASE_URL` | Base URL của API | **Để trống** để tự động detect |
| `VITE_APP_NAME` | Tên ứng dụng | Hiển thị trên UI |
| `VITE_ORG_NAME` | Tên tổ chức | Thông tin footer |
| `VITE_ORG_ADDRESS` | Địa chỉ tổ chức | |
| `VITE_ORG_HOTLINE` | Hotline hỗ trợ | |
| `VITE_ORG_EMAIL` | Email liên hệ | |
| `VITE_API_TIMEOUT` | Timeout cho API calls (ms) | Mặc định 30 giây |

### 💡 Auto-detect hoạt động như thế nào?

Khi `VITE_API_BASE_URL` để trống, hệ thống tự động:

```
Người dùng truy cập: http://192.168.1.22:3000
→ API sẽ là: http://192.168.1.22:5000/api

Người dùng truy cập: http://safe.cantho.gov.vn:3000
→ API sẽ là: http://safe.cantho.gov.vn:5000/api
```

---

## 🚀 Quick Start

### Bước 1: Tạo 2 file .env

```bash
# Backend
notepad backend\.env
# Paste nội dung từ trên

# Frontend
notepad safe-download-react\.env
# Paste nội dung từ trên
```

### Bước 2: Sửa thông tin

- Thay `192.168.1.22` bằng **IP thực tế** của server
- Sửa MongoDB connection string
- Sửa thông tin tổ chức (nếu cần)

### Bước 3: Khởi động

```bash
# Dùng script tự động
start-network.bat
```

### Bước 4: Test

Từ máy khác trong mạng, truy cập:
```
http://YOUR_IP:3000
```

---

## ✅ Checklist

- [ ] Đã tạo file `backend/.env`
- [ ] Đã tạo file `safe-download-react/.env`
- [ ] Đã sửa IP trong `CORS_ORIGINS` (backend)
- [ ] Đã test MongoDB connection: `node backend/test-mongo.js`
- [ ] Đã mở firewall port 3000 và 5000
- [ ] Đã test truy cập từ máy khác

---

## 🔒 Bảo mật

### ⚠️ QUAN TRỌNG:

1. **KHÔNG commit .env vào Git**
   ```bash
   # File .gitignore đã có:
   .env
   .env.local
   ```

2. **Thay đổi JWT_SECRET**
   - Tạo secret key ngẫu nhiên dài ít nhất 32 ký tự
   - Có thể dùng: https://randomkeygen.com/

3. **Whitelist IP trong MongoDB**
   - Vào MongoDB Atlas
   - Network Access → Add IP Address
   - Thêm IP server của bạn

4. **Sao lưu .env**
   - Lưu file .env ở nơi an toàn
   - Không gửi qua email/chat công khai
   - Team mới cần copy từ .env.example và điền thông tin

---

## 📞 Cần hỗ trợ?

Nếu gặp vấn đề, check:

1. **Lỗi kết nối MongoDB:**
   ```bash
   cd backend
   node test-mongo.js
   ```

2. **Lỗi CORS:**
   - Kiểm tra `CORS_ORIGINS` có đúng địa chỉ không
   - Restart backend sau khi sửa .env

3. **Frontend không kết nối Backend:**
   - Kiểm tra backend đang chạy: http://localhost:5000
   - Check Console trong browser
   - Đọc `NETWORK_DEPLOYMENT.md` để troubleshooting

---

**🎉 Setup hoàn tất! Tiếp theo đọc `NETWORK_DEPLOYMENT.md` để triển khai.**

