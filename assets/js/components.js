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

async function initializeHeader() {
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

// No está en uso
// window.addEventListener("scroll", () => {
//     if (window.scrollY > 80) {
//         navbarMenu.classList.add("scrolled");
//     } else {
//         navbarMenu.classList.remove("scrolled");
//     }
// });   


document.addEventListener("DOMContentLoaded", async() => {
    
    loadComponent("footer", "footer.html");
 
    await loadComponent("header", "header.html");
    initializeHeader();
});
