# Karteikarten-App Dashboard

Eine moderne Flashcard-Anwendung zum Lernen mit Spaced Repetition Algorithmus.

## Features

- 📚 **Deck-Verwaltung** - Erstelle und organisiere Lernkarten-Decks
- 🧠 **Spaced Repetition** - Intelligentes Lernsystem für optimale Erinnerung
- 🎨 **Modernes UI** - Schönes Interface mit Dark Mode Unterstützung
- 📱 **Responsiv** - Funktioniert auf Desktop und Mobilgeräten
- 💾 **Offline** - Speichert alle Daten lokal im Browser (IndexedDB)

## Tech Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **shadcn/ui** Komponenten
- **Material-UI Icons**
- **React Router** für Navigation

## Lokale Entwicklung

### Voraussetzungen

- [Node.js](https://nodejs.org/) 18 oder höher
- [npm](https://www.npmjs.com/) oder [pnpm](https://pnpm.io/)

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd Karteikartenapp

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` verfügbar.

### Build

```bash
npm run build
```

Der Build wird im `dist/` Verzeichnis erstellt.

## Deployment auf GitHub Pages

### 1. GitHub Repository einrichten

1. Erstelle ein neues Repository auf GitHub
2. Pushe den Code:

```bash
git remote add origin https://github.com/DEIN_USERNAME/Karteikartenapp.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages aktivieren

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** → **Pages**
3. Unter **Source** wähle **GitHub Actions**

### 3. Deployment

Das Deployment geschieht automatisch bei jedem Push auf den `main` Branch.

Du kannst es auch manuell auslösen:
1. Gehe zu **Actions** → **Deploy to GitHub Pages**
2. Klicke auf **Run workflow**

### 4. Zugriff auf die App

Nach erfolgreichem Deployment ist die App unter verfügbar:
```
https://DEIN_USERNAME.github.io/Karteikartenapp/
```

## VS Code Integration

Das Projekt enthält VS Code Konfigurationen:

- **Empfohlene Extensions** - Werden beim Öffnen vorgeschlagen
- **Launch Konfiguration** - Debugging mit Chrome oder Edge (F5)
- **Tasks** - Schneller Zugriff auf npm Befehle (Strg+Shift+P → "Run Task")

### Nützliche Shortcuts

- `F5` - Starte Debugging (öffnet Browser)
- `Strg+Shift+P` → "Run Task" → "Start Dev Server" - Startet den Dev Server
- `Strg+Shift+P` → "Run Task" → "Build" - Erstellt den Production Build

## Projektstruktur

```
src/
├── app/
│   ├── components/       # Wiederverwendbare UI-Komponenten
│   ├── components/ui/    # shadcn/ui Komponenten
│   ├── contexts/         # React Contexts (Theme, etc.)
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Hilfsfunktionen (IndexedDB, etc.)
│   ├── pages/            # Hauptseiten (Dashboard, StudyMode, etc.)
│   ├── App.tsx           # Haupt-App Komponente
│   ├── Layout.tsx        # App-Layout
│   ├── routes.ts         # Route-Definitionen
│   └── types.ts          # TypeScript Typen
├── styles/               # CSS Dateien
└── main.tsx              # Entry Point
```

## Datenpersistenz

Alle Daten werden lokal im Browser mit IndexedDB gespeichert:
- Lernkarten
- Decks
- Einstellungen
- Lernstatistiken

**Hinweis:** Daten gehen verloren, wenn der Browser-Cache geleert wird.

## Attribution

- UI Komponenten von [shadcn/ui](https://ui.shadcn.com/) (MIT Lizenz)
- Fotos von [Unsplash](https://unsplash.com) ([Lizenz](https://unsplash.com/license))

## Lizenz

MIT
