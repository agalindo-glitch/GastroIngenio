import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

// GET. /usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST. /usuarios
app.post("/usuarios", async (req, res) => {
  //guarda los valores
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const edad = req.body.edad;
  const usuario = req.body.usuario;
  const contrasena = req.body.contrasena;

  //trim() sirve para que no te permita dejar espacios en blanco
  try {
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }
    
    if (edad <= 0) {
      return res.status(406).json({ error: 'Numero de edad invalido' });
    }

    const query = `insert into usuarios (nombre, apellido, edad, usuario, contrasena) 
    values ('${nombre}', '${apellido}', '${edad}', '${usuario}', '${contrasena}')`;

    await pool.query(query);
    res.json();
    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});