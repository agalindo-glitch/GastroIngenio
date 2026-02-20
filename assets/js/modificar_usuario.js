"use strict";

async function cargarEstadisticas(id_usuario) {
    try {
        const resPosts = await fetch(`http://localhost:3000/usuariosPosts/${id_usuario}`);
        const postsData = await resPosts.json();
        document.getElementById("numPosts").textContent = postsData.posts || 0;

        const resElegidas = await fetch(`http://localhost:3000/usuariosElegidas/${id_usuario}`);
        const elegidasData = await resElegidas.json();
        document.getElementById("numElegidos").textContent = elegidasData.elegidas || 0;

    } catch (error) {
        console.error("Error al cargar estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidos").textContent = "0";
    }
}

async function editarUsuario(id_usuario) {
    try {
        const nombre = document.getElementById("nombrePerfilMod").value;
        const apellido = document.getElementById("apellidoPerfilMod").value;
        const edad = document.getElementById("edadPerfilMod").value;
        const usuario = document.getElementById("usuarioPerfilMod").value;
        const contrasena = document.getElementById("contrasenaInput").value;

        const fotoInput = document.getElementById("fotoPerfilInput");
        const foto_perfil = fotoInput.value.trim() || null;

        if (foto_perfil) {
            try {
                await validarImagen(foto_perfil);
                limpiarErrorFoto(fotoInput);
            } catch {
                marcarErrorFoto(fotoInput, "La URL de la foto no es válida");
                return; 
            }
        }

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

function validarImagen(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(false);
        img.src = url;
    });
}

function marcarErrorFoto(input, mensaje) {
    input.classList.add("is-danger");
    input.setCustomValidity(mensaje);
    input.reportValidity();
}

function limpiarErrorFoto(input) {
    input.classList.remove("is-danger");
    input.setCustomValidity("");
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("editarForm");
    const id_usuario = localStorage.getItem("id_usuario");

    const fotoInput = document.getElementById("fotoPerfilInput");
    const fotoPreview = document.getElementById("perfilImg");
    const previewBtn = document.getElementById("previewFotoBtn");

    try {
        const resUser = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
        const user = await resUser.json();

        document.getElementById("nombrePerfilMod").value = user.nombre;
        document.getElementById("apellidoPerfilMod").value = user.apellido;
        document.getElementById("edadPerfilMod").value = user.edad;
        document.getElementById("usuarioPerfilMod").value = user.usuario;
        document.getElementById("contrasenaInput").value = user.contrasena;

        document.getElementById("nombrePerfil").textContent = `@${user.usuario}`;

        if (user.foto_perfil) {
            fotoPreview.src = user.foto_perfil;
            fotoInput.value = user.foto_perfil;
        }

        cargarEstadisticas(id_usuario);

    } catch (error) {
        console.error("Error al cargar usuario", error);
    }

    previewBtn.addEventListener("click", async () => {
        const url = fotoInput.value.trim();

        if (!url) {
            marcarErrorFoto(fotoInput, "Ingresá una URL de imagen");
            return;
        }

        try {
            await validarImagen(url);
            limpiarErrorFoto(fotoInput);
            fotoPreview.src = url;
        } catch {
            marcarErrorFoto(fotoInput, "La URL no corresponde a una imagen válida");
        }
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        editarUsuario(id_usuario);
    });
});

