document.addEventListener("DOMContentLoaded", () =>{
    const id_usuario = localStorage.getItem("id_usuario");

    if (!id_usuario) {
        window.location.href = "/login.html";
    }

    fetch(`http://localhost:3000/usuarios/${id_usuario}`)
    .then(res => res.json())
    .then(user => {
        document.getElementById("nombrePerfil").textContent = `${user.nombre}`;
        document.getElementById("usuarioPerfil").textContent = `@${user.usuario}`;
    })
})