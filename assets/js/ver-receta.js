document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recetaId = params.get("id");

  if (!recetaId) {
    alert("No se encontró el ID de la receta");
    return;
  }

  window.recetaId = recetaId;

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
    ingredientes.innerHTML = `<li>(Ingedientes pendientes)</li>`;
  }

  const pasos = document.getElementById("lista-pasos");
  if (pasos) {
    pasos.insertAdjacentHTML("beforeend", "<p>(Pasos pendientes)</p>");
  }

  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  reviews.innerHTML = "";

  const total = receta.comentarios?.length || 0;

  const contador = document.getElementById("comentarios-count");
  if (contador) contador.textContent = total;

  if (total === 0) {
    reviews.innerHTML = "<p>No hay reseñas todavía</p>";
    return;
  }

   receta.comentarios.slice(0, 3).forEach((c) => agregarReview(c));
}



function agregarReview(c) {
  const reviews = document.getElementById("lista-reviews");
  if (!reviews) return;

  const article = document.createElement("article");
  article.className = "review";

  const usuarioLogueado = Number(localStorage.getItem("id_usuario"));

  article.innerHTML = `
    <strong>${c.usuario}</strong>
    <p>${c.descripcion}</p>
    <small>👍 ${c.likes} | 👎 ${c.dislikes}</small>
  `;

  if (usuarioLogueado === c.id_usuario) {
    const botones = document.createElement("div");
    botones.className = "comentario-botones";

    botones.innerHTML = `
      <button class="btn-editar" data-id="${c.id}">Editar</button>
      <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
    `;

    botones.querySelector(".btn-editar").addEventListener("click", () => {
      iniciarEdicionComentario(c, article);
    });

    botones.querySelector(".btn-eliminar").addEventListener("click", () => {
      eliminarComentario(c.id);
    });

    article.appendChild(botones);
  }

  reviews.appendChild(article);
}
