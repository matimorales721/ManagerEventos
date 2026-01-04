// Main JavaScript for Manager de Eventos

document.addEventListener("DOMContentLoaded", function () {
  // Búsqueda de eventos
  const searchInput = document.getElementById("searchEventos");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const eventosContainer = document.getElementById("eventosContainer");

      if (!eventosContainer) return;

      const eventCols = eventosContainer.querySelectorAll("[data-evento-nombre]");

      eventCols.forEach((col) => {
        const nombre = col.getAttribute("data-evento-nombre").toLowerCase();

        if (nombre.includes(searchTerm)) {
          col.style.display = "";
        } else {
          col.style.display = "none";
        }
      });
    });

    // Permitir buscar con Enter (prevenir form submit)
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  }

  // Filtros de entradas
  const filterButtons = document.querySelectorAll('[name="filterEntradas"]');
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("change", function (e) {
        const filter = e.target.value;
        const entradas = document.querySelectorAll("[data-estado]");

        entradas.forEach((entrada) => {
          if (filter === "todas" || entrada.dataset.estado === filter) {
            entrada.style.display = "";
          } else {
            entrada.style.display = "none";
          }
        });
      });
    });
  }

  // Confirmación antes de pagar
  const btnsPagar = document.querySelectorAll(".btn-confirmar-pago");
  btnsPagar.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (!confirm("¿Confirmar pago de esta entrada?")) {
        e.preventDefault();
      }
    });
  });

  // Confirmación antes de validar entrada
  const btnsValidar = document.querySelectorAll(".btn-validar-entrada");
  btnsValidar.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (!confirm("¿Confirmar validación de esta entrada?")) {
        e.preventDefault();
      }
    });
  });

  // Auto-ocultar alerts después de 10 segundos
  const alerts = document.querySelectorAll(".alert:not(.alert-permanent)");
  alerts.forEach((alert) => {
    setTimeout(() => {
      // Verificar que el alert todavía está en el DOM
      if (alert && alert.parentNode && document.contains(alert)) {
        try {
          const bsAlert = new bootstrap.Alert(alert);
          bsAlert.close();
        } catch (error) {
          // Silenciar errores si el alert ya fue removido
          console.debug("Alert already removed or not available");
        }
      }
    }, 10000);
  });
});
