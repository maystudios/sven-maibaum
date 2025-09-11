(() => {
  const byId = id => document.getElementById(id);
  const $grid = byId("gallery");
  const $lb = byId("lightbox");
  const $lbImg = byId("lbImg");
  const $lbCap = byId("lbCap");
  const $lbPrev = byId("lbPrev");
  const $lbNext = byId("lbNext");
  const $lbClose = byId("lbClose");

  const BASE = (window.GALLERY_BASE || "").replace(/\/?$/, "/");
  let idx = 0;

  // Grid rendern
  $grid.innerHTML = GALLERY_IMAGES.map((m, i) => {
    const src = BASE + m.file;
    const ratio = (m.ratio || "16/9").split("/").map(Number);
    const pad = (ratio[1] / ratio[0]) * 100; // aspect-ratio fallback
    return `
      <figure class="media-item" tabindex="0" data-index="${i}" style="aspect-ratio:${m.ratio};">
        <div style="position:relative;">
          <img class="media-thumb" src="${src}" alt="${m.alt || ""}" loading="lazy" />
        </div>
        <figcaption>${m.cap || ""}</figcaption>
      </figure>
    `;
  }).join("");

  // einfache Reveal-Animation
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible"));
  }, { threshold: 0.1 });
  $grid.querySelectorAll(".media-item").forEach(el => io.observe(el));

  // Lightbox öffnen
  function open(i) {
    idx = (i + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    const m = GALLERY_IMAGES[idx];
    $lbImg.src = BASE + m.file;
    $lbImg.alt = m.alt || "";
    $lbCap.textContent = m.cap || "";
    $lb.classList.remove("hidden");
    $lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    $lb.classList.add("hidden");
    $lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function next(n = 1) { open(idx + n); }

  $grid.addEventListener("click", e => {
    const fig = e.target.closest(".media-item");
    if (!fig) return;
    open(+fig.dataset.index);
  });
  $grid.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const fig = e.target.closest(".media-item");
      if (fig) { e.preventDefault(); open(+fig.dataset.index); }
    }
  });

  $lbPrev.addEventListener("click", () => next(-1));
  $lbNext.addEventListener("click", () => next(1));
  $lbClose.addEventListener("click", close);
  $lb.addEventListener("click", e => { if (e.target === $lb) close(); });
  window.addEventListener("keydown", e => {
    if ($lb.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next(1);
    if (e.key === "ArrowLeft") next(-1);
  });
})();
