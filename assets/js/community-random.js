"use strict";

const API_RECIPES = "http://localhost:3000/recetas";
const API_USERS = "http://localhost:3000/usuarios";

async function getFromBackend(API) {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Error obteniendo recetas");
        return await res.json();
    } catch (err) {
        console.error("❌ getRecipesFromBackend: ", err);
        return null;
    }
}

function renderRecipe(htmlId, recipe, usuario) {
    const card = document.querySelector(htmlId);
    if (!card || !recipe) return;

    const imageEl = card.querySelector(".community-card__image");
    const recetaLink = `./pages/ver-receta.html?id=${recipe.id}`;
    const authorNameEl = card.querySelector(".community-card__author-name");
    const authorAvatarEl = card.querySelector(".community-card__author-avatar");
    const authorEl = card.querySelector(".community-card__author");
    const authorLink = `/pages/usuario.html?userId=${usuario.id}`;
    const durationEl = card.querySelector(".community-card__duration span");
    const stars = card.querySelectorAll(".community-card__star");
    const score = card.querySelector(".community-card__score");
    const shareButton = card.querySelector("[aria-label='Compartir']");
    const badgeEl = card.querySelector(".community-card__badge");

    // Imagen
    imageEl.src = recipe.imagen_url || "https://via.placeholder.com/400x250?text=Sin+Imagen";
    imageEl.alt = recipe.nombre;

    // Links
    card.querySelector(".community-card__link").href = recetaLink;
    card.querySelector(".community-card__title-link").href = recetaLink;
    card.querySelector(".community-card__title-link").textContent = recipe.nombre;

    // Autor
    authorNameEl.textContent = usuario.usuario || "Usuario desconocido";
    authorAvatarEl.src = usuario.foto_perfil || "../img/default-user.png";

    authorAvatarEl.onerror = () => {
        authorAvatarEl.src = "./assets/img/default-user.png";
    };

    authorEl.href = authorLink;

    // Duración
    const totalMin = Number(recipe.tiempo_preparacion) || 0;

    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;

    let textoDuracion = "";

    if (horas > 0) {
        textoDuracion += `${horas} h`;
    }

    if (minutos > 0) {
        textoDuracion += (horas > 0 ? " " : "") + `${minutos} min`;
    }

    if (horas === 0 && minutos === 0) {
        textoDuracion = "0 min";
    }

    durationEl.textContent = textoDuracion;

    // ⭐ PROMEDIO DESDE BACKEND
    const promedio = Number(recipe.promedio) || 0;
    const totalReseñas = Number(recipe.total_reseñas) || 0;

    // Limpiar estrellas
    stars.forEach(star => {
        star.classList.add("community-card__star--empty");
    });

    // Pintar estrellas
    let i = 0;
    while (i < promedio && i < stars.length) {
        stars[i].classList.remove("community-card__star--empty");
        i++;
    }

    // Texto del puntaje
    score.textContent = `${promedio}/5 (${totalReseñas} reseñas)`;

    // Compartir
    shareButton.onclick = async () => {
        const url = `${window.location.origin}/pages/ver-receta.html?id=${recipe.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert("📋 Enlace copiado al portapapeles");
        } catch {
            alert("❌ No se pudo copiar el enlace");
        }
    };

    // Badge comunidad
    if (badgeEl) {
        if (recipe.elegida_comunidad === true) {
            badgeEl.textContent = "⭐ Elegido por la comunidad";
            badgeEl.style.display = "inline-block";
        } else {
            badgeEl.style.display = "none";
        }
    }

}

async function chooseElegidosComunidad() {
    try {

        const htmlId = "#community-card";

        // Trae UNA receta random ya elegida por comunidad
        const recipe = await getFromBackend("http://localhost:3000/recetaRandomComunidad");
        if (!recipe) return;

        // Trae su autor
        const user = await getFromBackend(`${API_USERS}/${recipe.id_usuario}`);
        if (!user) return;

        renderRecipe(htmlId, recipe, user);

    } catch (err) {
        console.error("❌ chooseElegidosComunidad:", err);
    }
}

document.addEventListener("DOMContentLoaded", chooseElegidosComunidad);
