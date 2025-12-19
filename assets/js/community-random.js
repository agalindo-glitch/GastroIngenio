const API_URL = "http://localhost:3000/recetas";
const API_USERS = "http://localhost:3000/usuarios";

/* ===========================
   FETCHERS
=========================== */

async function getRecipesFromBackend() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error obteniendo recetas");
        return await res.json();
    } catch (err) {
        console.error("❌ getRecipesFromBackend:", err);
        return null;
    }
}

/* ===========================
   RENDER RECETA
=========================== */

function renderRecipe(recipe, usuario) {
    const card = document.querySelector(".community-card");
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

/* ===========================
   RECETA ALEATORIA
=========================== */

async function renderRandomRecipe() {
    try {
        // 1️⃣ Traer recetas
        const recetas = await getRecipesFromBackend();
        if (!recetas?.length) return;

        // 2️⃣ Filtrar elegidas por la comunidad
        const recetasComunidad = recetas.filter(r => r.elegidos_comunidad === true);
        if (!recetasComunidad.length) return;

        // 3️⃣ Elegir una al azar
        const random = recetasComunidad[Math.floor(Math.random() * recetasComunidad.length)];

        // 4️⃣ Traer receta completa (con comentarios)
        const res = await fetch(`${API_URL}/${random.id}/completo`);
        if (!res.ok) throw new Error("Error obteniendo receta completa");

        const recetaCompleta = await res.json();

        // 5️⃣ Armar usuario
        const usuario = {
            id: recetaCompleta.id_usuario,
            usuario: recetaCompleta.autor,
            foto_perfil: recetaCompleta.autor_foto
        };

        // 6️⃣ Render
        renderRecipe(recetaCompleta, usuario);

    } catch (err) {
        console.error("❌ renderRandomRecipe:", err);
    }
}

/* ===========================
   INIT
=========================== */

document.addEventListener("DOMContentLoaded", renderRandomRecipe);
