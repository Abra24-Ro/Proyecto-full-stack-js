import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar conexión con el servidor SMTP antes de enviar el correo
    await transporter.verify();
    console.log("Servidor de correo listo para enviar mensajes.");

    const { email, nombre, token } = datos;

    const info = await transporter.sendMail({
      from: '"APV - Administrador de Pacientes" <no-reply@apv.com>',
      to: email,
      subject: "Verifica tu cuenta en APV",
      text: `Hola ${nombre}, confirma tu cuenta en APV.`,
      html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu cuenta ya está lista, pero debes confirmarla haciendo clic en el siguiente enlace:</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}" 
             style="background-color:#10B981; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
            Confirmar Cuenta
          </a>
        </p>
        <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
      `,
    });

    console.log("Correo enviado correctamente: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

export default emailRegistro;
