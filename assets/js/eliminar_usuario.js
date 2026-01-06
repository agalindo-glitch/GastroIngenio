document.addEventListener("DOMContentLoaded", () => {
    const eliminar_boton = document.getElementById("eliminar_boton");
    const id_usuario = localStorage.getItem("id_usuario");

    eliminar_boton.addEventListener("click", () => {
        eliminarUsuario(id_usuario);
    });
});

async function eliminarUsuario(id_usuario){
    const confirmacion = window.confirm("Seguro que quieres eliminar el usuario?");
    
    if (!confirmacion) {
        return;
    }
    
    try {
        const respuesta = await fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
            method: "DELETE"
        })

        if(respuesta.ok){
            alert("Su usuario se elimino correctamente");
            localStorage.clear();
            window.location.href = "/index.html";
        } else {
            alert("No se pudo eliminar su usuario")
        }

    } catch (error) {
        alert("Algo salio mal");
        console.error(error);
    }
}