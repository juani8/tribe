const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Helper function to create a transporter
const createTransporter = () => {
    if (process.env.NODE_ENV === 'development') {
        return nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });
    } else {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'no.reply.tribe.app@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
};

// Helper function to generate email templates
const generateEmailTemplate = (subject, header, message, linkText, link) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <table style="width: 100%; padding: 20px;">
            <tr>
                <td style="text-align: center;">
                    <h1 style="color: #2C3E50;">${header}</h1>
                    <p style="font-size: 16px; color: #7f8c8d;">${message}</p>
                    <p>
                        <a href="${link}">${linkText}</a>
                    </p>
                    <p style="font-size: 16px; color: #7f8c8d;">Saludos,<br>El equipo de Tribe</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
`;

// Helper function to send an email
const sendEmail = async (email, subject, htmlContent) => {
    const transporter = createTransporter();
    console.log('Sending email...');
    console.log('Email:', email);
    console.log('Subject:', subject);
    
    const info = await transporter.sendMail({
        from: 'no.reply.tribe.app@gmail.com',
        to: email,
        subject,
        html: htmlContent
    });

    console.log(`${subject} sent to: ${email}, Message ID: ${info.messageId}`);
};

// Function to send magic link via email
exports.sendMagicLink = async (email, userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const magicLink = `tribeapp://register?token=${token}`;

        const htmlContent = generateEmailTemplate(
            '¡Bienvenido/a a Tribe!',
            '¡Hola, te damos la bienvenida a Tribe!',
            'Para completar tu registro, haz clic en el siguiente enlace para verificar tu correo electrónico y unirte a la comunidad:',
            magicLink,
            magicLink
        );

        await sendEmail(email, '¡Bienvenido/a a Tribe! Confirma tu correo electrónico', htmlContent);
    } catch (error) {
        console.error('Error sending magic link:', error);
        throw new Error('Could not send magic link');
    }
};

// Function to send password recovery link
exports.sendRecoveryLink = async (email, userId) => {
    try {
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const recoveryLink = `https://triberedmedia.netlify.app/recover-password.html?token=${token}`;

        const htmlContent = generateEmailTemplate(
            'Recupera tu contraseña en Tribe',
            'Recupera tu Contraseña en Tribe',
            'Para restablecer tu contraseña, haz clic en el siguiente enlace:',
            'Restablecer mi contraseña',
            recoveryLink
        );

        await sendEmail(email, 'Recupera tu contraseña en Tribe', htmlContent);
    } catch (error) {
        console.error('Error sending password recovery link:', error);
        throw new Error('Could not send password recovery link');
    }
};