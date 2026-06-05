const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  console.error("Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

async function runKeepalive() {
  const headers = {
    "apikey": KEY,
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  try {
    // 1. Create
    console.log("Iniciando ping de keepalive (CREATE)...");
    let res = await fetch(`${URL}/rest/v1/keepalive_cron`, {
      method: "POST",
      headers,
      body: JSON.stringify({ action_type: "cron_ping" })
    });
    let data = await res.json();
    if (!res.ok) throw new Error("Error Create: " + JSON.stringify(data));
    const createdId = data[0].id;

    // 2. Read
    console.log("Verificando registro (READ)...");
    res = await fetch(`${URL}/rest/v1/keepalive_cron?id=eq.${createdId}`, {
      method: "GET",
      headers
    });
    data = await res.json();
    if (!res.ok) throw new Error("Error Read: " + JSON.stringify(data));

    // 3. Update
    console.log("Actualizando registro (UPDATE)...");
    res = await fetch(`${URL}/rest/v1/keepalive_cron?id=eq.${createdId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ action_type: "cron_ping_updated" })
    });
    if (!res.ok) {
      data = await res.json();
      throw new Error("Error Update: " + JSON.stringify(data));
    }

    // 4. Delete
    console.log("Eliminando registro y limpieza (DELETE)...");
    res = await fetch(`${URL}/rest/v1/keepalive_cron?id=eq.${createdId}`, {
      method: "DELETE",
      headers
    });
    if (!res.ok) {
      data = await res.json();
      throw new Error("Error Delete: " + JSON.stringify(data));
    }
    
    // Limpieza de registros antiguos que pudieran haber quedado
    await fetch(`${URL}/rest/v1/keepalive_cron?action_type=eq.cron_ping`, {
      method: "DELETE",
      headers
    });

    // Registro final para marcar que el proceso se completó exitosamente
    console.log("Creando registro final de keepalive...");
    res = await fetch(`${URL}/rest/v1/keepalive_cron`, {
      method: "POST",
      headers,
      body: JSON.stringify({ action_type: "cron_ping_completed" })
    });
    data = await res.json();
    if (!res.ok) throw new Error("Error creating final record: " + JSON.stringify(data));


    // mensaje final de éxito
    console.log("Keepalive finalizado correctamente. Operación CRUD completa.");
  } catch (error) {
    console.error("Keepalive falló:", error.message);
    process.exit(1);
  }
}

runKeepalive();
