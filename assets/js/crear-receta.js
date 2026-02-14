"use strict";

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
  const preview = input.closest(".field").querySelector(".step-preview, .imageUrl-preview");

  return new Promise((resolve) => {
    if (!url) {
      preview.src = "";
      preview.style.display = "none";
      resolve(true);
      return;
    }

    const img = new Image();

    img.onload = () => {
      preview.src = url;
      preview.style.display = "block";
      resolve(true);
    };

    img.onerror = () => {
      preview.src = "";
      preview.style.display = "none";
      alert("La URL ingresada no corresponde a una imagen válida.");
      resolve(false);
    };

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
          <input class="input step-number-input" type="number" min="1" value="${pasosNumero}" readonly>
        </div>
        <div class="control ml-auto">
          <button type="button" class="button is-danger is-light remove-step">Eliminar paso</button>
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Descripción</label>
        <div class="control">
          <textarea class="textarea step-text" rows="2" required></textarea>
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Imagen del paso (URL)</label>
        <div class="control">
          <input class="input step-image" type="text" placeholder="https://...">
        </div>
        <img class="step-preview mt-2" style="max-width:200px; display:none;" />
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

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-ingredient")) e.target.closest(".ingredient-item").remove();
    if (e.target.classList.contains("remove-step")) { e.target.closest(".step-item").remove(); renumerarPasos(); }
  });

  document.body.addEventListener("blur", (e) => {
    if (
      e.target.matches('input[name="imageUrl"]') ||
      e.target.classList.contains("step-image")
    ) {
      imagenReceta(e.target);
    }
  }, true);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const descripcionPaso = item.querySelector(".step-text").value.trim();
      const imagenPaso = item.querySelector(".step-image").value.trim() || null;

      if (!descripcionPaso) {
        alert(`El paso ${i + 1} debe tener una descripción.`);
        return;
      }

      pasos.push({
        numero_paso: i + 1,
        descripcion: descripcionPaso,
        imagen_url: imagenPaso
      });
    }
    
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
      window.location.href = `/pages/mis-recetas.html`;
    } catch (err) { console.error(err); alert("Error de red o servidor"); }
  });
});
