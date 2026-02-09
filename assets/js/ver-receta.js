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

      if (!id_usuario) return alert("Tenés que iniciar sesión para comentar");
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

        const respuesta = await res.json();

        if (!res.ok) {
          alert(respuesta.error || "No se pudo enviar la reseña");
          return;
        }

        agregarReview(respuesta);

        if (contadorComentarios) {
          const actual = Number(contadorComentarios.textContent) || 0;
          contadorComentarios.textContent = actual + 1;
        }

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
    if (imgEl) imgEl.src = receta.imagen_url || "https://via.placeholder.com/800x400?text=Sin+Imagen";

    const ingList = document.getElementById("lista-ingredientes");
    if (ingList) {
      if (Array.isArray(receta.ingredientes)) {
        ingList.innerHTML = receta.ingredientes.map(ing => `<li>${ing}</li>`).join("");
      } else {
        ingList.innerHTML = "<li>(Ingredientes pendientes)</li>";
      }
    }

    const pasosContainer = document.getElementById("lista-pasos");
    if (pasosContainer) {
      if (Array.isArray(receta.pasos)) {
        pasosContainer.innerHTML = `
          <h2>Pasos</h2>
          ${receta.pasos.map((paso, index) => `
            <div class="paso">
              <h3>Paso ${index + 1}</h3>
              <p>${paso}</p>
            </div>
          `).join("")}
        `;
      } else {
        pasosContainer.innerHTML = "<p>(Pasos pendientes)</p>";
      }
    }

    if (reviewsContainer) {
      reviewsContainer.innerHTML = "";
      if (Array.isArray(receta.comentarios) && receta.comentarios.length) {
        receta.comentarios.forEach(c => agregarReview(c));
        if (contadorComentarios) contadorComentarios.textContent = receta.comentarios.length;
      } else {
        if (contadorComentarios) contadorComentarios.textContent = 0;
        reviewsContainer.innerHTML = "<p>No hay comentarios todavía</p>";
      }
    }
  }

  function agregarReview(c) {
    if (!reviewsContainer) return;

    const usuarioLogueado = Number(localStorage.getItem("id_usuario"));

    const starsHTML = renderStars(Number(c.puntaje) || 0);

    const article = document.createElement("article");
    article.className = "review";

    article.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
        ${c.foto_perfil ? `<img src="${c.foto_perfil}" alt="${c.usuario}" style="width:40px;height:40px;border-radius:50%;">` : ""}
        <strong>@${c.usuario || "usuario"}</strong> - ${starsHTML}
      </div>
      <p>${c.descripcion}</p>
      <small>👍 ${c.likes || 0} | 👎 ${c.dislikes || 0}</small>
    `;

    if (usuarioLogueado === Number(c.id_usuario)) {
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
      starsHTML += `<span class="star ${i <= puntaje ? "filled" : ""}">&#9733;</span>`;
    }
    return starsHTML;
  }

  async function iniciarEdicionComentario(c, articleEl) {
    const nuevaDesc = prompt("Editar comentario:", c.descripcion);
    if (!nuevaDesc || !nuevaDesc.trim()) return;

    const id_usuario = Number(localStorage.getItem("id_usuario"));
    if (!id_usuario) return alert("Tenés que iniciar sesión");

    try {
      const res = await fetch(`http://localhost:3000/comentarios/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          descripcion: nuevaDesc.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo editar el comentario");
        return;
      }

      c.descripcion = data.descripcion;
      articleEl.querySelector("p").textContent = c.descripcion;

      alert("Comentario editado");
    } catch (err) {
      console.error(err);
      alert("Error de red o servidor");
    }
  }

  async function eliminarComentario(id) {
    if (!confirm("¿Seguro que querés eliminar este comentario?")) return;

    const id_usuario = Number(localStorage.getItem("id_usuario"));
    if (!id_usuario) return alert("Tenés que iniciar sesión");

    try {
      const res = await fetch(`http://localhost:3000/comentarios/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "No se pudo borrar el comentario");
        return;
      }

      const reviewEl = reviewsContainer
        .querySelector(`.btn-eliminar[data-id='${id}']`)
        ?.closest("article");

      if (reviewEl) reviewEl.remove();

      bajarContadorComentarios();
      alert("Comentario eliminado");
    } catch (err) {
      console.error(err);
      alert("Error de red o servidor");
    }
  }

  function bajarContadorComentarios() {
    if (!contadorComentarios) return;
    const actual = Number(contadorComentarios.textContent) || 0;
    contadorComentarios.textContent = Math.max(0, actual - 1);
  }
});
