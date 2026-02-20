"use strict";

const params = new URLSearchParams(window.location.search);
const idVisitado = params.get("userId");
const idLogueado = localStorage.getItem("id_usuario");
const idFinal = idVisitado || idLogueado;
const esMiPerfil = !idVisitado || idVisitado === idLogueado;

let userVisitado; 

document.addEventListener("DOMContentLoaded", async () => {
    
    if (!esMiPerfil){
        document.getElementById("botones-propios").remove();
    }

    try {
        const res = await fetch(`http://localhost:3000/usuarios/${idFinal}`);
        const text = await res.text();
        userVisitado = text ? JSON.parse(text) : null;

        document.getElementById("nombrePerfil").textContent = userVisitado.nombre;
        document.getElementById("usuarioPerfil").textContent = `@${userVisitado.usuario}`;

        const perfilImg = document.getElementById("perfilImg");
        perfilImg.src =
            userVisitado.foto_perfil?.trim() || "https://st5.depositphotos.com/54392550/74655/v/450/depositphotos_746551184-stock-illustration-user-profile-icon-anonymous-person.jpg";

        cargarEstadisticas(Number(userVisitado.id));

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }

    const logoutBtn = document.getElementById("logoutPerfilBtn");
    logoutBtn?.addEventListener("click", () => {
        if (confirm("¿Seguro que querés cerrar sesión?")) {
            localStorage.clear();
            window.location.href = "/index.html";
        }
    });
});

async function cargarEstadisticas(id_usuario) {
    try {

        const resPosts = await fetch(`http://localhost:3000/usuariosPosts/${id_usuario}`);
        const postsData = await resPosts.json();
        document.getElementById("numPosts").textContent = postsData.posts || 0;

        const resElegidas = await fetch(`http://localhost:3000/usuariosElegidas/${id_usuario}`);
        const elegidasData = await resElegidas.json();
        document.getElementById("numElegidas").textContent = elegidasData.elegidas || 0;

    } catch (error) {
        console.error("Error cargando estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidas").textContent = "0";
    }
}
