(() => {
  const root = document.documentElement;
  const body = document.body;

  const announce = (message, tone = "success") => {
    const liveRegion = document.querySelector("[data-live-region]");
    if (!liveRegion) return;
    liveRegion.textContent = message;
    liveRegion.dataset.tone = tone;
    window.setTimeout(() => {
      liveRegion.textContent = "";
      liveRegion.dataset.tone = "";
    }, 4200);
  };

  const closeMenu = () => {
    const menu = document.querySelector("[data-menu]");
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };

  const menuToggle = document.querySelector("[data-menu-toggle]");
  menuToggle?.addEventListener("click", () => {
    const menu = document.querySelector("[data-menu]");
    const isOpen = menu?.classList.toggle("is-open") ?? false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  document.querySelectorAll("[data-menu] a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const menu = document.querySelector("[data-menu]");
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!menu || !toggle || !menu.classList.contains("is-open")) return;
    if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const savedTheme = window.localStorage.getItem("agendae-theme");
  if (savedTheme === "light") root.dataset.theme = "light";
  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const light = root.dataset.theme === "light";
    themeToggle.setAttribute("aria-pressed", String(light));
    themeToggle.setAttribute("aria-label", light ? "Ativar tema escuro" : "Ativar tema claro");
    themeToggle.querySelector("[data-theme-text]")?.replaceChildren(document.createTextNode(light ? "Escuro" : "Claro"));
  };
  updateThemeLabel();
  themeToggle?.addEventListener("click", () => {
    const light = root.dataset.theme !== "light";
    if (light) root.dataset.theme = "light";
    else delete root.dataset.theme;
    window.localStorage.setItem("agendae-theme", light ? "light" : "dark");
    updateThemeLabel();
  });

  document.querySelectorAll("[data-free-slot]").forEach((slot) => {
    slot.addEventListener("click", () => {
      const time = slot.dataset.freeSlot;
      const timeInput = document.querySelector("#time");
      const form = document.querySelector("#booking-form");
      if (timeInput) timeInput.value = time;
      document.querySelectorAll("[data-free-slot]").forEach((item) => item.classList.remove("is-selected"));
      slot.classList.add("is-selected");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => document.querySelector("#client")?.focus(), 450);
      }
      announce(`Horário das ${time} selecionado. Complete os dados da cliente.`);
    });
  });

  const bookingForm = document.querySelector("#booking-form");
  bookingForm?.addEventListener("invalid", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    field.setCustomValidity("");
    if (field.validity.valueMissing) field.setCustomValidity("Preencha este campo para continuar.");
    if (field.validity.typeMismatch) field.setCustomValidity("Confira o formato deste dado.");
  }, true);
  bookingForm?.addEventListener("input", (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
  });
  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const client = form.querySelector("#client")?.value || "cliente";
    const time = form.querySelector("#time")?.value || "o horário escolhido";
    const feedback = form.querySelector("[data-form-feedback]");
    if (feedback) {
      feedback.textContent = `Agendamento de ${client} criado para ${time}.`;
      feedback.hidden = false;
    }
    announce(`Agendamento de ${client} criado com sucesso.`);
    form.reset();
    document.querySelectorAll("[data-free-slot]").forEach((item) => item.classList.remove("is-selected"));
  });

  const appointmentRows = [...document.querySelectorAll("[data-appointment]")];
  const searchInput = document.querySelector("#appointment-search");
  const statusFilter = document.querySelector("#status-filter");
  const professionalFilter = document.querySelector("#professional-filter");
  const sortSelect = document.querySelector("#sort-appointments");
  const resultsCount = document.querySelector("[data-results-count]");

  const normalize = (value) => value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const renderAppointments = () => {
    const query = normalize(searchInput?.value || "");
    const status = statusFilter?.value || "all";
    const professional = professionalFilter?.value || "all";
    let visible = appointmentRows.filter((row) => {
      const haystack = normalize(row.textContent || "");
      return haystack.includes(query) && (status === "all" || row.dataset.status === status) && (professional === "all" || row.dataset.professional === professional);
    });
    const sort = sortSelect?.value || "time";
    visible.sort((a, b) => {
      if (sort === "client") return (a.dataset.client || "").localeCompare(b.dataset.client || "", "pt-BR");
      if (sort === "status") return (a.dataset.status || "").localeCompare(b.dataset.status || "", "pt-BR");
      return (a.dataset.time || "").localeCompare(b.dataset.time || "", "pt-BR");
    });
    const list = document.querySelector("[data-appointment-list]");
    visible.forEach((row) => list?.appendChild(row));
    appointmentRows.forEach((row) => { row.hidden = !visible.includes(row); });
    if (resultsCount) resultsCount.textContent = `${visible.length} ${visible.length === 1 ? "atendimento encontrado" : "atendimentos encontrados"}`;
    const emptyState = document.querySelector("[data-empty-appointments]");
    if (emptyState) emptyState.hidden = visible.length > 0;
  };
  [searchInput, statusFilter, professionalFilter, sortSelect].forEach((control) => control?.addEventListener("input", renderAppointments));
  [statusFilter, professionalFilter, sortSelect].forEach((control) => control?.addEventListener("change", renderAppointments));

  let modalTrigger = null;
  const closeRescheduleModal = () => {
    if (!modal) return;
    modal.hidden = true;
    modalTrigger?.focus();
    modalTrigger = null;
  };

  document.querySelectorAll("[data-appointment-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.appointmentAction;
      const row = button.closest("[data-appointment]");
      if (!row) return;
      const statusBadge = row.querySelector("[data-status-badge]");
      if (action === "confirm") {
        row.dataset.status = "confirmed";
        statusBadge.textContent = "Confirmado";
        statusBadge.className = "status-badge status-badge--confirmed";
        announce(`Atendimento de ${row.dataset.client} confirmado.`);
      }
      if (action === "cancel") {
        row.dataset.status = "cancelled";
        statusBadge.textContent = "Cancelado";
        statusBadge.className = "status-badge status-badge--cancelled";
        announce(`Atendimento de ${row.dataset.client} cancelado. A lista de espera foi sinalizada.`, "info");
      }
      if (action === "reschedule") {
        modalTrigger = button;
        document.querySelector("#reschedule-client").textContent = row.dataset.client || "cliente";
        document.querySelector("#reschedule-target").value = row.dataset.time || "10:00";
        document.querySelector("#reschedule-modal").hidden = false;
        document.querySelector("#reschedule-modal").dataset.activeId = row.dataset.id;
        document.querySelector("#reschedule-target")?.focus();
      }
      renderAppointments();
    });
  });

  const modal = document.querySelector("#reschedule-modal");
  document.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeRescheduleModal));
  modal?.addEventListener("click", (event) => { if (event.target === modal) closeRescheduleModal(); });
  document.querySelector("#reschedule-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = document.querySelector("#reschedule-target");
    const row = appointmentRows.find((item) => item.dataset.id === modal?.dataset.activeId);
    if (row && target?.value) {
      row.dataset.time = target.value;
      row.querySelector("[data-time-label]").textContent = target.value;
      row.dataset.status = "confirmed";
      row.querySelector("[data-status-badge]").textContent = "Remarcado";
      row.querySelector("[data-status-badge]").className = "status-badge status-badge--confirmed";
      announce(`Atendimento de ${row.dataset.client} remarcado para ${target.value}.`);
    }
    closeRescheduleModal();
    renderAppointments();
  });
  renderAppointments();

  const waitlistForm = document.querySelector("#waitlist-form");
  waitlistForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!waitlistForm.checkValidity()) {
      waitlistForm.reportValidity();
      return;
    }
    const name = waitlistForm.querySelector("#wait-client")?.value || "Nova cliente";
    const service = waitlistForm.querySelector("#wait-service")?.value || "serviço";
    const preference = waitlistForm.querySelector("#wait-preference")?.value || "qualquer horário";
    const list = document.querySelector("[data-waitlist]");
    const item = document.createElement("article");
    item.className = "wait-item wait-item--new";
    const avatar = document.createElement("div");
    avatar.className = "wait-item__avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = name.charAt(0).toUpperCase();
    const content = document.createElement("div");
    content.className = "wait-item__content";
    const title = document.createElement("h3");
    title.textContent = name;
    const details = document.createElement("p");
    details.textContent = `${service} · ${preference}`;
    const status = document.createElement("span");
    status.className = "wait-status";
    status.textContent = "Recém-adicionada";
    content.append(title, details, status);
    const notifyButton = document.createElement("button");
    notifyButton.className = "button button--quiet";
    notifyButton.type = "button";
    notifyButton.dataset.notifyClient = name;
    notifyButton.textContent = "Avisar";
    item.append(avatar, content, notifyButton);
    list?.prepend(item);
    notifyButton.addEventListener("click", () => announce(`Aviso enviado para ${name}.`));
    announce(`${name} entrou na lista de espera.`);
    waitlistForm.reset();
  });

  document.querySelectorAll("[data-notify-client]").forEach((button) => {
    button.addEventListener("click", () => announce(`Aviso enviado para ${button.dataset.notifyClient}.`));
  });

  document.querySelectorAll("[data-day-filter] button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-day-filter] button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const label = button.textContent.trim();
      const heading = document.querySelector("[data-agenda-day]");
      if (heading) heading.textContent = label === "Hoje" ? "Quarta, 20 de novembro" : `${label}, 21 de novembro`;
      announce(`Agenda atualizada para ${label.toLowerCase()}.`);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeRescheduleModal();
    }
  });
})();
