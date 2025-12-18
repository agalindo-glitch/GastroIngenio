// Agarramos el contenedor
const contenedor = document.getElementById("contenedor-recetas");

// Traemos el usuario logueado
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  alert("Tenés que iniciar sesión");
  window.location.href = "login.html";
}

// Pedimos las recetas del usuario
fetch(`http://localhost:3000/recetas/usuario/${usuario.id}`)
  .then(res => res.json())
  .then(recetas => {
    if (recetas.length === 0) {
      contenedor.innerHTML = "<p>No tenés recetas aún.</p>";
      return;
    }

    recetas.forEach(receta => {
      const columna = document.createElement("div");
      columna.className = "column is-4";

      columna.innerHTML = `
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="${receta.imagen}" alt="${receta.titulo}">
          </figure>
          </div>

          <div class="card-content">
            <p class="title is-5">${receta.titulo}</p>

            <a href="ver-receta.html?id=${receta.id}" class="button is-link is-small">
              Ver receta
            </a>
          </div>
        </div>
      `;

      contenedor.appendChild(columna);
    });
  })
  .catch(err => {
    console.error(err);
    contenedor.innerHTML = "<p>Error al cargar recetas</p>";
  });
