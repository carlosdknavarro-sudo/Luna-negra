// js/admin.js
import { supabase } from './supabase.js';

const btnAgregar = document.getElementById('btnAgregar');

btnAgregar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value; // Usando tu columna 'categoria'
    const file = document.getElementById('imagen').files[0];

    if (!nombre || !precio || !file) {
        alert("Por favor completa nombre, precio y selecciona una imagen");
        return;
    }

    try {
        // 1. Subir la imagen al bucket 'productos'
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('productos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Obtener la URL pública real
        const { data: urlData } = supabase.storage
            .from('productos')
            .getPublicUrl(fileName);

        const urlFinal = urlData.publicUrl;

        // 3. Insertar en la tabla usando el nombre de columna 'imagen'
        const { error: dbError } = await supabase
            .from('productos')
            .insert([{ 
                nombre: nombre, 
                precio: precio, 
                imagen: urlFinal, // <-- Nombre corregido según tu captura
                categoria: categoria 
            }]);

        if (dbError) throw dbError;

        alert("¡Producto subido con éxito!");
        location.reload();

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error: " + error.message);
    }
});
