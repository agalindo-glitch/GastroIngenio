document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recipe-form");

  // Enviar formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const nombre = formData.get("title")?.trim();
    const descripcion = formData.get("shortDescription")?.trim();
    const tiempo_preparacion = formData.get("cookTime")?.trim() || null;
    const comensales = parseInt(formData.get("servings")) || null;
    const categoria = "general";
    const imagen_url = formData.get("imageUrl")?.trim() || null;

    const id_usuario = localStorage.getItem("id_usuario");
    if (!id_usuario) {
      alert("Tenés que iniciar sesión antes de crear una receta.");
      return;
    }

    // Ingredientes
    const ingredientes = [];
    document.querySelectorAll("#ingredients-container .ingredient-item").forEach((item) => {
      const nombre = item.querySelector('input[name="ingredients[]"]').value.trim();
      if (nombre) ingredientes.push({ nombre, cantidad: null, unidad: null });
    });

    // Pasos
    const pasos = [];
    document.querySelectorAll("#steps-container .step-item").forEach((item, index) => {
      const descripcion = item.querySelector('textarea[name="steps[][text]"]').value.trim();
      const imagen = item.querySelector('input[name="steps[][image]"]').value.trim();
      if (descripcion) pasos.push({ numero: index + 1, descripcion, imagen: imagen || null });
    });

    const body = { id_usuario, nombre, descripcion, tiempo_preparacion, categoria, comensales, imagen_url, ingredientes, pasos, tags: [] };

    console.log("Enviando:", body);

    try {
      const res = await fetch("http://localhost:3000/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error || "No se pudo crear la receta"));
        return;
      }

      alert("Receta creada correctamente");
      window.location.href = `/receta.html?id=${data.id}`;
    } catch (err) {
      console.error(err);
      alert("Error de red o servidor");
    }
  });

  // Agregar ingrediente
  document.getElementById("add-ingredient").addEventListener("click", () => {
    const c = document.getElementById("ingredients-container");
    c.insertAdjacentHTML("beforeend", `
      <div class="field is-grouped ingredient-item">
        <div class="control is-expanded">
          <input class="input" type="text" name="ingredients[]" placeholder="Ingrediente">
        </div>
        <div class="control">
          <button type="button" class="button is-danger is-light remove-ingredient">X</button>
        </div>
      </div>
    `);
  });

  // Agregar paso
  document.getElementById("add-step").addEventListener("click", () => {
    const c = document.getElementById("steps-container");
    const stepNumber = c.children.length + 1;
    c.insertAdjacentHTML("beforeend", `
      <div class="box step-item">
        <div class="field is-grouped is-align-items-center">
          <label class="label mr-2">Paso</label>
          <div class="control">
            <input class="input step-number-input" type="number" min="1" value="${stepNumber}" readonly>
          </div>
          <div class="control ml-auto">
            <button type="button" class="button is-danger is-light remove-step">Eliminar paso</button>
          </div>
        </div>
        <div class="field">
          <label class="label is-small">Descripción del paso</label>
          <div class="control">
            <textarea class="textarea" name="steps[][text]" rows="2" placeholder="Explicá qué hay que hacer en este paso" required></textarea>
          </div>
        </div>
        <div class="field">
          <label class="label is-small">URL de imagen (opcional)</label>
          <div class="control">
            <input class="input" type="url" name="steps[][image]" placeholder="https://...">
          </div>
        </div>
      </div>
    `);
  });

  // Delegar eventos para eliminar ingredientes o pasos
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-ingredient")) {
      e.target.closest(".ingredient-item").remove();
    }
    if (e.target.classList.contains("remove-step")) {
      e.target.closest(".step-item").remove();
      // Re-numerar pasos
      document.querySelectorAll("#steps-container .step-number-input").forEach((input, idx) => {
        input.value = idx + 1;
      });
    }
  });
});
