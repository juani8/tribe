require("dotenv").config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Function to send magic link via email
exports.sendMagicLink = async (email, userId) => {
    try {
        // Create a JWT token for the user, valid for a certain period (e.g., 15 minutes)
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.SMPT_SERVER,  // Replace with your SMTP server
            port: process.env.SMPT_PORT,  // Replace with your SMTP server's port
            auth: {
                user: process.env.SMPT_USER,  // Replace with your SMTP user
                pass: process.env.SMPT_PASS  // Replace with your SMTP password
            }
        });

        // Define the email options, including the generated token in the link
        const magicLink = `https://yourapp.com/register?token=${token}`;

        const message = {
            from: 'no-reply@yourapp.com',
            to: email,
            subject: 'Your Magic Link',
            text: `Click the link to complete your registration: ${magicLink}`
        };

        // Send the email
        let info = await transporter.sendMail(message);
        console.log('Magic link sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send magic link');
    }
};