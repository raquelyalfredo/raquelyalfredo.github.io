/* Capa de datos compartida por la invitación, la lista de invitados y el checklist.
   - Con BODA.apiUrl: usa Google Apps Script + Google Sheets (compartido para todos).
   - Sin apiUrl: "modo prueba" con localStorage (solo en este navegador). */
(function () {
  const URL_API = (window.BODA && window.BODA.apiUrl || "").trim();
  const DEMO = !URL_API;
  const K_INV = "boda_demo_invitados";
  const K_CHK = "boda_demo_checklist";
  const CLAVE_DEMO = "boda";

  function normalizar(t) {
    return String(t || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ñ ]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  // Palabras que no sirven para identificar a nadie
  const VACIAS = new Set(["y", "e", "su", "sus", "la", "el", "de", "del", "los", "las", "esposa", "esposo", "mujer", "pareja",
    "papa", "mama", "tio", "tia", "abuela", "abuelo", "pastores", "pastor", "veci", "vecina", "vecino", "familia", "padre", "hijos"]);
  function palabras(t) {
    return normalizar(t).split(" ").filter(x => x.length > 1 && !/^\d+$/.test(x) && !VACIAS.has(x));
  }

  // Busca la invitación que corresponde al nombre escrito (misma lógica que Code.gs).
  // Sirve para invitaciones de grupo: «Saimar» encuentra «Samuel, Saimar y Samy».
  // Devuelve todas las invitaciones que encajan igual de bien con el nombre escrito.
  // Si hay más de una (p. ej. «Cesar» está en dos invitaciones), son personas distintas
  // con el mismo nombre y no se adivina cuál es.
  function candidatos(lista, nombre) {
    const n = normalizar(nombre);
    if (!n) return [];
    const exacto = lista.filter(g => normalizar(g.nombre) === n);
    const t = palabras(nombre);
    if (!t.length) return exacto;
    let mejor = 0, cand = [];
    lista.forEach(g => {
      const gt = palabras(g.nombre);
      const s = t.filter(x => gt.includes(x)).length;
      if (s > mejor) { mejor = s; cand = [g]; } else if (s && s === mejor) cand.push(g);
    });
    return exacto.length === 1 ? exacto : cand;
  }
  function buscar(lista, nombre) {
    const c = candidatos(lista, nombre);
    return c.length === 1 ? c[0] : null;
  }

  const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const ahora = () => new Date().toISOString();

  async function get(params) {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(URL_API + "?" + q);
    const j = await r.json();
    if (j.error) throw new Error(j.error);
    return j;
  }
  async function post(body) {
    // text/plain evita el "preflight" CORS que Apps Script no admite
    const r = await fetch(URL_API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j.error) throw new Error(j.error);
    return j;
  }

  // ---------- Modo prueba ----------
  const demo = {
    async confirmar(d) {
      const lista = leer(K_INV, []);
      const c = candidatos(lista, d.nombre);
      let g = c.length === 1 ? c[0] : null;
      const nuevo = g ? false : (c.length > 1 ? "repetido" : true);
      if (!g) { g = { id: id(), nombre: d.nombre.trim(), grupo: "", cupos: 1 }; lista.push(g); }
      Object.assign(g, {
        estado: d.asiste ? "confirmado" : "no_asiste",
        personas: d.asiste ? Number(d.personas || 1) : 0,
        mensaje: d.mensaje || "", fuente: "web", fecha: ahora(), nuevo
      });
      guardar(K_INV, lista);
      return { ok: true, nombre: g.nombre, nuevo };
    },
    async listar(clave) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      return { invitados: leer(K_INV, []) };
    },
    async marcar(clave, gid, estado, personas) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      const lista = leer(K_INV, []);
      const g = lista.find(x => x.id === gid);
      if (g) {
        g.estado = estado;
        g.personas = estado === "confirmado" ? Number(personas || g.cupos || 1) : 0;
        g.fuente = estado === "pendiente" ? "" : "manual";
        g.fecha = ahora();
      }
      guardar(K_INV, lista);
      return { ok: true };
    },
    async agregar(clave, nombres, grupo, cupos) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      const lista = leer(K_INV, []);
      nombres.forEach(n => { if (n.trim()) lista.push({ id: id(), nombre: n.trim(), grupo: grupo || "", cupos: Number(cupos || 1), estado: "pendiente", personas: 0 }); });
      guardar(K_INV, lista);
      return { ok: true };
    },
    async editar(clave, gid, cambios) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      const lista = leer(K_INV, []);
      const g = lista.find(x => x.id === gid);
      if (g) Object.assign(g, cambios);
      guardar(K_INV, lista);
      return { ok: true };
    },
    async eliminar(clave, gid) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      guardar(K_INV, leer(K_INV, []).filter(x => x.id !== gid));
      return { ok: true };
    },
    async checklistLeer(clave) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      return { checklist: leer(K_CHK, { hechos: {}, extra: [] }) };
    },
    async checklistGuardar(clave, data) {
      if (clave !== CLAVE_DEMO) throw new Error("Clave incorrecta");
      guardar(K_CHK, data);
      return { ok: true };
    }
  };

  // ---------- Google Sheets ----------
  const remoto = {
    confirmar: d => post({ accion: "confirmar", ...d }),
    listar: clave => get({ accion: "listar", clave }),
    marcar: (clave, id, estado, personas) => post({ accion: "marcar", clave, id, estado, personas }),
    agregar: (clave, nombres, grupo, cupos) => post({ accion: "agregar", clave, nombres, grupo, cupos }),
    editar: (clave, id, cambios) => post({ accion: "editar", clave, id, cambios }),
    eliminar: (clave, id) => post({ accion: "eliminar", clave, id }),
    checklistLeer: clave => get({ accion: "checklist", clave }),
    checklistGuardar: (clave, data) => post({ accion: "checklist", clave, data })
  };

  window.BodaAPI = Object.assign({ demo: DEMO, normalizar, buscar, candidatos }, DEMO ? demo : remoto);
})();
