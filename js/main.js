// ---- Theme toggle (persisted) ----------------------------
(function () {
  var root = document.documentElement;
  var KEY = "pw-theme";
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  function label() {
    var isDark = root.getAttribute("data-theme") !== "light";
    document.querySelectorAll("#themeBtn").forEach(function (b) {
      b.textContent = isDark ? "☾ theme" : "☀ theme";
    });
  }
  label();

  document.querySelectorAll("#themeBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label();
    });
  });
})();

// ---- Current year ----------------------------------------
document.querySelectorAll("#year").forEach(function (el) {
  // Date is intentionally read at runtime in the browser, not build time.
  el.textContent = new Date().getFullYear();
});

// ---- Scroll reveal ---------------------------------------
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
