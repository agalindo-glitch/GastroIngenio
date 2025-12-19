const API_URL = "http://localhost:3000/recetas";
const API_USERS = "http://localhost:3000/usuarios";

async function getRecipesFromBackend() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error obteniendo recetas del backend");
        return await res.json();
    } catch (err) {
        console.error("Error al obtener recetas:", err);
        return null;
    }
}

async function getUsersFromBackend() {
    try {
        const res = await fetch(API_USERS);
        if (!res.ok) throw new Error("Error obteniendo usuarios");
        return await res.json();
    } catch (err) {
        console.error("Error usuarios:", err);
        return null;
    }
}

function renderRecipe(recipe, usuario) {
    const card = document.querySelector(".community-card");
    if (!card || !recipe) return;

    // Imagen principal
    card.querySelector(".community-card__image").src =
        recipe.imagen_url || "https://via.placeholder.com/400x250?text=Sin+Imagen";
    card.querySelector(".community-card__image").alt = recipe.nombre;

    // Título
    card.querySelector(".community-card__title-link").textContent = recipe.nombre;

    // Autor
    const authorNameEl = card.querySelector(".community-card__author-name");
    const authorAvatarEl = card.querySelector(".community-card__author-avatar");

    authorNameEl.textContent = usuario?.usuario || "Autor desconocido";

    authorAvatarEl.src =
        usuario?.foto_perfil ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    // Link al perfil del usuario
    const authorLink = `/pages/usuario.html?userId=${usuario?.id}`;

    authorNameEl.style.cursor = "pointer";
    authorNameEl.onclick = () => window.location.href = authorLink;

    authorAvatarEl.style.cursor = "pointer";
    authorAvatarEl.onclick = () => window.location.href = authorLink;

    // Duración
    card.querySelector(".community-card__duration span").textContent =
        recipe.tiempo_preparacion
            ? `${recipe.tiempo_preparacion} min`
            : "—";

    // ⭐⭐⭐⭐✩ Estrellas fijas en 4
    const stars = card.querySelectorAll(".community-card__star");
    stars.forEach((star, index) => {
        star.classList.toggle("community-card__star--empty", index >= 4);
    });

    // review = cantidad de reseñas
    const reviews = recipe.review ?? 0;

    // Texto: 4/5 (7 reseñas)
    card.querySelector(".community-card__score").textContent =
        `4/5 (${reviews} reseñas)`;
}

async function renderRandomRecipe() {
    const recetas = await getRecipesFromBackend();
    const usuarios = await getUsersFromBackend();

    if (!recetas || recetas.length === 0) return;

    const usersById = {};
    if (usuarios) {
        usuarios.forEach(u => usersById[u.id] = u);
    }

    const random = recetas[Math.floor(Math.random() * recetas.length)];
    const usuario = usersById[random.id_usuario];

    renderRecipe(random, usuario);
}

document.addEventListener("DOMContentLoaded", renderRandomRecipe);
