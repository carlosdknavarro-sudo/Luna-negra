import { supabase } from "./supabase.js";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");
const tablaCuerpo = document.getElementById("tabla-cuerpo");

// 1. LOGIN
document.getElementById("loginBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("pass-login").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert("Error: " + error.message);
    else {
        loginSection.style.display = "none";
        adminPanel.style.display = "block";
        cargarInventario();
    }
});

// 2. AGREGAR PRODUCTO CON IMAGEN LOCAL
document.getElementById("addBtn")?.addEventListener("click", async () => {
    const nombre = document.getElementById("prodNombre").value;
    const precio = document.getElementById("prodPrecio").value;
    const categoria = document.getElementById("prodCategoria").value;
    const fotoArchivo = document.getElementById("prodFoto").files[0];

    if (!nombre || !precio || !fotoArchivo) return alert("Faltan datos o la foto.");

    try {
        // A. Subir imagen al Storage
        const nombreImg = `${Date.now()}_${fotoArchivo.name}`;
        const { error: uploadError } = await supabase.storage
            .from('imagenes-productos')
            .upload(nombreImg, fotoArchivo);

        if (uploadError) throw uploadError;

        // B. Obtener link de la foto
        const { data: urlData } = supabase.storage.from('imagenes-productos').getPublicUrl(nombreImg);
        const urlFinal = urlData.publicUrl;

        // C. Guardar en Base de Datos
        const { error: insertError } = await supabase.from('productos').insert([{ 
            nombre, precio, categoria, imagen: urlFinal 
        }]);

        if (insertError) throw insertError;

        alert("¡Publicado con éxito!");
        location.reload(); // Recarga para limpiar
    } catch (err) {
        alert("Error: " + err.message);
    }
});

// 3. CARGAR INVENTARIO
async function cargarInventario() {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) return;
    tablaCuerpo.innerHTML = "";
    data.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding:10px; text-align:center;"><img src="${prod.imagen}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;"></td>
            <td style="font-weight:bold;">${prod.nombre}</td>
            <td style="color:green;">$${prod.precio}</td>
            <td><button class="btn-delete" data-id="${prod.id}" style="background:#ff4d4d; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Borrar</button></td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

// 4. BORRAR
tablaCuerpo?.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Eliminar prenda?")) {
            await supabase.from('productos').delete().eq('id', id);
            cargarInventario();
        }
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => location.reload());
