const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

console.log('🔍 Starting OTP Auth Server...');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory storage (reliable and fast)
const memoryDB = {
  users: [],
  otps: new Map()
};

// Email configuration
// Email configuration with SSL fix
// Email configuration with SSL fix
const createTransporter = () => {
  // Check if Gmail credentials are properly set
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && 
      process.env.GMAIL_USER !== 'your-email@gmail.com' && 
      process.env.GMAIL_PASS !== 'your-app-password') {
    
    console.log('📧 Using Gmail transporter for:', process.env.GMAIL_USER);
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // Fallback to Ethereal.email for testing
  console.log('📧 Using Ethereal.email for testing - Gmail credentials not properly configured');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'maddison53@ethereal.email',
      pass: 'jn7jn7jjj2gQxW3fPq'
    }
  });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ SMTP server connection verified');

    const mailOptions = {
      from: {
        name: 'OTP Auth System',
        address: process.env.GMAIL_USER || 'noreply@otp-auth.com'
      },
      to: email,
      subject: 'Your OTP Verification Code',
      text: `Your OTP code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">OTP Verification</h2>
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; padding: 10px 20px; border: 2px dashed #2563eb; border-radius: 5px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #888;">This code will expire in 10 minutes.</p>
            <p style="font-size: 12px; color: #ff0000;"><strong>⚠️ Do not share this code with anyone.</strong></p>
          </div>
        </div>
      `
    };

    console.log(`📧 Attempting to send OTP to: ${email}`);
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', result.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // More detailed error information
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check your Gmail credentials.');
      console.error('💡 Tip: Use App Password instead of regular password.');
    } else if (error.code === 'ESOCKET') {
      console.error('🌐 Network error. Check your internet connection.');
    } else {
      console.error('🔧 Error details:', error);
    }
    
    console.log(`📋 OTP for ${email}: ${otp} (Email failed, but OTP is valid)`);
    return false;
  }
};

// Clean expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [identifier, data] of memoryDB.otps.entries()) {
    if (data.expiresAt < now) {
      memoryDB.otps.delete(identifier);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired OTPs`);
  }
}, 5 * 60 * 1000);

// Routes
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email or phone is required' 
      });
    }

    const identifier = email || phone;
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store OTP in memory
    memoryDB.otps.set(identifier, { otp, expiresAt, method: email ? 'email' : 'phone' });
    
    console.log(`📋 OTP for ${identifier}: ${otp} (Expires: ${new Date(expiresAt).toLocaleTimeString()})`);

    let emailSent = true;
    if (email) {
      emailSent = await sendOTPEmail(email, otp);
    }

    res.json({
      success: true,
      message: email ? 'OTP sent successfully' : 'OTP generated',
      otp: otp, // Include for testing
      emailSent,
      identifier
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send OTP' 
    });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'OTP is required' 
      });
    }
    
    const identifier = email || phone;
    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email or phone is required' 
      });
    }

    const storedData = memoryDB.otps.get(identifier);
    
    if (!storedData) {
      return res.status(400).json({ 
        success: false, 
        error: 'OTP not found. Please request a new one.' 
      });
    }
    
    if (Date.now() > storedData.expiresAt) {
      memoryDB.otps.delete(identifier);
      return res.status(400).json({ 
        success: false, 
        error: 'OTP expired. Please request a new one.' 
      });
    }
    
    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid OTP' 
      });
    }

    memoryDB.otps.delete(identifier);
    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Verification failed' 
    });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, company, userType = 'jobseeker' } = req.body;
    
    if ((!name && !company) || (!email && !phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const identifier = email || phone;
    const existingUser = memoryDB.users.find(user => 
      user.email === identifier || user.phone === identifier
    );
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    const newUser = {
      id: uuidv4(),
      name: userType === 'employer' ? company : name,
      email: email || null,
      phone: phone || null,
      type: userType,
      company: userType === 'employer' ? company : null
    };

    memoryDB.users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, userType: newUser.type },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Registration successful',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = email || phone;
    
    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email or phone required' 
      });
    }

    const user = memoryDB.users.find(user => 
      user.email === identifier || user.phone === identifier
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const token = jwt.sign(
      { userId: user.id, userType: user.type },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'in-memory',
    usersCount: memoryDB.users.length,
    otpCount: memoryDB.otps.size
  });
});

app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    memoryDB: {
      users: memoryDB.users,
      otps: Object.fromEntries(memoryDB.otps)
    }
  });
});
// Test email configuration endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const testEmail = process.env.GMAIL_USER || 'test@example.com';
    const otp = generateOTP();
    
    console.log('🧪 Testing email configuration...');
    const emailSent = await sendOTPEmail(testEmail, otp);
    
    res.json({
      success: true,
      emailSent,
      message: emailSent ? 'Email test successful' : 'Email test failed',
      testEmail,
      otp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 OTP Auth Server running!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`📧 Email: ${process.env.GMAIL_USER ? 'Gmail' : 'Ethereal (test)'}`);
  console.log(`💾 Storage: In-Memory`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n✅ Server ready to accept requests!');
});

console.log('🔍 Environment Variables Check:');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✅ Set' : '❌ Missing');

// Check if using placeholder values
if (process.env.GMAIL_USER === 'your-email@gmail.com' || 
    process.env.GMAIL_PASS === 'your-app-password') {
  console.log('⚠️  WARNING: You are using placeholder values in .env file!');
  console.log('⚠️  Please update with your actual Gmail credentials.');
}