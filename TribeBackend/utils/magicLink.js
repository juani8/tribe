const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { totp } = require('otplib');
const { authenticator } = require('otplib');


// Función auxiliar para crear un transportador
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
        console.log('App Password:', process.env.GMAIL_APP_PASSWORD ? 'Loaded' : 'Not Loaded');
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'no.reply.tribe.app@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Ignora errores de certificado
            }
        });
    }
};

// Función auxiliar para generar plantillas de correo electrónico
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

// Función auxiliar para enviar un correo electrónico
const sendEmail = async (email, subject, htmlContent) => {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
        from: 'no.reply.tribe.app@gmail.com',
        to: email,
        subject,
        html: htmlContent
    });
};

// Función para enviar el enlace de recuperación de contraseña
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
        console.error('Error al enviar el enlace de recuperación de contraseña:', error);
        throw new Error('No se pudo enviar el enlace de recuperación de contraseña');
    }
};

// Función para enviar el código TOTP por correo electrónico al momento del registro
exports.sendTotpEmail = async (email, totpCode) => {
    try {
        const subject = 'Tu código de verificación - Tribe';
        const header = 'Confirma tu registro en Tribe';
        const message = 'Tu código de verificación es:';
        const linkText = '';
        const link = '';

        const htmlContent = generateEmailTemplate(
            subject,
            header,
            `${message} <h1 style="color: #3498db;">${totpCode}</h1>`,
            linkText,
            link
        );

        await sendEmail(email, subject, htmlContent);
    } catch (error) {
        console.error('Error al enviar el código TOTP:', error);
        throw new Error('No se pudo enviar el código de verificación');
    }
};

// Función para generar un secreto TOTP
exports.generateTotpSecret = () => {
    return authenticator.generateSecret(); // Generates a unique secret key
};

// Función para generar un código TOTP
exports.generateTotpCode = (totpSecret) => {
    return authenticator.generate(totpSecret); // Generates a code based on the secret
};