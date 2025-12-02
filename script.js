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
// Robust skill-fill animation: store the intended target (percent) in data attribute
// then animate from 0% to that target. This prevents the width becoming blank / broken
// if UI interactions toggle or change layout after the initial animation.
function animateSkillFills() {
  const skillFills = document.querySelectorAll(".skill-fill");
  skillFills.forEach((fill) => {
    // try to read a stored target width first, then inline style, then fallback to inner text (e.g. "90%")
    let target = fill.dataset.targetWidth || fill.style.width || "";
    if (!target) {
      const m = fill.textContent.trim().match(/(\d+)%/);
      if (m) target = m[1] + "%";
    }

    // ensure we always have a percentage string as the target (fallback 0%)
    if (!target || !/%$/.test(target)) target = "0%";

    // persist target so future interactions can re-use it
    fill.dataset.targetWidth = target;

    // start animation from 0% then move to the target — use explicit percent strings
    fill.style.width = "0%";

    // Add a small stagger so the UI feels smoother and to allow layout to settle
    const delay = 140 + (Array.from(skillFills).indexOf(fill) % 6) * 70;
    setTimeout(() => {
      fill.style.width = fill.dataset.targetWidth;
    }, delay);
  });
}

window.addEventListener("load", animateSkillFills);
// Re-apply when window resizes or layout changes so percent widths remain correct
window.addEventListener("resize", () => {
  // re-apply the intended width in case the container size changed
  document.querySelectorAll(".skill-fill").forEach((f) => {
    if (f.dataset.targetWidth) f.style.width = f.dataset.targetWidth;
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
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// ===== Scroll offset handling for sticky header =====
function updateScrollOffset() {
  const headerEl = document.getElementById("header");
  const offset = headerEl ? headerEl.offsetHeight : 120;
  // add a tiny extra gap so content doesn't collide with header
  // add a small gap and add extra space for desktop so titles never hide
  const gap = 10;
  const desktopExtra = window.innerWidth >= 1000 ? 30 : 0;
  const final = offset + gap;
  document.documentElement.style.setProperty("--scroll-offset", final + "px");
  // also set an explicit extra-offset variable used by some scroll logic
  document.documentElement.style.setProperty(
    "--scroll-extra",
    desktopExtra + "px"
  );
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
    if (mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    }
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
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });
  const activeLink = document.querySelector(`.nav-link[href="#${current.id}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "true");
  }
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
      const expanded = card.classList.toggle("expanded");
      card.setAttribute("aria-expanded", expanded ? "true" : "false");
      card.setAttribute("aria-pressed", expanded ? "true" : "false");
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const expanded = card.classList.toggle("expanded");
        card.setAttribute("aria-expanded", expanded ? "true" : "false");
        card.setAttribute("aria-pressed", expanded ? "true" : "false");
      }
    });
  });
});
