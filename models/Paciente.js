import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true, // Elimina espacios en blanco al inicio y al final
    },
    propietario: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Convierte el email a minúsculas
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    sintomas: {
      type: String,
      required: true,
      trim: true,
    },
    veterinario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinario",
    },
  },
  {
    timestamps: true, // Habilita `createdAt` y `updatedAt`
  }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;
