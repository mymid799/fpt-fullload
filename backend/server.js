import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// 🧩 Import routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import windowsRoutes from "./routes/windowsRoutes.js";
import officeRoutes from "./routes/officeRoutes.js";
import toolsRoutes from "./routes/toolsRoutes.js";
import antivirusRoutes from "./routes/antivirusRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminInfoRoutes from "./routes/adminInfoRoutes.js";
import virustotalRoutes from "./routes/virustotalRoutes.js";
import dynamicColumnRoutes from "./routes/dynamicColumnRoutes.js";
import columnConfigRoutes from "./routes/columnConfigRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

// 📦 Environment Variables
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Origins - cho phép nhiều domains
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['*'];

// ✅ PHẢI TẠO app TRƯỚC khi dùng app.use()
const app = express();

// 🔧 Middleware - CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // Cho phép request không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Cho phép tất cả trong development
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Kiểm tra origin có trong danh sách cho phép không
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🛣️ Gắn route
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/windows", windowsRoutes);
app.use("/api/office", officeRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/antivirus", antivirusRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin-info", adminInfoRoutes);
app.use("/api/virustotal", virustotalRoutes);
app.use("/api/dynamic-columns", dynamicColumnRoutes);
app.use("/api/column-config", columnConfigRoutes);
app.use("/api/stats", statsRoutes);

// ⚙️ Kết nối MongoDB Atlas
console.log('');
console.log('========================================');
console.log('  Safe Download Portal - Cần Thơ Gov');
console.log('========================================');
console.log('');

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log('');
    
    // Start Server
    app.listen(PORT, HOST, () => {
      console.log('========================================');
      console.log('  🚀 Server is running!');
      console.log('========================================');
      console.log('');
      console.log(`  📍 Local:    http://localhost:${PORT}`);
      console.log(`  🌐 Network:  http://${HOST}:${PORT}`);
      console.log(`  📱 Frontend: ${process.env.FRONTEND_URL || 'Not configured'}`);
      console.log(`  🔒 CORS:     ${allowedOrigins.join(', ')}`);
      console.log(`  ⚙️  Mode:     ${NODE_ENV}`);
      console.log('');
      console.log('========================================');
      console.log('');
      console.log('  💡 Press Ctrl+C to stop');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('');
    console.error('❌ MongoDB connection error:');
    console.error('   ', err.message);
    console.error('');
    console.error('🔍 Please check:');
    console.error('   1. MONGODB_URI in .env file');
    console.error('   2. Network connection');
    console.error('   3. MongoDB Atlas IP whitelist');
    console.error('');
    process.exit(1);
  });
