(function () {
  "use strict";

  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var toggle = document.querySelector("[data-nav-toggle]");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function initActiveNav() {
    var path = window.location.pathname.replace(/\/$/, "");
    document.querySelectorAll(".site-nav__link").forEach(function (link) {
      var key = null;
      if (link.hasAttribute("data-nav-work")) key = "/work";
      if (link.hasAttribute("data-nav-about")) key = "/about";
      if (link.hasAttribute("data-nav-ds")) key = "/design-system";
      if (link.hasAttribute("data-nav-contact")) key = "/contact";
      if (key && path.indexOf(key) !== -1) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initEmblaCarousel(root) {
    if (typeof window.EmblaCarousel !== "function") return;

    var viewport = root.querySelector("[data-embla-viewport]");
    var prevBtn = root.querySelector("[data-embla-prev]");
    var nextBtn = root.querySelector("[data-embla-next]");
    if (!viewport) return;

    var emblaApi = window.EmblaCarousel(viewport, {
      loop: false,
      align: "start",
      containScroll: "trimSnaps",
      watchDrag: true
    });

    function syncButtons() {
      if (prevBtn) prevBtn.disabled = !emblaApi.canScrollPrev();
      if (nextBtn) nextBtn.disabled = !emblaApi.canScrollNext();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        emblaApi.scrollPrev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        emblaApi.scrollNext();
      });
    }

    root.addEventListener("keydown", function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        emblaApi.scrollTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
      }
    });

    if (!root.hasAttribute("tabindex")) {
      root.setAttribute("tabindex", "0");
    }

    emblaApi.on("select", syncButtons);
    emblaApi.on("reInit", syncButtons);
    syncButtons();
  }

  function initEmblaCarousels() {
    document.querySelectorAll("[data-embla]").forEach(initEmblaCarousel);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
    initEmblaCarousels();
  });
})();
