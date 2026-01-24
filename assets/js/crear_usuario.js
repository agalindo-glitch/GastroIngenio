"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("crearForm");

    form.addEventListener("submit", e => {
        e.preventDefault();
        crearUsuario();
    });
})

async function crearUsuario() {
    try{
        const nombre = document.getElementById("nombreInput").value;
        const apellido = document.getElementById("apellidoInput").value;
        const edad = document.getElementById("edadInput").value;
        const usuario = document.getElementById("usuarioInput").value;
        const contrasena = document.getElementById("contrasenaInput").value;

        const respuesta = await fetch(`http://localhost:3000/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, apellido, edad, usuario, contrasena })
        })

        if(respuesta.ok){
            alert("Usuario creado");
            window.location.href = "/index.html";
        }else{
            alert("El usuario ya existe");
        }

    }catch(error){
        console.error("Error al hacer la solicitud:", error);
    }
}