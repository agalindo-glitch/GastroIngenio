document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recetaId = params.get("id");

  if (!recetaId) {
    alert("No se encontró el ID de la receta");
    return;
  }

  window.recetaId = recetaId;

  fetch(`http://localhost:3000/recetas/${recetaId}/completo`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar receta");
      return res.json();
    })
    .then(receta => renderReceta(receta))
    .catch(err => {
      console.error(err);
      alert("No se pudo cargar la receta");
    });
});

function renderReceta(receta) {
  // Función auxiliar para setear texto
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // Título
  set("receta-titulo", receta.nombre);

  // Autor con foto
  const autorEl = document.getElementById("receta-autor");
  if (autorEl) {
    const foto = receta.autor_foto ? receta.autor_foto : "https://imgs.search.brave.com/0CKikgFuIDhaHzW-9hUB0bekNgxrXXrUDzkgCe7ZzPY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8x/MC8wNS8yMi8zNy9i/bGFuay1wcm9maWxl/LXBpY3R1cmUtOTcz/NDYwXzY0MC5wbmc";
    autorEl.innerHTML = `
      <img src="${foto}" alt="${receta.autor}" style="width:40px; height:40px; border-radius:50%; margin-right:10px; vertical-align:middle;">
      Creada por: @${receta.autor}
    `;
  }

  // Imagen de la receta
  const recetaImg = document.getElementById("receta-imagen");
  if (recetaImg && receta.imagen_url) {
    recetaImg.src = receta.imagen_url;
  }

  // Tiempo de preparación y comensales
  set("receta-tiempo", `${receta.tiempo_preparacion} min`);
  set("receta-comensales", receta.comensales || "-");

  // Ingredientes
  const ingredientesList = document.getElementById("lista-ingredientes");
  if (ingredientesList) {
    if (Array.isArray(receta.ingredientes) && receta.ingredientes.length) {
      ingredientesList.innerHTML = receta.ingredientes
        .map(ing => `<li>${ing.nombre}${ing.cantidad ? `: ${ing.cantidad}${ing.unidad ? ' ' + ing.unidad : ''}` : ''}</li>`)
        .join("");
    } else {
      ingredientesList.innerHTML = "<li>(Ingredientes pendientes)</li>";
    }
  }

  // Pasos
  const pasosContainer = document.getElementById("lista-pasos");
  if (pasosContainer) {
    if (Array.isArray(receta.pasos) && receta.pasos.length) {
      pasosContainer.innerHTML = receta.pasos
        .map(p => `
          <div class="paso">
            <h3>Paso ${p.numero}</h3>
            <p>${p.descripcion}</p>
            ${p.foto_url ? `<img src="${p.foto_url}" alt="Paso ${p.numero}">` : ""}
          </div>
        `)
        .join("");
    } else {
      pasosContainer.innerHTML = "<p>(Pasos pendientes)</p>";
    }
  }

  // Fecha de creación
  const fecha = new Date(receta.fecha_creacion);
  const fechaStr = fecha.toLocaleDateString("es-AR", { year: 'numeric', month: 'long', day: 'numeric' });
  set("receta-fecha", `Creada el: ${fechaStr}`);

  // Elegidos por la comunidad
  if (receta.elegidos_comunidad) {
    const comunidadBadge = document.createElement("span");
    comunidadBadge.textContent = "⭐ Elegida por la comunidad";
    comunidadBadge.style.color = "#F28C43";
    comunidadBadge.style.fontWeight = "bold";
    const header = document.querySelector(".receta-header");
    if (header) header.appendChild(comunidadBadge);
  }

  // Reseñas / comentarios
  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  reviews.innerHTML = "";

  const total = receta.comentarios?.length || 0;
  const contador = document.getElementById("comentarios-count");
  if (contador) contador.textContent = total;

  if (total === 0) {
    reviews.innerHTML = "<p>No hay reseñas todavía</p>";
    return;
  }

  receta.comentarios.slice(0, 3).forEach(c => agregarReview(c));
}

function agregarReview(c) {
  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  const article = document.createElement("article");
  article.className = "review";

  const usuarioLogueado = Number(localStorage.getItem("id_usuario"));

  article.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
      ${c.foto_perfil ? `<img src="${c.foto_perfil}" alt="${c.autor}" style="width:40px; height:40px; border-radius:50%;">` : ''}
      <strong>@${c.autor}</strong>
    </div>
    <p>${c.descripcion}</p>
    <small>👍 ${c.likes} | 👎 ${c.dislikes}</small>
  `;

  if (usuarioLogueado === c.id_usuario) {
    const botones = document.createElement("div");
    botones.className = "comentario-botones";

    botones.innerHTML = `
      <button class="btn-editar" data-id="${c.id}">Editar</button>
      <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
    `;

    botones.querySelector(".btn-editar").addEventListener("click", () => {
      iniciarEdicionComentario(c, article);
    });

    botones.querySelector(".btn-eliminar").addEventListener("click", () => {
      eliminarComentario(c.id);
    });

    article.appendChild(botones);
  }

  reviews.appendChild(article);
}
