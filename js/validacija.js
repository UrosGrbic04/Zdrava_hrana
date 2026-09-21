/* ============================================
   Validacija kontakt forme
   HTML required atributi + JavaScript provere
   ============================================ */
(function () {
  "use strict";

  const forma = document.getElementById("kontaktForma");
  if (!forma) return;

  const polja = {
    ime: {
      el: forma.querySelector("#ime"),
      proveri: function (v) {
        if (!v.trim()) return "Ime je obavezno.";
        if (v.trim().length < 2) return "Ime mora imati barem 2 slova.";
        if (!/^[A-Za-zĆčćŠšĐđŽžА-Яа-я\s-]+$/.test(v)) return "Ime sme da sadrži samo slova.";
        return "";
      }
    },
    email: {
      el: forma.querySelector("#email"),
      proveri: function (v) {
        if (!v.trim()) return "E-mail je obavezan.";
        // Jednostavna ali pouzdana regex provera
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!re.test(v)) return "Unesite ispravnu e-mail adresu.";
        return "";
      }
    },
    telefon: {
      el: forma.querySelector("#telefon"),
      proveri: function (v) {
        if (!v.trim()) return ""; // opciono
        if (!/^[+]?[0-9\s\-/()]{6,20}$/.test(v)) return "Telefon nije ispravan.";
        return "";
      }
    },
    tema: {
      el: forma.querySelector("#tema"),
      proveri: function (v) {
        if (!v) return "Izaberite temu poruke.";
        return "";
      }
    },
    poruka: {
      el: forma.querySelector("#poruka"),
      proveri: function (v) {
        if (!v.trim()) return "Poruka je obavezna.";
        if (v.trim().length < 10) return "Poruka mora imati barem 10 znakova.";
        if (v.length > 1000) return "Poruka ne sme preći 1000 znakova.";
        return "";
      }
    },
    saglasnost: {
      el: forma.querySelector("#saglasnost"),
      proveri: function (_, el) {
        if (!el.checked) return "Morate prihvatiti uslove korišćenja.";
        return "";
      }
    }
  };

  function prikaziGresku(naziv, poruka) {
    const polje = polja[naziv].el.closest(".polje");
    const greska = polje.querySelector(".greska");
    if (poruka) {
      polje.classList.add("nevazece");
      greska.textContent = poruka;
      polja[naziv].el.setAttribute("aria-invalid", "true");
    } else {
      polje.classList.remove("nevazece");
      greska.textContent = "";
      polja[naziv].el.removeAttribute("aria-invalid");
    }
  }

  // Validacija u realnom vremenu
  Object.keys(polja).forEach(function (naziv) {
    const p = polja[naziv];
    p.el.addEventListener("blur", function () {
      const greska = p.proveri(p.el.value, p.el);
      prikaziGresku(naziv, greska);
    });
    p.el.addEventListener("input", function () {
      // Skidamo grešku kad korisnik počne da kuca
      const polje = p.el.closest(".polje");
      if (polje.classList.contains("nevazece")) {
        const greska = p.proveri(p.el.value, p.el);
        if (!greska) prikaziGresku(naziv, "");
      }
    });
  });

  // Brojač znakova za poruku
  const poruka = polja.poruka.el;
  const brojac = document.getElementById("brojacZnakova");
  if (poruka && brojac) {
    poruka.addEventListener("input", function () {
      brojac.textContent = poruka.value.length + " / 1000";
    });
  }

  // Slanje
  forma.addEventListener("submit", function (e) {
    e.preventDefault();
    let imaGrešaka = false;
    Object.keys(polja).forEach(function (naziv) {
      const p = polja[naziv];
      const greska = p.proveri(p.el.value, p.el);
      prikaziGresku(naziv, greska);
      if (greska) imaGrešaka = true;
    });

    if (imaGrešaka) {
      // Fokus na prvo nevažeće polje
      const prvo = forma.querySelector(".nevazece input, .nevazece textarea, .nevazece select");
      if (prvo) prvo.focus();
      return;
    }

    // Uspeh: prikazujemo poruku i resetujemo formu
    const uspeh = document.getElementById("porukaUspeh");
    if (uspeh) {
      uspeh.classList.add("prikazi");
      setTimeout(function () { uspeh.classList.remove("prikazi"); }, 6000);
    }
    forma.reset();
    if (brojac) brojac.textContent = "0 / 1000";
  });
})();
