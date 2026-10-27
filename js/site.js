/* Tech Element Lab website: builds the pages from data/config.js (text, series) and data/videos.js (your videos).
   No libraries. All text from the data is inserted as text, never as HTML. */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || { name: "Tech Element Lab", about: [], series: [] };
  var data = window.SITE_DATA || { videos: [], channel: {} };
  var videos = (data.videos || []).slice().sort(function (a, b) { return a.published < b.published ? 1 : -1; });
  var SHORT_SECONDS = 180;

  // ---------------------------------------------------------------- helpers
  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "class") node.className = attrs[key];
      else if (attrs[key] !== null && attrs[key] !== undefined && attrs[key] !== false) node.setAttribute(key, attrs[key]);
    });
    (kids || []).forEach(function (kid) { if (kid) node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid); });
    return node;
  }
  function cleanTitle(title) { return String(title || "").replace(/\s*#[\w-]+/g, "").replace(/\s{2,}/g, " ").trim(); }
  function watchUrl(id) { return "https://www.youtube.com/watch?v=" + encodeURIComponent(id); }
  function thumbUrl(id) { return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg"; }
  function fmtDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? "" : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d);
  }
  function isShort(v) { return v.seconds > 0 && v.seconds <= SHORT_SECONDS; }
  function channelUrl() { return cfg.channelUrl || (data.channel && data.channel.url) || ""; }
  function subscribeUrl() {
    var url = channelUrl();
    return url ? url + (url.indexOf("?") > -1 ? "&" : "?") + "sub_confirmation=1" : "";
  }
  function normalVideos() { return videos.filter(function (v) { return !isShort(v); }); }
  function mount(id, node) { var host = document.getElementById(id); if (host) host.appendChild(node); }

  // part of a series -> the public video whose title contains the match text
  function seriesParts(series) {
    var used = {};
    return series.parts.map(function (part) {
      var found = null;
      for (var i = 0; i < videos.length; i++) {
        if (!used[videos[i].id] && String(videos[i].title).toLowerCase().indexOf(part.match.toLowerCase()) > -1) { found = videos[i]; break; }
      }
      if (found) used[found.id] = true;
      return { part: part, video: found };
    });
  }

  // ---------------------------------------------------------------- shared header and footer
  function nav(page) {
    var items = [["index.html", "Home", "home"], ["series.html", "Series", "series"], ["videos.html", "All videos", "videos"], ["about.html", "About", "about"]];
    var navEl = el("nav", { class: "nav", "aria-label": "Main" });
    items.forEach(function (item) {
      navEl.appendChild(el("a", { href: item[0], text: item[1], "aria-current": item[2] === page ? "page" : null }));
    });
    var sub = subscribeUrl();
    if (sub) navEl.appendChild(el("a", { class: "btn btn-amber", href: sub, target: "_blank", rel: "noopener", text: "Subscribe" }));
    return navEl;
  }
  function renderChrome(page) {
    var header = document.getElementById("site-header");
    if (header) {
      var row = el("div", { class: "wrap header-row" }, [
        el("a", { class: "brand", href: "index.html" }, [
          el("img", { src: "assets/logo.png", alt: "", width: "42", height: "42" }),
          el("span", { html: null }, [document.createTextNode("Tech Element "), el("b", { text: "Lab" })])
        ]),
        nav(page)
      ]);
      header.appendChild(row);
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      var links = el("span", {});
      if (channelUrl()) links.appendChild(el("a", { href: channelUrl(), target: "_blank", rel: "noopener", text: "YouTube channel" }));
      footer.appendChild(el("div", { class: "wrap foot-row" }, [
        el("span", { text: "© " + new Date().getFullYear() + " " + cfg.name }),
        links
      ]));
    }
  }

  // ---------------------------------------------------------------- video card
  function videoCard(v, opts) {
    opts = opts || {};
    var short = isShort(v);
    var title = cleanTitle(v.title);
    var thumb = el("a", { class: "thumb", href: watchUrl(v.id), target: "_blank", rel: "noopener", "aria-label": "Watch: " + title }, [
      el("img", { src: thumbUrl(v.id), alt: "", loading: "lazy", width: "480", height: "360" }),
      short ? el("span", { class: "badge short", text: "Short" }) : (opts.badge ? el("span", { class: "badge", text: opts.badge }) : null)
    ]);
    return el("article", { class: "card" + (short ? " vertical" : "") }, [
      thumb,
      el("div", { class: "body" }, [
        el("h3", {}, [el("a", { href: watchUrl(v.id), target: "_blank", rel: "noopener", text: title })]),
        el("div", { class: "meta", text: fmtDate(v.published) })
      ])
    ]);
  }
  function emptyNote(text) { return el("p", { class: "empty", text: text }); }

  // ---------------------------------------------------------------- pages
  function pageHome() {
    var normal = normalVideos();
    var latest = normal[0];
    var heroText = el("div", {}, [
      el("p", { class: "eyebrow", text: "YouTube channel" }),
      el("h1", {}, [document.createTextNode("Chips, explained "), el("em", { text: "properly" })]),
      el("p", { class: "lead", text: cfg.tagline }),
      el("div", { class: "cta-row" }, [
        latest ? el("a", { class: "btn btn-amber", href: watchUrl(latest.id), target: "_blank", rel: "noopener", text: "Watch the latest video" }) : null,
        subscribeUrl() ? el("a", { class: "btn btn-ghost", href: subscribeUrl(), target: "_blank", rel: "noopener", text: "Subscribe" }) : null
      ])
    ]);
    var player = el("div", { class: "glow player" });
    if (latest) {
      player.appendChild(el("iframe", {
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(latest.id), title: "Latest video: " + cleanTitle(latest.title),
        loading: "lazy", allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: "allowfullscreen",
        referrerpolicy: "strict-origin-when-cross-origin"
      }));
    } else {
      player.appendChild(el("img", { src: "assets/logo.png", alt: "Tech Element Lab logo", style: "object-fit:contain;padding:12%" }));
    }
    mount("hero", el("div", { class: "wrap hero-grid" }, [heroText, player]));

    var grid = el("div", { class: "grid" });
    normal.slice(0, 6).forEach(function (v, i) { grid.appendChild(videoCard(v, { badge: i === 0 ? "Latest" : "" })); });
    mount("latest", normal.length ? grid : emptyNote("Videos will appear here after the first update (run update_website.py)."));

    var seriesHost = document.getElementById("series-list");
    if (seriesHost) {
      cfg.series.forEach(function (series) { seriesHost.appendChild(seriesCard(series)); });
    }
    var band = document.getElementById("cta");
    if (band && subscribeUrl()) {
      band.appendChild(el("h2", { text: "Never miss a part" }));
      band.appendChild(el("p", { text: "New videos in the series arrive every week. Subscribe on YouTube to see them first." }));
      band.appendChild(el("a", { class: "btn btn-amber", href: subscribeUrl(), target: "_blank", rel: "noopener", text: "Subscribe on YouTube" }));
    } else if (band) { band.hidden = true; }
  }

  function seriesCard(series) {
    var parts = seriesParts(series);
    var live = parts.filter(function (p) { return p.video; }).length;
    var pills = el("div", { class: "pills" });
    parts.forEach(function (p) {
      pills.appendChild(p.video
        ? el("a", { class: "pill live", href: watchUrl(p.video.id), target: "_blank", rel: "noopener", text: "Part " + p.part.n })
        : el("span", { class: "pill", text: "Part " + p.part.n + " · soon" }));
    });
    var left = el("div", {}, [
      el("h3", { text: series.title }),
      el("p", { class: "lead", text: series.description }),
      el("div", { class: "progress", role: "img", "aria-label": live + " of " + parts.length + " parts published" }, [el("i", { style: "width:" + Math.round(100 * live / parts.length) + "%" })]),
      el("div", { class: "meta", text: live + " of " + parts.length + " parts published" }),
      pills
    ]);
    var first = parts.filter(function (p) { return p.video; })[0];
    var right = el("div", {}, [
      first ? el("a", { class: "glow player", href: "series.html?id=" + encodeURIComponent(series.id), "aria-label": "Open the series" }, [
        el("img", { src: thumbUrl(first.video.id), alt: "", loading: "lazy" })
      ]) : null,
      el("div", { class: "cta-row" }, [el("a", { class: "btn btn-ghost", href: "series.html?id=" + encodeURIComponent(series.id), text: "See all parts" })])
    ]);
    return el("div", { class: "series-card" }, [left, right]);
  }

  function pageSeries() {
    var wanted = new URLSearchParams(location.search).get("id");
    var series = cfg.series.filter(function (s) { return s.id === wanted; })[0] || cfg.series[0];
    if (!series) { mount("series-detail", emptyNote("No series is set up yet.")); return; }
    document.title = series.title + " | " + cfg.name;
    var head = el("div", { class: "prose" }, [el("h1", { text: series.title }), el("p", { class: "lead", text: series.description })]);
    var list = el("div", { class: "parts" });
    seriesParts(series).forEach(function (item) {
      var v = item.video;
      var media = v
        ? el("a", { href: watchUrl(v.id), target: "_blank", rel: "noopener", "aria-label": "Watch part " + item.part.n }, [el("img", { src: thumbUrl(v.id), alt: "", loading: "lazy", width: "480", height: "270" })])
        : el("div", { class: "ph", text: "Coming soon" });
      list.appendChild(el("article", { class: "part" + (v ? "" : " soon") }, [
        media,
        el("div", {}, [
          el("div", { class: "num", text: "Part " + item.part.n }),
          el("h3", { text: v ? cleanTitle(v.title) : item.part.title }),
          el("div", { class: "meta", text: v ? "Published " + fmtDate(v.published) : "In production" })
        ]),
        v ? el("a", { class: "btn btn-amber watch", href: watchUrl(v.id), target: "_blank", rel: "noopener", text: "Watch" })
          : el("span", { class: "meta watch", text: "Coming soon" })
      ]));
    });
    mount("series-detail", head);
    mount("series-detail", list);
  }

  function pageVideos() {
    var grid = el("div", { class: "grid", id: "video-grid" });
    var filters = el("div", { class: "filters", role: "group", "aria-label": "Filter videos" });
    var current = "all";
    function draw() {
      grid.textContent = "";
      var shown = videos.filter(function (v) { return current === "all" || (current === "short" ? isShort(v) : !isShort(v)); });
      shown.forEach(function (v) { grid.appendChild(videoCard(v)); });
      if (!shown.length) grid.appendChild(emptyNote("Nothing here yet."));
      Array.prototype.forEach.call(filters.children, function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === current)); });
    }
    [["all", "All"], ["long", "Videos"], ["short", "Shorts"]].forEach(function (f) {
      var button = el("button", { type: "button", "data-filter": f[0], text: f[1], "aria-pressed": "false" });
      button.addEventListener("click", function () { current = f[0]; draw(); });
      filters.appendChild(button);
    });
    mount("videos-host", filters);
    mount("videos-host", grid);
    draw();
  }

  function pageAbout() {
    var box = el("div", { class: "prose" });
    cfg.about.forEach(function (p) { box.appendChild(el("p", { text: p })); });
    if (cfg.made) box.appendChild(el("p", { class: "note", text: cfg.made }));
    if (channelUrl()) {
      box.appendChild(el("div", { class: "cta-row" }, [
        el("a", { class: "btn btn-amber", href: subscribeUrl(), target: "_blank", rel: "noopener", text: "Subscribe on YouTube" }),
        el("a", { class: "btn btn-ghost", href: channelUrl(), target: "_blank", rel: "noopener", text: "Visit the channel" })
      ]));
    }
    mount("about-host", box);
  }

  // ---------------------------------------------------------------- start
  var page = document.body.getAttribute("data-page");
  renderChrome(page);
  ({ home: pageHome, series: pageSeries, videos: pageVideos, about: pageAbout }[page] || function () {})();
})();
