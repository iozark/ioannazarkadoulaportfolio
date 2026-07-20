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

  function initWalkthrough(root) {
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-walk-panel]"));
    var prevBtn = root.querySelector("[data-walk-prev]");
    var nextBtn = root.querySelector("[data-walk-next]");
    var status = root.querySelector("[data-walk-status]");
    var stepLabel = root.querySelector("[data-walk-step]");
    var stage = root.querySelector("[data-walk-stage]");
    var viewport = root.querySelector("[data-walk-viewport]");
    if (!panels.length || !stage) return;

    var index = -1;
    var total = panels.length;
    var touchStartX = null;
    var touchStartY = null;

    function goTo(nextIndex) {
      if (nextIndex < 0 || nextIndex >= total || nextIndex === index) return;
      index = nextIndex;

      panels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", active ? "false" : "true");
      });

      if (status) status.textContent = pad2(index + 1) + " / " + pad2(total);
      if (stepLabel) {
        stepLabel.textContent = panels[index].getAttribute("data-walk-label") || "";
      }
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === total - 1;

      if (stage) {
        stage.setAttribute(
          "aria-label",
          "Production payment walkthrough, step " +
            pad2(index + 1) +
            " of " +
            pad2(total) +
            ": " +
            (panels[index].getAttribute("data-walk-label") || "")
        );
      }
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

    function onKey(e) {
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
    }

    stage.addEventListener("keydown", onKey);
    root.addEventListener("keydown", function (e) {
      if (e.target === stage) return;
      onKey(e);
    });

    var swipeTarget = viewport || stage;
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

    goTo(0);
  }

  function initWalkthroughs() {
    document.querySelectorAll("[data-walkthrough]").forEach(initWalkthrough);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initActiveNav();
    initWalkthroughs();
  });
})();
