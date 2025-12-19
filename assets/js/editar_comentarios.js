function editarComentario(idComentario) {
  const comentarioDiv = document.getElementById(`comentario-${idComentario}`);
  const textoActual = comentarioDiv.querySelector(".comentario-texto").textContent;


  comentarioDiv.querySelector(".comentario-texto").innerHTML = `
    <textarea class="textarea mb-2" id="textarea-${idComentario}">${textoActual}</textarea>
    <div class="buttons">
      <button class="button is-small is-success" onclick="guardarEdicion(${idComentario})">
        Guardar
      </button>
      <button class="button is-small is-light" onclick="cancelarEdicion(${idComentario}, '${textoActual.replace(/'/g, "\\'")}')">
        Cancelar
      </button>
    </div>
  `;
}

function guardarEdicion(idComentario) {
  const textarea = document.getElementById(`textarea-${idComentario}`);
  const nuevoTexto = textarea.value.trim();

  if (!nuevoTexto) {
    alert("El comentario no puede estar vacío");
    return;
  }

  fetch(`http://localhost:3000/comentarios/${idComentario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      descripcion: nuevoTexto
    })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      location.reload();
    })
    .catch(() => alert("Error al editar comentario"));
}

function cancelarEdicion(idComentario, textoOriginal) {
  const comentarioDiv = document.getElementById(`comentario-${idComentario}`);
  comentarioDiv.querySelector(".comentario-texto").textContent = textoOriginal;
}