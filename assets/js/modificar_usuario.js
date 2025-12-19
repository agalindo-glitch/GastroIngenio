document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editarForm");
    const id_usuario = localStorage.getItem("id_usuario");

    const fotoInput = document.getElementById("fotoPerfilInput");
    const fotoPreview = document.getElementById("perfilImg");
    const previewBtn = document.getElementById("previewFotoBtn");

    // 🔄 Cargar datos del usuario
    fetch(`http://localhost:3000/usuarios/${id_usuario}`)
        .then(res => res.json())
        .then(user => {
            document.getElementById("nombrePerfilMod").value = user.nombre;
            document.getElementById("apellidoPerfilMod").value = user.apellido;
            document.getElementById("edadPerfilMod").value = user.edad;
            document.getElementById("usuarioPerfilMod").value = user.usuario;
            document.getElementById("nombrePerfil").textContent = `@ ${user.usuario}`;
            document.getElementById("contrasenaPerfilMod").value = user.contrasena;
            

            // 👤 Foto actual
            if (user.foto_perfil) {
                fotoPreview.src = user.foto_perfil;
                fotoInput.value = user.foto_perfil;
            }
        });

    // 👁️ Preview de foto
    previewBtn.addEventListener("click", () => {
        const url = fotoInput.value.trim();
        if (!url) {
            alert("Pegá una URL válida");
            return;
        }
        fotoPreview.src = url;
    });

    // 💾 Guardar cambios
    form.addEventListener("submit", e => {
        e.preventDefault();
        editarUsuario(id_usuario);
    });
});

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
            headers: {
                "Content-Type": "application/json"
            },
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
        alert("Algo salió mal");
        console.error(error);
    }
}
