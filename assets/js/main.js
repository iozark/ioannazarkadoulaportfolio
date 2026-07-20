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
    var dataNode = root.querySelector("[data-doc-carousel-slides]");
    var image = root.querySelector("[data-doc-carousel-image]");
    var count = root.querySelector("[data-doc-carousel-count]");
    var title = root.querySelector("[data-doc-carousel-title]");
    var copy = root.querySelector("[data-doc-carousel-copy]");
    var prevBtn = root.querySelector("[data-doc-carousel-prev]");
    var nextBtn = root.querySelector("[data-doc-carousel-next]");
    if (!dataNode || !image) return;

    var slides;
    try {
      slides = JSON.parse(dataNode.textContent);
    } catch (err) {
      return;
    }
    if (!slides || !slides.length) return;

    var index = 0;
    var total = slides.length;
    var animating = false;
    var touchStartX = null;
    var touchStartY = null;

    function render(nextIndex, animate) {
      if (nextIndex < 0 || nextIndex >= total) return;
      if (nextIndex === index && animate) return;
      if (animating) return;

      var apply = function () {
        index = nextIndex;
        var slide = slides[index];
        image.src = slide.src;
        image.alt = slide.alt || "";
        if (count) count.textContent = pad2(index + 1) + " / " + pad2(total);
        if (title) title.textContent = slide.title || "";
        if (copy) copy.textContent = slide.copy || "";
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === total - 1;
        root.setAttribute(
          "aria-label",
          "Production payment walkthrough, step " +
            pad2(index + 1) +
            " of " +
            pad2(total) +
            ": " +
            (slide.title || "")
        );
      };

      if (!animate) {
        apply();
        return;
      }

      animating = true;
      image.classList.add("is-fading");
      window.setTimeout(function () {
        apply();
        image.classList.remove("is-fading");
        animating = false;
      }, 250);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        render(index - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        render(index + 1, true);
      });
    }

    root.addEventListener("keydown", function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        render(index - 1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        render(index + 1, true);
      } else if (e.key === "Home") {
        e.preventDefault();
        render(0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        render(total - 1, true);
      }
    });

    root.addEventListener(
      "touchstart",
      function (e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null || !e.changedTouches || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        touchStartX = null;
        touchStartY = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) render(index + 1, true);
        else render(index - 1, true);
      },
      { passive: true }
    );

    render(0, false);
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
