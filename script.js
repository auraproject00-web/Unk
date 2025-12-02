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

    // if info not shown, show first
    if (!info.classList.contains("visible")) {
      info.classList.add("visible");
      toggleIcon.classList.add("up");
      toggleIcon.classList.remove("bounce");
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 260);
    } else {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
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
