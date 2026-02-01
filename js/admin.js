import { supabase } from "./supabase.js";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const tablaCuerpo = document.getElementById("tabla-cuerpo");

// 1. Manejar el Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email-login").value;
        const pass = document.getElementById("pass-login").value;
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

        if (error) alert("Error: " + error.message);
        else {
            loginSection.style.display = "none";
            adminPanel.style.display = "block";
            cargarInventario();
        }
    });
}

// 2. Agregar Producto
const addBtn = document.getElementById("addBtn");
if (addBtn) {
    addBtn.addEventListener("click", async () => {
        const nombre = document.getElementById("prodNombre").value;
        const precio = document.getElementById("prodPrecio").value;
        const categoria = document.getElementById("prodCategoria").value;
        const imagen = document.getElementById("prodImagen").value;

        if (!nombre || !precio || !imagen) return alert("Completa todos los campos");

        const { error } = await supabase.from('productos').insert([{ nombre, precio, categoria, imagen }]);
        if (error) alert("Error al subir");
        else {
            alert("¡Subido!");
            cargarInventario();
        }
    });
}

// 3. Cerrar Sesión
document.getElementById("logoutBtn")?.addEventListener("click", () => location.reload());

// 4. Cargar Tabla (con delegación de eventos para evitar errores)
async function cargarInventario() {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) return;

    tablaCuerpo.innerHTML = "";
    data.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${prod.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
            <td>${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>$${prod.precio}</td>
            <td><button class="btn-delete" data-id="${prod.id}">BORRAR</button></td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

// Escuchar los clics de la tabla de forma segura (sin onclick)
tablaCuerpo.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Borrar producto?")) {
            await supabase.from('productos').delete().eq('id', id);
            cargarInventario();
        }
    }
});
