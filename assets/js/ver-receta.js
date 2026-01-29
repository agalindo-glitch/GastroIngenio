"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recetaId = params.get("id");
  if (!recetaId) {
    alert("No se encontró el ID de la receta");
    return;
  }
  window.recetaId = recetaId;

  const reviewsContainer = document.getElementById("lista-reviews");
  const contadorComentarios = document.getElementById("comentarios-count");

  async function cargarReceta() {
    try {
      const res = await fetch(`http://localhost:3000/recetas/${recetaId}`);
      if (!res.ok) throw new Error(`Error al cargar receta: ${res.status}`);
      const receta = await res.json();
      renderReceta(receta);
    } catch (err) {
      console.error(err);
      if (reviewsContainer) reviewsContainer.innerHTML = "<p>No se pudo cargar la receta</p>";
      alert("No se pudo cargar la receta");
    }
  }

  cargarReceta();

  const stars = document.querySelectorAll("#star-rating .star");
  const puntajeInput = document.getElementById("puntaje");
  console.log("Valor de puntajeInput", puntajeInput);
  let ratingValue = 0;

  stars.forEach(star => {
    star.addEventListener("click", () => {
      ratingValue = Number(star.dataset.value);
      puntajeInput.value = ratingValue;
      updateStars(ratingValue);
    });
  });

  function updateStars(value) {
    stars.forEach(star => {
      star.classList.toggle("filled", Number(star.dataset.value) <= value);
    });
  }

  const form = document.getElementById("form-review");
  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const puntaje = Number(puntajeInput.value);
      const comentario = document.getElementById("comentario").value.trim();
      const id_usuario = Number(localStorage.getItem("id_usuario"));

      if (!puntaje) return alert("Por favor, selecciona un puntaje");
      if (!comentario) return alert("Por favor, escribe un comentario");

      const data = {
        id_usuario,
        id_receta: Number(window.recetaId),
        descripcion: comentario,
        puntaje: puntaje, 
        likes: 0,
        dislikes: 0
      };

      try {
        const res = await fetch("http://localhost:3000/comentarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al enviar la reseña");

        const nuevaReseña = await res.json();
        agregarReview(nuevaReseña);

        form.reset();
        puntajeInput.value = 0;
        updateStars(0);
        alert("Reseña enviada correctamente");
      } catch (err) {
        console.error(err);
        alert("No se pudo enviar la reseña");
      }
    });
  }

  async function cargarComentarios() {
    if (!reviewsContainer) return;
    try {
      const res = await fetch(`http://localhost:3000/recetas/${window.recetaId}/comentarios/resumen`);
      if (!res.ok) throw new Error(`Error al obtener comentarios: ${res.status}`);
      const data = await res.json();

      reviewsContainer.innerHTML = "";
      const total = data.total || 0;
      if (contadorComentarios) contadorComentarios.textContent = total;

      if (!data.top3 || data.top3.length === 0) {
        reviewsContainer.innerHTML = "<p>No hay comentarios todavía</p>";
        return;
      }

      data.top3.forEach(c => agregarReview(c));

      if (total > 3) {
        const aviso = document.createElement("p");
        aviso.className = "has-text-grey mt-2";
        aviso.textContent = `Mostrando solo los primeros 3 comentarios de ${total}`;
        reviewsContainer.appendChild(aviso);
      }

    } catch (err) {
      console.error(err);
      reviewsContainer.innerHTML = "<p>Error al cargar comentarios</p>";
    }
  }

  cargarComentarios();

  function renderReceta(receta) {
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("receta-titulo", receta.nombre);
    setText("receta-tiempo", `${receta.tiempo_preparacion || "-"} min`);
    setText("receta-comensales", receta.comensales || "-");

    const autorEl = document.getElementById("receta-autor");
    if (autorEl) {
      const foto = receta.autor_foto || "https://via.placeholder.com/40";
      autorEl.innerHTML = `
        <img src="${foto}" alt="${receta.autor}" style="width:40px;height:40px;border-radius:50%;margin-right:10px;vertical-align:middle;">
        Creada por: @${receta.autor || "desconocido"}
      `;
    }

    const imgEl = document.getElementById("receta-imagen");
    if (imgEl && receta.imagen_url) imgEl.src = receta.imagen_url;

    const ingList = document.getElementById("lista-ingredientes");

    if (ingList) {
      if (Array.isArray(receta.ingredientes)) {
        ingList.innerHTML = receta.ingredientes.map(ing => `<li>${ing}</li>`).join("");
      } else ingList.innerHTML = "<li>(Ingredientes pendientes)</li>";
    }

    const pasosContainer = document.getElementById("lista-pasos");
    if (pasosContainer) {
      if (Array.isArray(receta.pasos)) {
        pasosContainer.innerHTML = receta.pasos.map((paso, index) => `<div class="paso"><h3>Paso ${index + 1}</h3><p>${paso}</p></div>`).join("");
      } else pasosContainer.innerHTML = "<p>(Pasos pendientes)</p>";
    }

    if (Array.isArray(receta.comentarios) && receta.comentarios.length) {
      receta.comentarios.forEach(c => agregarReview(c));
      if (contadorComentarios) contadorComentarios.textContent = receta.comentarios.length;
    }
  }

  function agregarReview(c) {
    if (!reviewsContainer) return;

    const usuarioLogueado = Number(localStorage.getItem("id_usuario"));

    const starsHTML = renderStars(c.puntaje);

    const article = document.createElement("article");
    article.className = "review";

    article.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
        ${c.foto_perfil ? `<img src="${c.foto_perfil}" alt="${c.usuario}" style="width:40px;height:40px;border-radius:50%;">` : ''}
        <strong>@${c.usuario}</strong> - ${starsHTML}
      </div>
      <p>${c.descripcion}</p>
      <small>👍 ${c.likes || 0} | 👎 ${c.dislikes || 0}</small>
    `;

    if (usuarioLogueado === c.id_usuario) {
      const botones = document.createElement("div");
      botones.className = "comentario-botones";
      botones.innerHTML = `
        <button class="btn-editar" data-id="${c.id}">Editar</button>
        <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
      `;
      botones.querySelector(".btn-editar").addEventListener("click", () => iniciarEdicionComentario(c, article));
      botones.querySelector(".btn-eliminar").addEventListener("click", () => eliminarComentario(c.id));
      article.appendChild(botones);
    }

    reviewsContainer.appendChild(article);
  }


  function renderStars(puntaje) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      starsHTML += `<span class="star ${i <= puntaje ? 'filled' : ''}">&#9733;</span>`;
    }
    return starsHTML;
  }

  function iniciarEdicionComentario(c, articleEl) {
    const nuevaDesc = prompt("Editar comentario:", c.descripcion);
    if (nuevaDesc && nuevaDesc.trim() !== "") {
      c.descripcion = nuevaDesc.trim();
      articleEl.querySelector("p").textContent = c.descripcion;
      console.log("💬 Comentario editado localmente:", c);
    }
  }

  function eliminarComentario(id) {
    if (!confirm("¿Seguro que quieres eliminar este comentario?")) return;
    const reviewEl = reviewsContainer.querySelector(`.btn-eliminar[data-id='${id}']`)?.closest("article");
    if (reviewEl) reviewsContainer.removeChild(reviewEl);
    console.log("💬 Comentario eliminado localmente:", id);
  }
});
