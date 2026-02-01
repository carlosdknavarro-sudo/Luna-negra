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

// 2. AGREGAR PRODUCTO
document.getElementById("addBtn")?.addEventListener("click", async () => {
    const nombre = document.getElementById("prodNombre").value;
    const precio = document.getElementById("prodPrecio").value;
    const categoria = document.getElementById("prodCategoria").value;
    const fotoArchivo = document.getElementById("prodFoto").files[0];

    if (!nombre || !precio || !fotoArchivo) return alert("Faltan datos o la foto.");

    try {
        const nombreImg = `${Date.now()}_${fotoArchivo.name}`;
        const { error: uploadError } = await supabase.storage
            .from('imagenes-productos')
            .upload(nombreImg, fotoArchivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('imagenes-productos').getPublicUrl(nombreImg);
        const urlFinal = urlData.publicUrl;

        const { error: insertError } = await supabase.from('productos').insert([{ 
            nombre, precio: parseFloat(precio), categoria, imagen: urlFinal 
        }]);

        if (insertError) throw insertError;

        alert("¡Publicado con éxito!");
        cargarInventario();
        // Limpiar campos
        document.getElementById("prodNombre").value = "";
        document.getElementById("prodPrecio").value = "";
        document.getElementById("prodFoto").value = "";
    } catch (err) {
        alert("Error: " + err.message);
    }
});

// 3. CARGAR INVENTARIO (Con Botón Editar)
async function cargarInventario() {
    const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (error) return;
    
    tablaCuerpo.innerHTML = "";
    data.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="padding:10px; text-align:center;"><img src="${prod.imagen}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;"></td>
            <td style="font-weight:bold;">${prod.nombre}</td>
            <td style="color:#d63384; font-weight:bold;">$${prod.precio}</td>
            <td>
                <button class="btn-edit" data-id="${prod.id}" data-precio="${prod.precio}" style="background:#87ceeb; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; margin-right:5px;">Editar $</button>
                <button class="btn-delete" data-id="${prod.id}" style="background:#ff4d4d; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">Borrar</button>
            </td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

// 4. EVENTOS DE LA TABLA (BORRAR Y EDITAR)
tablaCuerpo?.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-id");

    // LÓGICA PARA BORRAR
    if (e.target.classList.contains("btn-delete")) {
        if (confirm("¿Eliminar esta prenda?")) {
            await supabase.from('productos').delete().eq('id', id);
            cargarInventario();
        }
    }

    // LÓGICA PARA EDITAR PRECIO
    if (e.target.classList.contains("btn-edit")) {
        const precioActual = e.target.getAttribute("data-precio");
        const nuevoPrecio = prompt("Ingrese el nuevo precio para este producto:", precioActual);
        
        if (nuevoPrecio !== null && nuevoPrecio !== "" && !isNaN(nuevoPrecio)) {
            const { error } = await supabase
                .from('productos')
                .update({ precio: parseFloat(nuevoPrecio) })
                .eq('id', id);

            if (error) {
                alert("Error al actualizar precio");
            } else {
                alert("Precio actualizado");
                cargarInventario();
            }
        }
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => location.reload());
