document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("navbarToggle");

    // Crear menú dinámico
    const mobileMenu = document.createElement("div");
    mobileMenu.classList.add("mobile-menu");

    // Contenido simple
    mobileMenu.innerHTML = `
        <a href="#">Cenas</a>
        <a href="#">Comidas</a>
        <a href="#">Ocasiones</a>
        <a href="#">Sobre Nosotros</a>
    `;

    document.body.appendChild(mobileMenu);

    // Abrir/cerrar menú
    toggleButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("show");
        toggleButton.classList.toggle("active");
    });

    // Cerrar menú al tocar fuera
    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            mobileMenu.classList.remove("show");
            toggleButton.classList.remove("active");
        }
    });
});
