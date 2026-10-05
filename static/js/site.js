(function () {
  "use strict";

  /* ---- Homepage: Load more answers ---- */
  var loadBtn = document.getElementById("load-more");
  if (loadBtn) {
    var PAGE = 12;
    var hiddenCards = function () {
      return Array.prototype.filter.call(
        document.querySelectorAll("#home-cards .card.is-hidden"),
        function () { return true; }
      );
    };
    var updateBtn = function () {
      var left = hiddenCards().length;
      if (left === 0) {
        loadBtn.style.display = "none";
      } else {
        loadBtn.textContent = "Load more answers (" + left + " more)";
      }
    };
    loadBtn.addEventListener("click", function () {
      hiddenCards().slice(0, PAGE).forEach(function (c) {
        c.classList.remove("is-hidden");
      });
      updateBtn();
    });
    updateBtn();
  }

  /* ---- Hero: live site search ---- */
  var input = document.getElementById("site-search");
  if (input) {
    var box = document.getElementById("search-results");
    var index = null;
    var esc = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };
    var loadIndex = function () {
      return fetch("/search.json")
        .then(function (r) { return r.json(); })
        .then(function (d) { index = d; });
    };
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.hidden = true; box.innerHTML = ""; return; }
      (index ? Promise.resolve() : loadIndex()).then(function () {
        var hits = index.filter(function (p) {
          return (p.title + " " + p.description).toLowerCase().indexOf(q) !== -1;
        }).slice(0, 8);
        if (!hits.length) {
          box.innerHTML = '<div class="search-nohit">No answers found — try “faucet”, “mold”, or “furnace”.</div>';
        } else {
          box.innerHTML = hits.map(function (p) {
            return '<a href="' + p.url + '"><strong>' + esc(p.title) + '</strong><span>' + esc(p.description) + '</span></a>';
          }).join("");
        }
        box.hidden = false;
      }).catch(function () {
        box.innerHTML = '<div class="search-nohit">Search is unavailable right now.</div>';
        box.hidden = false;
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".hero-search")) { box.hidden = true; }
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { box.hidden = true; input.blur(); }
    });
  }

  /* ---- /posts/ page: live filter ---- */
  var filter = document.getElementById("posts-filter");
  if (filter) {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("#posts-cards .card")
    );
    var nohit = document.getElementById("filter-nohit");
    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hit = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.classList.toggle("is-hidden", !hit);
        if (hit) shown++;
      });
      if (nohit) nohit.hidden = shown !== 0;
    });
  }
})();
