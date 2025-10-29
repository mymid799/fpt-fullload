# ⚡ Quick Start - Safe Download Portal Cần Thơ

## 🎯 Khởi động nhanh trong 3 bước

### 1️⃣ Double-click file này:
```
start-production.bat
```

### 2️⃣ Đợi 10 giây cho services khởi động

### 3️⃣ Truy cập:
- **Frontend:** http://safe.cantho.gov.vn:3000
- **Backend:** http://safe.cantho.gov.vn:5000

---

## ✅ Đã cấu hình xong

✅ MongoDB Atlas (Cloud Database)  
✅ Domain: safe.cantho.gov.vn  
✅ Environment Variables (.env)  
✅ API Configuration  
✅ CORS Settings  
✅ Auto-detect environment  

---

## 📝 Files quan trọng

| File | Mô tả |
|------|-------|
| `backend/.env` | Cấu hình backend (MongoDB, CORS) |
| `safe-download-react/.env` | Cấu hình frontend (API URL) |
| `start-production.bat` | Script khởi động tự động |
| `backend/test-mongo.js` | Test kết nối MongoDB |

---

## 🧪 Test MongoDB

```bash
cd backend
node test-mongo.js
```

Kết quả:
```
✅ Connected successfully to MongoDB Atlas!
   Database: safedownload
   Host: cluster0.nspa5o1.mongodb.net
```

---

## 🔧 Cấu hình hiện tại

### MongoDB:
- **Type:** Atlas (Cloud)
- **Database:** safedownload
- **Region:** MongoDB Atlas

### Domain:
- **Production:** safe.cantho.gov.vn
- **Backend Port:** 5000
- **Frontend Port:** 3000

### Allowed Origins:
- http://safe.cantho.gov.vn:3000
- http://localhost:3000
- http://192.168.1.22:3000

---

## ⚠️ Lưu ý quan trọng

### 🔒 Bảo mật:
- ❌ **KHÔNG commit file `.env` vào Git**
- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ Sử dụng `.env.example` để share config template

### 🌐 Network:
- Đảm bảo firewall mở port **3000** và **5000**
- IP server đã được whitelist trong MongoDB Atlas

---

## 📞 Liên hệ

**UBND Thành phố Cần Thơ**  
📍 Số 2 Hòa Bình, Ninh Kiều, Cần Thơ  
☎️ 0292.3812.785  
✉️ ubnd@cantho.gov.vn  

---

📖 **Chi tiết:** Xem file `DEPLOYMENT_GUIDE.md`

