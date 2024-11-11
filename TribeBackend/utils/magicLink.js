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
                service: 'gmail', // o tu servicio de correo
                auth: {         
                    user: 'no.reply.tribe.app@gmail.com',         
                    pass: process.env.GMAIL_APP_PASSWORD,     
                },    
                tls: {         
                    rejectUnauthorized: false // Ignora errores de certificado 
                } 
            });
        }

        const info = await transporter.sendMail({
            from: 'no.reply.tribe.app@gmail.com',
            to: email,
            subject: '¡Bienvenido/a a Tribe! Confirma tu correo electrónico',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Correo Electrónico</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
                    <table style="width: 100%; padding: 20px;">
                        <tr>
                            <td style="text-align: center;">
                                <h1 style="color: #2C3E50;">¡Hola, te damos la bienvenida a Tribe!</h1>
                                <p style="font-size: 16px; color: #7f8c8d;">Para completar tu registro, haz clic en el siguiente enlace para verificar tu correo electrónico y unirte a la comunidad:</p>
                                <p>
                                    <p><a href="${magicLink}">${magicLink}</a></p>
                                    <!--<a href="${magicLink}" class="button">Completa tu registro</a>-->
                                </p>
                                <p style="font-size: 16px; color: #7f8c8d;">Si no solicitaste este registro, puedes ignorar este mensaje sin problema.</p>
                                <br>
                                <p style="font-size: 16px; color: #7f8c8d;">Saludos,<br>El equipo de Tribe</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });
        console.log('Magic link sent to:', email, 'Message ID:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send magic link');
    }
};