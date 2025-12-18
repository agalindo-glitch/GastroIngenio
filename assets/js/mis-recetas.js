document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("mis-recetas");
  const template = document.getElementById("receta-template");

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Tenés que iniciar sesión para ver tus recetas");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:3000/mis-recetas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
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
        const clone = template.content.cloneNode(true);

        clone.querySelector(".receta-nombre").textContent = receta.nombre;
        clone.querySelector(".receta-categoria").textContent = receta.categoria;
        clone.querySelector(".receta-tiempo").textContent =
          `⏱ ${receta.tiempo} min`;

        clone.querySelector(".btn-ver").addEventListener("click", () => {
          window.location.href = `ver-receta.html?id=${receta.id}`;
        });

        clone.querySelector(".btn-editar").addEventListener("click", () => {
          window.location.href = `editar-receta.html?id=${receta.id}`;
        });

        clone.querySelector(".btn-eliminar").addEventListener("click", () => {
          if (!confirm("¿Seguro que querés eliminar esta receta?")) return;

          fetch(`http://localhost:3000/recetas/${receta.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
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

        contenedor.appendChild(clone);
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML =
        "<p>Error al cargar las recetas.</p>";
    });
});

