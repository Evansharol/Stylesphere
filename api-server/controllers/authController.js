// Handles authentication logic (send OTP, verify OTP, reset password)

const { sendOtpEmail } = require('../utils/mailer');
const { generateOtp, otpStore } = require('../utils/otp');

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  const otp = generateOtp();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 minutes
  
  try {
    await sendOtpEmail(email, otp);
    res.json({ 
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send email' 
    });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and OTP are required' 
    });
  }
  
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid or expired OTP' 
    });
  }
  
  // TODO: Update password in your user database here
  delete otpStore[email];
  
  res.json({ 
    success: true,
    message: 'OTP verified successfully'
  });
};
