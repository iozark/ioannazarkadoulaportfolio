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

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function initDocCarousel(root) {
    var track = root.querySelector("[data-doc-carousel-track]");
    var viewport = root.querySelector("[data-doc-carousel-viewport]");
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-doc-carousel-slide]"));
    var title = root.querySelector("[data-doc-carousel-title]");
    var copy = root.querySelector("[data-doc-carousel-copy]");
    var prevBtn = root.querySelector("[data-doc-carousel-prev]");
    var nextBtn = root.querySelector("[data-doc-carousel-next]");
    if (!track || !slides.length) return;

    var index = 0;
    var total = slides.length;
    var touchStartX = null;
    var touchStartY = null;

    function goTo(nextIndex) {
      if (nextIndex < 0 || nextIndex >= total || nextIndex === index) return;
      index = nextIndex;

      track.style.transform = "translateX(-" + index * 100 + "%)";

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      var active = slides[index];
      if (title) title.textContent = active.getAttribute("data-title") || "";
      if (copy) copy.textContent = active.getAttribute("data-copy") || "";
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === total - 1;

      root.setAttribute(
        "aria-label",
        "Production payment walkthrough, step " +
          pad2(index + 1) +
          " of " +
          pad2(total) +
          ": " +
          (active.getAttribute("data-title") || "")
      );
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    root.addEventListener("keydown", function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    });

    var swipeTarget = viewport || root;
    swipeTarget.addEventListener(
      "touchstart",
      function (e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );

    swipeTarget.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null || !e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        touchStartX = null;
        touchStartY = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      },
      { passive: true }
    );

    slides.forEach(function (slide, i) {
      slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
    });
    track.style.transform = "translateX(0%)";
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = total <= 1;
  }

  function initDocCarousels() {
    document.querySelectorAll("[data-doc-carousel]").forEach(initDocCarousel);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
    initDocCarousels();
  });
})();
