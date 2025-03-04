import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRegistro = async (datos) => {
  try {
    const { email, nombre, token } = datos;

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambiado para funcionar sin dominio propio
      to: email,
      subject: "Verifica tu cuenta en APV",
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

    console.log("Correo enviado correctamente:", response);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

export default emailRegistro;
