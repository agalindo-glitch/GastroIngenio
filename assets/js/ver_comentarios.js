function mostrarResumenComentarios(comentarios) {
  const contenedor = document.getElementById("lista-reviews");


  contenedor.innerHTML = "";

  const total = comentarios.length;


  const titulo = document.createElement("h4");
  titulo.classList.add("mb-2");
  titulo.textContent = `Comentarios (${total})`;
  contenedor.appendChild(titulo);


  if (total === 0) {
    const sinComentarios = document.createElement("p");
    sinComentarios.textContent = "Todavía no hay comentarios.";
    contenedor.appendChild(sinComentarios);
    return;
  }


  comentarios.slice(0, 3).forEach(c => {
    const div = document.createElement("div");
    div.classList.add("review", "mb-2");

    div.innerHTML = `
      <strong>${c.usuario}</strong>
      <p>${c.descripcion}</p>
    `;

    contenedor.appendChild(div);
  });


  if (total > 3) {
    const aviso = document.createElement("p");
    aviso.classList.add("has-text-grey", "mt-2");
    aviso.textContent = "Mostrando solo los primeros 3 comentarios";
    contenedor.appendChild(aviso);
  }
}
