function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  if (!display || !copyBtn || !toast) return;

  const address = display.textContent.trim();

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.classList.add("copied");
      copyBtn.querySelector("span").textContent = "Copied!";
      toast.textContent = "Contract address copied!";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector("span").textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const header = document.querySelector(".site-header");
  if (!toggle || !links || !header) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((el) => io.observe(el));
}

function initMemeLightbox() {
  const lightbox = document.getElementById("meme-lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".lightbox-img");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    img.src = "";
    img.alt = "";
    caption.textContent = "";
  };

  document.querySelectorAll(".meme-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.full;
      const text = btn.dataset.caption || "";
      const thumb = btn.querySelector("img");
      img.src = src;
      img.alt = thumb ? thumb.alt : text;
      caption.textContent = text;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initLeaves() {
  const field = document.getElementById("leaf-field");
  if (!field || prefersReducedMotion()) return;

  const count = window.innerWidth < 768 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.animationDuration = `${10 + Math.random() * 14}s`;
    leaf.style.animationDelay = `${Math.random() * 12}s`;
    leaf.style.width = `${10 + Math.random() * 10}px`;
    leaf.style.height = leaf.style.width;
    leaf.style.opacity = String(0.15 + Math.random() * 0.3);
    field.appendChild(leaf);
  }
}

function initSparkles() {
  const field = document.getElementById("sparkle-field");
  if (!field || prefersReducedMotion()) return;

  const count = window.innerWidth < 768 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDuration = `${2.5 + Math.random() * 3.5}s`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    const size = 2 + Math.random() * 4;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    field.appendChild(sparkle);
  }
}

function initAndyCursor() {
  const el = document.getElementById("andy-cursor");
  if (!el || prefersReducedMotion()) return;
  if (window.matchMedia("(max-width: 768px)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let visible = false;
  let raf = 0;

  const ease = 0.14;

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      currentX = mouseX;
      currentY = mouseY;
      el.classList.add("is-active");
    }
  };

  const onLeave = () => {
    visible = false;
    el.classList.remove("is-active");
  };

  const tick = () => {
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    const rot = Math.max(-14, Math.min(14, dx * 0.08));
    const tilt = Math.max(-8, Math.min(8, dy * 0.04));

    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${rot}deg) skewY(${tilt * 0.15}deg)`;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  raf = requestAnimationFrame(tick);

  window.addEventListener(
    "beforeunload",
    () => {
      cancelAnimationFrame(raf);
    },
    { once: true }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initNav();
  initReveals();
  initMemeLightbox();
  initLeaves();
  initSparkles();
  initAndyCursor();
});
