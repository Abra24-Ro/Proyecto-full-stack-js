import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;

  try {
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    console.error("Error al guardar el paciente:", error);
    res.status(500).json({ msg: "Hubo un error al guardar el paciente" });
  }
};

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find()
      .where("veterinario")
      .equals(req.veterinario._id)
      .lean(); // Mejora el rendimiento si solo es para lectura

    res.json(pacientes);
  } catch (error) {
    console.error("Error al obtener los pacientes:", error);
    res.status(500).json({ msg: "Hubo un error al obtener los pacientes" });
  }
};

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findById(id).lean(); // Solo para lectura

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    res.json(paciente);
  } catch (error) {
    console.error(`Error al obtener el paciente con ID ${id}:`, error);
    res.status(500).json({ msg: "Error al obtener el paciente" });
  }
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    // Actualizar paciente con los datos recibidos o mantener los existentes
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.telefono = req.body.telefono || paciente.telefono; // 🔹 Agregando la actualización del teléfono
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado);
  } catch (error) {
    console.error(`Error al actualizar el paciente con ID ${id}:`, error);
    res.status(500).json({ msg: "Error al actualizar el paciente" });
  }
};

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    if (paciente.veterinario.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    await paciente.deleteOne(); // `await` es mejor práctica aquí
    res.json({ msg: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error(`Error al eliminar el paciente con ID ${id}:`, error);
    res.status(500).json({ msg: "Error al eliminar el paciente" });
  }
};

export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
