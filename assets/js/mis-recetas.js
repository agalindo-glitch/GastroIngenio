"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("recetas-container");
  const template = document.getElementById("receta-template");

  const idUsuario = localStorage.getItem("id_usuario");

  if (!idUsuario) {
    alert("Tenés que iniciar sesión para ver tus recetas");
    window.location.href = "login.html";
    return;
  }

  fetch(`http://localhost:3000/mis-recetas?id_usuario=${idUsuario}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar recetas");
      return res.json();
    })
    .then(recetas => {
      if (recetas.length === 0) {
        contenedor.innerHTML = "<p>No tenés recetas cargadas.</p>";
        return;
      }

      recetas.forEach(receta => {
        const clon = template.content.cloneNode(true);

        clon.querySelector(".receta-nombre").textContent = receta.nombre;
        clon.querySelector(".receta-tiempo").textContent = `${receta.tiempo_preparacion} min`;

        clon.querySelector(".btn-ver").addEventListener("click", () => {
          window.location.href = `ver-receta.html?id=${receta.id}`;
        });

        clon.querySelector(".btn-editar").addEventListener("click", () => {
          window.location.href = `editar-recetas.html?id=${receta.id}`;
        });

        clon.querySelector(".btn-eliminar").addEventListener("click", () => {
          if (!confirm("¿Seguro que querés eliminar esta receta?")) return;
            fetch("http://localhost:3000/recetas", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: receta.id
              })
            })
            .then(res => {
              if (!res.ok) throw new Error("Error al eliminar");
              alert("Receta eliminada");
              location.reload();
            })
            .catch(err => {
              console.error(err);
              alert("No se pudo eliminar la receta");
            });

        });

        contenedor.appendChild(clon);
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p>Error al cargar las recetas.</p>";
    });
});
