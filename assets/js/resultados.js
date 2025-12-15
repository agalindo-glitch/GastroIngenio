// ----------- 1. Obtener parámetro ?query= de la URL -----------
const params = new URLSearchParams(window.location.search);
const query = (params.get("query") || "").trim().toLowerCase();

const titleResultados = document.getElementById("title-resultados");
titleResultados.textContent = query ? `Resultados para "${query}"` : "Resultados";


// ----------- 2. Ejemplo de recetas -----------
const recetas = [
  {
    titulo: "Pollo al horno clásico",
    dificultad: "Media",
    duracion: "45 minutos",
    descripcion: "Pollo al horno jugoso con papas.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg",
    autor: "Chef Ana",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    rating: 5,
    reviews: 58,
    link: "hola"
  },
  {
    titulo: "Milanesa de pollo",
    dificultad: "Baja",
    duracion: "30 minutos",
    descripcion: "Crocante y dorada milanesa casera.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg",
    autor: "Chef Martín",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    rating: 5,
    reviews: 103,
    link: "hola"
  },
  {
    titulo: "Ensalada fresca con pollo grillado",
    dificultad: "Muy baja",
    duracion: "20 minutos",
    descripcion: "Ensalada fresca, liviana y saludable.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg",
    autor: "Chef Laura",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    rating: 4,
    reviews: 41,
    link: "hola"
  },
  {
    titulo: "Milanesa de pollo",
    dificultad: "Baja",
    duracion: "30 minutos",
    descripcion: "Crocante y dorada milanesa casera.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg",
    autor: "Chef Martín",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    rating: 5,
    reviews: 103,
    link: "hola"
  }
];


// ----------- 3. Filtrar recetas -----------
const resultados = recetas.filter(r =>
  r.titulo.toLowerCase().includes(query)
);


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
      <a href="${r.link}" class="recipe-card__main-link">
        <figure class="recipe-card__media">
          <img class="recipe-card__image" 
               src="${r.imagen}"
               alt="imagen de la receta" />
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
            <a class="recipe-card__author" href="#">
              <img class="recipe-card__author-avatar" 
                   src="${r.avatar}"
                   alt="Autor" />
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
    html += `
      <button class="page-btn ${i === paginaActual ? "active" : ""}" 
              onclick="cambiarPagina(${i})">${i}</button>
    `;
  }

  contenedorPaginas.innerHTML = html;
}

function cambiarPagina(num) {
  const scrollY = window.scrollY;
  paginaActual = num;
  mostrarPagina();
  window.scrollTo(0, scrollY);
}


mostrarPagina(); 
