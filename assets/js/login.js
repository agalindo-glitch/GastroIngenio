
// funcion para iniciar sesion
async function login(){
  try {
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("contrasena");

    const respuesta = await fetch("http://localhost:3000/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          usuario: usuario.value,
          contrasena: contrasena.value
      })
    });

    if(respuesta.ok){
      const data = await respuesta.json(); 
      localStorage.setItem("logueado", "true");
      localStorage.setItem("id_usuario", data.id);
      alert("Sesion iniciada");
      window.location.href = "/index.html";
    }else{
      alert("Los datos ingresados no son correctos");
    }
  } catch (error) {
    alert("Algo salio mal");
    console.error(error);
  }
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
  }, 100);
});
