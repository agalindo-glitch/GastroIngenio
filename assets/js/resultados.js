"use strict";

const API_RECETAS = "http://localhost:3000/recetas";
const API_USUARIOS = "http://localhost:3000/usuarios";
const API_INGREDIENTES = "http://localhost:3000/receta_ingredientes";
const AVATAR_DEFAULT = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

document.addEventListener("click", e => {
  const card = e.target.closest(".recipe-card__main-link");
  if (!card) return;
  if (e.target.closest(".recipe-card__author")) return;
  window.location.href = card.dataset.link;
});

const params = new URLSearchParams(window.location.search);
const query = (params.get("query") || "").trim().toLowerCase();

const titleResultados = document.getElementById("title-resultados");
titleResultados.textContent = query
  ? `Resultados para "${query}"`
  : "Resultados";

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(url);
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return [];
  }
}

let resultados = [];
const porPagina = 15;
let paginaActual = 1;

const contenedorResultados = document.getElementById("resultados-recetas");
const contenedorPaginas = document.getElementById("paginacion");

async function cargarResultados() {
  const [recetas, usuarios, ingredientes] = await Promise.all([
    fetchJSON(API_RECETAS),
    fetchJSON(API_USUARIOS),
    fetchJSON(API_INGREDIENTES)
  ]);

  const usuariosPorId = {};
  usuarios.forEach(u => (usuariosPorId[u.id] = u));

  const ingredientesPorReceta = {};
  ingredientes.forEach(i => {
    if (!ingredientesPorReceta[i.id_receta]) {
      ingredientesPorReceta[i.id_receta] = [];
    }
    ingredientesPorReceta[i.id_receta].push(i.ingrediente.toLowerCase());
  });

  resultados = recetas.filter(r => {
    if (!query) return true;

    if (query === "elegidos_por-la_comunidad") {
      return r.elegida_comunidad === true;
    }

    const usuario = usuariosPorId[r.id_usuario];
    return (
      r.nombre?.toLowerCase().includes(query) ||
      r.descripcion?.toLowerCase().includes(query) ||
      usuario?.usuario?.toLowerCase().includes(query) ||
      (ingredientesPorReceta[r.id] || []).some(i => i.includes(query))
    );
  });

  paginaActual = 1;
  mostrarPagina();
}

function calcularPromedio(comentarios = []) {
  if (!comentarios.length) return { promedio: 0, total: 0 };

  const suma = comentarios.reduce((acc, c) => acc + (c.puntaje || 0), 0);
  return {
    promedio: Math.round(suma / comentarios.length),
    total: comentarios.length
  };
}

async function mostrarPagina() {
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const paginaItems = resultados.slice(inicio, fin);

  if (!paginaItems.length) {
    contenedorResultados.innerHTML = "<p>No se encontraron resultados.</p>";
    contenedorPaginas.innerHTML = "";
    return;
  }

  contenedorResultados.innerHTML = "";

  for (const r of paginaItems) {
    const recetaCompleta = await fetchJSON(`${API_RECETAS}/${r.id}`);
    const promedio = Number(recetaCompleta.promedio) || 0;
    const total = Number(recetaCompleta.total_reseñas) || 0;

    const usuario = recetaCompleta.autor
      ? {
          id: recetaCompleta.id_usuario,
          usuario: recetaCompleta.autor,
          foto_perfil: recetaCompleta.autor_foto
        }
      : null;

    contenedorResultados.innerHTML += `
      <article class="recipe-card">
        <a class="recipe-card__main-link" data-link="ver-receta.html?id=${r.id}">
          <figure class="recipe-card__media">
            <img class="recipe-card__image"
              src="${r.imagen_url || "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg"}"
              alt="imagen receta" />
          </figure>

          <div class="recipe-card__content">
            <h2 class="recipe-card__heading">${r.nombre}</h2>

            <div class="recipe-card__meta">
              <a class="recipe-card__author" href="usuario.html?userId=${usuario?.id}">
                <img class="recipe-card__author-avatar"
                  src="${usuario?.foto_perfil || AVATAR_DEFAULT}" />
                <span class="recipe-card__author-name">
                  ${usuario?.usuario || "Usuario desconocido"}
                </span>
              </a>

              <div class="recipe-card__duration">
                ⏱️ ${r.tiempo_preparacion || "—"} min
              </div>

              <div class="recipe-card__rating">
                ${"<span class='star'>★</span>".repeat(promedio)}
                ${"<span class='star empty'>★</span>".repeat(5 - promedio)}
                <span class="reviews">
                  ${promedio}/5 (${total} reseñas)
                </span>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  generarPaginacion();
}

function generarPaginacion() {
  const totalPaginas = Math.ceil(resultados.length / porPagina);
  contenedorPaginas.innerHTML = "";

  if (totalPaginas <= 1) return;

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `page-btn ${i === paginaActual ? "active" : ""}`;
    btn.onclick = () => {
      paginaActual = i;
      mostrarPagina();
    };
    contenedorPaginas.appendChild(btn);
  }
}

cargarResultados();
