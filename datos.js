/* =========================================================
   DATOS DE LA BODA — edita solo este archivo
   Todo lo que está entre comillas se muestra en la invitación.
   ========================================================= */
window.BODA = {
  // --- Pareja ---
  novia: "Raquel Suárez",
  novio: "Alfredo Navea",
  iniciales: "R & A",

  // --- Fecha (formato AAAA-MM-DDTHH:MM, hora de 24 h) ---
  fecha: "2026-12-19T18:00",

  // --- Lugar ---
  ceremonia: {
    nombre: "Salón de Fiestas Varsovias",
    direccion: "Barinas, Venezuela",
    hora: "6:00 p. m.",
    mapa: "https://www.google.com/maps/place/SALON+DE+FIESTA+VARSOVIAS/@8.6173616,-70.2705384,17z"
  },
  // Si la recepción es en otro sitio, cambia null por { nombre, direccion, hora, mapa }
  recepcion: null,

  // --- Cronograma del día (deja hora: "" para no mostrar la hora) ---
  cronograma: [
    { hora: "6:00 p. m.", texto: "Llegada de invitados" },
    { hora: "", texto: "Ceremonia" },
    { hora: "", texto: "Brindis y fotos" },
    { hora: "", texto: "Cena" },
    { hora: "", texto: "¡A bailar!" }
  ],

  // --- Código de vestimenta ---
  vestimenta: {
    tipo: "Elegante",
    nota: "Lo importante es venir elegantes: el traje no es obligatorio para los caballeros, y las damas pueden lucir el vestido que más les guste. Puedes venir de cualquier color, salvo los reservados. Si buscas inspiración, estos tonos combinan con nuestra boda:",
    colores: ["#A7B39C", "#A9BBCB", "#BDB3CC"],          // paleta sugerida (opcional): salvia, azul empolvado, lavanda
    prohibidos: [                                          // colores que no se deben usar
      { nombre: "Blanco", color: "#FFFFFF" },
      { nombre: "Marfil", color: "#F4EBD6" },
      { nombre: "Beige", color: "#E8DCC8" },
      { nombre: "Rojo", color: "#C0392B" },
      { nombre: "Vinotinto", color: "#6B1E2C" }
    ],
    damas: [                                               // reservados para las damas de honor
      { nombre: "Rosa viejo", color: "#C08A8B" },
      { nombre: "Rose gold", color: "#B76E79" }
    ],
    evitar: "Con cariño te pedimos no usar blanco ni sus derivados (marfil, crema, beige), rojo ni vinotinto: queremos que la novia sea la protagonista de la noche."
  },

  // --- Solo adultos ---
  soloAdultos: "Queremos mucho a sus pequeños, pero esta vez pensamos en una celebración solo para adultos. ¡Gracias por entenderlo y regalarse una noche de baile con nosotros!",

  // --- Regalos ---
  regalos: "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, habrá lluvia de sobres el día de la boda.",

  // --- Confirmación ---
  confirmarAntesDe: "5 de diciembre de 2026",
  whatsapp: "584245738444",          // 0424-5738444 con código de Venezuela

  // --- Conexión con la lista de invitados ---
  // Pega aquí la URL de tu Apps Script (ver INSTRUCCIONES.md).
  // Mientras esté vacía, todo funciona en "modo prueba" dentro de este navegador.
  apiUrl: "https://script.google.com/macros/s/AKfycbyx7_3L9CA9UczP5G2cnHxxpg8TSvodqsfBGp7c3O7pGtel-m5gj38AJYMwZTJu6cpuzA/exec"
};
