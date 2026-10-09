/* Jonhy Italian News — interactions légères.
   Vanilla, sans dépendance. Ne touche jamais au contenu des cartes,
   pour ne pas perturber le générateur C++. */
(function () {
  'use strict';

  var racine = document.documentElement;
  var CLE = 'jin-news-theme';

  /* ---------- Thème clair / sombre ---------- */
  var themeToggle = document.getElementById('theme-toggle');

  function themePrefere() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'clair' : 'sombre';
  }

  function appliquerTheme(theme) {
    var clair = theme === 'clair';
    if (clair) {
      racine.setAttribute('data-theme', 'light');
      racine.style.colorScheme = 'light';
    } else {
      racine.removeAttribute('data-theme');
      racine.style.colorScheme = 'dark';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(clair));
      themeToggle.setAttribute('aria-label', clair ? 'Passer en thème sombre' : 'Passer en thème clair');
    }
  }

  var themeEnregistre = null;
  try { themeEnregistre = localStorage.getItem(CLE); } catch (e) { /* stockage indisponible */ }
  appliquerTheme(themeEnregistre || themePrefere());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var clair = racine.getAttribute('data-theme') === 'light';
      var nouveau = clair ? 'sombre' : 'clair';
      appliquerTheme(nouveau);
      try { localStorage.setItem(CLE, nouveau); } catch (e) { /* sans conséquence */ }
    });
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    var basculerNav = function (ouvrir) {
      nav.classList.toggle('est-ouvert', ouvrir);
      burger.setAttribute('aria-expanded', String(ouvrir));
      burger.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
    };

    burger.addEventListener('click', function () {
      basculerNav(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) basculerNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') basculerNav(false);
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) basculerNav(false);
    });
  }

  /* ---------- En-tête au défilement ---------- */
  var header = document.getElementById('site-header');

  if (header) {
    var majHeader = function () {
      header.classList.toggle('est-defile', window.scrollY > 8);
    };
    majHeader();
    window.addEventListener('scroll', majHeader, { passive: true });
  }

  /* ---------- Année du pied de page ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();