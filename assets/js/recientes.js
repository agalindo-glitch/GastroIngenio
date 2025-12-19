// assets/js/recientes.js

document.addEventListener("DOMContentLoaded", loadRecientes);

async function loadRecientes() {
  const lista = document.querySelector(".recent__list");

  if (!lista) return;

  try {
    // 1. Pedir recetas al backend
    const res = await fetch("http://127.0.0.1:3000/recetas");
    if (!res.ok) throw new Error("Error obteniendo recetas");

    const recetas = await res.json();

    // 2. Ordenar por fecha (más nuevas primero)
    recetas.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    // 3. Tomar solo las 5 recetas más recientes
    const recientes = recetas.slice(0, 5);

    // 4. Renderizar tarjetas
    const html = recientes.map(receta => crearCardReciente(receta)).join("");

    // Insertar contenido
    lista.innerHTML = html 
    // + 
    // `
    //   <a href="./pages/resultados.html?query=recientes" class="recent__more">
    //     Ver Más
    //   </a>
    // `
    ;

  } catch (error) {
    console.error("Error cargando recientes:", error);
  }
}



// ----------------------
// Función para calcular el tiempo transcurrido
// ----------------------
function tiempoDesde(fechaString) {
  const fecha = new Date(fechaString); // no agregar 'Z'
  if (isNaN(fecha)) return "Fecha inválida"; // chequeo extra

  const ahora = new Date();
  let diff = Math.floor((ahora - fecha) / 1000); // en segundos

  if (diff < 5) return "Hace unos segundos";

  const minutos = Math.floor(diff / 60);
  if (minutos < 1) return `Hace ${diff} segundos`;

  if (minutos < 60) return `Hace ${minutos} minutos`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} horas`;

  const dias = Math.floor(horas / 24);
  return `Hace ${dias} días`;
}





// ----------------------
// Crear card HTML
// ----------------------
function crearCardReciente(receta) {
  const tiempo = tiempoDesde(receta.fecha_creacion);
  const link = `./pages/ver-receta.html?id=${receta.id}`;
  const img = receta.imagen_url || "https://placehold.co/600x400?text=Sin+Imagen";

  return `
    <div class="recent__card">
      <a href="${link}" class="recent__image-link">
        <img class="recent__image" src="${img}" alt="${receta.nombre}" />
      </a>

      <div class="recent__content">
        <div class="recent__meta">
          <p class="recent__category">${receta.categoria.toUpperCase()}</p>
          <p class="recent__time">${tiempo}</p>
        </div>

        <a href="${link}" class="recent__headline">
          ${receta.nombre}
        </a>
      </div>
    </div>
  `;
}
