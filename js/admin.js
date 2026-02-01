import { supabase } from "./supabase.js";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const tablaCuerpo = document.getElementById("tabla-cuerpo");

// Manejo del Login (Seguro)
document.getElementById("loginBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("pass-login").value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Error de acceso: " + error.message);
    } else {
        loginSection.style.display = "none";
        adminPanel.style.display = "block";
        cargarInventario();
    }
});

// Agregar Producto (Seguro)
document.getElementById("addBtn")?.addEventListener("click", async () => {
    const nombre = document.getElementById("prodNombre").value;
    const precio = document.getElementById("prodPrecio").value;
    const categoria = document.getElementById("prodCategoria").value;
    const imagen = document.getElementById("prodImagen").value;

    if (!nombre || !precio || !imagen) return alert("Completa todos los campos");

    const { error } = await supabase.from('productos').insert([{ nombre, precio, categoria, imagen }]);
    
    if (error) alert("Error al subir");
    else {
        alert("¡Producto agregado!");
        document.getElementById("prodNombre").value = "";
        document.getElementById("prodPrecio").value = "";
        document.getElementById("prodImagen").value = "";
        cargarInventario();
    }
});

// Cerrar sesión
document.getElementById("logoutBtn")?.addEventListener("click", () => location.reload());

// Función para cargar la tabla
async function cargarInventario() {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) return;

    tablaCuerpo.innerHTML = "";
    data.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align:center; padding:10px;"><img src="${prod.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
            <td>${prod.nombre}</td>
            <td>$${prod.precio}</td>
            <td><button class="btn-delete" data-id="${prod.id}">BORRAR</button></td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

// Escuchar clics para borrar (Seguro)
tablaCuerpo?.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Seguro que quieres borrarlo?")) {
            await supabase.from('productos').delete().eq('id', id);
            cargarInventario();
        }
    }
});
