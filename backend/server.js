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

// ✅ PHẢI TẠO app TRƯỚC khi dùng app.use()
const app = express();

// 🔧 Middleware
app.use(cors({
  origin: '*',  // Cho phép tất cả origin
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

// ⚙️ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 5000, '0.0.0.0', () =>
      console.log(`🚀 Server running on 0.0.0.0:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
