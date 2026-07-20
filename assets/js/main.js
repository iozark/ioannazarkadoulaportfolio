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

  function initHScroll(root) {
    if (!root) return;

    var isDragging = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    root.addEventListener("keydown", function (e) {
      var step = Math.max(160, Math.floor(root.clientWidth * 0.7));
      if (e.key === "ArrowRight") {
        e.preventDefault();
        root.scrollBy({ left: step, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        root.scrollBy({ left: -step, behavior: "smooth" });
      } else if (e.key === "Home") {
        e.preventDefault();
        root.scrollTo({ left: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        root.scrollTo({ left: root.scrollWidth, behavior: "smooth" });
      }
    });

    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;
      isDragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = root.scrollLeft;
      root.classList.add("is-dragging");
      root.setPointerCapture(e.pointerId);
    });

    root.addEventListener("pointermove", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      root.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove("is-dragging");
      if (root.hasPointerCapture(e.pointerId)) {
        root.releasePointerCapture(e.pointerId);
      }
    }

    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);

    root.addEventListener("click", function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);
  }

  function initHScrolls() {
    document.querySelectorAll("[data-hscroll]").forEach(initHScroll);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
    initHScrolls();
  });
})();
