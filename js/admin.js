import { supabase } from "./supabase.js";

document.getElementById("agregar").onclick = async () => {
  const nombre = nombre.value;
  const precio = precio.value;
  const categoria = categoria.value;
  const file = imagen.files[0];

  const path = `productos/${Date.now()}_${file.name}`;

  await supabase.storage.from("productos").upload(path, file);

  const { data } = supabase.storage.from("productos").getPublicUrl(path);

  await supabase.from("productos").insert({
    nombre,
    precio,
    categoria,
    imagen: data.publicUrl
  });

  alert("Producto agregado");
};

