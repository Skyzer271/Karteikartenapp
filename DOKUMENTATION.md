# Projektdokumentation Karteikarten-App

## FlashCards - Intelligentes Lernen mit Spaced Repetition

---

**Projekt:** Karteikarten-App mit Spaced Repetition Algorithmus  
**Erstellt:** März 2026  
**Technologie:** React, TypeScript, Vite, Tailwind CSS  

---

## Inhaltsverzeichnis

1. [Einleitung](#1-einleitung)
2. [Projektbeschreibung](#2-projektbeschreibung)
3. [Verwendete Technologien](#3-verwendete-technologien)
4. [Systemarchitektur](#4-systemarchitektur)
5. [Installation und Setup](#5-installation-und-setup)
6. [Funktionsbeschreibung](#6-funktionsbeschreibung)
7. [Quellenverzeichnis](#7-quellenverzeichnis)

---

## 1. Einleitung

### 1.1 Projektziel
Entwicklung einer modernen Webanwendung zum Lernen mit Karteikarten basierend auf dem Spaced Repetition Algorithmus (SM-2). Die Anwendung ermöglicht benutzerspezifische Lernintervalle und ein responsives Design für Desktop und Mobilgeräte.

### 1.2 Anforderungen
- Erstellung und Verwaltung von Lernkarten-Decks
- Intelligentes Lernsystem mit SM-2 Algorithmus
- Anpassbare Lernintervalle
- Dark/Light Mode Unterstützung
- Offline-Fähigkeit durch IndexedDB
- Deployment auf GitHub Pages

---

## 2. Projektbeschreibung

### 2.1 Funktionsumfang
Die Anwendung bietet folgende Kernfunktionen:

| Funktion | Beschreibung |
|----------|-------------|
| Deck-Verwaltung | Erstellen, Bearbeiten und Löschen von Karteikarten-Decks |
| Karten erstellen | Eingabe von Vorder- und Rückseite mit optionalen Hinweisen |
| Lernmodus | Interaktives Lernen mit Antworteingabe und Selbstbewertung |
| Spaced Repetition | Automatische Berechnung der nächsten Wiederholung |
| Statistiken | Übersicht über Lernfortschritt und Streaks |
| Einstellungen | Anpassbare Intervalle, Schriftgröße, Dark Mode |

### 2.2 Zielgruppe
Schüler, Studenten und lebenslange Lerner, die effizient mit Karteikarten lernen möchten.

---

## 3. Verwendete Technologien

### 3.1 Frontend-Framework

#### React 18.3.1
- **Quelle:** https://react.dev/
- **Lizenz:** MIT License
- **Verwendung:** Komponentenbasierte UI-Entwicklung
- **Begründung:** Industriestandard für moderne Webanwendungen, große Community, ausgereiftes Ökosystem

#### TypeScript 5.x
- **Quelle:** https://www.typescriptlang.org/
- **Lizenz:** Apache License 2.0
- **Verwendung:** Typisierung für bessere Code-Qualität und Fehlererkennung
- **Begründung:** Statische Typisierung reduziert Laufzeitfehler, verbesserte IDE-Unterstützung

### 3.2 Build-Tool

#### Vite 6.3.5
- **Quelle:** https://vitejs.dev/
- **Lizenz:** MIT License
- **Verwendung:** Entwicklungsserver und Build-Tool
- **Begründung:** Schneller als Webpack, Hot Module Replacement, optimierte Production-Builds

### 3.3 Styling

#### Tailwind CSS 4.1.12
- **Quelle:** https://tailwindcss.com/
- **Lizenz:** MIT License
- **Verwendung:** Utility-First CSS Framework
- **Begründung:** Schnelle Entwicklung, konsistentes Design, Dark Mode Unterstützung

#### tw-animate-css 1.3.8
- **Quelle:** https://github.com/mattbfb/tw-animate-css
- **Lizenz:** MIT License
- **Verwendung:** Animationen für Tailwind CSS

### 3.4 UI-Komponenten

#### shadcn/ui
- **Quelle:** https://ui.shadcn.com/
- **Lizenz:** MIT License
- **Verwendung:** Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip
- **Begründung:** Kopierbare Komponenten, volle Kontrolle über Styling, Tailwind-Integration

#### Radix UI
- **Quelle:** https://www.radix-ui.com/
- **Lizenz:** MIT License
- **Verwendung:** Headless UI Primitives für shadcn/ui
- **Begründung:** Barrierefreiheit, unstyled Komponenten, volle Anpassbarkeit

#### Lucide React 0.487.0
- **Quelle:** https://lucide.dev/
- **Lizenz:** ISC License
- **Verwendung:** Icon-Bibliothek
- **Begründung:** Moderne Icons, Tree-Shaking Unterstützung

#### Framer Motion (motion) 12.23.24
- **Quelle:** https://www.framer.com/motion/
- **Lizenz:** MIT License
- **Verwendung:** Animationen und Übergänge
- **Begründung:** Deklarative Animationen, React-Integration

### 3.5 Datenbank

#### IndexedDB (native Browser API)
- **Quelle:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Verwendung:** Lokale Datenspeicherung für Karten, Decks und Einstellungen
- **Begründung:** Persistente Speicherung im Browser, Offline-Fähigkeit

### 3.6 Routing

#### React Router 7.13.1
- **Quelle:** https://reactrouter.com/
- **Lizenz:** MIT License
- **Verwendung:** Client-seitiges Routing
- **Begründung:** Standard für React-Routing, deklarative Konfiguration

### 3.7 Algorithmen

#### SuperMemo-2 (SM-2) Algorithmus
- **Quelle:** https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
- **Urheber:** Piotr Wozniak (1990)
- **Verwendung:** Berechnung der optimalen Wiederholungsintervalle
- **Anpassung:** Implementierung mit benutzerdefinierbaren Intervallen

---

## 4. Systemarchitektur

### 4.1 Architekturmuster: MVC

Die Anwendung folgt dem Model-View-Controller Pattern:

```
src/
├── model/          # Daten und Geschäftslogik
│   ├── types/      # TypeScript Interfaces
│   ├── storage/    # IndexedDB Zugriff
│   └── services/   # Algorithmen (Spaced Repetition)
├── view/           # UI-Komponenten
│   ├── pages/      # Seitenkomponenten
│   ├── components/ # Wiederverwendbare Komponenten
│   └── ui/         # shadcn/ui Komponenten
└── controller/     # Steuerungslogik
    ├── hooks/      # Custom React Hooks
    └── contexts/   # React Contexts (Theme, etc.)
```

### 4.2 Datenfluss

1. **Benutzerinteraktion** → View (React Komponenten)
2. **State Management** → Controller (Hooks)
3. **Datenpersistenz** → Model (IndexedDB)
4. **Business Logic** → Model (Services)

### 4.3 Komponentenstruktur

| Komponente | Zweck |
|------------|-------|
| Dashboard | Übersicht über Decks und Statistiken |
| DeckDetail | Detailansicht eines Decks mit Kartenliste |
| StudyMode | Lernmodus mit Antworteingabe |
| CreateCard | Formular zum Erstellen neuer Karten |
| Settings | Konfiguration der App-Einstellungen |

---

## 5. Installation und Setup

### 5.1 Systemanforderungen
- Node.js 18.x oder höher
- npm oder pnpm
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)

### 5.2 Installation

```bash
# Repository klonen
git clone https://github.com/Skyzer271/Karteikartenapp.git
cd Karteikartenapp

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build
```

### 5.3 Deployment

Die Anwendung ist für GitHub Pages konfiguriert:

1. Repository auf GitHub erstellen
2. GitHub Pages in den Einstellungen aktivieren (Source: GitHub Actions)
3. Workflow automatisch bei Push auf main ausführen

---

## 6. Funktionsbeschreibung

### 6.1 Spaced Repetition Algorithmus

Der implementierte Algorithmus basiert auf SM-2 mit folgenden Anpassungen:

**Intervalle (benutzerdefinierbar):**
- Nochmal: 1-7 Tage
- Schwer: 0-7 Tage  
- Gut: 4-14 Tage
- Einfach: 7-28 Tage

**Formel:**
```
nextReview = now + interval * 24 * 60 * 60 * 1000
```

### 6.2 Lernmodus Ablauf

1. Frage wird angezeigt
2. Benutzer gibt Antwort ein (optional)
3. "Lösung aufdecken" zeigt richtige Antwort
4. Automatischer Vergleich mit Eingabe
5. Selbstbewertung (Nochmal/Schwer/Gut/Einfach)
6. Berechnung des nächsten Review-Datums

### 6.3 Datenpersistenz

**IndexedDB Struktur:**
- `decks`: Deck-Informationen
- `cards`: Karteikarten mit Lernstatus
- `sessions`: Lernsitzungen für Statistiken
- `settings`: Benutzereinstellungen

---

## 7. Quellenverzeichnis

### 7.1 Dokumentationen und Tutorials

| Quelle | URL | Verwendung |
|--------|-----|------------|
| React Docs | https://react.dev/ | Komponentenentwicklung |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ | Typisierung |
| Tailwind CSS Docs | https://tailwindcss.com/docs | Styling |
| shadcn/ui Docs | https://ui.shadcn.com/docs | UI-Komponenten |
| MDN Web Docs | https://developer.mozilla.org/ | IndexedDB API |
| React Router Docs | https://reactrouter.com/ | Routing |

### 7.2 Algorithmus-Quellen

| Quelle | URL | Autor |
|--------|-----|-------|
| SuperMemo-2 Algorithm | https://www.supermemo.com/en/archives1990-2015/english/ol/sm2 | Piotr Wozniak |

### 7.3 Tools und Libraries

Alle verwendeten Bibliotheken sind unter MIT, Apache 2.0 oder ISC Lizenz verfügbar und über npm registriert:
- https://www.npmjs.com/

### 7.4 Icons

- Lucide Icons: https://lucide.dev/

### 7.5 Deployment

- GitHub Pages: https://pages.github.com/
- GitHub Actions: https://github.com/features/actions

---

## Anlagen

### Anlage A: Verwendete NPM-Pakete (Auszug)

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "^7.13.1",
    "@radix-ui/react-*": "latest",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "tailwindcss": "4.1.12"
  },
  "devDependencies": {
    "vite": "6.3.5",
    "typescript": "^5.0.0"
  }
}
```

### Anlage B: Projektstruktur

```
Karteikartenapp/
├── .github/workflows/    # CI/CD
├── src/
│   ├── controller/       # Hooks & Contexts
│   ├── model/            # Daten & Logik
│   ├── view/             # Komponenten
│   ├── styles/           # CSS
│   ├── App.tsx           # Hauptkomponente
│   ├── Layout.tsx        # Layout
│   ├── routes.ts         # Routing
│   └── main.tsx          # Entry Point
├── index.html            # HTML Template
├── package.json          # Dependencies
├── vite.config.ts        # Build-Konfig
└── tailwind.config.ts    # Tailwind-Konfig
```

---

**Erstellt:** März 2026  
**Autor:** Entwicklungsteam  
**Version:** 2.0.0

---

*Diese Dokumentation wurde nach den Standards der Industrie- und Handelskammer (IHK) für Projektdokumentationen erstellt.*
