document.addEventListener("DOMContentLoaded", () => {
    const from = document.getElementById("editarForm");
    const id_usuario = localStorage.getItem("id_usuario");

    fetch(`http://localhost:3000/usuarios/${id_usuario}`)
    .then(res => res.json())
    .then(user => {
        document.getElementById("nombrePerfilMod").value = user.nombre;
        document.getElementById("apellidoPerfilMod").value = user.apellido;
        document.getElementById("edadPerfilMod").value = user.edad;
        document.getElementById("usuarioPerfilMod").value = user.usuario;
        document.getElementById("contrasenaPerfilMod").value = user.contrasena;
    })

    from.addEventListener("submit", e => {
        e.preventDefault();
        editarUsuario(id_usuario);
    });
});

async function editarUsuario(id_usuario) {
    try {
        const nombre = document.getElementById("nombrePerfilMod").value;
        const apellido = document.getElementById("apellidoPerfilMod").value;
        const edad = document.getElementById("edadPerfilMod").value;
        const usuario = document.getElementById("usuarioPerfilMod").value;
        const contrasena = document.getElementById("contrasenaPerfilMod").value;

        const respuesta = await fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, apellido, edad, usuario, contrasena })
        });

        if (respuesta.ok) {
            alert("Usuario modificado correctamente");
            window.location.href = "/pages/usuario.html"
        } else {
            alert("Error no se pudo modificar el usuario (revise que todos los campos esten llenos)")
        }

    } catch (error) {
        alert("Algo salio mal");
        console.error(error);
    }
}