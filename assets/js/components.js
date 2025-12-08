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

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        navbarMenu.classList.add("scrolled");
    } else {
        navbarMenu.classList.remove("scrolled");
    }
});
