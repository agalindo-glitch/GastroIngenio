// ----------- 1. Obtener parámetro ?query= de la URL -----------
const params = new URLSearchParams(window.location.search);
const query = (params.get("query") || "").trim().toLowerCase();

// Cambia el título
const titleResultados = document.getElementById("title-resultados");
titleResultados.textContent = query ? `Resultados para "${query}"` : "Resultados";


// ----------- 2. Ejemplo de recetas (luego lo reemplazás por la data real) -----------
const recetas = [
  {
    titulo: "Pollo al horno clásico",
    dificultad: "Media",
    duracion: "45 minutos",
    descripcion: "Pollo al horno jugoso con papas.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg"
  },
  {
    titulo: "Milanesa de pollo",
    dificultad: "Baja",
    duracion: "30 minutos",
    descripcion: "Crocante y dorada milanesa casera.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg"
  },
  {
    titulo: "Ensalada fresca con pollo grillado",
    dificultad: "Muy baja",
    duracion: "20 minutos",
    descripcion: "Ensalada fresca, liviana y saludable.",
    imagen: "https://wallpapers.com/images/hd/food-4k-1pf6px6ryqfjtnyr.jpg"
  }
];


// ----------- 3. Filtrar recetas según el texto buscado -----------
const resultados = recetas.filter(r =>
  r.titulo.toLowerCase().includes(query)
);


// ----------- 4. Pintar los resultados en el HTML -----------
const contenedorResultados = document.getElementById("resultados-recetas");

if (resultados.length === 0) {
  contenedorResultados.innerHTML = `<p>No se encontraron resultados.</p>`;
} else {
  contenedorResultados.innerHTML = resultados.map(r => `
    <div class="resultados__item">
      <img class="resultados__img" src="${r.imagen}" alt="imagen de la receta" />

      <div class="resultados__info">
        <h2 class="resultados__titulo">${r.titulo}</h2>

        <p class="resultados__meta">${r.dificultad} | ${r.duracion}</p>

        <p class="resultados__descripcion">${r.descripcion}</p>
      </div>
    </div>
  `).join("");
}
