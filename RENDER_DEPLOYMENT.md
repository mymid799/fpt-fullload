# 🚀 Hướng dẫn sử dụng Backend trên Render

## 📋 Thông tin Backend

**Backend URL:** https://webfpt-2.onrender.com  
**API Base URL:** https://webfpt-2.onrender.com/api  
**Platform:** Render.com (Free Tier)  

---

## ✅ Đã cấu hình xong

### 1. Frontend đã được cấu hình

File `safe-download-react/.env` đã được tạo với nội dung:
```env
VITE_API_BASE_URL=https://webfpt-2.onrender.com/api
```

### 2. Files đã tạo

- ✅ `safe-download-react/.env` - Cấu hình API
- ✅ `safe-download-react/.env.example` - Template cho team
- ✅ `start-frontend-render.bat` - Script khởi động frontend
- ✅ `test-render-backend.html` - Trang test backend

---

## 🚀 Cách sử dụng

### Option 1: Dùng Script (Khuyến nghị)

**Double-click file:**
```
start-frontend-render.bat
```

Hoặc chạy lệnh:
```bash
cd safe-download-react
npm run dev
```

Frontend sẽ tự động kết nối tới backend trên Render! ✨

### Option 2: Thủ công

```bash
cd safe-download-react
npm run dev
```

Truy cập: http://localhost:3000

---

## 🧪 Test Backend

### Cách 1: Dùng HTML Test Tool

**Double-click file:**
```
test-render-backend.html
```

Trang web sẽ mở và bạn có thể test tất cả endpoints!

### Cách 2: Test trong Browser

Mở trình duyệt và truy cập:

```
https://webfpt-2.onrender.com/api/admin-info/public
https://webfpt-2.onrender.com/api/reports/public
https://webfpt-2.onrender.com/api/reports/public/stats
```

### Cách 3: Test bằng PowerShell

```powershell
# Test admin info
curl https://webfpt-2.onrender.com/api/admin-info/public

# Test reports
curl https://webfpt-2.onrender.com/api/reports/public

# Test stats
curl https://webfpt-2.onrender.com/api/reports/public/stats
```

---

## 📊 API Endpoints có sẵn

| Endpoint | Method | Mô tả | Public? |
|----------|--------|-------|---------|
| `/api/admin-info/public` | GET | Thông tin tổ chức | ✅ |
| `/api/reports/public` | GET | Danh sách báo cáo | ✅ |
| `/api/reports/public/stats` | GET | Thống kê báo cáo | ✅ |
| `/api/reports` | POST | Tạo báo cáo mới | ✅ |
| `/api/windows` | GET | Phần mềm Windows | ✅ |
| `/api/office` | GET | Phần mềm Office | ✅ |
| `/api/tools` | GET | Công cụ | ✅ |
| `/api/antivirus` | GET | Antivirus | ✅ |
| `/api/stats/overview` | GET | Tổng quan thống kê | ✅ |

---

## ⚠️ Lưu ý quan trọng

### 1. Cold Start (Khởi động lạnh)

Render Free tier có tính năng "sleep" sau 15 phút không hoạt động:
- ⏰ Request đầu tiên sẽ mất **~30 giây**
- ✅ Các request sau sẽ nhanh (<100ms)

**Giải pháp:**
- Chờ 30s cho request đầu tiên
- Hoặc ping server mỗi 10 phút để giữ "thức"
- Hoặc upgrade lên Paid plan ($7/month)

### 2. CORS Configuration

Nếu gặp lỗi CORS, cần cấu hình trên Render:

1. Vào **Render Dashboard** → **webfpt-2**
2. Tab **Environment** → **Environment Variables**
3. Tìm `CORS_ORIGINS`
4. Thêm domain của bạn:
   ```
   CORS_ORIGINS=*
   ```
   Hoặc cụ thể hơn:
   ```
   CORS_ORIGINS=http://localhost:3000,https://your-domain.com
   ```
5. Click **Save Changes**

### 3. MongoDB Atlas

Backend đang kết nối tới MongoDB Atlas (cloud database):
- ✅ Không cần cài MongoDB local
- ✅ Data được lưu trữ trên cloud
- ⚠️ Cần whitelist IP trong MongoDB Atlas

---

## 🔧 Troubleshooting

### ❌ Lỗi: "Failed to fetch" hoặc "Network Error"

**Nguyên nhân:**
1. Backend đang cold start (chờ 30s)
2. CORS chưa cấu hình
3. Backend offline

**Giải pháp:**
1. Chờ 30 giây và thử lại
2. Kiểm tra CORS_ORIGINS trong Render
3. Kiểm tra Logs trong Render Dashboard

### ❌ Lỗi: "CORS Error"

**Giải pháp:**
- Vào Render → Environment Variables
- Set `CORS_ORIGINS=*`
- Hoặc thêm domain cụ thể

### ❌ Frontend không kết nối Backend

**Kiểm tra:**
1. File `.env` có tồn tại trong `safe-download-react/`
2. Nội dung file có dòng:
   ```
   VITE_API_BASE_URL=https://webfpt-2.onrender.com/api
   ```
3. Đã restart frontend sau khi sửa .env

**Cách kiểm tra:**
- Mở DevTools (F12) → Console
- Xem API calls đang gọi tới đâu
- Nếu thấy `localhost:5000` → .env chưa được load
- **Giải pháp:** Restart frontend

---

## 🎯 Workflow Làm Việc

### Khi phát triển (Development):

```bash
# 1. Mở terminal
cd safe-download-react

# 2. Chạy frontend
npm run dev

# 3. Truy cập
http://localhost:3000

# Frontend sẽ tự động gọi tới backend Render
# Không cần chạy backend local!
```

### Khi deploy frontend lên production:

```bash
# 1. Build frontend
cd safe-download-react
npm run build

# 2. Deploy folder dist/ lên:
#    - Vercel
#    - Netlify
#    - Render
#    - GitHub Pages

# Frontend vẫn sẽ gọi tới backend Render!
```

---

## 💡 Tips & Tricks

### 1. Keep Backend Awake

Tạo cron job ping server mỗi 10 phút:
- Dùng https://cron-job.org
- URL: `https://webfpt-2.onrender.com/api/stats/overview`
- Interval: */10 * * * * (mỗi 10 phút)

### 2. Monitor Backend

Kiểm tra logs real-time:
- Vào Render Dashboard
- Click **webfpt-2** → Tab **Logs**
- Xem request/error logs

### 3. Update Environment Variables

Khi cần thay đổi config:
1. Render Dashboard → **Environment**
2. Sửa biến (MONGODB_URI, JWT_SECRET, etc.)
3. Click **Save Changes**
4. Backend tự động redeploy (~2 phút)

---

## 📞 Support

**Backend Platform:** Render.com  
**Backend URL:** https://webfpt-2.onrender.com  
**Frontend Local:** http://localhost:3000  

**Tổ chức:** UBND Thành phố Cần Thơ  
**Email:** ubnd@cantho.gov.vn  

---

## ✨ Tóm tắt

✅ **Backend:** Đang chạy trên Render (24/7)  
✅ **Frontend:** Chạy local, kết nối tới backend Render  
✅ **Database:** MongoDB Atlas (cloud)  
✅ **Test Tool:** `test-render-backend.html`  
✅ **Script:** `start-frontend-render.bat`  

**🎉 Mọi thứ đã sẵn sàng! Chỉ cần chạy frontend và code thôi!**

