document.addEventListener("DOMContentLoaded", () => {
    const eliminar_boton = document.getElementById("eliminar_boton");
    const id_usuario = localStorage.getItem("id_usuario");
    const errorElement = document.getElementById("error");

    eliminar_boton.addEventListener("click", () => {
        fetch(`http://localhost:3000/usuarios/${id_usuario}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("No se pudo eliminar el usuario");
            }
            localStorage.clear();
            window.location.href = "/index.html";
        })
        .catch(error => {
            if (errorElement) {
                errorElement.innerText = "Error al eliminar: " + error.message;
            }
        });
    });
});
