// ---- Theme toggle (persisted; defaults to system) --------
(function () {
  var root = document.documentElement;
  var KEY = "pw-theme";
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  function isDark() {
    var set = root.getAttribute("data-theme");
    if (set) return set === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function label() {
    // button names the theme you'll switch to
    document.querySelectorAll("#themeBtn").forEach(function (b) {
      b.textContent = isDark() ? "Day" : "Night";
    });
  }
  label();

  document.querySelectorAll("#themeBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
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
