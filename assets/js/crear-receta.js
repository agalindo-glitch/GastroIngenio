const form = document.getElementById("recipe-form");

form.addEventListener("submit", manejarSubmit);

function manejarSubmit(event) {
    event.preventDefault(); 
    console.log("crear-receta.js cargado");
    guardarReceta();
}

function guardarReceta() {
    const formData = new FormData(form);

    const receta = {
        id_usuario: 1, 
        nombre: formData.get("title")?.trim() || "Receta sin nombre",
        descripcion: formData.get("shortDescription")?.trim() || "Sin descripción",
        tiempo_preparacion: Number(formData.get("cookTime")) || 1, 
        categoria: "General",
        elegidos_comunidad: false,
        review: 0,
        ingredients: formData.getAll("ingredients[]").filter(i => i.trim() !== ""), 
        steps: obtenerPasos().filter(p => p.text.trim() !== "") 
    };

    console.log("Receta a enviar:", receta); 
    enviarReceta(receta);
}


function obtenerPasos() {
    const pasos = [];
    const pasosHTML = document.querySelectorAll(".step-item");

    pasosHTML.forEach((paso, index) => {
        const texto = paso.querySelector("textarea").value;
        const imagen = paso.querySelector("input").value;

        pasos.push({
            order: index + 1,
            text: texto,
            image: imagen
        });
    });

    return pasos;
}



function enviarReceta(receta) {
    fetch("http://localhost:3000/recetas" , {
        method: "POST",
        headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify(receta)
    })
        .then(response => {
            if(!response.ok) {
                throw new Error("Error al guardar receta");
            }

            return response.json();
        })

        .then(() => {
            alert("Receta guardada con exito");
            form.reset();
        })
        .catch(error => {
        console.error(error);
        alert("Ocurrió un error al guardar la receta");
        });
}

// flujo:

// Usuario clickea "Guardar"
// submit del form
// manejarSubmit
// guardarReceta
// obtenerPasos
// enviarReceta
// backend recibe POST /recetas
