"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("recetas-container");
  const template = document.getElementById("receta-template");
  const contenedorPaginas = document.getElementById("paginacion");

  const idUsuario = localStorage.getItem("id_usuario");

  if (!idUsuario) {
    alert("Tenés que iniciar sesión para ver tus recetas");
    window.location.href = "login.html";
    return;
  }

  let recetas = [];
  const porPagina = 6; // 🔥 cantidad de recetas por página
  let paginaActual = 1;

  fetch(`http://localhost:3000/mis-recetas?id_usuario=${idUsuario}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar recetas");
      return res.json();
    })
    .then(data => {
      recetas = data;

      if (recetas.length === 0) {
        contenedor.innerHTML = "<p>No tenés recetas cargadas.</p>";
        return;
      }

      mostrarPagina();
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p>Error al cargar las recetas.</p>";
    });

  function mostrarPagina() {
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;
    const recetasPagina = recetas.slice(inicio, fin);

    contenedor.innerHTML = "";

    recetasPagina.forEach(receta => {
      const clon = template.content.cloneNode(true);

      // Datos básicos
      clon.querySelector(".receta-nombre").textContent = receta.nombre;
      clon.querySelector(".receta-tiempo").textContent =
        `🕐 ${receta.tiempo_preparacion} min`;

      clon.querySelector(".receta-imagen").src =
        receta.imagen_url || "https://via.placeholder.com/400x300";

      // ⭐ Promedio estrellas
      const promedio = Number(receta.promedio) || 0;
      const totalReseñas = Number(receta.total_reseñas) || 0;

      const stars = clon.querySelectorAll(".star");
      const reviewsEl = clon.querySelector(".reviews");
      const badgeEl = clon.querySelector(".receta-badge");

      stars.forEach(star => star.classList.add("empty"));

      for (let i = 0; i < promedio && i < stars.length; i++) {
        stars[i].classList.remove("empty");
      }

      if (reviewsEl) {
        reviewsEl.textContent = `${promedio}/5 (${totalReseñas} reseñas)`;
      }

      // 🏅 Badge comunidad
      if (badgeEl) {
        if (receta.elegida_comunidad === true) {
          badgeEl.textContent = "⭐ Elegido por la comunidad";
          badgeEl.style.display = "inline-block";
        } else {
          badgeEl.style.display = "none";
        }
      }

      // 🔘 Botones
      clon.querySelector(".btn-ver").onclick = () => {
        window.location.href = `ver-receta.html?id=${receta.id}`;
      };

      clon.querySelector(".btn-editar").onclick = () => {
        window.location.href = `editar-recetas.html?id=${receta.id}`;
      };

      clon.querySelector(".btn-eliminar").onclick = () => {
        if (!confirm("¿Seguro que querés eliminar esta receta?")) return;

        fetch("http://localhost:3000/recetas", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: receta.id })
        })
          .then(res => {
            if (!res.ok) throw new Error("Error al eliminar");
            alert("Receta eliminada");
            location.reload();
          })
          .catch(() => {
            alert("No se pudo eliminar la receta");
          });
      };

      contenedor.appendChild(clon);
    });

    generarPaginacion();
  }

  function generarPaginacion() {
    const totalPaginas = Math.ceil(recetas.length / porPagina);
    contenedorPaginas.innerHTML = "";

    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `page-btn ${i === paginaActual ? "active" : ""}`;

      btn.onclick = () => {
        paginaActual = i;
        mostrarPagina();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      contenedorPaginas.appendChild(btn);
    }
  }
});
