import { supabase } from "./supabase.js";

const contenedor = document.getElementById("productos");
let categoriaActual = "todos";

async function cargar() {
  let query = supabase.from("productos").select("*");

  if (categoriaActual !== "todos") {
    query = query.eq("categoria", categoriaActual);
  }

  const { data } = await query;

  contenedor.innerHTML = "";
  data.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <img src="${p.imagen}">
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>
      </div>
    `;
  });
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    categoriaActual = btn.dataset.cat;
    cargar();
  };
});

cargar();

