const params = new URLSearchParams(window.location.search);
const idVisitado = params.get("userId");
const idLogueado = localStorage.getItem("id_usuario");

let userVisitado = null; // global para poder usar en botones

const btnSeguir = document.getElementById("btnSeguir");
const btnMensaje = document.getElementById("btnMensaje");
const btnBloquear = document.getElementById("btnBloquear");

document.addEventListener("DOMContentLoaded", async () => {
    console.log("perfil.js: DOM cargado");
    console.log("idLogueado:", idLogueado);
    console.log("idVisitado:", idVisitado);

    if (!idLogueado) {
        window.location.href = "/pages/login.html";
        return;
    }

    try {
        // ==========================
        // 👤 DATOS DEL USUARIO
        // ==========================
        if (idVisitado) {
            console.log("Buscando usuario por ID:", idVisitado);
            const res = await fetch(`http://localhost:3000/usuarios/${idVisitado}`);
            const text = await res.text();
            userVisitado = text ? JSON.parse(text) : null;
        } else {
            console.log("Mostrando mi propio perfil");
            const res = await fetch(`http://localhost:3000/usuarios/${idLogueado}`);
            const text = await res.text();
            userVisitado = text ? JSON.parse(text) : null;
        }

        if (!userVisitado) {
            console.error("Usuario no encontrado");
            return;
        }

        console.log("Datos del usuario:", userVisitado);

        // ==========================
        // Rellenar campos de la página
        // ==========================
        document.getElementById("nombrePerfil").textContent = userVisitado.nombre;
        document.getElementById("usuarioPerfil").textContent = `@${userVisitado.usuario}`;

        const perfilImg = document.getElementById("perfilImg");
        perfilImg.src =
            userVisitado.foto_perfil?.trim() || "https://st5.depositphotos.com/54392550/74655/v/450/depositphotos_746551184-stock-illustration-user-profile-icon-anonymous-person.jpg";

        // ==========================
        // Estadísticas
        // ==========================
        cargarEstadisticas(Number(userVisitado.id));

        // ==========================
        // Mostrar botones según perfil propio o ajeno
        // ==========================
        const botonesPropios = document.getElementById("botones-propios");
        const botonesAjenos = document.getElementById("botones-ajenos");

        if (userVisitado.id.toString() !== idLogueado.toString()) {
            botonesPropios.style.display = "none";
            botonesAjenos.style.display = "flex";
        } else {
            botonesPropios.style.display = "flex";
            botonesAjenos.style.display = "none";
        }

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }

    // ==========================
    // 🚪 DESLOGUEARSE
    // ==========================
    const logoutBtn = document.getElementById("logoutPerfilBtn");
    logoutBtn?.addEventListener("click", () => {
        if (confirm("¿Seguro que querés cerrar sesión?")) {
            localStorage.clear();
            window.location.href = "/index.html";
        }
    });
});

// ==========================
// 📊 RECETAS / POSTS
// ==========================
async function cargarEstadisticas(id_usuario) {
    try {
        const res = await fetch("http://localhost:3000/recetas");
        const recetas = await res.json();

        const recetasUsuario = recetas.filter(r => r.id_usuario == id_usuario);
        document.getElementById("numPosts").textContent = recetasUsuario.length;

        const elegidos = recetasUsuario.filter(r => r.elegidos_comunidad === true);
        document.getElementById("numElegidos").textContent = elegidos.length;

    } catch (error) {
        console.error("Error cargando estadísticas", error);
        document.getElementById("numPosts").textContent = "0";
        document.getElementById("numElegidos").textContent = "0";
    }
}

// ==========================
// BOTONES PERFIL AJENO
// ==========================
if (btnSeguir) {
    btnSeguir.addEventListener("click", async () => {
        if (!userVisitado) return;
        await fetch("http://localhost:3000/seguidores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                seguidor_id: idLogueado,
                seguido_id: userVisitado.id
            })
        });
        alert("Ahora seguís a este usuario 👌");
    });
}

if (btnMensaje) {
    btnMensaje.addEventListener("click", () => {
        if (!userVisitado) return;
        document.getElementById("chatModal").classList.add("is-active");
        document.getElementById("chatUser").textContent = userVisitado.usuario;
    });
}

if (btnBloquear) {
    btnBloquear.addEventListener("click", async () => {
        if (!userVisitado) return;
        if (!confirm("¿Seguro que querés bloquear a este usuario?")) return;

        await fetch("http://localhost:3000/bloqueados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bloqueador_id: idLogueado,
                bloqueado_id: userVisitado.id
            })
        });

        alert("Usuario bloqueado 🚫");
        window.location.href = "/index.html";
    });
}
