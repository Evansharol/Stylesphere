// Utility for OTP generation and storage
exports.otpStore = {};
exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
