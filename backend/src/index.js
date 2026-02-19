import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});

// GET. /usuarios (busco todos los usuarios de la tabla) //ELIMINAR CUANDO SE FINALICE EL PROYECTO
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
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    const foto_perfil = req.body.foto_perfil || null;

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

    const query = `INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6)`;
    await pool.query(query, [nombre, apellido, edad, usuario, contrasena, foto_perfil || null]);

    res.status(200).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT. /usuarios/<id> (modifico un usuario por id)
app.put("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    const foto_perfil = req.body.foto_perfil;

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

    const queryEliminarPasos = `DELETE FROM pasos WHERE id_receta IN (SELECT id FROM recetas WHERE id_usuario = $1)`;
    await pool.query(queryEliminarPasos, [id]);

    const queryEliminarReceta = `DELETE FROM recetas WHERE id_usuario = $1`;
    await pool.query(queryEliminarReceta, [id]);

    const query = `DELETE FROM usuarios WHERE id = $1`;
    await pool.query(query, [id]);

    res.status(200).json({ message: `Usuario con el id: ${id} fue eliminado` });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET. /recetas (muestra todas las recetas) //ELIMINAR CUANDO SE FINALICE EL PROYECTO
app.get("/recetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recetas");
    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las recetas" });
  }
});

// POST. /recetas (crear receta)
app.post("/recetas", async (req, res) => {
  try {
    const {id_usuario, nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes, pasos} = req.body;

    if (!id_usuario || !nombre?.trim() || !descripcion?.trim() || !comensales || comensales <= 0 || !Array.isArray(ingredientes) || ingredientes.length === 0 || !Array.isArray(pasos) || pasos.length === 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const recetaInsert = await pool.query(`INSERT INTO recetas (id_usuario, nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, [id_usuario, nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes]);

    const id_receta = recetaInsert.rows[0].id;

    for (let i = 0; i < pasos.length; i++) {
      await pool.query(`INSERT INTO pasos (id_receta, numero_paso, descripcion, imagen_url) VALUES ($1,$2,$3,$4)`, [id_receta, i + 1, pasos[i].descripcion, pasos[i].imagen_url || null]);
    }

    res.status(201).json({ message: "Receta creada correctamente", id: id_receta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


app.get("/recetas/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const receta = await pool.query(`SELECT r.*, u.usuario AS autor, u.foto_perfil AS autor_foto, COALESCE(ROUND(AVG(c.puntaje)),0) AS promedio, COUNT(c.id) AS total_reseñas FROM recetas r LEFT JOIN usuarios u ON r.id_usuario = u.id LEFT JOIN comentarios c ON c.id_receta = r.id WHERE r.id = $1 GROUP BY r.id, r.id_usuario, r.nombre, r.descripcion, r.tiempo_preparacion, r.comensales, r.imagen_url, r.ingredientes, u.usuario, u.foto_perfil`, [id]);

    const pasos = await pool.query(`SELECT numero_paso, descripcion, imagen_url FROM pasos WHERE id_receta = $1 ORDER BY numero_paso ASC`, [id]);

    if (receta.rows.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const recetaData = receta.rows[0];
    recetaData.pasos = pasos.rows;

    res.json(recetaData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// PUT. /recetas/<id> (modifico una receta por id)
app.put("/recetas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {nombre, ingredientes, pasos, descripcion, tiempo_preparacion, comensales, imagen_url} = req.body;

    if (!nombre?.trim() || !descripcion?.trim() || !comensales || comensales <= 0 || !Array.isArray(ingredientes) || ingredientes.length === 0 || !Array.isArray(pasos) || pasos.length === 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await pool.query(`UPDATE recetas SET nombre = $1, descripcion = $2, tiempo_preparacion = $3, comensales = $4, imagen_url = $5, ingredientes = $6 WHERE id = $7`, [nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes, pasos, id]);

    res.json({ message: "Receta actualizada correctamente" });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// DELETE. /recetas (elimino una receta por su id, pero no como parametro)
app.delete("/recetas", async (req, res) => {
  try {
    const id = req.body.id;

    const deletePasos = 'DELETE FROM pasos WHERE id_receta = $1';
    const deleteComentarios = 'DELETE FROM comentarios WHERE id_receta = $1';
    const deleteReceta = 'DELETE FROM recetas WHERE id = $1';

    await pool.query(deletePasos, [id]);
    await pool.query(deleteComentarios, [id]);
    await pool.query(deleteReceta, [id]);

    res.status(204).json();
  } catch (error) {
    console.error("Error en DELETE /recetas:", error);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
});

// GET. /recetaRandomComunidad
app.get("/recetaRandomComunidad", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM (SELECT r.*, COALESCE(ROUND(AVG(c.puntaje)), 0) AS promedio, COUNT(c.id) AS total_reseñas FROM recetas r LEFT JOIN comentarios c ON c.id_receta = r.id GROUP BY r.id HAVING COUNT(c.id) > 0 ORDER BY ROUND(AVG(c.puntaje)) DESC, COUNT(c.id) DESC LIMIT 10) AS top10 ORDER BY RANDOM() LIMIT 1`);

    if (result.rows.length === 0) return res.json(null);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/recetas-recientes", async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, nombre, imagen_url, fecha_creacion FROM recetas ORDER BY fecha_creacion DESC LIMIT 5`);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo recetas recientes" });
  }
});

// GET /trends 
app.get("/trends", async (req, res) => {
  try {
    const result = await pool.query(`SELECT r.id, r.nombre, r.imagen_url, r.tiempo_preparacion, r.id_usuario, u.usuario AS autor, u.foto_perfil AS autor_foto, COUNT(c.id) AS total_comentarios, COALESCE(ROUND(AVG(c.puntaje)), 0) AS promedio FROM recetas r LEFT JOIN comentarios c ON c.id_receta = r.id LEFT JOIN usuarios u ON u.id = r.id_usuario GROUP BY r.id, u.usuario, u.foto_perfil ORDER BY COUNT(c.id) DESC LIMIT 4`);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /mis-recetas 
app.get("/mis-recetas", async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) return res.status(400).json({ error: "Falta id_usuario" });

    const query = `SELECT r.id, r.nombre, r.tiempo_preparacion, r.comensales, r.imagen_url, r.elegida_comunidad, COALESCE(ROUND(AVG(c.puntaje)),0) AS promedio, COUNT(c.id) AS total_reseñas FROM recetas r LEFT JOIN comentarios c ON c.id_receta = r.id WHERE r.id_usuario = $1 GROUP BY r.id ORDER BY r.id DESC`;

    const result = await pool.query(query, [id_usuario]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

// POST /comentarios 
app.post("/comentarios", async (req, res) => {
  try {
    const id_usuario = req.body.id_usuario;
    const id_receta = req.body.id_receta;
    const descripcion = req.body.descripcion;
    const puntaje = req.body.puntaje;

    if (!id_usuario || !id_receta || descripcion.length <= 0) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const insert = await pool.query(`INSERT INTO comentarios (id_usuario, id_receta, descripcion, puntaje) VALUES ($1,$2,$3,$4) RETURNING id`, [id_usuario, id_receta, descripcion.trim(), puntaje]);

    const idNuevo = insert.rows[0].id;

    const result = await pool.query(`SELECT c.*, u.usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id = $1`, [idNuevo]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// PUT /actualizarElegidasComunidad
app.put("/actualizarElegidasComunidad", async (req, res) => {
  try {
    await pool.query(`UPDATE recetas SET elegida_comunidad = FALSE`);

    await pool.query(`UPDATE recetas SET elegida_comunidad = TRUE WHERE id IN (SELECT r.id FROM recetas r LEFT JOIN comentarios c ON c.id_receta = r.id GROUP BY r.id HAVING COUNT(c.id) > 0 ORDER BY ROUND(AVG(c.puntaje)) DESC, COUNT(c.id) DESC LIMIT 10)`);

    res.json({ message: "Recetas elegidas por la comunidad actualizadas" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /comentarios 
app.get("/comentarios", async (req, res) => {
  try {

    const result = await pool.query(`SELECT c.*, u.usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario ORDER BY c.id DESC`);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /comentarios/:id 
app.get("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(`SELECT c.*, u.usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /recetas/:id/comentarios 
app.get("/recetas/:id/comentarios", async (req, res) => {
  try {
    const id_receta = Number(req.params.id);

    const result = await pool.query(`SELECT c.*, u.usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id_receta = $1 ORDER BY c.id DESC`, [id_receta]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// PUT /comentarios/:id 
app.put("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const id_usuario = req.body.id_usuario;
    const descripcion = req.body.descripcion;
    const puntaje = req.body.puntaje;

    if (!id_usuario || !descripcion || !descripcion.trim()) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let puntajeNum = null;

    if (puntaje !== undefined) {
      puntajeNum = Number(puntaje);
      if (isNaN(puntajeNum) || puntajeNum < 0 || puntajeNum > 5) {
        return res.status(406).json({ error: "Puntaje inválido (0-5)" });
      }
    }

    const cambio = await pool.query(`UPDATE comentarios SET descripcion = $1, puntaje = COALESCE($2, puntaje) WHERE id = $3 AND id_usuario = $4 RETURNING *`, [descripcion.trim(), puntajeNum, id, id_usuario]);

    if (cambio.rows.length === 0) {
      return res.status(403).json({ error: "No podés editar este comentario" });
    }

    const resultado = await pool.query(`SELECT c.*, u.usuario, u.foto_perfil FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id = $1`, [id]);

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// DELETE /comentarios/:id
app.delete("/comentarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const id_usuario = req.body.id_usuario;

    if (!id_usuario) {
      return res.status(400).json({ error: "Falta id_usuario" });
    }

    const result = await pool.query(`DELETE FROM comentarios WHERE id = $1 AND id_usuario = $2 RETURNING *`, [id, id_usuario]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "No podés borrar este comentario" });
    }

    res.status(204).send();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// PUT /comentarios/votar/:id
app.put("/comentarios/votar/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { tipo } = req.body;

    if (!["like", "dislike"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const campo = tipo === "like" ? "likes" : "dislikes";

    const result = await pool.query(`UPDATE comentarios SET ${campo} = ${campo} + 1 WHERE id = $1 RETURNING likes, dislikes`, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando voto" });
  }
});


//POST. /login (un usuario se logea)
app.post("/login", async (req, res) => {
  try{
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    const query = `SELECT id, usuario FROM usuarios WHERE usuario = $1 AND contrasena = $2`;

    const resultados = await pool.query(query, [usuario, contrasena]);

    if (resultados.rows.length === 0){
      return res.status(401).send("No existe el usuario");
    }

    res.json(resultados.rows[0]);
  }catch(error){
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET. /usuariosPosts/<id>
app.get("/usuariosPosts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(`SELECT u.id, COUNT(r.id) AS posts FROM usuarios u LEFT JOIN recetas r ON r.id_usuario = u.id WHERE u.id = $1 GROUP BY u.id`, [id]);

    if (result.rows.length === 0) {
      return res.json({ usuario_id: id, posts: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// GET. /usuariosElegidas/:id (cantidad de recetas elegidas por la comunidad)
app.get("/usuariosElegidas/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(`SELECT COUNT(*) AS elegidas FROM recetas WHERE id_usuario = $1 AND elegida_comunidad = TRUE`, [id]);

    res.json({ elegidas: Number(result.rows[0].elegidas) });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
