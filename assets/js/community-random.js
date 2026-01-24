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
    const imageEl = card.querySelector(".community-card__image");
    const recetaLink = `./pages/ver-receta.html?id=${recipe.id}`;
    const authorNameEl = card.querySelector(".community-card__author-name");
    const authorAvatarEl = card.querySelector(".community-card__author-avatar");
    const authorEl = card.querySelector(".community-card__author");
    const authorLink = `/pages/usuario.html?userId=${usuario.id}`;
    const durationEl = card.querySelector(".community-card__duration span");
    const stars = card.querySelectorAll(".community-card__star");
    const comentarios = recipe?.comentarios || [];
    const score= card.querySelector(".community-card__score")
    const shareButton = card.querySelector("[aria-label='Compartir']");
    const badgeEl = card.querySelector(".community-card__badge");
    let promedio = 0;
    let i = 0;

    if (!card || !recipe) return;

    imageEl.src = recipe.imagen_url || "https://via.placeholder.com/400x250?text=Sin+Imagen";
    imageEl.alt = recipe.nombre;

    // Se puede acceder a la receta desde la imágen y desde el título
    card.querySelector(".community-card__link").href = recetaLink;
    card.querySelector(".community-card__title-link").href = recetaLink;

    card.querySelector(".community-card__title-link").textContent = recipe.nombre;

    authorNameEl.textContent = usuario.usuario || "Usuario desconocido";
    authorAvatarEl.src = usuario.foto_perfil || "/assets/img/default-user.png";
    authorEl.href = authorLink;

    durationEl.textContent = `${recipe.tiempo_preparacion} min`;

    // Promedio de 0 a 5 stars
    if (comentarios.length > 0) {
        const total = comentarios.reduce((sum, comentario) => sum + (comentario.puntaje), 0);
        promedio = Math.round(total / comentarios.length);
    }


    while (i < promedio && i < stars.length) {
        stars[i].classList.remove("community-card__star--empty");
        i++;
    }

    score.textContent =`${promedio}/5 (${comentarios.length} reseñas)`;

    shareButton.onclick = async () => {
        const url = `${window.location.origin}/pages/ver-receta.html?id=${recipe.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert("📋 Enlace copiado al portapapeles");
        } catch {
            alert("❌ No se pudo copiar el enlace");
        }
    };

    if (recipe.elegidos_comunidad === true) {
        badgeEl.textContent = "⭐ Elegido por la comunidad";
        badgeEl.style.display = "inline-block";
    } else {
        badgeEl.style.display = "none";
    }
}

async function chooseElegidosComunidad() {
    try {
        // Existen diferentes tipos de cards
        const htmlId = "#community-card";

        const recetas = await getFromBackend(API_RECIPES);
        if (!recetas?.length) return;

        const recetasComunidad = recetas.filter(receta => receta.elegidos_comunidad === true);
        if (!recetasComunidad.length) return;

        // El usuario ve una receta random de todas las elegidas por la comunidad
        const randomCommunityRecipe = recetasComunidad[Math.floor(Math.random() * recetasComunidad.length)];

        const users = await getFromBackend(API_USERS);
        if (!users?.length) return;

        const user = users.find(user => user.id === randomCommunityRecipe.id_usuario);

        renderRecipe(htmlId, randomCommunityRecipe, user);

    } catch (err) {
        console.error("❌ chooseElegidosComunidad:", err);
    }
}

document.addEventListener("DOMContentLoaded", chooseElegidosComunidad);
