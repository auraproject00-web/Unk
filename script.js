// Ambil semua elemen dengan class "fade-in"
const fadeElements = document.querySelectorAll(".fade-in");

// ===== KODE TAMBAHAN: toggle info saat header diklik =====
const header = document.getElementById("header");
const info = document.getElementById("info");
const toggleIcon = document.getElementById("toggle-icon");

header.addEventListener("click", (e) => {
  // Prevent header toggle when interacting with nav or toggle button
  if (
    e.target.closest(".main-nav") ||
    e.target.closest("#nav-toggle") ||
    e.target.classList.contains("nav-link")
  )
    return;
  // toggle class hidden/visible
  if (info.classList.contains("visible")) {
    info.classList.remove("visible");
    toggleIcon.classList.remove("up");
    toggleIcon.classList.add("bounce");
  } else {
    info.classList.add("visible");
    toggleIcon.classList.add("up");
    toggleIcon.classList.remove("bounce");
  }
});

// Fungsi untuk cek posisi elemen saat scroll
function checkFadeIn() {
  fadeElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Kalau elemen masuk ke viewport (layar)
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible"); // tambahin class visible -> aktifkan animasi
    }
  });
}

// ===== Tambahan Animasi Skill Bar =====
window.addEventListener("load", () => {
  const skillFills = document.querySelectorAll(".skill-fill");
  skillFills.forEach((fill) => {
    const width = fill.style.width; // ambil nilai width (misalnya 90%)
    fill.style.width = "0"; // mulai dari 0
    setTimeout(() => {
      fill.style.width = width; // animasi ke nilai asli
    }, 200);
  });
});

// Jalankan saat scroll dan saat pertama kali load
window.addEventListener("scroll", checkFadeIn);
window.addEventListener("load", checkFadeIn);

// ===== NAV: smooth scroll and mobile toggle =====
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.querySelector(".main-nav");

// mobile nav toggle
if (navToggle) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mainNav.classList.toggle("open");
  });
}

// ===== Scroll offset handling for sticky header =====
function updateScrollOffset() {
  const headerEl = document.getElementById("header");
  const offset = headerEl ? headerEl.offsetHeight : 120;
  // add a tiny extra gap so content doesn't collide with header
  const gap = 10;
  const final = offset + gap;
  document.documentElement.style.setProperty("--scroll-offset", final + "px");
  return final;
}

// update on load and resize so mobile/desktop sizes are correct
window.addEventListener("load", updateScrollOffset);
window.addEventListener("resize", updateScrollOffset);

// smooth scroll + ensure info panel is visible
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    // recompute offset in case header size changed
    updateScrollOffset();

    // recompute offset in case header size changed
    updateScrollOffset();

    // helper for accurate scroll that accounts for header height
    const smoothScrollTo = (el) => {
      if (!el) return;
      const offset =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--scroll-offset"
          )
        ) || 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    // if info not shown, show first and wait until the info container finishes expanding
    if (!info.classList.contains("visible")) {
      let didRun = false;
      const onExpand = (ev) => {
        // wait for the max-height transition to finish (or opacity) — run once
        if (ev && ev.target !== info) return;
        if (didRun) return;
        didRun = true;
        info.removeEventListener("transitionend", onExpand);
        // recalculate header height after expansion then scroll (short delay to let layout settle)
        setTimeout(() => {
          updateScrollOffset();
          smoothScrollTo(targetEl);
        }, 60);
      };

      // Add visible and update icon, then wait for transitionend (fallback to timeout)
      info.classList.add("visible");
      toggleIcon.classList.add("up");
      toggleIcon.classList.remove("bounce");
      info.addEventListener("transitionend", onExpand);
      // fallback in case transitionend doesn't fire (older browsers) — 900ms
      setTimeout(() => onExpand(), 900);
    } else {
      smoothScrollTo(targetEl);
    }
    // close mobile nav if open
    if (mainNav.classList.contains("open")) mainNav.classList.remove("open");
  });
});

// highlight active nav link
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  let current = sections[0];
  // Determine dynamic threshold from header height so highlight matches visible section
  const offset =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--scroll-offset"
      )
    ) || 120;
  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom >= offset) current = sec;
  });
  navLinks.forEach((link) => link.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-link[href="#${current.id}"]`);
  if (activeLink) activeLink.classList.add("active");
}

window.addEventListener("scroll", () => {
  checkFadeIn();
  updateActiveNav();
});
window.addEventListener("load", updateActiveNav);

// ===== Interactivity: toggle skill card details =====
window.addEventListener("load", () => {
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card) => {
    card.setAttribute("tabindex", "0"); // make keyboard focusable
    card.addEventListener("click", () => {
      card.classList.toggle("expanded");
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("expanded");
      }
    });
  });
});
