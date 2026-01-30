import { supabase } from "./supabase.js";

const lista = document.getElementById("lista-productos");

// 1. CARGAR PRODUCTOS PARA GESTIÓN
async function obtenerProductos() {
  const { data, error } = await supabase.from('productos').select('*');
  if (error) return;
  
  lista.innerHTML = "";
  data.forEach(prod => {
    lista.innerHTML += `
      <tr>
        <td><img src="${prod.imagen}"></td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio}</td>
        <td><button class="btn-delete" onclick="eliminarProducto(${prod.id})"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `;
  });
}

// 2. FUNCIÓN PARA ELIMINAR (La exponemos a la ventana)
window.eliminarProducto = async (id) => {
  if (confirm("¿Seguro que quieres eliminar este producto?")) {
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) alert("Error al eliminar");
    else obtenerProductos(); // Recargar lista
  }
};

// 3. AGREGAR NUEVO PRODUCTO
document.getElementById("btnAgregar").onclick = async () => {
  const nomVal = document.getElementById("nombre").value;
  const preVal = document.getElementById("precio").value;
  const catVal = document.getElementById("categoria").value;
  const file = document.getElementById("imagen").files[0];

  if (!file || !nomVal) return alert("Completa todos los campos");

  const path = `productos/${Date.now()}_${file.name}`;
  await supabase.storage.from("productos").upload(path, file);
  const { data } = supabase.storage.from("productos").getPublicUrl(path);

  await supabase.from("productos").insert({
    nombre: nomVal, precio: preVal, categoria: catVal, imagen: data.publicUrl
  });

  alert("Producto subido!");
  location.reload(); 
};

obtenerProductos();
