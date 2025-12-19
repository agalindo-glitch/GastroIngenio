async function eliminarComentario(idComentario) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Tenés que estar logueado para eliminar un comentario");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que querés eliminar este comentario?");
    if (!confirmar) return;

    try {
        const respuesta = await fetch("http://localhost:3000/comentarios", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idComentario,
                id_usuario: usuario.id
            })
        });

        if (respuesta.ok) {
            alert("Comentario eliminado correctamente");
            location.reload();
        } else if (respuesta.status === 403) {
            alert("No tenés permiso para eliminar este comentario");
        } else {
            alert("No se pudo eliminar el comentario");
        }
    } catch (error) {
        console.error("Error al eliminar comentario:", error);
        alert("Error de conexión con el servidor");
    }
}