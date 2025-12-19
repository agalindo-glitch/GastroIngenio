document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-review");

    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        crearComentario();
    });
});

async function crearComentario() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Tenés que estar logueado para comentar");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id_receta = params.get("id");

    if (!id_receta) {
        alert("No se encontró la receta");
        return;
    }

    const puntaje = document.querySelector('select[name="puntaje"]').value;
    const comentario = document.querySelector('textarea[name="comentario"]').value;

    if (!comentario.trim() || !puntaje) {
        alert("Completá todos los campos");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuario.id,
                id_receta: id_receta,
                descripcion: comentario,
                likes: 0,
                dislikes: 0
            })
        });

        if (respuesta.ok) {
            alert("Comentario agregado correctamente");
            document.getElementById("form-review").reset();
            location.reload();
        } else {
            alert("No se pudo agregar el comentario");
        }
    } catch (error) {
        console.error("Error al crear comentario:", error);
        alert("Error de conexión con el servidor");
    }
}