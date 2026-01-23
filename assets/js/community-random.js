"use strict"

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

    /* Imagen */
    const imageEl = card.querySelector(".community-card__image");
    imageEl.src = recipe.imagen_url || "https://via.placeholder.com/400x250?text=Sin+Imagen";
    imageEl.alt = recipe.nombre;

    /* Links */
    const recetaLink = `./pages/ver-receta.html?id=${recipe.id}`;
    card.querySelector(".community-card__link").href = recetaLink;
    card.querySelector(".community-card__title-link").href = recetaLink;
    card.querySelector(".community-card__title-link").textContent = recipe.nombre;

    /* Autor */
    const authorNameEl = card.querySelector(".community-card__author-name");
    const authorAvatarEl = card.querySelector(".community-card__author-avatar");

    authorNameEl.textContent = usuario?.usuario || "Autor desconocido";
    authorAvatarEl.src =
        usuario?.foto_perfil || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    const authorLink = `/pages/usuario.html?userId=${usuario?.id}`;
    authorNameEl.onclick = () => (window.location.href = authorLink);
    authorAvatarEl.onclick = () => (window.location.href = authorLink);

    /* Duración */
    card.querySelector(".community-card__duration span").textContent =
        recipe.tiempo_preparacion ? `${recipe.tiempo_preparacion} min` : "—";

    /* ===========================
       ESTRELLAS (PROMEDIO ENTERO)
    =========================== */

    const stars = card.querySelectorAll(".community-card__star");
    const comentarios = recipe.comentarios || [];

    console.log("📌 Comentarios:", comentarios);

    let promedio = 0;
    if (comentarios.length > 0) {
        const total = comentarios.reduce((sum, c) => sum + (c.puntaje || 0), 0);
        promedio = Math.round(total / comentarios.length);
    }

    console.log("⭐ Promedio calculado:", promedio);

    // Resetear estrellas
    stars.forEach(star => star.classList.add("community-card__star--empty"));

    // Activar según promedio
    for (let i = 0; i < promedio && i < stars.length; i++) {
        stars[i].classList.remove("community-card__star--empty");
    }

    card.querySelector(".community-card__score").textContent =
        `${promedio}/5 (${comentarios.length} reseñas)`;

    /* Compartir */
    const shareBtn = card.querySelector("[aria-label='Compartir']");
    shareBtn.onclick = async () => {
        const url = `${window.location.origin}/pages/ver-receta.html?id=${recipe.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert("📋 Enlace copiado al portapapeles");
        } catch {
            alert("❌ No se pudo copiar el enlace");
        }
    };

    /* Badge */
    const badgeEl = card.querySelector(".community-card__badge");
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
