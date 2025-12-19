document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("editarForm");
    const id_usuario = localStorage.getItem("id_usuario");

    const fotoInput = document.getElementById("fotoPerfilInput");
    const fotoPreview = document.getElementById("perfilImg");
    const previewBtn = document.getElementById("previewFotoBtn");

    // ====== CARGAR USUARIO ======
    try {
        const resUser = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
        const user = await resUser.json();

        document.getElementById("nombrePerfilMod").value = user.nombre;
        document.getElementById("apellidoPerfilMod").value = user.apellido;
        document.getElementById("edadPerfilMod").value = user.edad;
        document.getElementById("usuarioPerfilMod").value = user.usuario;
        document.getElementById("contrasenaPerfilMod").value = user.contrasena;

        // 👉 Mostrar @usuario
        document.getElementById("nombrePerfil").textContent = `@${user.usuario}`;

        // 👉 Foto actual
        if (user.foto_perfil) {
            fotoPreview.src = user.foto_perfil;
            fotoInput.value = user.foto_perfil;
        }

        // 👉 Cargar estadísticas
        cargarEstadisticas(id_usuario);

    } catch (error) {
        console.error("Error al cargar usuario", error);
    }

    // ====== PREVIEW FOTO ======
    previewBtn.addEventListener("click", () => {
        const url = fotoInput.value.trim();
        if (!url) {
            alert("Pegá una URL válida");
            return;
        }
        fotoPreview.src = url;
    });

    // ====== GUARDAR CAMBIOS ======
    form.addEventListener("submit", e => {
        e.preventDefault();
        editarUsuario(id_usuario);
    });
});


// ==============================
// 📊 ESTADÍSTICAS DEL USUARIO
// ==============================
async function cargarEstadisticas(id_usuario) {
    try {
        const res = await fetch("http://localhost:3000/recetas");
        const recetas = await res.json();

        // Recetas del usuario
        const recetasUsuario = recetas.filter(
            receta => receta.id_usuario == id_usuario
        );

        // Total posts
        document.getElementById("numPosts").textContent = recetasUsuario.length;

        // Elegidos por la comunidad
        const elegidos = recetasUsuario.filter(
            receta => receta.elegidos_comunidad === true
        );

        document.getElementById("numElegidos").textContent = elegidos.length;

    } catch (error) {
        console.error("Error al cargar estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidos").textContent = "0";
    }
}


// ==============================
// ✏️ EDITAR USUARIO
// ==============================
async function editarUsuario(id_usuario) {
    try {
        const nombre = document.getElementById("nombrePerfilMod").value;
        const apellido = document.getElementById("apellidoPerfilMod").value;
        const edad = document.getElementById("edadPerfilMod").value;
        const usuario = document.getElementById("usuarioPerfilMod").value;
        const contrasena = document.getElementById("contrasenaPerfilMod").value;
        const foto_perfil = document.getElementById("fotoPerfilInput").value || null;

        const respuesta = await fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                apellido,
                edad,
                usuario,
                contrasena,
                foto_perfil
            })
        });

        if (respuesta.ok) {
            alert("Usuario modificado correctamente");
            window.location.href = "/pages/usuario.html";
        } else {
            alert("Error: no se pudo modificar el usuario");
        }

    } catch (error) {
        console.error(error);
        alert("Algo salió mal");
    }
}
