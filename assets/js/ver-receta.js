document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const recetaId = params.get('id');

  if (!recetaId) {
    alert('No se encontro el ID de la receta');
    return;
  }

  //Traer la receta y sus comentarios
  fetch(`http://localhost:3000/recetas/${recetaId}`)

    .then(res => res.json())
    .then(receta => renderReceta(receta))
    .catch(err => console.error(err));

  //Manejar envío del formulario de nueva reseña
  const form = document.getElementById('form-review');
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // evitar recarga de página

    const puntaje = form.puntaje.value;
    const comentario = form.comentario.value;

    if (!puntaje || !comentario) return alert('Completa todos los campos');

    //Suponemos que el backend sabe qué usuario está logueado
    fetch(`/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: localStorage.getItem("id_usuario"),
        id_receta: recetaId,
        descripcion: comentario,
        likes: 0,
        dislikes: 0
      })
    })

      .then(res => res.json())
      .then(nuevaReview => {
        //Agregar la reseña recién creada al listado
        agregarReview(nuevaReview);
        form.reset();
      })
      .catch(err => console.error(err));
  });
});


function renderReceta(receta) {
  document.getElementById('receta-titulo').textContent = receta.nombre;
  document.getElementById('receta-autor').textContent = `Creada por: ${receta.autor}`;
  document.getElementById('receta-tiempo').textContent = `${receta.tiempo_preparacion} min`;

  const comensalesEl = document.getElementById('receta-comensales');
  if (comensalesEl) {
    comensalesEl.textContent = receta.comensales || 'N/A';
  }

  const ingredientes = document.getElementById('lista-ingredientes');
  ingredientes.innerHTML = `<li>${receta.descripcion}</li>`;

  const reviews = document.getElementById('lista-reviews');
  reviews.innerHTML = '';

  if (receta.comentarios.length > 0) {
    receta.comentarios.forEach(c => agregarReview(c));
  } else {
    reviews.innerHTML = '<p>No hay reseñas todavía</p>';
  }
}


function agregarReview(c) {
  const reviews = document.getElementById('lista-reviews');

  const article = document.createElement('article');
  article.classList.add('review');

  article.innerHTML = `
    <strong>${c.usuario}</strong>
    <p>${c.descripcion}</p>
    <small>👍 ${c.likes} | 👎 ${c.dislikes}</small>
  `;

  reviews.appendChild(article);
}
