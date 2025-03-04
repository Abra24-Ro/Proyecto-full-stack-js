import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRecuperaPassword = async (datos) => {
  try {
    const { email, nombre, token } = datos;

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambiado para funcionar sin dominio propio
      to: email,
      subject: "Restablece tu contraseña",
      html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Has solicitado un cambio de contraseña.</p>
        <p>
          Sigue el siguiente enlace para generar una nueva contraseña:
        </p>
        <p>
          <a href="${process.env.FRONTEND_URL}/olvide-contraseña/${token}" 
             style="background-color:#10B981; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      `,
    });

    console.log("Correo de recuperación enviado correctamente:", response);
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
  }
};

export default emailRecuperaPassword;
