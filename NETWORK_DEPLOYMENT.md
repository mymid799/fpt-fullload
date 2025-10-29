# 🌐 Hướng dẫn Triển khai trên Mạng LAN/Internet

## 📋 Tổng quan

Sau khi hoàn thành cấu hình, web của bạn sẽ:
- ✅ Tự động detect địa chỉ IP/domain
- ✅ Hoạt động trên LAN (192.168.x.x)
- ✅ Hoạt động trên Internet (qua NAT)
- ✅ Không cần hardcode localhost

---

## 🎯 Bước 1: Tạo file .env

### Backend (.env trong folder backend/)

```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://safewed:safewed123@cluster0.nspa5o1.mongodb.net/safedownload

# Frontend URLs (CORS) - Thêm tất cả địa chỉ có thể truy cập
FRONTEND_URL=http://192.168.1.22:3000
CORS_ORIGINS=http://192.168.1.22:3000,http://localhost:3000,http://safe.cantho.gov.vn:3000

# Security
JWT_SECRET=cantho-safe-download-portal-secret-key-2024
```

### Frontend (.env trong folder safe-download-react/)

```env
# Để trống để tự động detect, hoặc set cụ thể nếu cần:
VITE_API_BASE_URL=

# App Information
VITE_APP_NAME=Safe Download Portal - Cần Thơ
VITE_ORG_NAME=UBND Thành phố Cần Thơ
VITE_ORG_ADDRESS=Số 2 Hòa Bình, Ninh Kiều, Cần Thơ
VITE_ORG_HOTLINE=0292.3812.785
VITE_ORG_EMAIL=ubnd@cantho.gov.vn
```

> **💡 Tip:** File `.env` trong frontend có thể để trống `VITE_API_BASE_URL`, 
> hệ thống sẽ tự động detect dựa vào hostname người dùng đang truy cập.

---

## 🚀 Bước 2: Khởi động Servers

### Option 1: Dùng Script (Khuyến nghị)

Double-click file:
```
start-network.bat
```

Script này sẽ:
- ✅ Khởi động Backend (0.0.0.0:5000)
- ✅ Khởi động Frontend (0.0.0.0:3000)
- ✅ Tự động bind tất cả network interfaces

### Option 2: Thủ công

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd safe-download-react
npm run dev -- --host 0.0.0.0 --port 3000
```

> **⚠️ Quan trọng:** Phải có `--host 0.0.0.0` để lắng nghe trên tất cả network interfaces!

---

## 🔧 Bước 3: Cấu hình Firewall (Windows)

Mở Windows Firewall để cho phép truy cập từ bên ngoài:

### PowerShell (Run as Administrator):

```powershell
# Cho phép port 3000 (Frontend)
New-NetFirewallRule -DisplayName "Safe Download Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Cho phép port 5000 (Backend API)
New-NetFirewallRule -DisplayName "Safe Download Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

### Hoặc qua GUI:

1. Mở **Windows Defender Firewall** → **Advanced Settings**
2. Click **Inbound Rules** → **New Rule**
3. Chọn **Port** → **TCP** → Nhập `3000` và `5000`
4. Chọn **Allow the connection**
5. Áp dụng cho **Domain, Private, Public**
6. Đặt tên: "Safe Download Portal"

---

## 🌍 Bước 4: Tìm địa chỉ IP của Server

### Windows:

```cmd
ipconfig
```

Tìm dòng **IPv4 Address**, ví dụ: `192.168.1.22`

### Hoặc dùng PowerShell:

```powershell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
```

---

## 🧪 Bước 5: Test kết nối

### Test từ máy Server (local):

```
http://localhost:3000
http://localhost:5000/api/admin-info/public
```

### Test từ máy khác trong LAN:

```
http://192.168.1.22:3000
http://192.168.1.22:5000/api/admin-info/public
```

**Thay `192.168.1.22` bằng IP thực tế của server**

### Test bằng curl:

```bash
curl http://192.168.1.22:5000/api/admin-info/public
```

---

## 🌐 Bước 6: NAT ra Internet (Optional)

Nếu muốn truy cập từ Internet:

### 1. Cấu hình Router (Port Forwarding)

Login vào Router và forward:
- **External Port 3000** → **Internal IP:3000** (Frontend)
- **External Port 5000** → **Internal IP:5000** (Backend)

### 2. Cấu hình DNS

Nếu có domain (ví dụ: `safe.cantho.gov.vn`):
- Tạo **A Record** trỏ về **Public IP** của bạn
- Update `CORS_ORIGINS` trong backend/.env

### 3. Whitelist IP trong MongoDB Atlas

1. Vào MongoDB Atlas Dashboard
2. **Network Access** → **Add IP Address**
3. Thêm **Public IP** của server
4. Hoặc chọn **Allow Access from Anywhere** (0.0.0.0/0) - ít an toàn hơn

---

## ✅ Cách hoạt động Auto-detect

File `safe-download-react/src/config/api.js` đã được cấu hình:

```javascript
const getApiBaseUrl = () => {
  // 1. Ưu tiên env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Tự động detect từ hostname
  const hostname = window.location.hostname;
  
  // Domain chính thức
  if (hostname === 'safe.cantho.gov.vn') {
    return 'http://safe.cantho.gov.vn:5000/api';
  }
  
  // Localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Tự động dùng IP hiện tại
  return `http://${hostname}:5000/api`;
};
```

**Ví dụ:**
- Truy cập `http://192.168.1.22:3000` → API sẽ là `http://192.168.1.22:5000/api`
- Truy cập `http://safe.cantho.gov.vn:3000` → API sẽ là `http://safe.cantho.gov.vn:5000/api`
- Truy cập `http://localhost:3000` → API sẽ là `http://localhost:5000/api`

---

## 📱 Test Cases

| Vị trí truy cập | URL | Kết quả mong đợi |
|----------------|-----|------------------|
| Máy server | http://localhost:3000 | ✅ OK |
| Máy khác (LAN) | http://192.168.1.22:3000 | ✅ OK |
| Điện thoại (WiFi cùng mạng) | http://192.168.1.22:3000 | ✅ OK |
| Từ Internet (sau NAT) | http://safe.cantho.gov.vn:3000 | ✅ OK |
| Máy khác (LAN) - API | http://192.168.1.22:5000/api/reports/public | ✅ OK |

---

## 🔍 Troubleshooting

### ❌ Lỗi: "ERR_CONNECTION_REFUSED"

**Nguyên nhân:**
- Backend chưa chạy
- Firewall chặn port
- Frontend đang gọi sai địa chỉ

**Giải pháp:**
1. Kiểm tra backend đang chạy:
   ```bash
   netstat -an | findstr "5000"
   ```
2. Kiểm tra firewall đã mở port
3. Xem Console log để biết frontend đang gọi API nào

### ❌ Lỗi: "CORS Error"

**Nguyên nhân:**
- Domain/IP chưa được thêm vào `CORS_ORIGINS`

**Giải pháp:**
Update `backend/.env`:
```env
CORS_ORIGINS=http://192.168.1.22:3000,http://localhost:3000,http://safe.cantho.gov.vn:3000
```
Restart backend.

### ❌ Lỗi: "Cannot connect to MongoDB"

**Nguyên nhân:**
- IP chưa được whitelist trong MongoDB Atlas
- Network bị chặn

**Giải pháp:**
1. Vào MongoDB Atlas → Network Access
2. Add IP Address → Thêm Public IP của server
3. Hoặc test bằng: `node backend/test-mongo.js`

---

## 📦 Build Production (Optional)

Nếu muốn deploy production thật sự (không dùng dev mode):

### Frontend:

```bash
cd safe-download-react
npm run build
```

Serve bằng static server:
```bash
npm install -g serve
serve -s dist -l 3000
```

### Backend:

Backend đã sẵn sàng cho production, chỉ cần:
```bash
cd backend
npm start
```

### Dùng PM2 (Process Manager):

```bash
npm install -g pm2

# Backend
cd backend
pm2 start server.js --name "safe-backend"

# Frontend (after build)
cd ../safe-download-react
pm2 serve dist 3000 --spa --name "safe-frontend"

# Save
pm2 save
pm2 startup
```

---

## 📞 Hỗ trợ

**Tổ chức:** UBND Thành phố Cần Thơ  
**Địa chỉ:** Số 2 Hòa Bình, Ninh Kiều, Cần Thơ  
**Hotline:** 0292.3812.785  
**Email:** ubnd@cantho.gov.vn  

---

## ✨ Tóm tắt

1. ✅ Tạo file `.env` (backend + frontend)
2. ✅ Chạy `start-network.bat`
3. ✅ Mở firewall port 3000 và 5000
4. ✅ Tìm IP server: `ipconfig`
5. ✅ Test: `http://YOUR_IP:3000` từ máy khác
6. ✅ (Optional) NAT ra Internet + cấu hình DNS

**🎉 Hoàn tất! Web của bạn đã sẵn sàng cho mọi người truy cập!**

