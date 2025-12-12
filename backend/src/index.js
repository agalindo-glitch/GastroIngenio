import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

// GET. /usuarios (busco todos los usuarios de la tabla)
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /usuarios/<id> (busco un usuario por su id)
app.get("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM usuarios where id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST. /usuarios (creo un usuario)
app.post("/usuarios", async (req, res) => {
  try {
    //guarda los valores
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

        if (nombre.length > 15 || apellido.length > 15 || usuario.length > 15 || contrasena.length > 15) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
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

// PUT. /usuarios/<id> (modifico un usuario por id)
app.put("/usuarios/:id", async (req, res) => {
  try {
    //guarda los valores
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 15 || apellido.length > 15 || usuario.length > 15 || contrasena.length > 15) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
    }

    if (edad <= 0) {
      return res.status(406).json({ error: 'Numero de edad invalido' });
    }

    const query = `update usuarios 
    set nombre = '${nombre}', apellido = '${apellido}', edad = '${edad}', usuario = '${usuario}', contrasena = '${contrasena}'
    where id = '${id}'`;
    
    await pool.query(query)
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /usuarios (elimino un usuario por su id, pero no como parametro)
app.delete("/usuarios", async (req, res) => {

  try {
    const id = req.body.id;
    const query = `delete from usuarios where id = '${id}'`;

    await pool.query(query);
    res.json(`usuario con el id: '${id}' fue eliminado`);
    res.status(204).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});