/**
 * Test MongoDB Atlas Connection
 * Cần Thơ Safe Download Portal
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('');
console.log('========================================');
console.log('  MongoDB Atlas Connection Test');
console.log('  Cần Thơ Safe Download Portal');
console.log('========================================');
console.log('');

console.log('🔗 Connecting to MongoDB Atlas...');

// Kiểm tra connection string
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file!');
  process.exit(1);
}

// Ẩn password trong log
const safeUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@');
console.log('📍 URI:', safeUri);

// Connect
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('');
    console.log('✅ Connected successfully to MongoDB Atlas!');
    console.log('');
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.name);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port || 'default');
    console.log('   - ReadyState:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('');
    console.log('========================================');
    console.log('');
    
    // Close connection
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.log('');
    console.error('❌ Connection failed!');
    console.error('');
    console.error('Error details:', err.message);
    console.log('');
    console.log('🔍 Common issues:');
    console.log('   1. Check your username/password');
    console.log('   2. Whitelist your IP in MongoDB Atlas');
    console.log('   3. Check network connection');
    console.log('');
    console.log('========================================');
    console.log('');
    process.exit(1);
  });

