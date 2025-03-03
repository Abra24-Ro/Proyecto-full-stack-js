import express from "express";
import {
  autenticar,
  confirmar,
  olvidePassword,
  perfil,
  registar,
  nuevoPassword,
  comprabarToken,
  actualizarPerfil,
  actualizarPassword 
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprabarToken).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id",checkAuth,actualizarPerfil);
router.put("/actualizar-password",checkAuth,actualizarPassword);

export default router;
