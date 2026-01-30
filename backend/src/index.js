import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});



app.post("/comentarios", async (req, res) => {
  try {
    const { id_usuario, id_receta, descripcion, puntaje } = req.body;
    const likes = req.body.likes ?? 0;
    const dislikes = req.body.dislikes ?? 0;

    // 🔍 Debug: mostrar datos recibidos
    console.log("💬 Datos recibidos en backend:", req.body);

    // 1️⃣ Validaciones básicas
    if (!id_usuario || !id_receta || !descripcion?.trim()) {
      console.log("⚠️ Faltan campos obligatorios");
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // 2️⃣ Validación de puntaje
    const puntajeNum = Number(puntaje);
    if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 5) {
      console.log("⚠️ Puntaje inválido:", puntaje);
      return res.status(406).json({ error: "Puntaje inválido (0-5)" });
    }

    // 3️⃣ Validación de likes/dislikes
    if (likes < 0 || dislikes < 0) {
      console.log("⚠️ Likes o dislikes inválidos");
      return res.status(406).json({ error: "Likes/Dislikes inválidos" });
    }

    // 🔍 Debug: mostrar datos a insertar
    console.log("💾 Insertando comentario:", {
      id_usuario,
      id_receta,
      descripcion: descripcion.trim(),
      puntaje: puntajeNum,
      likes,
      dislikes
    });

    // 🔍 Debug: mostrar datos a insertar
    console.log("💾 Insertando comentario:", {
      id_usuario,
      id_receta,
      descripcion: descripcion.trim(),
      puntaje: puntajeNum,
      likes,
      dislikes
    });

    // 🔍 Debug: mostrar valor que irá como $4
    console.log("💡 Valor que se enviará como $4 (puntaje):", puntajeNum);

    // Guardar comentario
    const result = await pool.query(
      `INSERT INTO comentarios (id_usuario, id_receta, descripcion, puntaje, likes, dislikes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [id_usuario, id_receta, descripcion.trim(), puntajeNum, likes, dislikes]
    );

    // 🔍 Debug: mostrar lo que realmente devuelve la DB
    console.log("✅ Comentario insertado en DB:", result.rows[0]);

    

    const comment = result.rows[0];

    // Traer el nombre de usuario y foto para el frontend
    const userRes = await pool.query(
      `SELECT usuario, foto_perfil FROM usuarios WHERE id = $1`,
      [comment.id_usuario]
    );

    comment.usuario = userRes.rows[0]?.usuario ?? "";
    comment.foto_perfil = userRes.rows[0]?.foto_perfil ?? null;

    // 🔍 Debug: mostrar comentario final que se envía al frontend
    console.log("✅ Comentario guardado y enviado al frontend:", comment);

    res.status(201).json(comment);

  } catch (error) {
    console.error("❌ Error en POST /comentarios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
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
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

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
    const foto_perfil = req.body.foto_perfil || null;


    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 30 || apellido.length > 30 || usuario.length > 30 || contrasena.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene muchos caracteres' });
    }

    if (usuario.length < 5 || contrasena.length < 8) {
      return res.status(400).json({ error: 'Un campo tiene pocos caracteres (Usuario o contrasena)' });
    }

    if (edad < 16 || edad > 100) {
      return res.status(400).json({ error: 'edad invalido' });
    }

    const chequeoQuery = 'SELECT usuario FROM usuarios WHERE usuario = $1';
    const resultados = await pool.query(chequeoQuery, [usuario]);

    if (resultados.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }


    const query = `
    INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena, foto_perfil)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;


    await pool.query(query, [nombre, apellido, edad, usuario, contrasena, foto_perfil || null]);

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
    const foto_perfil = req.body.foto_perfil;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (nombre.length > 30 || apellido.length > 30 || usuario.length > 30 || contrasena.length > 50) {
      return res.status(400).json({ error: 'Un campo tiene muchos caracteres' });
    }

    if (usuario.length < 5 || contrasena.length < 8) {
      return res.status(400).json({ error: 'Un campo tiene pocos caracteres (Usuario o contrasena)' });
    }

    if (edad < 16 || edad > 100) {
      return res.status(400).json({ error: 'edad invalido' });
    }

    const query = `UPDATE usuarios SET nombre = $1, apellido = $2, edad = $3, usuario = $4, contrasena = $5, foto_perfil = $6 WHERE id = $7`;

    await pool.query(query, [nombre, apellido, edad, usuario, contrasena, foto_perfil || null, id]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});



// DELETE. /usuarios (elimino un usuario por su id, pero no como parametro)
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const queryEliminarComentarioRecetas = `DELETE FROM comentarios WHERE id_receta IN (SELECT id FROM recetas WHERE id_usuario = $1)`;
    await pool.query(queryEliminarComentarioRecetas, [id]);

    const queryEliminarComentario = `DELETE FROM comentarios WHERE id_usuario = $1`;
    await pool.query(queryEliminarComentario, [id]);

    const queryEliminarReceta = `DELETE FROM recetas WHERE id_usuario = $1`;
    await pool.query(queryEliminarReceta, [id]);

    const query = `DELETE FROM usuarios WHERE id = $1`;
    await pool.query(query, [id]);

    res.status(200).json({ message: `Usuario con el id: ${id} fue eliminado` });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// GET /recetas (muestra todas las recetas)
app.get("/recetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recetas");
    res.json(result.rows);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las recetas" });
  }
});

// GET /recetas (muestra una receta por el id, con su respectivo usuario)
app.get("/recetas/:id", async(req, res) => {
  try{
    const id = req.params.id;
    const result = await pool.query(`SELECT r.*, u.usuario AS autor, u.foto_perfil AS autor_foto FROM recetas r LEFT JOIN usuarios u ON r.id_usuario = u.id WHERE r.id = $1`, [id]);

    res.status(200).json(result.rows[0]);

  }catch (error){
    res.status(500).json({ error: 'Error en el servidor' });
  }
})



// POST. /recetas (creo un receta)
app.post("/recetas", async (req, res) => {
  try {
    const id_usuario = req.body.id_usuario;
    const nombre = req.body.nombre;
    const ingredientes = req.body.ingredientes;
    const pasos = req.body.pasos;
    const descripcion = req.body.descripcion;
    const tiempo_preparacion = req.body.tiempo_preparacion;
    const comensales = req.body.comensales;
    const imagen_url = req.body.imagen_url;

    if (!id_usuario || !nombre.trim() || !Array.isArray(ingredientes) || ingredientes.length === 0 || !descripcion.trim() || !Array.isArray(pasos) || pasos.length === 0 || !tiempo_preparacion || !comensales || !imagen_url.trim()) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (tiempo_preparacion <= 0) {
      return res.status(400).json({ error: "Tiempo de preparación inválido" });
    }

    const query = `INSERT INTO recetas (id_usuario, nombre, ingredientes, pasos, descripcion, tiempo_preparacion, comensales, imagen_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;

    await pool.query(query, [id_usuario, nombre, ingredientes, pasos, descripcion, tiempo_preparacion, comensales, imagen_url]);

    res.status(201).json({ message: "Receta creada correctamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// PUT. /recetas/<id> (modifico una receta por id)
app.put("/recetas/:id", async (req, res) => {
  try {
    //guarda los valores
    const id = req.params.id;
    const nombre = req.body.nombre;
    const ingredientes = req.body.ingredientes;
    const pasos = req.body.pasos;
    const descripcion = req.body.descripcion;
    const tiempo_preparacion = req.body.tiempo_preparacion;
    const comensales = req.body.comensales;
    const imagen_url = req.body.imagen_url;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !Array.isArray(ingredientes) || ingredientes.length === 0 || !descripcion.trim() || !Array.isArray(pasos) || pasos.length === 0 || !tiempo_preparacion || !comensales || !imagen_url.trim()) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (tiempo_preparacion <= 0) {
      return res.status(400).json({ error: "Tiempo de preparación inválido" });
    }

    const query = `UPDATE recetas SET nombre = $1, descripcion = $2, tiempo_preparacion = $3, comensales = $4, imagen_url = $5, ingredientes = $6, pasos = $7 WHERE id = $8`;

    await pool.query(query, [ nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes, pasos, id]);
    
    res.status(200).json({ message: "Receta actualizada correctamente" });

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }

});

// DELETE. /recetas (elimino una receta por su id, pero no como parametro)
app.delete("/recetas", async (req, res) => {
  try {
    const id = req.body.id;

    const queryComentario = 'DELETE FROM comentarios WHERE id_receta = $1';
    const query = `DELETE FROM recetas WHERE id = $1`;

    await pool.query(queryComentario, [id]);
    await pool.query(query, [id]);

    res.status(204).json();
  } catch (error) {
    console.error("Error en DELETE /recetas:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
});





// GET /mis-recetas (muestra las recetas hechas por el usuario)
app.get("/mis-recetas", async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;

    if (!id_usuario) {
      return res.status(400).json({ error: "Falta id_usuario" });
    }

    const query = `SELECT id, nombre, tiempo_preparacion FROM recetas WHERE id_usuario = $1`;

    const result = await pool.query(query, [id_usuario]);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});


// GET /comentarios (todos)
app.get("/comentarios", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.usuario
      FROM comentarios c
      JOIN usuarios u ON u.id = c.id_usuario
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /comentarios/:id (uno por id)
app.get("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      `SELECT c.*, u.usuario
       FROM comentarios c
       JOIN usuarios u ON u.id = c.id_usuario
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});


// PUT /comentarios/:id (editar) solo dueño
app.put("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { id_usuario, descripcion } = req.body;

    if (!id_usuario || !descripcion || !descripcion.trim()) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const result = await pool.query(
      `UPDATE comentarios
       SET descripcion = $1
       WHERE id = $2 AND id_usuario = $3
       RETURNING *`,
      [descripcion.trim(), id, id_usuario]
    );

    if (result.rows.length === 0) {
      // puede ser: no existe o no sos dueño
      return res.status(403).json({ error: "No podés editar este comentario" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// DELETE /comentarios/:id  solo dueño
app.delete("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: "Falta id_usuario" });
    }

    const result = await pool.query(
      `DELETE FROM comentarios
       WHERE id = $1 AND id_usuario = $2
       RETURNING *`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "No podés borrar este comentario" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
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


// PUT /comentarios/:id/like
app.put("/comentarios/:id/like", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      `UPDATE comentarios SET likes = likes + 1 WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// PUT /comentarios/:id/dislike
app.put("/comentarios/:id/dislike", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      `UPDATE comentarios SET dislikes = dislikes + 1 WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
