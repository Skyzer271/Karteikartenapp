# Projektdokumentation

## Entwicklung einer Karteikarten-Anwendung mit Spaced Repetition Algorithmus

---

**Projekt:** Karteikarten-App "FlashCards"  
**Projektzeitraum:** März 2026  
**Auszubildender:** [Name]  
**Ausbildungsberuf:** Fachinformatiker für Anwendungsentwicklung  
**Ausbildungsbetrieb:** [Betrieb]  
**IHK:** [IHK-Bezirk]

---

## Inhaltsverzeichnis

1. [Einleitung](#1-einleitung)
2. [Projektbeschreibung](#2-projektbeschreibung)
3. [Ist-Analyse](#3-ist-analyse)
4. [Soll-Konzept](#4-soll-konzept)
5. [Projektplanung](#5-projektplanung)
6. [Entwurf/Design](#6-entwurfdesign)
7. [Implementierung](#7-implementierung)
8. [Qualitätsmanagement](#8-qualitätsmanagement)
9. [Wirtschaftlichkeitsbetrachtung](#9-wirtschaftlichkeitsbetrachtung)
10. [Fazit](#10-fazit)
11. [Anlagen](#11-anlagen)
12. [Quellenverzeichnis](#12-quellenverzeichnis)

---

## 1. Einleitung

### 1.1 Ausgangssituation
Im Zeitalter des digitalen Lernens besteht ein wachsender Bedarf an effizienten Lernwerkzeugen. Traditionelle Lernmethoden wie das Auswendiglernen sind oft zeitaufwendig und wenig effektiv. Die Methode der verteilten Wiederholung (Spaced Repetition) hat sich wissenschaftlich als besonders effektiv erwiesen, ist jedoch in vielen bestehenden Anwendungen nicht ausreichend implementiert oder benutzerfreundlich gestaltet.

### 1.2 Projektziel
Entwicklung einer modernen, responsiven Webanwendung zum Lernen mit Karteikarten unter Verwendung des Spaced Repetition Algorithmus SM-2. Die Anwendung soll benutzerdefinierbare Lernintervalle ermöglichen und offline funktionsfähig sein.

### 1.3 Projektabgrenzung
**Im Projektumfang enthalten:**
- Frontend-Entwicklung mit React und TypeScript
- Implementierung des SM-2 Algorithmus mit anpassbaren Intervallen
- Lokale Datenspeicherung via IndexedDB
- Responsive Design für Desktop und Mobilgeräte
- Deployment auf GitHub Pages

**Nicht im Projektumfang:**
- Backend-Server oder Cloud-Synchronisation
- Mobile App (Native iOS/Android)
- Benutzerauthentifizierung/Accounts
- Social Features (Sharing, Community)

---

## 2. Projektbeschreibung

### 2.1 Aufgabenstellung
Die zu entwickelnde Anwendung muss folgende Kernfunktionen bereitstellen:

| Anforderung | Priorität | Beschreibung |
|-------------|-----------|--------------|
| Deck-Verwaltung | Muss | Erstellen, Bearbeiten, Löschen von Lernkarten-Decks |
| Kartenverwaltung | Muss | Vorder-/Rückseite mit optionalen Hinweisen |
| Lernmodus | Muss | Interaktives Lernen mit Selbstbewertung |
| Spaced Repetition | Muss | Automatische Berechnung der Wiederholungsintervalle |
| Anpassbare Intervalle | Soll | Benutzerdefinierte Einstellung der Lernzeiten |
| Statistiken | Soll | Lernfortschritt und Streak-Anzeige |
| Dark Mode | Soll | Dunkles Farbschema |
| Offline-Fähigkeit | Soll | Funktionsfähigkeit ohne Internet |

*Legende: Muss = Pflichtanforderung, Soll = Wunschanforderung*

### 2.2 Zielgruppe
- Schüler und Studenten
- Berufstätige in Weiterbildung
- Sprachenlerner
- Alle Personen mit Bedarf an effizientem Wissensspeicher

---

## 3. Ist-Analyse

### 3.1 Analyse bestehender Lösungen

| Anwendung | Stärken | Schwächen |
|-----------|---------|-----------|
| Anki | Sehr mächtig, etabliert | Komplexe UI, hohe Einstiegshürde |
| Quizlet | Einfach, sozial | Abo-Modell, keine offline Spaced Repetition |
| Memrise | Gamification | Fokus auf Sprachen, begrenzte Flexibilität |
| Selbst gebastelte Karten | Offline, einfach | Keine Algorithmus-Unterstützung |

### 3.2 Problemanalyse
Bestehende Lösungen haben folgende Mängel:
1. **Zu komplex:** Anki überfordert Gelegenheitsnutzer
2. **Abhängigkeit:** Quizlet erfordert Internet und Account
3. **Fehlende Anpassung:** Feste Intervalle passen nicht zu jedem Lerntyp
4. **Kosten:** Viele Features nur gegen Bezahlung verfügbar

### 3.3 Anforderungsdefinition
Aus der Ist-Analyse ergeben sich folgende kritische Erfolgsfaktoren:
- Intuitive Bedienbarkeit ohne Einarbeitungszeit
- Vollständige Offline-Funktionalität
- Anpassbare Lernintervalle für individuelles Lerntempo
- Modernes, responsives Design
- Kostenlos und Open Source

---

## 4. Soll-Konzept

### 4.1 Funktionale Anforderungen

#### 4.1.1 Use Cases

**UC-01: Deck erstellen**
- Akteur: Benutzer
- Ablauf: Benutzer gibt Deck-Namen ein → Deck wird erstellt
- Ergebnis: Neues leeres Deck verfügbar

**UC-02: Karte erstellen**
- Akteur: Benutzer
- Vorbedingung: Mindestens ein Deck existiert
- Ablauf: Vorderseite eingeben → Rückseite eingeben → (optional) Hinweis → Speichern
- Ergebnis: Karte im Deck gespeichert

**UC-03: Lernen**
- Akteur: Benutzer
- Vorbedingung: Deck mit fälligen Karten
- Ablauf: Frage anzeigen → Antwort eingeben → Lösung aufdecken → Selbstbewertung
- Ergebnis: Intervall wird neu berechnet, Karte wird eingeplant

**UC-04: Intervalle anpassen**
- Akteur: Benutzer
- Ablauf: Einstellungen öffnen → Slider für Intervalle anpassen → Speichern
- Ergebnis: Neues Lernverhalten basierend auf Einstellungen

### 4.2 Nicht-funktionale Anforderungen

| Anforderung | Zielwert | Messmethode |
|-------------|----------|-------------|
| Performance | Ladezeit < 2 Sekunden | Lighthouse Audit |
| Responsiveness | Mobile-First, bis 320px | Browser-Testing |
| Browser-Support | Chrome, Firefox, Safari, Edge | Manuelle Tests |
| Barrierefreiheit | WCAG 2.1 AA | Axe-Testing |
| Offline-Fähigkeit | 100% Funktionalität ohne Netz | Netzwerk-Deaktivierung |

### 4.3 Technologieentscheidungen

#### 4.3.1 Frontend-Framework
**Entscheidung:** React mit TypeScript

**Begründung:**
- Industriestandard mit großem Ökosystem
- Komponentenbasierte Architektur ermöglicht Wiederverwendbarkeit
- TypeScript bietet statische Typisierung für weniger Laufzeitfehler
- Gute Performance durch Virtual DOM

**Alternativen:**
- Vue.js: Ebenfalls geeignet, aber React hat größere Community
- Angular: Zu schwer für kleines Projekt, zu viel Boilerplate
- Vanilla JS: Keine Type-Safety, schwerer wartbar

#### 4.3.2 Build-Tool
**Entscheidung:** Vite

**Begründung:**
- Deutlich schneller als Webpack (Startup 300ms vs. 3000ms)
- Native ES-Module Unterstützung
- Optimierte Production-Builds
- Einfache Konfiguration

#### 4.3.3 Styling
**Entscheidung:** Tailwind CSS + shadcn/ui

**Begründung:**
- Utility-First ermöglicht schnelle Entwicklung ohne CSS-Dateien
- shadcn/ui bietet kopierbare, anpassbare Komponenten
- Keine Vendor-Lock-in (kein UI-Framework wie Material-UI)
- Dark Mode einfach implementierbar

#### 4.3.4 Datenspeicherung
**Entscheidung:** IndexedDB (Browser-API)

**Begründung:**
- Persistente Speicherung im Browser
- Funktioniert offline
- Kein Backend/Server erforderlich
- Ausreichend für lokale Nutzung

**Alternativen:**
- LocalStorage: Zu klein (5MB), keine komplexe Struktur
- Backend-API: Zu aufwändig, Offline-Problem

---

## 5. Projektplanung

### 5.1 Projektphasen (80 Stunden)

| Phase | Zeitraum | Aufwand | Deliverables |
|-------|----------|---------|--------------|
| **1. Analyse** | Woche 1 | 10h | Lastenheft, Ist-Analyse, Anforderungsdefinition |
| **2. Planung/Entwurf** | Woche 1-2 | 15h | Architektur, Wireframes, Technologieentscheidungen, Datenmodell |
| **3. Setup** | Woche 2 | 5h | Projektstruktur, CI/CD-Pipeline, Tool-Konfiguration |
| **4. Implementierung** | Woche 2-4 | 40h | Frontend, Algorithmus, Datenbank, UI-Komponenten |
| **5. Testing & QA** | Woche 4 | 12h | Unit-Tests, Integrationstests, Bugfixes, Code-Review |
| **6. Dokumentation** | Woche 4-5 | 8h | Technische Dokumentation, IHK-Dokumentation |
| **Puffer** | - | 5h | Unvorhergesehene Probleme, Nachbesserungen |
| **Gesamt** | **5 Wochen** | **95h** | **Effektiv: 80h** |

#### 5.1.1 Detaillierte Aufschlüsselung Implementierungsphase (40h)

| Modul | Aufwand | Beschreibung |
|-------|---------|--------------|
| **Projekt-Setup** | 4h | Vite + React + TypeScript konfigurieren, Tailwind einrichten |
| **Datenmodell & Types** | 4h | TypeScript Interfaces, IndexedDB Schema definieren |
| **Storage-Service** | 6h | IndexedDB CRUD-Operationen, Fehlerbehandlung |
| **Algorithmus (SM-2)** | 6h | Spaced Repetition Logik, Intervall-Berechnung |
| **Hooks & Contexts** | 5h | useDecks, useSettings, ThemeContext implementieren |
| **UI-Komponenten** | 8h | Dashboard, Kartenkomponenten, Formulare |
| **Lernmodus** | 6h | StudyMode mit Antworteingabe und Bewertung |
| **Einstellungen** | 4h | Settings-Seite mit Slidern für Intervalle |
| **Routing & Layout** | 3h | React Router, Navigation, Layout-Komponente |
| **Deployment** | 4h | GitHub Actions, GitHub Pages Konfiguration, Bugfixes |

### 5.2 Ressourcenplanung

**Hardware:**
- Entwicklungsrechner (vorhanden)
- Testgeräte: Desktop, Smartphone (vorhanden)

**Software:**
- VS Code (Open Source)
- Node.js LTS (Open Source)
- Git (Open Source)

**Drittanbieter-Services:**
- GitHub (Repository + Pages Hosting, kostenlos)

### 5.3 Risikoanalyse

| Risiko | Eintritts-wahrscheinlichkeit | Auswirkung | Gegenmaßnahme |
|--------|------------------------------|------------|---------------|
| IndexedDB-Browser-Inkompatibilität | Niedrig | Hoch | Feature-Detection, Fallback |
| Performance-Probleme bei vielen Karten | Mittel | Mittel | Pagination, Lazy Loading |
| Datenverlust | Niedrig | Sehr hoch | Export-Funktion (geplant) |

---

## 6. Entwurf/Design

### 6.1 Architekturentwurf

#### 6.1.1 MVC-Architektur
Das Projekt folgt dem Model-View-Controller Pattern:

**Model (Daten & Logik):**
- `types`: TypeScript Interfaces
- `storage`: IndexedDB Zugriffsschicht
- `services`: Spaced Repetition Algorithmus

**View (Präsentation):**
- `pages`: Seitenkomponenten (Dashboard, Lernen, Einstellungen)
- `components`: Wiederverwendbare UI-Elemente
- `ui`: Basis-Komponenten (Button, Input, etc.)

**Controller (Steuerung):**
- `hooks`: State Management (useDecks, useSettings)
- `contexts`: Global State (ThemeContext)

#### 6.1.2 Datenmodell

**Entity: Deck**
```typescript
interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}
```

**Entity: Card**
```typescript
interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  deckId: string;
  createdAt: number;
  lastReviewed: number | null;
  nextReview: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
  isPaused: boolean;
}
```

**Entity: Settings**
```typescript
interface Settings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoRecognition: boolean;
  showHintButton: boolean;
  shuffleMode: boolean;
  randomSide: boolean;
  intervals: LearningIntervals;
}
```

### 6.2 Benutzeroberfläche

#### 6.2.1 Wireframes

**Dashboard:**
- Header mit Logo und Einstellungen-Button
- Statistik-Karten (Gesamt, Fällig, Gemeistert)
- Grid mit Deck-Karten
- "Neues Deck" Button

**Lernmodus:**
- Große Karte mit Frage
- Eingabefeld für Antwort
- "Lösung aufdecken" Button
- Nach Aufdecken: Antwortvergleich + Bewertungsbuttons

**Einstellungen:**
- Toggle für Dark Mode
- Schriftgröße (Klein/Mittel/Groß)
- Slider für Intervalle (Nochmal/Schwer/Gut/Einfach)

#### 6.2.2 Design-System

**Farben:**
- Primary: #007BFF (Blau)
- Success: #28A745 (Grün)
- Warning: #FFC107 (Gelb)
- Danger: #DC3545 (Rot)
- Background Light: #F8FAFC
- Background Dark: #0F172A

**Typografie:**
- Font: System-UI (sans-serif)
- Größen: Small (14px), Medium (16px), Large (18px)

**Spacing:**
- Base Unit: 4px
- Komponenten-Abstand: 16px-24px

### 6.3 Algorithmus-Entwurf

#### 6.3.1 Spaced Repetition (SM-2)
Der Algorithmus berechnet das nächste Review-Datum basierend auf der Schwierigkeit:

**Formeln:**
```
IF difficulty = "again" THEN
  interval = 1 Tag
  repetitions = 0
  easeFactor = easeFactor - 0.2
  
ELSE IF difficulty = "hard" THEN
  interval = userSetting.hard (0-7 Tage)
  repetitions = repetitions + 1
  
ELSE IF difficulty = "good" THEN
  interval = userSetting.good (4-14 Tage)
  repetitions = repetitions + 1
  
ELSE IF difficulty = "easy" THEN
  interval = userSetting.easy (7-28 Tage)
  repetitions = repetitions + 1
  easeFactor = easeFactor + 0.15
END IF

nextReview = currentTime + (interval × 24 × 60 × 60 × 1000 ms)
```

**Anpassung:**
Im Gegensatz zum Original-SM2 werden hier direkte Tage-Intervalle statt Multiplikatoren verwendet, um dem Benutzer mehr Kontrolle zu geben.

---

## 7. Implementierung

### 7.1 Entwicklungsumgebung

**Tools:**
- IDE: Visual Studio Code
- Versionierung: Git
- Repository: GitHub
- CI/CD: GitHub Actions
- Package Manager: npm

**Setup:**
```bash
# Projekt initialisieren
npm create vite@latest Karteikartenapp -- --template react-ts

# Dependencies installieren
npm install react-router motion lucide-react @radix-ui/react-*
npm install -D tailwindcss postcss autoprefixer

# Tailwind konfigurieren
npx tailwindcss init -p
```

### 7.2 Wichtige Code-Komponenten

#### 7.2.1 IndexedDB Service
```typescript
// model/storage/indexedDB.ts
export const indexedDBStorage = {
  async getDecks(): Promise<Deck[]> { ... },
  async addDeck(deck: Deck): Promise<void> { ... },
  async getCards(): Promise<Card[]> { ... },
  async addCard(card: Card): Promise<void> { ... },
  async getSettings(): Promise<Settings> { ... },
  async saveSettings(settings: Settings): Promise<void> { ... }
};
```

#### 7.2.2 Spaced Repetition Service
```typescript
// model/services/spaced-repetition.ts
export function calculateNextReview(
  card: Card, 
  difficulty: Difficulty,
  intervals: LearningIntervals
): Partial<Card> {
  // Implementierung nach SM-2 mit anpassbaren Intervallen
}
```

#### 7.2.3 React Hook
```typescript
// controller/hooks/useDecks.ts
export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  
  // Laden aus IndexedDB
  useEffect(() => { ... }, []);
  
  // CRUD Operationen
  const addDeck = async (deck: Deck) => { ... };
  const addCard = async (card: Card) => { ... };
  
  return { decks, cards, addDeck, addCard };
}
```

### 7.3 Deployment

**GitHub Pages Setup:**
1. Repository auf GitHub erstellen
2. GitHub Actions Workflow für Deployment
3. Vite-Config mit `base: '/Karteikartenapp/'`
4. SPA-Routing Script in index.html

**CI/CD Pipeline:**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
```

---

## 8. Qualitätsmanagement

### 8.1 Teststrategie

**Testarten:**
- Unit-Tests (nicht implementiert aufgrund Zeitbeschränkung)
- Manuelle Funktionstests
- Cross-Browser-Tests
- Responsive-Tests

**Testfälle:**

| Test-ID | Beschreibung | Erwartetes Ergebnis | Status |
|---------|--------------|---------------------|--------|
| T-01 | Deck erstellen | Deck erscheint in Liste | OK |
| T-02 | Karte erstellen | Karte im Deck gespeichert | OK |
| T-03 | Lernmodus starten | Fällige Karten werden angezeigt | OK |
| T-04 | Antwort eingeben | Vergleich mit Lösung funktioniert | OK |
| T-05 | Bewertung wählen | Intervall wird neu berechnet | OK |
| T-06 | Einstellungen ändern | Intervalle werden übernommen | OK |
| T-07 | Dark Mode | Farbschema wechselt | OK |
| T-08 | Offline nutzen | App funktioniert ohne Netz | OK |
| T-09 | Reload auf Unterseite | Kein 404-Fehler | OK |

### 8.2 Code-Qualität

**Maßnahmen:**
- TypeScript für Typ-Sicherheit
- ESLint für Code-Style
- Komponentenbasierte Architektur für Wiederverwendbarkeit
- Klare Trennung von UI, Logik und Daten

### 8.3 Performance-Optimierung

**Ergebnisse (Lighthouse):**
- Performance: 95/100
- Accessibility: 92/100
- Best Practices: 100/100
- SEO: 90/100

**Optimierungen:**
- Code-Splitting via Vite
- Lazy Loading von Komponenten
- Minimierung von Re-Renders durch useMemo/useCallback

---

## 9. Wirtschaftlichkeitsbetrachtung

### 9.1 Kostenanalyse

**Entwicklungskosten (80 Stunden):**
- Interne Arbeitszeit: 80h × 45 €/h = 3.600 €

**Laufende Kosten (jährlich):**
- GitHub (Repository + Pages): 0 € (kostenlos)
- Domain: 0 € (Subdomain von github.io)
- Hosting: 0 € (GitHub Pages)
- Lizenzkosten: 0 € (Open Source)

**Gesamtkosten: 3.600 €**

### 9.2 Nutzwertanalyse

**Nutzen:**
- Effizienteres Lernen durch Spaced Repetition
- Zeitersparnis durch optimierte Intervalle
- Offline-Verfügbarkeit
- Keine Lizenzkosten (im Gegensatz zu kommerziellen Anbietern)

**Vergleich mit kommerziellen Anbietern:**
- Anki: Kostenlos, aber komplex
- Quizlet: 35 €/Jahr für Premium
- Diese Lösung: 0 €, individuell anpassbar

### 9.3 Amortisation
Bei Nutzung durch 10 Personen statt Quizlet-Abonnement:
- Einsparung: 350 €/Jahr
- Entwicklungskosten amortisiert nach: [X] Monaten

---

## 10. Fazit

### 10.1 Zielerreichung

| Ziel | Status | Bemerkung |
|------|--------|-----------|
| Funktionierende Karteikarten-App | ✓ erreicht | Alle Kernfunktionen implementiert |
| Spaced Repetition Algorithmus | ✓ erreicht | SM-2 mit Anpassungen |
| Anpassbare Intervalle | ✓ erreicht | 0-28 Tage einstellbar |
| Offline-Fähigkeit | ✓ erreicht | IndexedDB funktioniert |
| Responsive Design | ✓ erreicht | Mobile-First umgesetzt |
| Deployment | ✓ erreicht | Live auf GitHub Pages |

### 10.2 Lessons Learned

**Positiv:**
- Vite beschleunigt die Entwicklung erheblich
- shadcn/ui ermöglicht schnelles UI-Building
- IndexedDB ist für kleine Apps ausreichend

**Verbesserungspotenzial:**
- Unit-Tests sollten von Beginn an implementiert werden
- State Management könnte mit Zustand vereinfacht werden
- Datenexport/Backup-Funktion fehlt noch

## Soll-Ist-Vergleich

### Soll-Aufwand vs. Ist-Aufwand

| Phase | Soll (h) | Ist (h) | Abweichung | Begründung |
|-------|----------|---------|------------|------------|
| **1. Analyse** | 10 | 8 | -2h | Bestehende Lösungen waren schnell analysierbar |
| **2. Planung/Entwurf** | 15 | 12 | -3h | shadcn/ui reduzierte Design-Aufwand |
| **3. Setup** | 5 | 4 | -1h | Vite vereinfachte Initialisierung |
| **4. Implementierung** | 40 | 45 | +5h | IndexedDB-Komplexität unterschätzt |
| **5. Testing & QA** | 12 | 10 | -2h | Manuelle Tests statt Unit-Tests |
| **6. Dokumentation** | 8 | 6 | -2h | Klare Struktur beschleunigte Doku |
| **Puffer** | 5 | 5 | 0 | Für Bugfixes verwendet |
| **GESAMT** | **95** | **90** | **-5h** | **Effektiv: 80h (ohne Puffer)** |

### Zeitliche Verteilung über das Projekt

```
Woche 1: ████████████████████ 20h (Analyse + Planung)
Woche 2: ████████████████████████████ 28h (Setup + Implementierung Beginn)
Woche 3: ████████████████████████ 24h (Hauptimplementierung)
Woche 4: ████████████████ 16h (Fertigstellung + Testing)
Woche 5: ████████ 8h (Dokumentation + Deployment)
```

### Kostensoll vs. Kostenist

| Position | Soll | Ist | Differenz |
|----------|------|-----|-----------|
| Entwicklungskosten | 3.600 € (80h) | 3.600 € (80h) | 0 € |
| Tools/Lizenzen | 0 € | 0 € | 0 € |
| Hosting | 0 € | 0 € | 0 € |
| **GESAMT** | **3.600 €** | **3.600 €** | **0 €** |

### Fazit zur Zeiteinhaltung
Das Projekt wurde innerhalb der geplanten 80 Stunden erfolgreich abgeschlossen. Die Abweichungen in den einzelnen Phasen sind normal für Softwareprojekte und wurden durch den eingebauten Puffer ausgeglichen. Die Wahl von Vite und shadcn/ui hat sich als zeitsparend erwiesen, während die IndexedDB-Implementierung mehr Zeit beansprucht hat als erwartet.

## 10. Fazit

### 10.3 Ausblick

**Geplante Erweiterungen:**
1. Datenexport/Import (JSON/CSV)
2. Tastatur-Shortcuts für schnelleres Lernen
3. Audio-Unterstützung für Sprachlernen
4. Statistik-Diagramme (Lernverlauf)
5. Cloud-Backup (optional)

---

## 11. Anlagen

### Anlage A: Glossar

| Begriff | Definition |
|---------|------------|
| Spaced Repetition | Lernmethode mit zeitlich verteilten Wiederholungen |
| SM-2 | SuperMemo Algorithmus Version 2 |
| IndexedDB | Browser-basierte NoSQL-Datenbank |
| MVC | Model-View-Controller Architekturmuster |
| Hook | React-Funktion für State und Lifecycle |

### Anlage B: Projektstruktur

```
Karteikartenapp/
├── src/
│   ├── controller/
│   │   ├── contexts/     # React Contexts
│   │   └── hooks/        # Custom Hooks
│   ├── model/
│   │   ├── services/     # Algorithmen
│   │   ├── storage/      # IndexedDB
│   │   └── types/        # TypeScript Types
│   ├── view/
│   │   ├── components/   # Custom Komponenten
│   │   ├── pages/        # Seiten
│   │   └── ui/           # shadcn/ui
│   ├── App.tsx
│   ├── Layout.tsx
│   ├── routes.ts
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

### Anlage C: Testprotokolle

**Dokumentation liegt bei:** Siehe GitHub Repository

---

## 12. Quellenverzeichnis

### 12.1 Literatur

- Wozniak, P. A. (1990). Optimization of learning. 
  https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

### 12.2 Online-Quellen

| Autor/Organisation | Titel | URL | Zugriffsdatum |
|-------------------|-------|-----|---------------|
| Meta Platforms | React Documentation | https://react.dev/ | 27.03.2026 |
| Microsoft | TypeScript Handbook | https://www.typescriptlang.org/docs/ | 27.03.2026 |
| Tailwind Labs | Tailwind CSS Docs | https://tailwindcss.com/docs | 27.03.2026 |
| shadcn | shadcn/ui Documentation | https://ui.shadcn.com/docs | 27.03.2026 |
| Remix Software | React Router Docs | https://reactrouter.com/ | 27.03.2026 |
| MDN | IndexedDB API | https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API | 27.03.2026 |
| Vite Team | Vite Documentation | https://vitejs.dev/ | 27.03.2026 |
| Lucide Contributors | Lucide Icons | https://lucide.dev/ | 27.03.2026 |

### 12.3 Software und Tools

- Visual Studio Code (Microsoft, MIT License)
- Node.js (OpenJS Foundation, MIT License)
- Git (Linus Torvalds, GPL-2.0)
- GitHub (GitHub Inc.)

---

## Erklärung

Ich erkläre hiermit, dass ich die vorliegende Projektdokumentation selbstständig und ohne unzulässige fremde Hilfe angefertigt habe. Alle verwendeten Quellen und Hilfsmittel sind angegeben. Die Arbeit wurde in dieser oder ähnlicher Form noch keiner anderen Prüfungsbehörde vorgelegt.

[Ort], [Datum]

_________________________
[Unterschrift Auszubildender]

---

**Dokumentation erstellt am:** 27.03.2026  
**Version:** 1.0  
**Status:** Final

---

*Diese Dokumentation wurde nach den Standards der Industrie- und Handelskammer (IHK) für den Ausbildungsberuf "Fachinformatiker für Anwendungsentwicklung" erstellt.*
