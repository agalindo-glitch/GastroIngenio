"use strict";

document.addEventListener("DOMContentLoaded", cargarRecientes);

async function cargarRecientes() {
  const lista = document.querySelector(".recent__list");
  if (!lista) return;

  try {
    const res = await fetch("http://127.0.0.1:3000/recetas-recientes");
    if (!res.ok) throw new Error("Error obteniendo recetas recientes");

    const recetas = await res.json();

    lista.innerHTML = recetas.map(receta => crearCardReciente(receta)).join("");

  } catch (error) {
    console.error("Error cargando recientes:", error);
  }
}

function tiempoDesde(fechaString) {
  const fecha = new Date(fechaString); 
  if (isNaN(fecha)) return "Fecha inválida"; 

  const ahora = new Date();
  let diff = Math.floor((ahora - fecha) / 1000); 

  if (diff < 5) return "Hace unos segundos";

  const minutos = Math.floor(diff / 60);
  if (minutos < 1) return `Hace ${diff} segundos`;

  if (minutos < 60) return `Hace ${minutos} minutos`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} horas`;

  const dias = Math.floor(horas / 24);
  return `Hace ${dias} días`;
}

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
          <p class="recent__category">COMIDA</p>
          <p class="recent__time">${tiempo}</p>
        </div>

        <a href="${link}" class="recent__headline">
          ${receta.nombre}
        </a>
      </div>
    </div>
  `;
}
