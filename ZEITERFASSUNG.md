# Zeiterfassung Karteikarten-App

## Projektzeiterfassung

| Datum | Aufgabe | Zeit | Beschreibung |
|-------|---------|------|--------------|
| 27.03.2026 | Theme-Transition Bugfix | 0.5h | CSS-Transitions für Input-Felder beim Dark/Light Mode Wechsel |

---

## Details zur letzten Änderung

### Theme-Transition Bugfix (0.5h)

**Problem:**
Input-Felder zeigten beim Wechsel zwischen Dark und Light Mode einen schwarzen Balken/dunkle Blende, da die Farben sofort wechselten ohne Übergang.

**Lösung:**
CSS-Transition-Eigenschaften hinzugefügt:

```css
/* Global für alle Elemente */
*, *::before, *::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Speziell für Input-Felder */
input, textarea, select {
  transition: background-color 0.3s ease, border-color 0.3s ease, 
              color 0.3s ease, box-shadow 0.3s ease;
}
```

**Recherche:**
- MDN: CSS Transitions - https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- Tailwind: transition-colors utility - https://tailwindcss.com/docs/transition-colors

**Geänderte Datei:**
- `src/styles/theme.css`

---

**Gesamtzeit:** 0.5 Stunden
