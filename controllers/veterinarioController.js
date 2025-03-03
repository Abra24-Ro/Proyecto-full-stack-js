import emailRecuperaPassword from "../helpers/emailRecuperaContraseña.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";

const registar = async (req, res) => {
  const { email, nombre } = req.body;
  //Prevenir usuarios duplicados

  const existeUsuario = await Veterinario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya existe");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar el email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;

  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;

    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente " });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobar si existe

  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(403).json({ msg: error.message });
  }

  //Confirmar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("La cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //Revisar el password

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }

  //Authenticar al usaurio
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });

  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msn: error.message });
  }

  try {
    existeVeterinario.token = generarID();
    await existeVeterinario.save();

    //Enviar email e
    emailRecuperaPassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
const comprabarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    //El tokeresn es valido el usuario existe

    res.json({ msg: "Token valido " });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    return res.status(400).json({ msg: "Hubo un error, token no válido" });
  }

  try {
    veterinario.token = null;
    veterinario.password = password; // Asegúrate de que se encripte en el modelo antes de guardar
    await veterinario.save();

    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al modificar la contraseña" });
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);

  if (!veterinario) {
    const error = new Error("Veterinario no encontrado");
    return res.status(400).json({ msg: error.message });
  }
  const { email } = req.body;

  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
      const error = new Error("El email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre || veterinario.nombre;
    veterinario.email = req.body.email || veterinario.email;
    veterinario.telefono = req.body.telefono || veterinario.telefono;
    veterinario.web = req.body.web || veterinario.web;

    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    const erro = new Error("Ocurrio un error al actualizar el perfil");
    return res.status(400).json({ msg: erro.message });
  }
};

const actualizarPassword = async (req, res) => {
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;

  const veterinario = await Veterinario.findById(id);

  if (!veterinario) {
    // Corregido: la validación debe ser si NO existe
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  if (await veterinario.comprobarPassword(pwd_actual)) {
    if (pwd_actual === pwd_nuevo) {
      const error = new Error(
        "La nueva contraseña no puede ser igual a la actual"
      );
      return res.status(400).json({ msg: error.message });
    }

    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({ msg: "Password actualizado correctamente" });
  } else {
    const error = new Error("El password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprabarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
