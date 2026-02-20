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
  cargarComentarios();

  const estrellas = document.querySelectorAll("#star-rating .star");
  const puntajeInput = document.getElementById("puntaje");
  let valorEstrella = 0;

  estrellas.forEach(star => {
    star.addEventListener("click", () => {
      valorEstrella = Number(star.dataset.value);
      puntajeInput.value = valorEstrella;
      subirEstrella(valorEstrella);
    });
  });

  function subirEstrella(value) {
    estrellas.forEach(star => {
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
        subirEstrella(0);
        alert("Reseña enviada correctamente");
      } catch (err) {
        console.error(err);
        alert("No se pudo enviar la reseña");
      }
    });
  }

  function renderReceta(receta) {
    const ponerTexto = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    ponerTexto("receta-titulo", receta.nombre);
    ponerTexto("receta-tiempo", `${receta.tiempo_preparacion || "-"} min`);
    ponerTexto("receta-comensales", receta.comensales || "-");

    const autorEl = document.getElementById("receta-autor");
    if (autorEl) {
      const foto = receta.autor_foto || "https://via.placeholder.com/40";
      autorEl.innerHTML = `
        <img src="${foto}" alt="${receta.autor}" style="object-fit:cover;width:40px;height:40px;border-radius:50%;margin-right:10px;vertical-align:middle;">
        Creada por: @${receta.autor || "desconocido"}
      `;
    }

    const img = document.getElementById("receta-imagen");
    if (img) img.src = receta.imagen_url || "https://via.placeholder.com/800x400?text=Sin+Imagen";

    const ingredientes = document.getElementById("lista-ingredientes");
    if (ingredientes) {
      if (Array.isArray(receta.ingredientes)) {
        ingredientes.innerHTML = receta.ingredientes.map(ing => `<li>${ing}</li>`).join("");
      } else {
        ingredientes.innerHTML = "<li>(Ingredientes pendientes)</li>";
      }
    }

    const pasosContainer = document.getElementById("lista-pasos");
    if (pasosContainer) {
      if (Array.isArray(receta.pasos)) {
        pasosContainer.innerHTML = `
          <h2>Pasos</h2>
          ${receta.pasos.map(paso => `
            <div class="paso">
              <h3>Paso ${paso.numero_paso}</h3>
              <p>${paso.descripcion}</p>
              ${paso.imagen_url ? `
                <img 
                  src="${paso.imagen_url}" 
                  class="paso-img"
                  onerror="this.style.display='none'"
                >
              ` : ""}
            </div>
          `).join("")}
        `;
      } else {
        pasosContainer.innerHTML = "<p>(Pasos pendientes)</p>";
      }
    }
  }

  function agregarReview(c) {
    if (!reviewsContainer) return;

    const usuarioLogueado = Number(localStorage.getItem("id_usuario"));

    const starsHTML = renderizarEstrellas(Number(c.puntaje) || 0);

    const articulo = document.createElement("article");
    articulo.className = "review";

    articulo.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
        ${c.foto_perfil ? `<img src="${c.foto_perfil}" alt="${c.usuario}" class="user-avatar">` : ""}
        <strong>@${c.usuario || "usuario"}</strong> - ${starsHTML}
      </div>
      <p>${c.descripcion}</p>
      <div class="comentario-votos">
        <button class="btn-like" data-id="${c.id}">
          👍 <span class="like-count">${c.likes || 0}</span>
        </button>
        <button class="btn-dislike" data-id="${c.id}">
          👎 <span class="dislike-count">${c.dislikes || 0}</span>
        </button>
      </div>
    `;

    const botonLike = articulo.querySelector(".btn-like");
    const botonDislike = articulo.querySelector(".btn-dislike");

    botonLike.addEventListener("click", () => votarComentario(c.id, "like", articulo));
    botonDislike.addEventListener("click", () => votarComentario(c.id, "dislike", articulo));

    const votoGuardado = localStorage.getItem(`voto_comentario_${c.id}`);
    if (votoGuardado) {
        botonLike.disabled = true;
        botonDislike.disabled = true;
        botonLike.style.opacity = "0.5";
        botonDislike.style.opacity = "0.5";
    }

    if (usuarioLogueado === Number(c.id_usuario)) {
      const botones = document.createElement("div");
      botones.className = "comentario-botones";
      botones.innerHTML = `
        <button class="btn-editar" data-id="${c.id}">Editar</button>
        <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
      `;

      botones.querySelector(".btn-editar").addEventListener("click", () => iniciarEdicionComentario(c, articulo));
      botones.querySelector(".btn-eliminar").addEventListener("click", () => eliminarComentario(c.id));

      articulo.appendChild(botones);
    }

    reviewsContainer.appendChild(articulo);
  }

  async function votarComentario(id, tipo, articulo) {
      const storageKey = `voto_comentario_${id}`;
      const votoExistente = localStorage.getItem(storageKey);

      // Si ya votó cualquier cosa en este comentario, bloqueamos
      if (votoExistente) {
          alert(`Ya votaste este comentario con ${votoExistente === "like" ? "👍" : "👎"}`);
          return;
      }

      try {
          const res = await fetch(`http://localhost:3000/comentarios/votar/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tipo })
          });

          const data = await res.json();

          if (!res.ok) {
              alert(data.error || "Error al votar");
              return;
          }

          // Guardamos el voto en localStorage
          localStorage.setItem(storageKey, tipo);

          // Actualizamos los contadores en pantalla
          articulo.querySelector(".like-count").textContent = data.likes;
          articulo.querySelector(".dislike-count").textContent = data.dislikes;

          // Deshabilitamos ambos botones visualmente
          articulo.querySelector(".btn-like").disabled = true;
          articulo.querySelector(".btn-dislike").disabled = true;
          articulo.querySelector(".btn-like").style.opacity = "0.5";
          articulo.querySelector(".btn-dislike").style.opacity = "0.5";

      } catch (err) {
          console.error(err);
          alert("Error al votar");
      }
  }

  function renderizarEstrellas(puntaje) {
    let estrellasHTML = "";
    for (let i = 1; i <= 5; i++) {
      estrellasHTML += `<span class="star ${i <= puntaje ? "filled" : ""}">&#9733;</span>`;
    }
    return estrellasHTML;
  }

  async function iniciarEdicionComentario(c, articleEl) {
    const nuevaDesc = prompt("Editar comentario:", c.descripcion);
    if (!nuevaDesc || !nuevaDesc.trim()) return;

    const id_usuario = Number(localStorage.getItem("id_usuario"));
    if (!id_usuario) return alert("Tenés que iniciar sesión");

    try {
      const respuesta = await fetch(`http://localhost:3000/comentarios/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          descripcion: nuevaDesc.trim()
        })
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        alert(resultado.error || "No se pudo editar el comentario");
        return;
      }

      c.descripcion = resultado.descripcion;
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
      const respuesta = await fetch(`http://localhost:3000/comentarios/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      });

      if (!respuesta.ok) {
        const data = await respuesta.json();
        alert(data.error || "No se pudo borrar el comentario");
        return;
      }

      const review = reviewsContainer
        .querySelector(`.btn-eliminar[data-id='${id}']`)
        ?.closest("article");

      if (review) review.remove();

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

  async function cargarComentarios() {
    try {
      const respuesta = await fetch(`http://localhost:3000/recetas/${recetaId}/comentarios`);
      if (!respuesta.ok) throw new Error("Error al cargar comentarios");

      const comentarios = await respuesta.json();

      reviewsContainer.innerHTML = "";

      if (comentarios.length === 0) {
        reviewsContainer.innerHTML = "<p>No hay comentarios todavía</p>";
        contadorComentarios.textContent = 0;
        return;
      }

      comentarios.forEach(c => agregarReview(c));
      contadorComentarios.textContent = comentarios.length;

    } catch (err) {
      console.error(err);
    }
  }
});
