document.addEventListener("DOMContentLoaded", async () => {
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        // ==========================
        // 👤 DATOS DEL USUARIO
        // ==========================
        const resUser = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
        const user = await resUser.json();

        document.getElementById("nombrePerfil").textContent = user.nombre;
        document.getElementById("usuarioPerfil").textContent = `@${user.usuario}`;

        // Foto de perfil
        if (user.foto_perfil) {
            document.getElementById("perfilImg").src = user.foto_perfil;
        }

        // ==========================
        // 📊 ESTADÍSTICAS
        // ==========================
        cargarEstadisticas(id_usuario);

    } catch (error) {
        console.error("Error cargando perfil", error);
    }

    // ==========================
    // 🚪 DESLOGUEARSE
    // ==========================
    const logoutBtn = document.getElementById("logoutPerfilBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("¿Seguro que querés cerrar sesión?")) {
                localStorage.clear();
                window.location.href = "/index.html";
            }
        });
    }
});


// ==========================
// 📊 RECETAS / POSTS
// ==========================
async function cargarEstadisticas(id_usuario) {
    try {
        const res = await fetch("http://localhost:3000/recetas");
        const recetas = await res.json();

        const recetasUsuario = recetas.filter(
            r => r.id_usuario == id_usuario
        );

        document.getElementById("numPosts").textContent = recetasUsuario.length;

        const elegidos = recetasUsuario.filter(
            r => r.elegidos_comunidad === true
        );

        document.getElementById("numElegidos").textContent = elegidos.length;

    } catch (error) {
        console.error("Error cargando estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidos").textContent = "0";
    }
}
