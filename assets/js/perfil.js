document.addEventListener("DOMContentLoaded", () =>{
    const id_usuario = localStorage.getItem("id_usuario");

    fetch(`http://localhost:3000/usuarios/${id_usuario}`)
    .then(res => res.json())
    .then(user => {
        document.getElementById("nombrePerfil").textContent = `${user.nombre}`;
        document.getElementById("usuarioPerfil").textContent = `@${user.usuario}`;
    })

    tomarElegidosComunidad(id_usuario);
    tomarPost(id_usuario);
})

async function tomarElegidosComunidad(id_usuario){
    try{
        const respuesta = await fetch (`http://localhost:3000/usuariosElegidosComunidad/${id_usuario}`);
        if(respuesta.ok){
            const data = await respuesta.json();
            document.getElementById("numElegidos").textContent = `${data.elegidos}`;
        }
    }catch(error){
        document.getElementById("numElegidos").textContent = `Error`;
        console.error("No se pudo encontrar el numero de Elegidos por la comunidad", error);
    }
}

async function tomarPost(id_usuario){
    try{
        const respuesta = await fetch (`http://localhost:3000/usuariosPosts/${id_usuario}`);
        if(respuesta.ok){
            const data = await respuesta.json();
            document.getElementById("numPosts").textContent = `${data.posts}`;
        }
    }catch(error){
        document.getElementById("numPosts").textContent = `Error`;
        console.error("No se pudo encontrar el numero de posteos", error);
    }
}