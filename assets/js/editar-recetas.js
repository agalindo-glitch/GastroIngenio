"use strict";

function previewImage(input) {
  const url = input.value.trim();
  const preview = document.querySelector(".imageUrl-preview");

  if (!preview) return;

  if (!url) {
    preview.style.display = "none";
    preview.src = "";
    return;
  }

  preview.src = url;
  preview.style.display = "block";

  preview.onerror = () => {
    preview.style.display = "none";
    preview.src = "";
  };
}

document.body.addEventListener("input", (e) => {
  if (e.target.classList.contains("step-image-input")) {

    const url = e.target.value.trim();
    const preview = e.target.nextElementSibling;

    if (!preview) return;

    if (!url) {
      preview.style.display = "none";
      preview.src = "";
      return;
    }

    preview.onerror = () => {
      preview.style.display = "none";
      preview.src = "";
    };

    preview.src = url;
    preview.style.display = "block";
  }
});


async function cargarReceta() {
  const parametro = new URLSearchParams(window.location.search);
  const recetaId = parametro.get("id");

  if (!recetaId) return;

  try {
    const res = await fetch(`http://localhost:3000/recetas/${recetaId}`);
    const receta = await res.json();

    document.querySelector('input[name="title"]').value = receta.nombre;
    document.querySelector('textarea[name="shortDescription"]').value = receta.descripcion;
    document.querySelector('input[name="cookTime"]').value = receta.tiempo_preparacion;
    document.querySelector('input[name="servings"]').value = receta.comensales;
    document.querySelector('input[name="imageUrl"]').value = receta.imagen_url || "";

    const ingredienteContainer = document.getElementById("ingredients-container");
    ingredienteContainer.innerHTML = "";
    receta.ingredientes.forEach(ing => {
      ingredienteContainer.insertAdjacentHTML("beforeend", `
        <div class="field is-grouped ingredient-item">
          <div class="control is-expanded">
            <input class="input" type="text" name="ingredients[]" value="${ing}" required>
          </div>
          <div class="control">
            <button type="button" class="button is-danger is-light remove-ingredient">X</button>
          </div>
        </div>
      `);
    });

    // Pasos
    const pasosContainer = document.getElementById("steps-container");
    pasosContainer.innerHTML = "";
    receta.pasos.forEach((paso, index) => {
      pasosContainer.insertAdjacentHTML("beforeend", `
        <div class="box step-item">
          <div class="field is-grouped is-align-items-center">
            <label class="label mr-2">Paso</label>
            <div class="control">
              <input class="input step-number-input" type="number" value="${paso.numero_paso}" readonly>
            </div>
            <div class="control ml-auto">
              <button type="button" class="button is-danger is-light remove-step">Eliminar paso</button>
            </div>
          </div>

          <div class="field">
            <textarea class="textarea" name="steps[][text]" required>${paso.descripcion}</textarea>
          </div>

          <div class="field">
            <label class="label is-small">Imagen del paso (URL)</label>
            <div class="control">
              <input class="input step-image-input" 
                    type="url" 
                    name="steps[][image]" 
                    value="${paso.imagen_url || ""}"
                    placeholder="https://...">
              <img class="step-preview" style="display:${paso.imagen_url ? "block" : "none"};" src="${paso.imagen_url || ""}">
            </div>
          </div>
        </div>
      `);
    });

    document.querySelectorAll(".step-preview").forEach(img => {

      if (!img.src) {
        img.style.display = "none";
        return;
      }

      img.onerror = () => {
        img.style.display = "none";
        img.src = "";
      };

    });

    const imageInput = document.querySelector('input[name="imageUrl"]');
    previewImage(imageInput);

  } catch (err) {
    alert("Error al cargar la receta");
  }
}

async function cargarUsuario() {
  const id_usuario = localStorage.getItem("id_usuario");
  const logueado = localStorage.getItem("logueado") === "true";

  if (!logueado || !id_usuario) return;

  const creardorInfo = document.querySelector(".creator-info");

  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
    const user = await res.json();

    const nombre_usuario = user.usuario || "usuario";
    const foto_usuario = user.foto_perfil?.trim() || "/assets/img/default-user.png";

    const avatarImg = creardorInfo.querySelector("img");
    const nombreSpan = creardorInfo.querySelector(".creator-name");      

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

async function imagenReceta(input) {
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

function agregarIngrediente() {
  const ingredientesContainer = document.getElementById("ingredients-container");
  
  ingredientesContainer.insertAdjacentHTML("beforeend", `
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

function agregarPaso() {
  const pasosContainer = document.getElementById("steps-container");
  const pasosNumero = pasosContainer.children.length + 1;

  pasosContainer.insertAdjacentHTML("beforeend", `
    <div class="box step-item">
      <div class="field is-grouped is-align-items-center">
        <label class="label mr-2">Paso</label>
        <div class="control">
          <input class="input step-number-input" type="number" value="${pasosNumero}" readonly>
        </div>
        <div class="control ml-auto">
          <button type="button" class="button is-danger is-light remove-step">Eliminar paso</button>
        </div>
      </div>

      <div class="field">
        <textarea class="textarea" name="steps[][text]" rows="2" required></textarea>
      </div>

      <div class="field">
        <input class="input step-image-input"
               type="url"
               name="steps[][image]"
               placeholder="https://...">
        <img class="step-preview" style="display:none; max-width:200px;">
      </div>
    </div>
  `);
}

function renumerarPasos() {
  document.querySelectorAll("#steps-container .step-number-input").forEach((input, idx) => {
    input.value = idx + 1;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const id_usuario = localStorage.getItem("id_usuario");

  cargarUsuario();

  const form = document.getElementById("recipe-form");

  document.getElementById("add-ingredient").addEventListener("click", agregarIngrediente);
  document.getElementById("add-step").addEventListener("click", agregarPaso);

  cargarReceta();

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-ingredient")) e.target.closest(".ingredient-item").remove();
    if (e.target.classList.contains("remove-step")) { e.target.closest(".step-item").remove(); renumerarPasos(); }
  });

  document.body.addEventListener("blur", (e) => {
    if (e.target.matches('input[name="imageUrl"]')) previewImage(e.target);
  }, true);
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const recetaId = new URLSearchParams(window.location.search).get("id");
    const formData = new FormData(form);
    const nombre = formData.get("title")?.trim();
    const descripcion = formData.get("shortDescription")?.trim();
    const tiempo_preparacion = formData.get("cookTime")?.trim() || null;
    const comensales = parseInt(formData.get("servings")) || null;
    const imagen_url = formData.get("imageUrl")?.trim();

    const imagenPrincipalValida = await imagenReceta(form.querySelector('input[name="imageUrl"]'));
    if (!imagenPrincipalValida) return;

    const ingredientes = [];
    document.querySelectorAll("#ingredients-container .ingredient-item").forEach(item => {
      const nombreIng = item.querySelector('input[name="ingredients[]"]').value.trim();
      if (nombreIng) ingredientes.push(nombreIng);
    });

    const pasos = [];

    const items = document.querySelectorAll("#steps-container .step-item");

    items.forEach((item, i) => {
      const textarea = item.querySelector('textarea[name="steps[][text]"]');
      const inputImagen = item.querySelector('input[name="steps[][image]"]');

      if (!textarea) return;

      const descripcionPaso = textarea.value.trim();

      if (!descripcionPaso) {
        alert(`El paso ${i + 1} debe tener descripción.`);
        error = true;
        return;
      }

      const imagenPaso = inputImagen ? inputImagen.value.trim() || null : null;

      pasos.push({
        numero_paso: i + 1,
        descripcion: descripcionPaso,
        imagen_url: imagenPaso
      });
    });

    const body = { id_usuario, nombre, descripcion, tiempo_preparacion, comensales, imagen_url, ingredientes, pasos};

    try {
        const res = await fetch(`http://localhost:3000/recetas/${recetaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Error: " + (data.error || "No se pudo modificar la receta"));
            return;
        }

        alert("Receta modificada correctamente");
        window.location.href = "/pages/mis-recetas.html";

        } catch (err) {
        console.error(err);
        alert("Error de red o servidor");
        }

    });
});