document.addEventListener("DOMContentLoaded", () => {
  setTimeout(async () => {
    const crearRecetaBtn = document.getElementById("crearReceta_boton");
    const perfilBtn = document.getElementById("perfil_boton");
    const perfilImg = document.getElementById("perfil_img");
    const loginBtn = document.getElementById("logearse_boton");

    const logueado = localStorage.getItem("logueado") === "true";
    const id_usuario = localStorage.getItem("id_usuario");

    // ====== USUARIO NO LOGUEADO ======
    if (!logueado || !id_usuario) {
      crearRecetaBtn.style.display = "none";
      perfilBtn.style.display = "none";
      loginBtn.style.display = "block";
      return;
    }

    // ====== USUARIO LOGUEADO ======
    crearRecetaBtn.style.display = "block";
    perfilBtn.style.display = "flex";
    loginBtn.style.display = "none";

    // ====== CARGAR FOTO PERFIL ======
    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);
      const user = await res.json();

      if (user.foto_perfil && user.foto_perfil.trim() !== "") {
        perfilImg.src = user.foto_perfil;
      } else {
        perfilImg.src = "../assets/img/default-user.png";
      }

      // Si la imagen falla
      perfilImg.onerror = () => {
        perfilImg.src = "../assets/img/default-user.png";
      };

    } catch (error) {
      console.error("Error al cargar la foto de perfil", error);
      perfilImg.src = "../assets/img/default-user.png";
    }

    // ====== CLICK EN FOTO → PERFIL ======
    perfilBtn.addEventListener("click", () => {
      window.location.href = "../pages/usuario.html";
    });

  }, 100);
});
