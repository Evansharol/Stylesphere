// Utility for sending OTP emails
const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/emailConfig');

const transporter = nodemailer.createTransport(emailConfig);

exports.sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`
  });
};
