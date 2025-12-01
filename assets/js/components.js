// --- Función para cargar cualquier componente HTML ---
function loadComponent(id, file) {
    return fetch(`/components/${file}`)
        .then(res => {
            if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error(err));
}

// --- Cargar Header y Footer ---
loadComponent("header", "header.html");
loadComponent("footer", "footer.html");

// --- Cargar Navbar y agregar funcionalidad toggle ---
loadComponent("navbar", "navbar.html").then(() => {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("nav-menu-visible");
        });
    }
});

// --- Función para cargar Cards dinámicamente desde JSON ---
async function loadCards(containerId, templateFile, dataFile) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Cargar plantilla
        const template = await fetch(`/components/${templateFile}`)
            .then(res => res.text());

        // Cargar datos
        const data = await fetch(`/assets/data/${dataFile}`)
            .then(res => res.json());

        // Crear cards
        data.forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = template;

            const card = wrapper.firstElementChild;
            if (!card) return;

            const img = card.querySelector(".card-img");
            if (img) img.src = item.img;

            const title = card.querySelector(".card-title");
            if (title) title.textContent = item.title;

            const desc = card.querySelector(".card-desc");
            if (desc) desc.textContent = item.desc;

            const btn = card.querySelector(".card-btn");
            if (btn) btn.textContent = item.btn;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando cards:", error);
    }
}

// --- Llamada de ejemplo para cargar las cards ---
loadCards("cards-container", "card.html", "cards.json");
