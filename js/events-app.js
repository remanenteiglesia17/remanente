/* ==================================================================
 *  Eventos dinámicos — Remanente del Dios Vivo y Eterno
 *  Lee carpetas de Google Drive (fotos) + jsonbin.io (textos)
 *  y arma la sección de Eventos automáticamente.
 * ================================================================== */

(function () {
  "use strict";

  const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
  const JSONBIN_API = "https://api.jsonbin.io/v3/b";

  const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];

  function formatFecha(fechaStr) {
    if (!fechaStr) return null;
    const d = new Date(fechaStr + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  }

  function coverUrl(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  function fullImgUrl(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  }

  async function driveList(query, fields) {
    const url = `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(
      "files(" + fields + ")"
    )}&pageSize=200&key=${CONFIG.GOOGLE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Drive API error (${res.status}): ${body}`);
    }
    const data = await res.json();
    return data.files || [];
  }

  async function fetchFolders() {
    const q = `'${CONFIG.DRIVE_PARENT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    return driveList(q, "id,name");
  }

  async function fetchFolderImages(folderId) {
    const q = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;
    const files = await driveList(q, "id,name");
    // orden estable por nombre
    return files.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function fetchEventTexts() {
    if (!CONFIG.JSONBIN_BIN_ID || CONFIG.JSONBIN_BIN_ID.startsWith("PEGA_AQUI")) {
      return [];
    }
    const res = await fetch(`${JSONBIN_API}/${CONFIG.JSONBIN_BIN_ID}/latest`);
    if (!res.ok) {
      throw new Error(`jsonbin error (${res.status})`);
    }
    const data = await res.json();
    return (data.record && data.record.events) || [];
  }

  function matchText(folderName, texts) {
    const norm = (s) => (s || "").trim().toLowerCase();
    return texts.find((t) => norm(t.folder) === norm(folderName));
  }

  function isConfigured() {
    return (
      CONFIG.GOOGLE_API_KEY &&
      !CONFIG.GOOGLE_API_KEY.startsWith("PEGA_AQUI") &&
      CONFIG.DRIVE_PARENT_FOLDER_ID &&
      !CONFIG.DRIVE_PARENT_FOLDER_ID.startsWith("PEGA_AQUI")
    );
  }

  async function buildEvents() {
    const [folders, texts] = await Promise.all([fetchFolders(), fetchEventTexts()]);

    const events = await Promise.all(
      folders.map(async (folder) => {
        const text = matchText(folder.name, texts) || {};
        let cover = null;
        try {
          const images = await fetchFolderImages(folder.id);
          cover = images[0] || null;
          folder._imageCount = images.length;
        } catch (e) {
          folder._imageCount = 0;
        }

        const dateObj = text.date ? new Date(text.date + "T00:00:00") : null;

        return {
          folderId: folder.id,
          folderName: folder.name,
          title: text.title || folder.name,
          description: text.description || "",
          dateRaw: text.date || null,
          dateObj: dateObj && !isNaN(dateObj.getTime()) ? dateObj : null,
          dateLabel: formatFecha(text.date),
          time: text.time || "",
          location: text.location || "",
          cost: text.cost || "",
          coverId: cover ? cover.id : null,
          imageCount: folder._imageCount || 0,
        };
      })
    );

    return events;
  }

  function splitEvents(events) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter((e) => e.dateObj && e.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj);

    const next = upcoming.shift() || null;

    const rest = events
      .filter((e) => e !== next)
      .sort((a, b) => {
        if (a.dateObj && b.dateObj) return b.dateObj - a.dateObj;
        if (a.dateObj) return -1;
        if (b.dateObj) return 1;
        return a.title.localeCompare(b.title);
      });

    return { next, rest };
  }

  /* ---------------- render ---------------- */

  function cardHTML(ev) {
    const img = ev.coverId
      ? `<img src="${coverUrl(ev.coverId)}" alt="${ev.title}" loading="lazy">`
      : `<div class="event-card__no-image">Remanente</div>`;

    return `
      <div class="column event-card" data-folder-id="${ev.folderId}">
        <button type="button" class="event-card__link" aria-label="Ver fotos de ${ev.title}">
          <div class="event-card__media">${img}</div>
          <div class="event-card__body">
            <h3 class="event-card__title">${ev.title}</h3>
            ${ev.dateLabel ? `<p class="event-card__date">${ev.dateLabel}</p>` : ""}
            ${ev.description ? `<p class="event-card__desc">${ev.description}</p>` : ""}
            <span class="event-card__cta">Ver fotos ${ev.imageCount ? `(${ev.imageCount})` : ""}</span>
          </div>
        </button>
      </div>`;
  }

  function nextEventHTML(ev) {
    if (!ev) return "";
    const img = ev.coverId ? coverUrl(ev.coverId) : "images/hero-bg-3000.jpg";
    return `
      <section class="s-next-event">
        <div class="next-event__media" style="background-image:url('${img}')"></div>
        <div class="row next-event__content">
          <div class="column">
            <h3 class="subhead">Próximo Evento</h3>
            <h2 class="display-1">${ev.title}</h2>
            ${ev.description ? `<p>${ev.description}</p>` : ""}
            <ul class="events-list__meta">
              ${ev.dateLabel ? `<li class="events-list__meta-date">${ev.dateLabel}</li>` : ""}
              ${ev.time ? `<li class="events-list__meta-time">${ev.time}</li>` : ""}
              ${ev.location ? `<li class="events-list__meta-location">${ev.location}</li>` : ""}
            </ul>
            ${ev.cost ? `<p><strong>Costo:</strong> ${ev.cost}</p>` : ""}
          </div>
        </div>
      </section>`;
  }

  function renderError(msg) {
    const el = document.getElementById("events-dynamic-root");
    if (!el) return;
    el.innerHTML = `<div class="row"><div class="column"><p class="event-error">${msg}</p></div></div>`;
  }

  async function openGallery(ev) {
    const modal = document.getElementById("event-gallery-modal");
    const grid = modal.querySelector(".gallery-modal__grid");
    const title = modal.querySelector(".gallery-modal__title");

    title.textContent = ev.title;
    grid.innerHTML = `<p class="gallery-modal__loading">Cargando fotos...</p>`;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    try {
      const images = await fetchFolderImages(ev.folderId);
      if (!images.length) {
        grid.innerHTML = `<p class="gallery-modal__loading">Aún no hay fotos en este álbum.</p>`;
        return;
      }
      grid.innerHTML = images
        .map(
          (img) => `
        <a href="${fullImgUrl(img.id)}" target="_blank" rel="noopener" class="gallery-modal__item">
          <img src="${coverUrl(img.id)}" alt="${img.name}" loading="lazy">
        </a>`
        )
        .join("");
    } catch (e) {
      grid.innerHTML = `<p class="gallery-modal__loading">No se pudieron cargar las fotos. Intenta de nuevo más tarde.</p>`;
    }
  }

  function closeGallery() {
    const modal = document.getElementById("event-gallery-modal");
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  function setupModal(eventsByFolder) {
    const modal = document.getElementById("event-gallery-modal");
    if (!modal) return;

    modal.querySelector(".gallery-modal__close").addEventListener("click", closeGallery);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGallery();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeGallery();
    });

    document.getElementById("events-dynamic-root").addEventListener("click", (e) => {
      const card = e.target.closest(".event-card");
      if (!card) return;
      const ev = eventsByFolder[card.dataset.folderId];
      if (ev) openGallery(ev);
    });

    document.getElementById("next-event-root")?.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-next-event-gallery]");
      if (!trigger) return;
      const ev = eventsByFolder[trigger.dataset.nextEventGallery];
      if (ev) openGallery(ev);
    });
  }

  async function init() {
    const root = document.getElementById("events-dynamic-root");
    if (!root) return;

    if (!isConfigured()) {
      renderError(
        "La sección de eventos aún no está configurada. Completa js/config.js siguiendo GUIA_CONFIGURACION.md."
      );
      return;
    }

    root.innerHTML = `<div class="row"><div class="column"><p class="event-loading">Cargando eventos...</p></div></div>`;

    try {
      const events = await buildEvents();
      const { next, rest } = splitEvents(events);

      const eventsByFolder = {};
      events.forEach((e) => (eventsByFolder[e.folderId] = e));

      const nextRoot = document.getElementById("next-event-root");
      if (nextRoot) {
        nextRoot.innerHTML = next
          ? nextEventHTML(next).replace(
              "</ul>",
              `</ul>${
                next.imageCount
                  ? `<button type="button" class="btn btn--stroke" data-next-event-gallery="${next.folderId}">Ver fotos</button>`
                  : ""
              }`
            )
          : "";
      }

      if (!rest.length) {
        root.innerHTML = `<div class="row"><div class="column"><p>Aún no hay eventos pasados para mostrar.</p></div></div>`;
      } else {
        root.innerHTML = `
          <div class="row events-header">
            <div class="column"><h2 class="subhead">Eventos que Ya Vivimos</h2></div>
          </div>
          <div class="row block-large-1-3 block-tab-1-2 block-mob-full events-cards">
            ${rest.map(cardHTML).join("")}
          </div>`;
      }

      setupModal(eventsByFolder);
    } catch (err) {
      console.error(err);
      renderError(
        "No se pudieron cargar los eventos en este momento. Revisa la consola para más detalle (clave de API, carpetas compartidas, o bin de jsonbin)."
      );
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
