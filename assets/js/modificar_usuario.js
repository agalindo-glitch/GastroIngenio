document.addEventListener("DOMContentLoaded", () => {
    const from = document.getElementById("editarForm");
    const id_usuario = localStorage.getItem("id_usuario");
    const error = document.getElementById("error");

    if (!id_usuario) {
        window.location.href = "/login.html";
    }

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
        editarUsuario();
    });

    function editarUsuario() {
        const nombre = document.getElementById("nombrePerfilMod").value;
        const apellido = document.getElementById("apellidoPerfilMod").value;
        const edad = document.getElementById("edadPerfilMod").value;
        const usuario = document.getElementById("usuarioPerfilMod").value;
        const contrasena = document.getElementById("contrasenaPerfilMod").value;

        fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, apellido, edad, usuario, contrasena })
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json(); // Si quieres manejar los datos devueltos por el servidor
        })
        .then(data => {
            // Aquí puedes manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito
        })
        .catch(() => {
            if (error) {
                error.innerText = "Error al actualizar";
            }
        });
    }
});

