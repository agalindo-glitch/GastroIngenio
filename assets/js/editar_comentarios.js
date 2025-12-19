document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-reviews");
  if (!lista) return;

  
  lista.addEventListener("click", async (e) => {
    const btnEditar = e.target.closest(".btn-editar");
    if (!btnEditar) return;

    const comentarioId = btnEditar.dataset.id;
    if (!comentarioId) return;

    
    const article = btnEditar.closest(".review");
    if (!article) return;

    
    const p = article.querySelector("p");
    if (!p) return;

    const textoActual = p.textContent;

    
    if (article.querySelector(".edit-box")) return;

    
    const editBox = document.createElement("div");
    editBox.className = "edit-box";
    editBox.style.marginTop = "0.6rem";

    editBox.innerHTML = `
      <textarea class="edit-textarea" rows="3"></textarea>
      <div class="comentario-botones">
        <button class="btn-guardar">Guardar</button>
        <button class="btn-cancelar">Cancelar</button>
    </div>
    `;

    const textarea = editBox.querySelector(".edit-textarea");
    textarea.value = textoActual;

    const btnGuardar = editBox.querySelector(".edit-guardar");
    const btnCancelar = editBox.querySelector(".edit-cancelar");

    article.appendChild(editBox);

    btnCancelar.addEventListener("click", () => {
      editBox.remove();
    });

    btnGuardar.addEventListener("click", async () => {
      const nuevoTexto = textarea.value.trim();
      if (!nuevoTexto) return alert("El comentario no puede quedar vacío");

      const id_usuario = Number(localStorage.getItem("id_usuario"));
      const id_receta = window.recetaId;

      if (!id_usuario || !id_receta) {
        return alert("No hay usuario logueado o falta el id de receta");
      }

      try {
        const resp = await fetch(`http://localhost:3000/comentarios/${comentarioId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario,
            id_receta,
            descripcion: nuevoTexto,
            likes: 0,
            dislikes: 0
          })
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          return alert(err.error || "No se pudo editar el comentario");
        }

        p.textContent = nuevoTexto;
        editBox.remove();
      } catch (error) {
        console.error(error);
        alert("Error de conexión");
      }
    });
  });
});