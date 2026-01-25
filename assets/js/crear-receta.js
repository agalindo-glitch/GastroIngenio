"use strict";

async function loadLoggedUser() {
  const id_usuario = localStorage.getItem("id_usuario");
  const logueado = localStorage.getItem("logueado") === "true";

  if (!logueado || !id_usuario) return;

  const creatorInfoContainer = document.querySelector(".creator-info");

  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
    const user = await res.json();

    const nombre_usuario = user.usuario || "usuario";
    const foto_usuario = user.foto_perfil?.trim() || "/assets/img/default-user.png";

    const avatarImg = creatorInfoContainer.querySelector("img");
    const nombreSpan = creatorInfoContainer.querySelector(".creator-name");      

    if (avatarImg) {
      avatarImg.src = foto_usuario;
      avatarImg.alt = nombre_usuario;
      avatarImg.onerror = () => {
        avatarImg.src = "/assets/img/default-user.png";
      };
    }

    if (nombreSpan) {
      nombreSpan.textContent = nombre_usuario;
    }

  } catch (error) {
    console.error("Error al cargar la foto o nombre de usuario:", error);
  }
}

async function previewImage(input) {
  const url = input.value.trim();
  const preview = input.nextElementSibling;

  return new Promise((resolve) => {
    if (!url) {
      preview.src = "";
      preview.style.display = "none";
      resolve(true);
      return;
    }
    const img = new Image();
    img.onload = () => { preview.src = url; preview.style.display = "block"; resolve(true); };
    img.onerror = () => { preview.src = ""; preview.style.display = "none"; alert("La URL ingresada no corresponde a una imagen válida."); resolve(false); };
    img.src = url;
  });
}

function addIngredient() {
  const ingredientsContainer = document.getElementById("ingredients-container");
  
  ingredientsContainer.insertAdjacentHTML("beforeend", `
    <div class="field is-grouped ingredient-item">
      <div class="control is-expanded">
        <input class="input" type="text" name="ingredients[]" placeholder="Ingrediente" required>
      </div>
      <div class="control">
        <button type="button" class="button is-danger is-light remove-ingredient">X</button>
      </div>
    </div>
  `);
}

function addStep() {
  const stepsContainer = document.getElementById("steps-container");

  const stepNumber = stepsContainer.children.length + 1;
  
  stepsContainer.insertAdjacentHTML("beforeend", `
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
          <img class="imageUrl-preview">
        </div>
      </div>
    </div>
  `);
}

function renumberSteps() {
  document.querySelectorAll("#steps-container .step-number-input").forEach((input, idx) => {
    input.value = idx + 1;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const id_usuario = localStorage.getItem("id_usuario");
  loadLoggedUser();

  const form = document.getElementById("recipe-form");

  document.getElementById("add-ingredient").addEventListener("click", addIngredient);
  document.getElementById("add-step").addEventListener("click", addStep);

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-ingredient")) e.target.closest(".ingredient-item").remove();
    if (e.target.classList.contains("remove-step")) { e.target.closest(".step-item").remove(); renumberSteps(); }
  });

  document.body.addEventListener("blur", (e) => {
    if (e.target.matches('input[name="imageUrl"], input[name="steps[][image]"]')) previewImage(e.target);
  }, true);
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("title")?.trim();
    const descripcion = formData.get("shortDescription")?.trim();
    const tiempo_preparacion = formData.get("cookTime")?.trim() || null;
    const comensales = parseInt(formData.get("servings")) || null;
    const imagen_url = formData.get("imageUrl")?.trim();

    const mainImageValid = await previewImage(form.querySelector('input[name="imageUrl"]'));
    if (!mainImageValid) return;

    const ingredientes = [];
    document.querySelectorAll("#ingredients-container .ingredient-item").forEach(item => {
      const nombreIng = item.querySelector('input[name="ingredients[]"]').value.trim();
      if (nombreIng) ingredientes.push({ nombre: nombreIng, cantidad: null, unidad: null });
    });

    const pasos = [];
    let allStepImagesValid = true;
    const stepItems = document.querySelectorAll("#steps-container .step-item");
    for (let i = 0; i < stepItems.length; i++) {
      const item = stepItems[i];
      const descripcionPaso = item.querySelector('textarea[name="steps[][text]"]').value.trim();
      const imagenPasoInput = item.querySelector('input[name="steps[][image]"]');
      const imagenPaso = imagenPasoInput.value.trim();

      const valid = await previewImage(imagenPasoInput);
      if (!valid) allStepImagesValid = false;

      if (!descripcionPaso) { alert(`El paso ${i + 1} debe tener una descripción.`); return; }

      pasos.push({ numero: i + 1, descripcion: descripcionPaso, imagen: imagenPaso || null });
    }

    if (!allStepImagesValid) { alert("Corrige las imágenes de los pasos antes de guardar la receta."); return; }

    const body = { id_usuario, nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes, pasos};

    try {
      const res = await fetch("http://localhost:3000/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) { alert("Error: " + (data.error || "No se pudo crear la receta")); return; }
      alert("Receta creada correctamente");
      window.location.href = `/pages/ver-receta.html?id=${data.id}`;
    } catch (err) { console.error(err); alert("Error de red o servidor"); }
  });
});
