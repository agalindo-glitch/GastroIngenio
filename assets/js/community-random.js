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

    // Imagen
    card.querySelector(".community-card__image").src =
        recipe.imagen_url || "https://via.placeholder.com/400x250?text=Sin+Imagen";
    card.querySelector(".community-card__image").alt = recipe.nombre;

    // Links dinámicos a la receta
    const recetaLink = `./pages/ver-receta.html?id=${recipe.id}`;
    const cardLink = card.querySelector(".community-card__link");
    const titleLink = card.querySelector(".community-card__title-link");

    cardLink.href = recetaLink;
    titleLink.href = recetaLink;
    cardLink.onclick = () => window.location.href = recetaLink;

    // Título
    titleLink.textContent = recipe.nombre;

    // Autor
    const authorNameEl = card.querySelector(".community-card__author-name");
    const authorAvatarEl = card.querySelector(".community-card__author-avatar");

    authorNameEl.textContent = usuario?.usuario || "Autor desconocido";
    authorAvatarEl.src = usuario?.foto_perfil ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    const authorLink = `/pages/usuario.html?userId=${usuario?.id}`;
    authorNameEl.onclick = () => window.location.href = authorLink;
    authorAvatarEl.onclick = () => window.location.href = authorLink;

    // Duración
    card.querySelector(".community-card__duration span").textContent =
        recipe.tiempo_preparacion ? `${recipe.tiempo_preparacion} min` : "—";

    // Estrellas fijas
    const stars = card.querySelectorAll(".community-card__star");
    stars.forEach((star, index) => {
        star.classList.toggle("community-card__star--empty", index >= 4);
    });

    // Reseñas
    const reviews = recipe.review ?? 0;
    card.querySelector(".community-card__score").textContent =
        `4/5 (${reviews} reseñas)`;

    // ⭐ Compartir → copiar URL
    const shareBtn = card.querySelector("[aria-label='Compartir']");
    shareBtn.onclick = async () => {
        const url = `${window.location.origin}/pages/ver-receta.html?id=${recipe.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert("📋 ¡Enlace copiado al portapapeles!");
        } catch (err) {
            alert("No se pudo copiar el enlace");
        }
    };

    // ---------- Badge "Elegidos por la comunidad" ----------
    const badgeEl = card.querySelector(".community-card__badge");
    if (recipe.elegidos_comunidad === true) {
        badgeEl.textContent = "⭐ Elegido por la comunidad";
        badgeEl.style.display = "inline-block"; // mostrar
    } else {
        badgeEl.style.display = "none"; // ocultar si es false o null
    }
}



async function renderRandomRecipe() {
    const recetas = await getRecipesFromBackend();
    const usuarios = await getUsersFromBackend();

    if (!recetas || recetas.length === 0) return;

    // Filtrar solo las recetas elegidas por la comunidad
    const recetasComunidad = recetas.filter(r => r.elegidos_comunidad === true);
    if (recetasComunidad.length === 0) return; // si no hay ninguna, no mostrar nada

    const usersById = {};
    if (usuarios) {
        usuarios.forEach(u => usersById[u.id] = u);
    }

    // Elegir una receta aleatoria de las filtradas
    const random = recetasComunidad[Math.floor(Math.random() * recetasComunidad.length)];
    const usuario = usersById[random.id_usuario];

    renderRecipe(random, usuario);
}


document.addEventListener("DOMContentLoaded", renderRandomRecipe);
