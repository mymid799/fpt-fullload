# 🚀 Hướng dẫn Triển khai - Safe Download Portal Cần Thơ

## 📋 Tổng quan

Hệ thống đã được cấu hình để sử dụng:
- **Database:** MongoDB Atlas (Cloud)
- **Domain:** http://safe.cantho.gov.vn:3000
- **Backend Port:** 5000
- **Frontend Port:** 3000

---

## ✅ Các file đã được tạo

### Backend:
- ✅ `backend/.env` - Cấu hình môi trường (MongoDB Atlas, CORS, JWT)
- ✅ `backend/.env.example` - Template cho team
- ✅ `backend/server.js` - Đã cập nhật sử dụng environment variables
- ✅ `backend/test-mongo.js` - Script test kết nối MongoDB

### Frontend:
- ✅ `safe-download-react/.env` - Cấu hình API và thông tin tổ chức
- ✅ `safe-download-react/.env.example` - Template
- ✅ `safe-download-react/src/config/api.js` - API configuration tự động
- ✅ `safe-download-react/src/utils/api.js` - API helper functions

### Scripts:
- ✅ `start-production.bat` - Khởi động cả Backend + Frontend
- ✅ `.gitignore` - Bảo vệ file .env khỏi bị commit

---

## 🔧 Cấu hình hiện tại

### Backend (.env):
```env
PORT=5000
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://safewed:***@cluster0.nspa5o1.mongodb.net/safedownload
FRONTEND_URL=http://safe.cantho.gov.vn:3000
CORS_ORIGINS=http://safe.cantho.gov.vn:3000,http://localhost:3000,http://192.168.1.22:3000
```

### Frontend (.env):
```env
VITE_API_BASE_URL=http://safe.cantho.gov.vn:5000/api
VITE_APP_NAME=Safe Download Portal - Cần Thơ
VITE_ORG_NAME=UBND Thành phố Cần Thơ
```

---

## 🚀 Cách khởi động

### Option 1: Dùng Script tự động (Khuyến nghị)

```bash
# Chỉ cần double-click file này
start-production.bat
```

### Option 2: Khởi động thủ công

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

---

## 🧪 Test kết nối MongoDB

```bash
cd backend
node test-mongo.js
```

Kết quả mong đợi:
```
✅ Connected successfully to MongoDB Atlas!
📊 Connection Details:
   - Database: safedownload
   - Host: ac-7mqr63p-shard-00-01.nspa5o1.mongodb.net
   - ReadyState: Connected
```

---

## 🌐 Truy cập hệ thống

### Development (Local):
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/api

### Production (Network):
- **Frontend:** http://safe.cantho.gov.vn:3000
- **Backend:** http://safe.cantho.gov.vn:5000
- **API:** http://safe.cantho.gov.vn:5000/api

### Test API:
```bash
# Test admin info
curl http://safe.cantho.gov.vn:5000/api/admin-info/public

# Test reports
curl http://safe.cantho.gov.vn:5000/api/reports/public
```

---

## 🔒 Bảo mật

### ⚠️ QUAN TRỌNG:

1. **KHÔNG BAO GIỜ commit file `.env` vào Git**
   ```bash
   # Kiểm tra .env có bị track không
   git status
   
   # Nếu đã commit nhầm
   git rm --cached backend/.env
   git rm --cached safe-download-react/.env
   ```

2. **Thay đổi JWT_SECRET trước khi deploy production**
   ```env
   JWT_SECRET=your-super-secret-key-minimum-32-characters-long
   ```

3. **Whitelist IP trong MongoDB Atlas**
   - Vào MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Thêm IP server của bạn

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to MongoDB"

**Giải pháp:**
1. Kiểm tra MONGODB_URI trong `.env`
2. Whitelist IP trong MongoDB Atlas
3. Kiểm tra network connection
4. Chạy test: `node backend/test-mongo.js`

### Lỗi: "CORS error"

**Giải pháp:**
1. Kiểm tra CORS_ORIGINS trong `backend/.env`
2. Thêm domain vào danh sách cho phép:
   ```env
   CORS_ORIGINS=http://safe.cantho.gov.vn:3000,http://localhost:3000
   ```

### Lỗi: "Cannot GET /api/..."

**Giải pháp:**
1. Đảm bảo backend đang chạy
2. Kiểm tra VITE_API_BASE_URL trong `safe-download-react/.env`
3. Clear browser cache

### Frontend không kết nối được Backend

**Giải pháp:**
1. Kiểm tra backend đang chạy: http://localhost:5000
2. Kiểm tra file `safe-download-react/.env`:
   ```env
   VITE_API_BASE_URL=http://safe.cantho.gov.vn:5000/api
   ```
3. Restart frontend sau khi sửa .env

---

## 📦 Cài đặt Dependencies

### Lần đầu tiên:

```bash
# Backend
cd backend
npm install

# Frontend
cd safe-download-react
npm install
```

### Các packages quan trọng:

**Backend:**
- `dotenv` - Environment variables
- `mongoose` - MongoDB ODM
- `cors` - Cross-Origin Resource Sharing
- `express` - Web framework

**Frontend:**
- `vite` - Build tool
- `react` - UI library

---

## 🔄 Update code lên GitHub

```bash
# 1. Kiểm tra status
git status

# 2. Add files (KHÔNG add .env)
git add .

# 3. Commit
git commit -m "feat: Add production config for Can Tho Gov domain"

# 4. Push
git push origin main
```

---

## 📝 Checklist Deploy Production

- [ ] File `.env` đã tạo (backend & frontend)
- [ ] MongoDB Atlas connection đã test thành công
- [ ] CORS origins đã config đúng
- [ ] JWT_SECRET đã thay đổi
- [ ] IP đã whitelist trong MongoDB Atlas
- [ ] Domain safe.cantho.gov.vn đã cấu hình DNS
- [ ] Firewall đã mở port 3000 và 5000
- [ ] `.env` đã thêm vào `.gitignore`
- [ ] Test API endpoints hoạt động
- [ ] Frontend kết nối được Backend

---

## 👥 Team Collaboration

### Khi có member mới:

1. Clone repository:
   ```bash
   git clone https://github.com/mymid799/webfpt.git
   ```

2. Copy file .env từ .env.example:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend  
   cp safe-download-react/.env.example safe-download-react/.env
   ```

3. Nhờ team lead cung cấp:
   - MongoDB connection string
   - JWT_SECRET
   - Các credentials khác

4. Cài đặt dependencies và chạy:
   ```bash
   cd backend && npm install
   cd ../safe-download-react && npm install
   cd ..
   start-production.bat
   ```

---

## 📞 Hỗ trợ

**Tổ chức:** UBND Thành phố Cần Thơ  
**Địa chỉ:** Số 2 Hòa Bình, Ninh Kiều, Cần Thơ  
**Hotline:** 0292.3812.785  
**Email:** ubnd@cantho.gov.vn  

---

## 📚 Tài liệu tham khảo

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express.js CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [React Documentation](https://react.dev/)

---

**🎉 Chúc bạn deploy thành công!**

