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
    const foto_perfil = req.body.foto_perfil;

    //trim() sirve para que no te permita dejar espacios en blanco
    if (!nombre.trim() || !apellido.trim() || !edad || !usuario.trim() || !contrasena.trim()) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o están vacíos' });
    }

    if (foto_perfil && foto_perfil.length > 255) {
      return res.status(400).json({ error: 'URL de foto demasiado larga' });
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
    INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena, foto_perfil)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;


    await pool.query(query, [
      nombre,
      apellido,
      edad,
      usuario,
      contrasena,
      foto_perfil || null
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
    const foto_perfil = req.body.foto_perfil;


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
    SET nombre = $1,
        apellido = $2,
        edad = $3,
        usuario = $4,
        contrasena = $5,
        foto_perfil = $6
    WHERE id = $7
    `;


    await pool.query(query, [
      nombre,
      apellido,
      edad,
      usuario,
      contrasena,
      foto_perfil || null,
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

app.get("/usuarios/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});


// GET. /recetas (busco todos los recetas de la tabla)
app.get("/recetas", async (req, res) => {
  const { id_usuario } = req.query;

  let query = "SELECT * FROM recetas";
  let params = [];

  if (id_usuario) {
    query = `
      SELECT r.*
      FROM recetas r
      WHERE NOT EXISTS (
        SELECT 1 FROM bloqueados b
        WHERE b.bloqueador_id = $1
        AND b.bloqueado_id = r.id_usuario
      )
    `;
    params = [id_usuario];
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
});


// GET. /recetas/<id> (busco una receta por su id)
app.get("/recetas/:id", async (req, res) => {
  try {
    const id = req.params.id;


    const recetaQuery = `
      SELECT r.*, u.usuario AS autor
      FROM recetas r
      JOIN usuarios u ON u.id = r.id_usuario
      WHERE r.id = $1
    `;
    const recetaResult = await pool.query(recetaQuery, [id]);

    if (recetaResult.rows.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const receta = recetaResult.rows[0];

    const comentariosQuery = `
      SELECT c.*, u.usuario
      FROM comentarios c
      JOIN usuarios u ON u.id = c.id_usuario
      WHERE c.id_receta = $1
    `;
    const comentariosResult = await pool.query(comentariosQuery, [id]);

    receta.comentarios = comentariosResult.rows;

    res.json(receta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /mis-recetas?id_usuario=1
app.get("/mis-recetas", async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;

    if (!id_usuario) {
      return res.status(400).json({ error: "Falta id_usuario" });
    }

    const query = `
      SELECT id, nombre, categoria, tiempo_preparacion
      FROM recetas
      WHERE id_usuario = $1
    `;

    const result = await pool.query(query, [id_usuario]);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
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

// GET /recetas/:id/comentarios/resumen (cantidad + top 3)
app.get("/recetas/:id/comentarios/resumen", async (req, res) => {
  try {
    const id_receta = Number(req.params.id);

    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM comentarios
       WHERE id_receta = $1`,
      [id_receta]
    );

    const top3Result = await pool.query(
      `SELECT c.*, u.usuario
       FROM comentarios c
       JOIN usuarios u ON u.id = c.id_usuario
       WHERE c.id_receta = $1
       ORDER BY c.id DESC
       LIMIT 3`,
      [id_receta]
    );

    res.json({
      total: totalResult.rows[0].total,
      top3: top3Result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});



// POST /comentarios (crear)
app.post("/comentarios", async (req, res) => {
  try {
    const { id_usuario, id_receta, descripcion } = req.body;
    const likes = req.body.likes ?? 0;
    const dislikes = req.body.dislikes ?? 0;

    if (!id_usuario || !id_receta || !descripcion || !descripcion.trim()) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    if (likes < 0 || dislikes < 0) {
      return res.status(406).json({ error: "Likes/Dislikes inválidos" });
    }

    const result = await pool.query(
      `INSERT INTO comentarios (id_usuario, id_receta, descripcion, likes, dislikes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_usuario, id_receta, descripcion.trim(), likes, dislikes]
    );

    // devolvemos también el usuario (para render instantáneo)
    const comment = result.rows[0];
    const userRes = await pool.query(`SELECT usuario FROM usuarios WHERE id = $1`, [comment.id_usuario]);
    comment.usuario = userRes.rows[0]?.usuario ?? "";

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
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

// POST /seguidores (seguir usuario)
app.post("/seguidores", async (req, res) => {
  try {
    const { seguidor_id, seguido_id } = req.body;

    if (!seguidor_id || !seguido_id) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const query = `
      INSERT INTO seguidores (seguidor_id, seguido_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;

    await pool.query(query, [seguidor_id, seguido_id]);

    res.status(201).json({ message: "Usuario seguido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB error" });
  }
});

// DELETE /seguidores (dejar de seguir)
app.delete("/seguidores", async (req, res) => {
  try {
    const { seguidor_id, seguido_id } = req.body;

    await pool.query(
      "DELETE FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2",
      [seguidor_id, seguido_id]
    );

    res.status(200).json({ message: "Dejaste de seguir al usuario" });
  } catch (error) {
    res.status(500).json({ error: "DB error" });
  }
});

// GET /seguidores/estado?seguidor_id=1&seguido_id=2
app.get("/seguidores/estado", async (req, res) => {
  const { seguidor_id, seguido_id } = req.query;

  const result = await pool.query(
    "SELECT 1 FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2",
    [seguidor_id, seguido_id]
  );

  res.json({ sigue: result.rows.length > 0 });
});

// GET /seguidores/count/:id
app.get("/seguidores/count/:id", async (req, res) => {
  const id = req.params.id;

  const result = await pool.query(
    "SELECT COUNT(*) FROM seguidores WHERE seguido_id = $1",
    [id]
  );

  res.json({ seguidores: Number(result.rows[0].count) });
});

// GET /seguidos/count/:id
app.get("/seguidos/count/:id", async (req, res) => {
  const id = req.params.id;

  const result = await pool.query(
    "SELECT COUNT(*) FROM seguidores WHERE seguidor_id = $1",
    [id]
  );

  res.json({ siguiendo: Number(result.rows[0].count) });
});

// POST /bloqueados
app.post("/bloqueados", async (req, res) => {
  const { bloqueador_id, bloqueado_id } = req.body;

  await pool.query(
    "INSERT INTO bloqueados (bloqueador_id, bloqueado_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [bloqueador_id, bloqueado_id]
  );

  res.status(201).json({ message: "Usuario bloqueado" });
});

// GET /tags
app.get("/tags", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY nombre ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

// POST /recetas/:id/tags
app.post("/recetas/:id/tags", async (req, res) => {
  try {
    const id_receta = req.params.id;
    const { tags } = req.body;

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Debe enviar un array de tags" });
    }

    const insertQuery = `
      INSERT INTO receta_tag (id_receta, id_tag)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;

    for (const tagId of tags) {
      await pool.query(insertQuery, [id_receta, tagId]);
    }

    res.status(201).json({ message: "Tags asignados correctamente" });
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

// GET /recetas/:id/tags
app.get("/recetas/:id/tags", async (req, res) => {
  try {
    const id_receta = req.params.id;

    const result = await pool.query(
      `SELECT t.*
       FROM tags t
       JOIN receta_tag rt ON rt.id_tag = t.id
       WHERE rt.id_receta = $1`,
      [id_receta]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

// DELETE /recetas/:id/tags/:tagId
app.delete("/recetas/:id/tags/:tagId", async (req, res) => {
  try {
    const { id, tagId } = req.params;

    await pool.query(
      "DELETE FROM receta_tag WHERE id_receta = $1 AND id_tag = $2",
      [id, tagId]
    );

    res.json({ message: "Tag removido de la receta" });
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

