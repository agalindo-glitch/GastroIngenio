document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 busqueda.js activo");
    console.log("🔎 Intentando obtener elementos...");

    function obtenerElementos() {
        const inputDesktop = document.querySelector(".navbar__search-input:not(#search-input)");
        const btnDesktop = document.querySelector(".navbar__search-control .navbar__search-button");

        const inputMobile = document.querySelector("#search-input");
        const btnMobile = document.querySelector(".navbar__menu-mobile .navbar__search-button");

        console.log("🖥 Desktop input:", inputDesktop);
        console.log("🖥 Desktop btn:", btnDesktop);
        console.log("📱 Mobile input:", inputMobile);
        console.log("📱 Mobile btn:", btnMobile);

        // Si todavía no existe el navbar (porque se inyecta dinámicamente), reintentar
        if (!inputDesktop && !inputMobile) {
            console.log("⏳ Header aún no cargado, reintentando en 300 ms...");
            setTimeout(obtenerElementos, 300);
            return;
        }

        inicializarBuscador(inputDesktop, btnDesktop, inputMobile, btnMobile);
        console.log("✅ Buscador totalmente inicializado");
    }

    function inicializarBuscador(inputDesktop, btnDesktop, inputMobile, btnMobile) {
        console.log("🎯 Instalando listeners de búsqueda...");

        function ejecutarBusqueda(origen, valor) {
            console.log(`🚀 Ejecutando búsqueda desde: ${origen}`);
            console.log(`🔍 Valor ingresado: "${valor}"`);

            if (!valor.trim()) {
                console.warn("⚠ No se puede buscar un texto vacío");
                return;
            }

            window.location.href = `/pages/resultados.html?query=${encodeURIComponent(valor)}`;
        }

        // -------- DESKTOP --------
        if (inputDesktop) {
            inputDesktop.addEventListener("keydown", (e) => {
                console.log(`⌨ Tecla presionada (desktop): ${e.key}`);
                if (e.key === "Enter") {
                    console.log("🎯 ENTER detectado en desktop");
                    ejecutarBusqueda("desktop", inputDesktop.value);
                }
            });
        }

        if (btnDesktop) {
            btnDesktop.addEventListener("click", () => {
                console.log("🖱 Click en botón desktop");
                ejecutarBusqueda("desktop", inputDesktop.value);
            });
        }

        // -------- MOBILE --------
        if (inputMobile) {
            inputMobile.addEventListener("keydown", (e) => {
                console.log(`⌨ Tecla presionada (mobile): ${e.key}`);
                if (e.key === "Enter") {
                    console.log("🎯 ENTER detectado en mobile");
                    ejecutarBusqueda("mobile", inputMobile.value);
                }
            });
        }

        if (btnMobile) {
            btnMobile.addEventListener("click", () => {
                console.log("🖱 Click en botón mobile");
                ejecutarBusqueda("mobile", inputMobile.value);
            });
        }

        console.log("✅ Listeners instalados");
    }

    // Iniciar
    obtenerElementos();
});
