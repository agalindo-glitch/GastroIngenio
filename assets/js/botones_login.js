// funcionalidad a los botones de sesion
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    const deslogearse_boton = document.getElementById("deslogearse_boton");
    const perfil_boton = document.getElementById("perfil_boton");
    const logearse_boton = document.getElementById("logearse_boton");
    const crearReceta_boton = document.getElementById("crearReceta_boton");

    if (localStorage.getItem("logueado") == "true") {
      crearReceta_boton.style.display = "block";
      logearse_boton.style.display = "none";
      deslogearse_boton.style.display = "block";
      perfil_boton.style.display = "block";
    } else {
      crearReceta_boton.style.display = "none";
      deslogearse_boton.style.display = "none";
      perfil_boton.style.display = "none";
      logearse_boton.style.display = "block";
    }

    deslogearse_boton.onclick = () => {
      localStorage.clear();
      window.location.href = "/index.html";
    };
  }, 50);
});