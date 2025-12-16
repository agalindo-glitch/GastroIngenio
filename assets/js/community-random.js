const STORAGE_KEY = "communityRecipes";

/* 1. Crear recetas solo si no existen */
function initRecipes() {
    const recipes = [
        {
            title: "Milanesa Napolitana con Papas Fritas",
            image: "https://i.pinimg.com/originals/ee/42/0c/ee420cee3da5a303b3ebfa7dc8852700.jpg",
            author: "Chef Martín",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "40 min",
            rating: 1,
            reviews: 58
        },
        {
            title: "Hamburguesa Casera Gourmet",
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
            author: "Chef Laura",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "30 min",
            rating: 0,
            reviews: 102
        },
        {
            title: "Pizza Napolitana",
            image: "https://images.unsplash.com/photo-1601924582975-7e6706c8f7f3",
            author: "Chef Juan",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "90 min",
            rating: 4,
            reviews: 88
        },
        {
            title: "Tacos Mexicanos",
            image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
            author: "Chef Ana",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "25 min",
            rating: 2,
            reviews: 64
        },
        {
            title: "Ensalada César",
            image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
            author: "Chef Diego",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "15 min",
            rating: 1,
            reviews: 39
        },
        {
            title: "Empanadas Criollas",
            image: "https://images.unsplash.com/photo-1604908812841-1c90d97c4c4b",
            author: "Chef Luis",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "50 min",
            rating: 4,
            reviews: 56
        },
        {
            title: "Brownies de Chocolate",
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
            author: "Chef Carla",
            authorImg: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            duration: "35 min",
            rating: 5,
            reviews: 120
        }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

}

function renderRandomRecipe() {
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!recipes) return;

    const recipe = recipes[Math.floor(Math.random() * recipes.length)];

    const card = document.querySelector(".community-card");
    if (!card) return;

    card.querySelector(".community-card__image").src = recipe.image;
    card.querySelector(".community-card__image").alt = recipe.title;

    card.querySelector(".community-card__title-link").textContent = recipe.title;
    card.querySelector(".community-card__author-name").textContent = recipe.author;
    card.querySelector(".community-card__author-avatar").src = recipe.authorImg;
    card.querySelector(".community-card__duration span").textContent = recipe.duration;

    const stars = card.querySelectorAll(".community-card__star");
    stars.forEach((star, index) => {
        star.classList.toggle(
            "community-card__star--empty",
            index >= recipe.rating
        );
    });

    card.querySelector(".community-card__score").textContent =
        `${recipe.rating}/5 (${recipe.reviews} Reseñas)`;
}
document.addEventListener("DOMContentLoaded", () => {
    initRecipes();
    renderRandomRecipe();
});
