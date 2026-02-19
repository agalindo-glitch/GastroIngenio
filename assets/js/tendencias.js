"use strict";

const API_RECETAS = "http://localhost:3000/recetas";
const AVATAR_DEFAULT = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const contenedorTendencias = document.querySelector(".trends__list");

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(url);
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetch:", err);
    return null;
  }
}

function calcularPromedio(comentarios = []) {
  if (!comentarios.length) {
    return { promedio: 0, total: 0 };
  }

  const suma = comentarios.reduce((acc, c) => acc + (c.puntaje || 0), 0);
  return {
    promedio: Math.round(suma / comentarios.length),
    total: comentarios.length
  };
}

async function cargarTendencias() {
  if (!contenedorTendencias) return;

  const recetas = await fetchJSON(API_RECETAS);
  if (!recetas || !recetas.length) return;

  const recetasConRating = [];

  for (const r of recetas) {

    const comentarios = await fetchJSON(`${API_RECETAS}/${r.id}/comentarios`);

    const { promedio, total } = calcularPromedio(comentarios || []);

    const completa = await fetchJSON(`${API_RECETAS}/${r.id}`);
    if (!completa) continue;

    recetasConRating.push({
      id: r.id,
      nombre: r.nombre,
      imagen: r.imagen_url,
      tiempo: r.tiempo_preparacion,
      promedio,
      total,
      autor: completa.autor,
      autorFoto: completa.autor_foto,
      autorId: completa.id_usuario
    });
  }

  recetasConRating.sort((a, b) => b.promedio - a.promedio);

  const top4 = recetasConRating.slice(0, 4);

  renderTendencias(top4);
}

function renderTendencias(recetas) {
  contenedorTendencias.innerHTML = "";

  recetas.forEach(r => {
    contenedorTendencias.innerHTML += `
      <article class="trends-card">
        <a href="./pages/ver-receta.html?id=${r.id}" class="trends-card__main-link">

          <figure class="trends-card__media">
            <img class="trends-card__image"
              src="${r.imagen || "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg"}"
              alt="imagen de la receta"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Sin+Imagen';" />

            <div class="trends-card__actions">
              <button class="trends-card__action-btn" aria-label="Guardar">
                <i class="fa-regular fa-bookmark"></i>
              </button>
              <button class="trends-card__action-btn" aria-label="Compartir">
                <i class="fa-solid fa-share"></i>
              </button>
            </div>
          </figure>

          <div class="trends-card__content">
            <h2 class="trends-card__heading">${r.nombre}</h2>

            <div class="trends-card__meta">
              <a class="trends-card__author" href="./pages/usuario.html?userId=${r.autorId}">
                <img class="trends-card__author-avatar"
                  src="${r.autorFoto || AVATAR_DEFAULT}"
                  alt="Autor" />
                <span class="trends-card__author-name">
                  ${r.autor || "Usuario desconocido"}
                </span>
              </a>

              <div class="trends-card__duration">
                ⏱️ ${r.tiempo || "—"} min
              </div>

              <div class="trends-card__rating">
                ${"<span class='star'>★</span>".repeat(r.promedio)}
                ${"<span class='star empty'>★</span>".repeat(5 - r.promedio)}
                <span class="reviews">
                  ${r.promedio}/5 (${r.total} reseñas)
                </span>
              </div>
            </div>
          </div>

        </a>
      </article>
    `;
  });
}

document.addEventListener("DOMContentLoaded", cargarTendencias);
