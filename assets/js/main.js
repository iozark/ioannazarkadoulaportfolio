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

  function initLightbox() {
    var lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) return;

    var img = lightbox.querySelector("[data-lightbox-img]");
    var caption = lightbox.querySelector("[data-lightbox-caption]");
    var closeBtn = lightbox.querySelector("[data-lightbox-close]");
    var lastFocus = null;

    function open(src, alt, cap) {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = alt || "";
      if (caption) caption.textContent = cap || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    function usableSrc(value) {
      if (!value) return "";
      if (value.indexOf("data:image/gif") === 0) return "";
      return value;
    }

    document.querySelectorAll("[data-lightbox-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nested = btn.querySelector("img.c-media__img, img");
        var src = usableSrc(
          btn.getAttribute("data-full") ||
            (nested && nested.getAttribute("src")) ||
            ""
        );
        if (!src || (nested && nested.getAttribute("data-media-empty") === "true")) {
          return;
        }
        open(
          src,
          btn.getAttribute("data-alt") || (nested && nested.alt) || "",
          btn.getAttribute("data-caption") || ""
        );
      });
    });

    closeBtn.addEventListener("click", close);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        close();
      }
    });
  }

  function initActiveNav() {
    var path = window.location.pathname.replace(/\/$/, "");
    document.querySelectorAll(".site-nav__link").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var normalized = href.replace(/^\.\//, "").replace(/^\.\.\//g, "");
      // Match by folder segment
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

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
    initLightbox();
  });
})();
