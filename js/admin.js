import { supabase } from "./supabase.js";

document.getElementById("agregar").onclick = async (e) => {
  e.preventDefault(); // Evita que la página se recargue

  // 1. Obtenemos las referencias a los elementos del HTML
  const inputNombre = document.getElementById("nombre");
  const inputPrecio = document.getElementById("precio");
  const inputCategoria = document.getElementById("categoria");
  const inputImagen = document.getElementById("imagen");

  // 2. Extraemos los valores (aquí es donde fallaba antes)
  const nombre = inputNombre.value;
  const precio = inputPrecio.value;
  const categoria = inputCategoria.value;
  const file = inputImagen.files[0];

  // Verificación básica para evitar errores si no hay archivo
  if (!file) {
    alert("Por favor, selecciona una imagen.");
    return;
  }

  console.log("Subiendo imagen...");

  const path = `productos/${Date.now()}_${file.name}`;

  // 3. Subida a Storage
  const { error: uploadError } = await supabase.storage.from("productos").upload(path, file);

  if (uploadError) {
    alert("Error al subir imagen: " + uploadError.message);
    return;
  }

  // 4. Obtener URL pública
  const { data } = supabase.storage.from("productos").getPublicUrl(path);

  // 5. Insertar en la base de datos
  const { error: insertError } = await supabase.from("productos").insert({
    nombre: nombre,
    precio: precio,
    categoria: categoria,
    imagen: data.publicUrl
  });

  if (insertError) {
    alert("Error al guardar producto: " + insertError.message);
  } else {
    alert("¡Producto agregado con éxito!");
    // Opcional: limpiar el formulario
    inputNombre.value = "";
    inputPrecio.value = "";
    inputImagen.value = "";
  }
};
