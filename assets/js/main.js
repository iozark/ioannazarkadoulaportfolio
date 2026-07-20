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

  function initGlider(root) {
    if (typeof window.Glider !== "function") return;

    var contain = root.closest(".glider-contain") || root.parentElement;
    var prevBtn = contain ? contain.querySelector(".glider-prev") : null;
    var nextBtn = contain ? contain.querySelector(".glider-next") : null;

    new window.Glider(root, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      dragVelocity: 3.3,
      scrollLock: true,
      scrollLockDelay: 150,
      resizeLock: true,
      rewind: false,
      duration: 0.5,
      arrows: {
        prev: prevBtn,
        next: nextBtn
      }
    });
  }

  function initGliders() {
    document.querySelectorAll("[data-glider]").forEach(initGlider);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
  });

  // Glider docs recommend initializing on window load.
  window.addEventListener("load", function () {
    initGliders();
  });
})();
