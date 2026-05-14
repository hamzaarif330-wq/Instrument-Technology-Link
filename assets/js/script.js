'use strict';

// ── Load header/footer first, then init everything ──────────────────────────

async function loadComponent(selector, filePath) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn("Placeholder not found:", selector);
    return;
  }
  console.log("Fetching:", filePath);
  try {
    const res = await fetch(filePath);
    if (!res.ok) {
      console.error("File not found:", filePath, "Status:", res.status);
      return;
    }
    const html = await res.text();
    el.outerHTML = html;
    console.log("Loaded OK:", filePath);
  } catch (e) {
    console.error("Fetch failed:", filePath, e.message);
  }
}

async function initPage() {
  // 1. Load header & footer first — await both before doing anything else
  await loadComponent("#include-header", "/assets/main/header.html");
  await loadComponent("#include-footer", "/assets/main/footer.html");

  // 2. NOW init navbar — elements exist in DOM at this point
  initNavbar();
  initScroll();
  initReveal();
}

function initNavbar() {
  const overlay    = document.querySelector("[data-overlay]");
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbar     = document.querySelector("[data-navbar]");
  const navCloseBtn= document.querySelector("[data-nav-close-btn]");

  if (!overlay || !navOpenBtn || !navbar || !navCloseBtn) {
    console.warn("Navbar elements not found — check header.html has data- attributes");
    return;
  }

  [overlay, navOpenBtn, navCloseBtn].forEach(el => {
    el.addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  });
}

function initScroll() {
  const header   = document.querySelector("[data-header]");
  const goTopBtn = document.querySelector("[data-go-top]");

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 80) {
      header?.classList.add("active");
      goTopBtn?.classList.add("active");
    } else {
      header?.classList.remove("active");
      goTopBtn?.classList.remove("active");
    }
  });
}

function initReveal() {
  const reveals  = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll(".story-section");

  window.addEventListener("scroll", () => {
    const trigger = window.innerHeight * 0.8;

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add("active");
    });

    sections.forEach(section => {
      const bg   = section.querySelector(".bg");
      const rect = section.getBoundingClientRect();
      if (bg && rect.top < window.innerHeight && rect.bottom > 0) {
        bg.style.transform = `translateY(${rect.top * 0.2}px) scale(1.2)`;
      }
    });
  });
}

// ── Start everything ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", initPage);


// ── Security ─────────────────────────────────────────────────────────────────

// Disable right-click
document.addEventListener("contextmenu", e => e.preventDefault());

// Disable F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I/J/C
document.addEventListener("keydown", function(e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key)) ||
    (e.ctrlKey && ["U","S"].includes(e.key))
  ) {
    e.preventDefault();
  }
});

// Disable long-press save on images
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault());
  img.addEventListener("dragstart",   e => e.preventDefault());
});






