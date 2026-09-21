/* ============================================
   Glavni JavaScript - Zdrava hrana
   Sadrzi: meni, tema, font, slajder, animacije
   ============================================ */
(function () {
  "use strict";

  // ---------- 1) HAMBURGER MENI ----------
  const hamburger = document.getElementById("hamburger");
  const meni = document.getElementById("glavniMeni");
  if (hamburger && meni) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("otvoren");
      meni.classList.toggle("otvoren");
      const otvoreno = meni.classList.contains("otvoren");
      hamburger.setAttribute("aria-expanded", otvoreno);
    });
  }

  // ---------- 2) AKTIVNA STAVKA MENIJA ----------
  const trenutna = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".meni a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href === trenutna) a.classList.add("aktivno");
  });

  // ---------- 3) TEMA (svetla / tamna) ----------
  // Učitavamo iz localStorage; ako nema, koristi sistemsku preferenciju
  const tasterTema = document.getElementById("tasterTema");
  function postaviTemu(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("zh_tema", tema);
    if (tasterTema) tasterTema.textContent = tema === "tamna" ? "☀️" : "🌙";
  }
  const sacuvanaTema = localStorage.getItem("zh_tema");
  if (sacuvanaTema) {
    postaviTemu(sacuvanaTema);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    postaviTemu("tamna");
  } else {
    postaviTemu("svetla");
  }
  if (tasterTema) {
    tasterTema.addEventListener("click", function () {
      const nova = document.documentElement.getAttribute("data-tema") === "tamna" ? "svetla" : "tamna";
      postaviTemu(nova);
    });
  }

  // ---------- 4) VELIČINA FONTA (A- / A+) ----------
  // Skala se cuva u localStorage; opseg 0.85 - 1.3
  let skala = parseFloat(localStorage.getItem("zh_skala")) || 1;
  function primeniSkalu() {
    document.documentElement.style.setProperty("--skala-fonta", skala.toFixed(2));
    localStorage.setItem("zh_skala", skala);
  }
  primeniSkalu();
  const tasterPlus = document.getElementById("fontPlus");
  const tasterMinus = document.getElementById("fontMinus");
  if (tasterPlus) tasterPlus.addEventListener("click", function () {
    skala = Math.min(1.3, skala + 0.1); primeniSkalu();
  });
  if (tasterMinus) tasterMinus.addEventListener("click", function () {
    skala = Math.max(0.85, skala - 0.1); primeniSkalu();
  });

  // ---------- 5) SLAJDER SLIKA ----------
  const slajder = document.querySelector(".slajder");
  if (slajder) {
    const slajdovi = slajder.querySelectorAll(".slajd");
    const tackice = slajder.querySelectorAll(".tackice button");
    let trenutni = 0;
    let timer = null;
    const RAZMAK = 4500;

    function pokazi(idx) {
      slajdovi.forEach(function (s, i) {
        s.classList.toggle("aktivan", i === idx);
      });
      tackice.forEach(function (t, i) {
        t.classList.toggle("aktivno", i === idx);
      });
      trenutni = idx;
    }
    function sledeci() { pokazi((trenutni + 1) % slajdovi.length); }
    function prethodni() { pokazi((trenutni - 1 + slajdovi.length) % slajdovi.length); }
    function pokreniAuto() { timer = setInterval(sledeci, RAZMAK); }
    function zaustaviAuto() { if (timer) { clearInterval(timer); timer = null; } }

    slajder.querySelector(".next").addEventListener("click", function () {
      sledeci(); zaustaviAuto(); pokreniAuto();
    });
    slajder.querySelector(".prev").addEventListener("click", function () {
      prethodni(); zaustaviAuto(); pokreniAuto();
    });
    tackice.forEach(function (t, i) {
      t.addEventListener("click", function () { pokazi(i); zaustaviAuto(); pokreniAuto(); });
    });
    slajder.addEventListener("mouseenter", zaustaviAuto);
    slajder.addEventListener("mouseleave", pokreniAuto);
    pokreniAuto();
  }

  // ---------- 6) FADE-IN ANIMACIJA NA SKROL ----------
  // IntersectionObserver pokrece klasu .vidljiv kada element udje u prikaz
  const elementi = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window && elementi.length) {
    const posmatrac = new IntersectionObserver(function (zapisi) {
      zapisi.forEach(function (z) {
        if (z.isIntersecting) {
          z.target.classList.add("vidljiv");
          posmatrac.unobserve(z.target);
        }
      });
    }, { threshold: 0.15 });
    elementi.forEach(function (el) { posmatrac.observe(el); });
  } else {
    elementi.forEach(function (el) { el.classList.add("vidljiv"); });
  }

  // ---------- 7) GODINA U FUTERU ----------
  const god = document.getElementById("godina");
  if (god) god.textContent = new Date().getFullYear();

  // ---------- 8) FAQ AKORDEON (usluge.html) ----------
  const akordeonStavke = document.querySelectorAll(".akordeon-stavka");
  akordeonStavke.forEach(function (stavka) {
    const dugme = stavka.querySelector(".akordeon-pitanje");
    if (!dugme) return;
    dugme.addEventListener("click", function () {
      const bilaOtvorena = stavka.classList.contains("otvoreno");
      akordeonStavke.forEach(function (s) {
        s.classList.remove("otvoreno");
        s.querySelector(".akordeon-pitanje").setAttribute("aria-expanded", "false");
      });
      if (!bilaOtvorena) {
        stavka.classList.add("otvoreno");
        dugme.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Napomena: pretraga, filter, sortiranje i paginacija za recepti.html
  // su implementirani u sopstvenom <script> bloku unutar recepti.html,
  // jer se kartice tamo generišu dinamički iz JS niza podataka.
})();
