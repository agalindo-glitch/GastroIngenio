"use strict";

const params = new URLSearchParams(window.location.search);
const idVisitado = params.get("userId");
const idLogueado = localStorage.getItem("id_usuario");

let userVisitado; 

const btnSeguir = document.getElementById("btnSeguir");
const btnMensaje = document.getElementById("btnMensaje");
const btnBloquear = document.getElementById("btnBloquear");

document.addEventListener("DOMContentLoaded", async () => {

    try {
        if (idVisitado) {
            const res = await fetch(`http://localhost:3000/usuarios/${idVisitado}`);
            const text = await res.text();
            userVisitado = text ? JSON.parse(text) : null;
        } else {
            const res = await fetch(`http://localhost:3000/usuarios/${idLogueado}`);
            const text = await res.text();
            userVisitado = text ? JSON.parse(text) : null;
        }

        if (!userVisitado) {
            console.error("Usuario no encontrado");
            return;
        }

        document.getElementById("nombrePerfil").textContent = userVisitado.nombre;
        document.getElementById("usuarioPerfil").textContent = `@${userVisitado.usuario}`;

        const perfilImg = document.getElementById("perfilImg");
        perfilImg.src =
            userVisitado.foto_perfil?.trim() || "https://st5.depositphotos.com/54392550/74655/v/450/depositphotos_746551184-stock-illustration-user-profile-icon-anonymous-person.jpg";

        cargarEstadisticas(Number(userVisitado.id));

        const botonesPropios = document.getElementById("botones-propios");
        const botonesAjenos = document.getElementById("botones-ajenos");

        if (userVisitado.id.toString() !== idLogueado.toString()) {
            botonesPropios.style.display = "none";
            botonesAjenos.style.display = "flex";
        } else {
            botonesPropios.style.display = "flex";
            botonesAjenos.style.display = "none";
        }

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
        const res = await fetch("http://localhost:3000/recetas");
        const recetas = await res.json();

        const recetasUsuario = recetas.filter(r => r.id_usuario == id_usuario);
        document.getElementById("numPosts").textContent = recetasUsuario.length;

        const elegidos = recetasUsuario.filter(r => r.elegidos_comunidad === true);
        document.getElementById("numElegidos").textContent = elegidos.length;

    } catch (error) {
        console.error("Error cargando estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidos").textContent = "0";
    }
}