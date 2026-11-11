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

// ---- Homepage view counter -------------------------------
// Backend: counter-worker/ in this repo (Cloudflare Worker). Stores only a number.
(function () {
  var COUNTER_URL = "https://site-counter.pwsqrd.workers.dev/homepage";
  var box = document.getElementById("viewCounter");
  if (!box || !window.fetch) return;

  fetch(COUNTER_URL, { method: "POST", credentials: "omit", cache: "no-store" })
    .then(function (r) { if (!r.ok) throw r; return r.json(); })
    .then(function (d) {
      var n = String(d.count);
      document.getElementById("viewCount").textContent = n.length < 6 ? ("000000" + n).slice(-6) : n;
      document.getElementById("viewCount").setAttribute("aria-label", d.count + " homepage views");
      if (d.since) {
        document.getElementById("viewSince").textContent = new Date(d.since).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
        });
      }
      box.hidden = false;
    })
    .catch(function () { /* counter offline: leave it hidden */ });
})();

// ---- Current year ----------------------------------------
document.querySelectorAll("#year").forEach(function (el) {
  // Date is intentionally read at runtime in the browser, not build time.
  el.textContent = new Date().getFullYear();
});
