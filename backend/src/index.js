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

// GET. /recetas (busco todos los recetas de la tabla)
app.get("/recetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recetas");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /recetas/<id> (busco un usuario por su id)
app.get("/recetas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM recetas where id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST. /recetas (creo un receta)
app.post("/recetas", async (req, res) => {
  try {
    //guarda los valores
    const id_usuario = req.body.id_usuario;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const tiempo_preparacion = req.body.tiempo_preparacion;
    const categoria = req.body.categoria;
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;


    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !nombre.trim() || !descripcion.trim() || !tiempo_preparacion || !categoria.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 30 || categoria.length > 15) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
    }

    if (tiempo_preparacion <= 0 || likes < 0 || dislikes < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }

    const query = `insert into recetas (id_usuario, nombre, descripcion, tiempo_preparacion, categoria, likes, dislikes) 
    values ('${id_usuario}','${nombre}', '${descripcion}', '${tiempo_preparacion}', '${categoria}', '${likes}', '${dislikes}')`;

    await pool.query(query);
    res.status(200).json({ message: 'Receta creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// PUT. /recetas/<id> (modifico una receta por id)
app.put("/recetas/:id", async (req, res) => {
  try {
    //guarda los valores
    const id = req.params.id;
    const id_usuario = req.body.id_usuario;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const tiempo_preparacion = req.body.tiempo_preparacion;
    const categoria = req.body.categoria;
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !nombre.trim() || !descripcion.trim() || !tiempo_preparacion || !categoria.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 30 || categoria.length > 15) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
    }

    if (tiempo_preparacion <= 0 || likes < 0 || dislikes < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }

    const query = `update recetas
    set id_usuario = '${id_usuario}', nombre = '${nombre}', descripcion = '${descripcion}', tiempo_preparacion = '${tiempo_preparacion}', categoria = '${categoria}', likes = '${likes}', dislikes = '${dislikes}'
    where id = '${id}'`;
    
    await pool.query(query)
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /recetas (elimino un usuario por su id, pero no como parametro)
app.delete("/recetas", async (req, res) => {

  try {
    const id = req.body.id;
    const query = `delete from recetas where id = '${id}'`;

    await pool.query(query);
    res.json(`la receta con el id: '${id}' fue eliminado`);
    res.status(204).json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});