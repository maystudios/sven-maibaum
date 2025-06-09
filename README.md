# Sven Maibaum Portfolio

This repository contains the static source files for Sven Maibaum's portfolio website.

## Kontaktformular

Das Formular in `index.html` verwendet weiterhin Formspree als Ziel, wird jedoch vor dem Absenden von einer Netlify Function validiert.

1. Beim Laden der Seite wird Googles reCAPTCHA eingebunden, um Spam vorzubeugen.
2. Beim Absenden fängt `js/contact.js` das Formular ab und sendet die Daten sowie das reCAPTCHA-Token an `/.netlify/functions/validate-form`.
3. Die Funktion `validate-form` prüft die Felder und verifiziert das reCAPTCHA mit dem geheimen Schlüssel (`RECAPTCHA_SECRET`). Anschließend leitet sie die Daten an Formspree weiter.
4. Bei Erfolg erhält der Benutzer eine Bestätigung, bei Fehlern eine entsprechende Meldung.

Zum lokalen Testen bleibt das action-Attribut des Formulars erhalten. Für den produktiven Einsatz muss in den Netlify-Einstellungen die Umgebungsvariable `RECAPTCHA_SECRET` gesetzt und der öffentliche Site Key im Formular (`YOUR_RECAPTCHA_SITE_KEY`) hinterlegt werden.
