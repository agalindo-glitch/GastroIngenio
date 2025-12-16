
// funcion para iniciar sesion
function login(){
  const usuario = document.getElementById("usuario");
  const contrasena = document.getElementById("contrasena");

    fetch("http://localhost:3000/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario.value,
            contrasena: contrasena.value
        })
    })
    .then(res => {
        if(!res.ok) throw new Error();
        return res.json();
    })
    .then(user => {
        localStorage.setItem("logueado", "true");
        localStorage.setItem("id_usuario", user.id);
        window.location.href = "/index.html";
    })
    .catch(() => alert("Los datos ingresados no son correctos"))
}

// funcionalidad al formulario
document.addEventListener("DOMContentLoaded", () =>{
  const form = document.getElementById("formularioLogin");

  form.addEventListener("submit", (e) =>{
    e.preventDefault();
    login();
  })
})

// funcionalidad a los botones de sesion
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    const deslogearse_boton = document.getElementById("deslogearse_boton");
    const perfil_boton = document.getElementById("perfil_boton");
    const logearse_boton = document.getElementById("logearse_boton");

    if (localStorage.getItem("logueado") == "true") {
      logearse_boton.style.display = "none";
      deslogearse_boton.style.display = "block";
      perfil_boton.style.display = "block";
    } else {
      deslogearse_boton.style.display = "none";
      perfil_boton.style.display = "none";
      logearse_boton.style.display = "block";
    }

    deslogearse_boton.onclick = () => {
      localStorage.removeItem("logueado");
      window.location.href = "/index.html";
    };
  }, 100);
});
