const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Function to send magic link via email
exports.sendMagicLink = async (email, userId) => {
    try {
        // Create a JWT token for the user, valid for a certain period (e.g., 15 minutes)
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const magicLink = `tribeapp://register?token=${token}`;

        // Determine the environment (development or production) and set up transporter accordingly
        let transporter;
        if (process.env.NODE_ENV === 'development') {
            // If in development, use Mailtrap for testing
            transporter = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 587,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS
                }
            });
        } else {
            // If in production, use Gmail or another real email service
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'no.reply.tribe.app@gmail.com',
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });
        }

        // Send the magic link email
        const info = await transporter.sendMail({
            from: 'no.reply.tribe.app@gmail.com',
            to: email,
            subject: '¡Bienvenido/a a Tribe! Confirma tu correo electrónico',
            html: `
                <p>¡Hola, te damos la bienvenida!</p>
                <p>Para completar tu registro, haz clic en el siguiente enlace para verificar tu correo electrónico y unirte a la comunidad:</p>
                <!-- <p><a href="${magicLink}">Completa tu registro</a></p> -->
                <p><a href="${magicLink}">${magicLink}</a></p>
                <p>Si no solicitaste este registro, puedes ignorar este mensaje sin problema.</p>
                <p>Saludos,<br>El equipo de Tribe</p>
            `
        });
        console.log('Magic link sent to:', email, 'Message ID:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send magic link');
    }
};