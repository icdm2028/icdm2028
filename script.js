const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const primaryNavLinks = document.querySelectorAll(".site-nav .nav-link, .site-nav .nav-link-parent");
const submenuToggles = document.querySelectorAll(".submenu-toggle");

const currentFile = window.location.pathname.split("/").pop() || "index.html";

primaryNavLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) {
    return;
  }

  const normalizedHref = href.replace(/^\.\//, "").split("#")[0];
  if (normalizedHref === currentFile) {
    link.setAttribute("aria-current", "page");
  }
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeSubmenus = (exceptToggle) => {
  submenuToggles.forEach((toggle) => {
    if (toggle === exceptToggle) {
      return;
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.parentElement?.parentElement?.classList.remove("is-open");
  });
};

const closeMenu = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  closeSubmenus();
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

submenuToggles.forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    const parent = toggle.parentElement?.parentElement;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    closeSubmenus(toggle);

    toggle.setAttribute("aria-expanded", String(!isOpen));
    parent?.classList.toggle("is-open", !isOpen);
  });
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (!event.target.closest(".nav-item.has-menu")) {
    closeSubmenus();
  }
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMenu();
  }
});

updateHeaderState();

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -48px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-slider-dot");
const heroPrev = document.querySelector("[data-hero-prev]");
const heroNext = document.querySelector("[data-hero-next]");
const heroBanner = document.querySelector(".hero-banner");

if (heroSlides.length && heroDots.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeSlideIndex = 0;
  let heroAutoPlayId;

  const showHeroSlide = (nextIndex) => {
    activeSlideIndex = (nextIndex + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeSlideIndex);
    });

    heroDots.forEach((dot, index) => {
      const isActive = index === activeSlideIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  };

  const stopHeroAutoPlay = () => {
    if (heroAutoPlayId) {
      window.clearInterval(heroAutoPlayId);
      heroAutoPlayId = undefined;
    }
  };

  const startHeroAutoPlay = () => {
    stopHeroAutoPlay();

    if (reduceMotion.matches) {
      return;
    }

    heroAutoPlayId = window.setInterval(() => {
      showHeroSlide(activeSlideIndex + 1);
    }, 3800);
  };

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      startHeroAutoPlay();
    });
  });

  heroPrev?.addEventListener("click", () => {
    showHeroSlide(activeSlideIndex - 1);
    startHeroAutoPlay();
  });

  heroNext?.addEventListener("click", () => {
    showHeroSlide(activeSlideIndex + 1);
    startHeroAutoPlay();
  });

  heroBanner?.addEventListener("pointerenter", stopHeroAutoPlay);
  heroBanner?.addEventListener("pointerleave", startHeroAutoPlay);
  heroBanner?.addEventListener("focusin", stopHeroAutoPlay);
  heroBanner?.addEventListener("focusout", startHeroAutoPlay);
  heroBanner?.addEventListener("touchstart", stopHeroAutoPlay, { passive: true });
  heroBanner?.addEventListener("touchend", () => {
    window.setTimeout(startHeroAutoPlay, 1400);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroAutoPlay();
    } else {
      startHeroAutoPlay();
    }
  });

  showHeroSlide(0);
  startHeroAutoPlay();
}
