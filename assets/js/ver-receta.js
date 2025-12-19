document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recetaId = params.get("id");

  if (!recetaId) {
    alert("No se encontró el ID de la receta");
    return;
  }

  fetch(`http://localhost:3000/recetas/${recetaId}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar receta");
      return res.json();
    })
    .then(receta => renderReceta(receta))
    .catch(err => {
      console.error(err);
      alert("No se pudo cargar la receta");
    });

  const form = document.getElementById("form-review");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Reviews todavía no habilitadas");
    });
  }
});

function renderReceta(receta) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  set("receta-titulo", receta.nombre);
  set("receta-autor", `Creada por: ${receta.autor}`);
  set("receta-tiempo", `${receta.tiempo_preparacion} min`);

  const ingredientes = document.getElementById("lista-ingredientes");
  if (ingredientes) {
    ingredientes.innerHTML = `<li>${receta.descripcion}</li>`;
  }

  const pasos = document.getElementById("lista-pasos");
  if (pasos && receta.descripcion) {
    pasos.innerHTML += `<p>${receta.descripcion}</p>`;
  }

  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  reviews.innerHTML = "";

  if (receta.comentarios.length === 0) {
    reviews.innerHTML = "<p>No hay reseñas todavía</p>";
    return;
  }

  receta.comentarios.forEach(c => agregarReview(c));
}

function agregarReview(c) {
  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  const article = document.createElement("article");
  article.className = "review";

  article.innerHTML = `
    <strong>${c.usuario}</strong>
    <p>${c.descripcion}</p>
    <small>${c.likes} | ${c.dislikes}</small>
  `;

  reviews.appendChild(article);
}
