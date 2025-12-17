
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
