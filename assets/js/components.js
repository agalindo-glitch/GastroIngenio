"use strict";

function loadComponent(id, file) {
    return fetch(`../../components/${file}`)
        .then(res => {
            if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
            return res.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error(err));
}

function initializeHeader () {
    
    async function initializeButtons(inputDesktop, btnDesktop,) {
        
        const crearRecetaBtn = document.getElementById("crearReceta_boton");
        const perfilBtn = document.getElementById("perfil_boton");
        const perfilImg = document.getElementById("perfil_img");
        const loginBtn = document.getElementById("loguearse_boton");
    
        const logueado = localStorage.getItem("logueado") === "true";
        const id_usuario = localStorage.getItem("id_usuario");
    
        // USUARIO NO LOGUEADO
        if (!logueado) {
          crearRecetaBtn.style.display = "none";
          perfilBtn.style.display = "none"  
          return;
        }
    
        // USUARIO LOGUEADO
        crearRecetaBtn.style.display = "block";
        perfilBtn.style.display = "flex";
        loginBtn.style.display = "none";
    
        // CARGAR FOTO PERFIL
        try {
          const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
          const user = await res.json();
    
          if (user.foto_perfil?.trim()) {
            perfilImg.src = user.foto_perfil;
          }
          else { 
            perfilImg.src = "../assets/img/default-user.png";
          }
    
        } catch (error) {
          console.error("Error al cargar la foto de perfil", error);
        }
    }   

    function initializeSearchBar () {
        const inputDesktop = document.querySelector(".navbar__search-input:not(#search-input)");
        const btnDesktop = document.querySelector(".navbar__search-control .navbar__search-button");

        function ejecutarBusqueda(busqueda) {

            if (!busqueda.trim()) {
                console.warn("⚠ No se puede buscar un texto vacío");
                return;
            }

            window.location.href = `/pages/resultados.html?query=${encodeURIComponent(busqueda)}`;
        }

        // -------- DESKTOP --------
        if (inputDesktop) {
            inputDesktop.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    ejecutarBusqueda(inputDesktop.value);
                }
            });
        }

        if (btnDesktop) {
            btnDesktop.addEventListener("click", () => {
                ejecutarBusqueda(inputDesktop.value);
            });
        }
    }

    initializeButtons();
    initializeSearchBar();
}


document.addEventListener("DOMContentLoaded", async() => {
    
    loadComponent("footer", "footer.html");
 
    await loadComponent("header", "header.html");
    initializeHeader();
});
