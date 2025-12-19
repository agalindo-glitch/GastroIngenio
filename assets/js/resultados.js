const AVATAR_DEFAULT = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// ----------- NAVEGACIÓN AL CLIC -----------
document.addEventListener("click", e => {
  const card = e.target.closest(".recipe-card__main-link");
  if (!card) return;

  // Si clickeó el autor, NO navegar a la receta
  if (e.target.closest(".recipe-card__author")) return;

  window.location.href = card.dataset.link;
});

// ----------- PARAMETRO ?query= DE LA URL -----------
const params = new URLSearchParams(window.location.search);
const query = (params.get("query") || "").trim().toLowerCase();

const titleResultados = document.getElementById("title-resultados");
titleResultados.textContent = query ? `Resultados para "${query}"` : "Resultados";

// ----------- FETCH RECETAS Y USUARIOS -----------
async function obtenerRecetas() {
  try {
    const response = await fetch("http://localhost:3000/recetas");
    if (!response.ok) throw new Error("Error al obtener recetas");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function obtenerUsuarios() {
  try {
    const response = await fetch("http://localhost:3000/usuarios");
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function obtenerIngredientes() {
  try {
    const response = await fetch("http://localhost:3000/receta_ingredientes");
    if (!response.ok) throw new Error("Error al obtener ingredientes");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// ----------- FILTRAR RECETAS -----------
let resultados = [];

async function cargarResultados() {
  const recetasDB = await obtenerRecetas();
  const usuariosDB = await obtenerUsuarios();
  const ingredientesDB = await obtenerIngredientes();
  const query = (params.get("query") || "").trim().toLowerCase();

  // Mapa usuarios
  const usuariosPorId = {};
  usuariosDB.forEach(u => { usuariosPorId[u.id] = u; });

  // Mapa ingredientes por receta
  const ingredientesPorReceta = {};
  ingredientesDB.forEach(i => {
    if (!ingredientesPorReceta[i.id_receta]) ingredientesPorReceta[i.id_receta] = [];
    ingredientesPorReceta[i.id_receta].push(i.ingrediente.toLowerCase());
  });

  resultados = recetasDB
    .filter(r => {
      if (!query) return true;

      // Elegidos por la comunidad
      if (query === "elegidos_por-la_comunidad") return r.elegidos_comunidad === true;

      const usuario = usuariosPorId[r.id_usuario];
      const tituloMatch = r.nombre?.toLowerCase().includes(query);
      const usuarioMatch = usuario?.usuario?.toLowerCase().includes(query);
      const descripcionMatch = r.descripcion?.toLowerCase().includes(query);
      const ingredientesMatch = (ingredientesPorReceta[r.id] || []).some(ing => ing.includes(query));

      return tituloMatch || usuarioMatch || descripcionMatch || ingredientesMatch;
    })
    .map(r => {
      const usuario = usuariosPorId[r.id_usuario];
      return {
        titulo: r.nombre,
        dificultad: "Media",
        duracion: `${r.tiempo_preparacion} minutos`,
        descripcion: r.descripcion,
        imagen: r.imagen_url || "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg",
        autor: usuario ? usuario.usuario : "Usuario desconocido",
        avatar: usuario?.foto_perfil?.trim() ? usuario.foto_perfil : AVATAR_DEFAULT,
        userLink: usuario ? `usuario.html?userId=${usuario.id}` : "#",
        rating: 4,
        reviews: r.review ?? 0,
        link: `ver-receta.html?id=${r.id}`
      };
    });

  mostrarPagina();
}

// ----------- PAGINACIÓN -----------
const contenedorResultados = document.getElementById("resultados-recetas");
const contenedorPaginas = document.getElementById("paginacion");

const porPagina = 15;
let paginaActual = 1;

function mostrarPagina() {
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const items = resultados.slice(inicio, fin);

  if (!items.length) {
    contenedorResultados.innerHTML = `<p>No se encontraron resultados.</p>`;
    contenedorPaginas.innerHTML = "";
    return;
  }

  contenedorResultados.innerHTML = items.map(r => `
    <article class="recipe-card">
      <a href="${r.link}" class="recipe-card__main-link" data-link="${r.link}">
        <figure class="recipe-card__media">
          <img class="recipe-card__image" src="${r.imagen}" alt="imagen de la receta" />
          <div class="recipe-card__actions">
            <button class="recipe-card__action-btn" aria-label="Guardar">
              <i class="fa-regular fa-bookmark"></i>
            </button>
            <button class="recipe-card__action-btn" aria-label="Compartir">
              <i class="fa-solid fa-share"></i>
            </button>
          </div>
        </figure>

        <div class="recipe-card__content">
          <h2 class="recipe-card__heading">${r.titulo}</h2>

          <div class="recipe-card__meta">
            <a class="recipe-card__author" href="${r.userLink}">
              <img class="recipe-card__author-avatar" src="${r.avatar}" alt="Autor" />
              <span class="recipe-card__author-name">${r.autor}</span>
            </a>

            <div class="recipe-card__duration">⏱️ ${r.duracion}</div>

            <div class="recipe-card__rating">
              ${"<span class='star'>★</span>".repeat(r.rating)}
              ${"<span class='star empty'>★</span>".repeat(5 - r.rating)}
              <span class="reviews">${r.rating}/5 (${r.reviews} Reseñas)</span>
            </div>
          </div>
        </div>
      </a>
    </article>
  `).join("");

  generarPaginacion();
}

function generarPaginacion() {
  const totalPaginas = Math.ceil(resultados.length / porPagina);
  if (totalPaginas <= 1) {
    contenedorPaginas.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="page-btn ${i === paginaActual ? "active" : ""}" onclick="cambiarPagina(${i})">${i}</button>`;
  }
  contenedorPaginas.innerHTML = html;
}

function cambiarPagina(num) {
  const scrollY = window.scrollY;
  paginaActual = num;
  mostrarPagina();
  window.scrollTo(0, scrollY);
}

// Cargar resultados al inicio
cargarResultados();
