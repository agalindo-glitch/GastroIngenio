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
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

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

    if (nombre.length > 30 || apellido.length > 30 || usuario.length > 30 || contrasena.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene muchos caracteres' });
    }

    if (edad <= 0) {
      return res.status(406).json({ error: 'Numero de edad invalido' });
    }

    const chequeoQuery = 'SELECT usuario FROM usuarios WHERE usuario = $1';
    const resultados = await pool.query(chequeoQuery, [usuario]);

    if (resultados.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }


    const query = `
    INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena)
    VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [
      nombre,
      apellido,
      edad,
      usuario,
      contrasena
    ]);


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

    if (nombre.length > 30 || apellido.length > 30 || usuario.length > 30 || contrasena.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene muchps caracteres' });
    }

    if (edad <= 0) {
      return res.status(406).json({ error: 'Numero de edad invalido' });
    }

    const query = `
    UPDATE usuarios
    SET nombre = $1, apellido = $2, edad = $3,
        usuario = $4, contrasena = $5
    WHERE id = $6
    `;

    await pool.query(query, [
      nombre,
      apellido,
      edad,
      usuario,
      contrasena,
      id
    ]);

    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /usuarios (elimino un usuario por su id, pero no como parametro)
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = `DELETE FROM usuarios WHERE id = $1`;
    await pool.query(query, [id]);


    res.status(200).json({ message: `Usuario con el id: ${id} fue eliminado` });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

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

// GET. /recetas/<id> (busco una receta por su id)
app.get("/recetas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM recetas WHERE id = $1",[id]);

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
    const elegidos_comunidad = req.body.elegidos_comunidad;
    const review = req.body.review;


    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !nombre.trim() || !descripcion.trim() || !tiempo_preparacion || !categoria.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 50 || categoria.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
    }

    if (tiempo_preparacion <= 0 || review < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }

    const query = `
    INSERT INTO recetas
    (id_usuario, nombre, descripcion, tiempo_preparacion, categoria, elegidos_comunidad, review)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

await pool.query(query, [
  id_usuario,
  nombre,
  descripcion,
  tiempo_preparacion,
  categoria,
  elegidos_comunidad,
  review
]);


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
    const elegidos_comunidad = req.body.elegidos_comunidad;
    const review = req.body.review;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !nombre.trim() || !descripcion.trim() || !tiempo_preparacion || !categoria.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 50 || categoria.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene más de 15 caracteres' });
    }

    if (tiempo_preparacion <= 0 || review < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }

    const query = `
    UPDATE recetas
    SET id_usuario = $1,
        nombre = $2,
        descripcion = $3,
        tiempo_preparacion = $4,
        categoria = $5,
        elegidos_comunidad = $6,
        review = $7
    WHERE id = $8
    `;

    await pool.query(query, [
      id_usuario,
      nombre,
      descripcion,
      tiempo_preparacion,
      categoria,
      elegidos_comunidad,
      review,
      id
    ]);

    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /recetas (elimino una receta por su id, pero no como parametro)
app.delete("/recetas", async (req, res) => {

  try {
    const id = req.body.id;
    const queryComentario = `DELETE FROM comentarios WHERE id_receta = $1`;
    const query = `DELETE FROM recetas WHERE id = $1`;

    await pool.query(queryComentario, [id]);
    await pool.query(query, [id]);

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// GET. /comentarios (busco todos los comentarios de la tabla)
app.get("/comentarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comentarios");


    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /comentarios/<id> (busco un comentario por su id)
app.get("/comentarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM comentarios where id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST. /comentarios (creo un comentario)
app.post("/comentarios", async (req, res) => {
  try {
    //guarda los valores
    const id_usuario = req.body.id_usuario;
    const id_receta = req.body.id_receta;
    const descripcion = req.body.descripcion;
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;


    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !id_receta || !descripcion.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (likes < 0 || dislikes < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }

    const query = `
    INSERT INTO comentarios (id_usuario, id_recetas, descripcion, likes, dislikes)
    VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [
      id_usuario,
      id_receta,
      descripcion,
      likes,
      dislikes
    ]);

    res.status(200).json({ message: 'Comentario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// PUT. /comentarios/<id> (modifico un comentario por id)
app.put("/comentarios/:id", async (req, res) => {
  try {
    //guarda los valores
    const id = req.params.id;
    const id_usuario = req.body.id_usuario;
    const id_receta = req.body.id_receta;
    const descripcion = req.body.descripcion;
    const likes = req.body.likes;
    const dislikes = req.body.dislikes;


    //trim() sirve para que no te permita dejar espacios en blanco
    if (!id_usuario || !id_receta || !descripcion.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (likes < 0 || dislikes < 0) {
      return res.status(406).json({ error: 'Numero de alguno de los campos es invalido' });
    }
    const query = `
    UPDATE comentarios
    SET id_usuario = $1,
        id_recetas = $2,
        descripcion = $3,
        likes = $4,
        dislikes = $5
    WHERE id = $6
    `;

    await pool.query(query, [
      id_usuario,
      id_receta,
      descripcion,
      likes,
      dislikes,
      id
    ]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /comentarios (elimino un comentarios por su id, pero no como parametro)
app.delete("/comentarios", async (req, res) => {
  try {
    const id = req.body.id;
    await pool.query("DELETE FROM comentarios WHERE id = $1", [id]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});

//POST. /login (un usuario se logea)
app.post("/login", async (req, res) => {
  try{
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    const query = `
    SELECT id, usuario
    FROM usuarios
    WHERE usuario = $1 AND contrasena = $2
    `;

    const resultados = await pool.query(query, [usuario, contrasena]);


    if (resultados.rows.length === 0){
      return res.status(401).send("No existe el usuario");
    }

    res.json(resultados.rows[0]);
  }catch(error){
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET. /usuariosElegidosComunidad/<id> (busca el numero de elegidos por la comunidad de un usuario)
app.get("/usuariosElegidosComunidad/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT u.id AS usuario_id, COUNT(r.id) AS elegidos
    FROM usuarios u
    LEFT JOIN recetas r ON u.id = r.id_usuario AND r.elegidos_comunidad = TRUE
    WHERE u.id = ${id}
    GROUP BY u.id;`);

    if (result.rows.length === 0 || result.rows[0].elegidos === 0) {
      return res.json({ usuario_id: id, elegidos: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /usuariosPosts/<id> (busca el numero de posteos de un usuario)
app.get("/usuariosPosts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT usuarios.id, COUNT(recetas.id) AS posts
    FROM usuarios
    INNER JOIN recetas ON recetas.id_usuario = usuarios.id
    GROUP BY usuarios.id;`);
    if (result.rows.length === 0 || result.rows[0].posts === 0) {
      return res.json({ usuario_id: id, posts: 0 });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
