/* =============================================================================
   IT MAKER LC - main.js
   Small, dependency-free JS shared across pages.
     0. Analytics (Microsoft Clarity)
     1. Mobile nav toggle (accessible)
     2. Auto-updating copyright year
     3. Contact form submit handler (CORS-safe POST to Power Automate)
   Everything is guarded with "if element exists" so one script works on every
   page without errors when a given element isn't present.
   ============================================================================= */
(function () {
  "use strict";

  /* 0. ANALYTICS - Microsoft Clarity (privacy-respecting, no cookie banner
        needed for basic use). Set CLARITY_ID to "" to disable all tracking.
        Get an ID at https://clarity.microsoft.com (Settings > Overview). */
  var CLARITY_ID = "wxj34hdcpa"; // set to "" to disable all tracking
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  /* 1. MOBILE NAV TOGGLE ---------------------------------------------------- */
  // Toggles the nav menu on small screens and keeps aria-expanded in sync.
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    // Collapse the menu after clicking a link (mobile UX)
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2. COPYRIGHT YEAR ------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* 3. CONTACT FORM HANDLER ------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // The flow URL lives in a data attribute on the <form> so it's easy to
      // find and rotate. It's a write-only capability URL (see security notes).
      var flowUrl = form.getAttribute("data-flow-url");

      // Honeypot: if the hidden decoy field has any value, it's a bot.
      // Silently pretend success so the bot gets no signal.
      if (form.elements["hp"] && form.elements["hp"].value.trim() !== "") {
        showStatus("Thanks - your message has been sent.", "is-success");
        form.reset();
        return;
      }

      // Basic required-field validation (HTML 'required' also guards this).
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["message"].value.trim();
      if (!name || !email || !message) {
        showStatus("Please fill in your name, email, and message.", "is-error");
        return;
      }

      // Build the JSON payload - matches the Power Automate schema exactly.
      var payload = {
        name: name,
        email: email,
        phone: form.elements["phone"].value.trim(),
        company: form.elements["company"].value.trim(),
        service: form.elements["service"].value,
        message: message,
        pageUrl: window.location.href,
        hp: ""
      };

      setLoading(true);
      showStatus("Sending...", "");

      // CORS-safe send: text/plain + no-cors avoids a preflight the Power
      // Automate endpoint won't answer. The response is "opaque" (unreadable),
      // so we optimistically treat a non-throwing fetch as success and rely on
      // the flow's auto-reply email for real confirmation to the user.
      fetch(flowUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload)
      })
        .then(function () {
          showStatus("Thanks - your message has been sent. We'll be in touch shortly.", "is-success");
          form.reset();
        })
        .catch(function () {
          showStatus(
            "Something went wrong sending your message. Please email us directly or try again.",
            "is-error"
          );
        })
        .finally(function () {
          setLoading(false);
        });
    });

    function showStatus(msg, cls) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = "form-status" + (cls ? " " + cls : "");
    }
    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? "Sending..." : "Send message";
    }
  }
})();
