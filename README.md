# TMP — Tommy Möller Partei | Website

Website der TMP, gehostet über GitHub Pages, mit einer Supabase-Datenbank im Hintergrund für Shop, Themen und Aktuelles. Dadurch lassen sich Texte, Bilder und Artikel jederzeit über die Admin-Seite ändern — **ohne** dass dafür etwas bei GitHub hochgeladen werden muss.

**Live:** `https://<dein-github-name>.github.io/TMP/`
**Admin:** `https://<dein-github-name>.github.io/TMP/admin.html`

## Wie die Seite aufgebaut ist

```
.
├── index.html                Startseite (statisch)
├── ueber-uns.html             Über die Partei und den Gründer (statisch)
├── themen.html                Themen-Übersicht — lädt Hauptpunkte aus Supabase
├── thema.html                 Ein Hauptpunkt + seine Artikel (per ?slug=…)
├── aktuelles.html              Blog-Übersicht — lädt Beiträge aus Supabase
├── beitrag.html                Ein Blog-Beitrag (per ?slug=…)
├── shop.html                   Shop mit Warenkorb — lädt Produkte aus Supabase
├── admin.html                  Admin-Login + Verwaltung (Produkte, Themen, Aktuelles)
├── mitglied-werden.html        Eintrittsformular als PDF-Download (statisch)
├── kontakt.html                 Kontaktangaben (statisch)
├── impressum.html               Impressum (Platzhalter, statisch)
├── datenschutz.html             Datenschutzerklärung (Platzhalter, statisch)
├── styles.css                   Gemeinsames Stylesheet aller Seiten
├── supabase-config.js            Supabase-URL + anon-Key (hier eintragen!)
├── dokumente/
│   └── eintrittsformular-tmp.pdf
└── supabase/
    ├── setup/schema.sql          Datenbank-Struktur + Startinhalte
    └── functions/
        └── bestellung-senden/index.ts   Edge Function für Bestell-E-Mails
```

Seiten ohne Datenbank-Anbindung (Start, Über uns, Mitglied werden, Kontakt, Impressum, Datenschutz) bleiben einfaches HTML, das du wie bisher direkt in den Dateien bearbeitest. Shop, Themen und Aktuelles beziehen ihre Inhalte zur Laufzeit aus Supabase.

## Einmalige Einrichtung: Supabase

### 1. Projekt anlegen
Auf [supabase.com](https://supabase.com) kostenlos ein neues Projekt anlegen (oder ein bestehendes wiederverwenden — dann nur die Tabellen aus Schritt 2 zusätzlich anlegen).

### 2. Datenbank-Struktur einspielen
Im Supabase-Dashboard → **SQL Editor** → den kompletten Inhalt von `supabase/setup/schema.sql` einfügen und ausführen. Das legt alle Tabellen, Zugriffsrechte (Row Level Security) und die bisherigen Inhalte (3 Produkte, 4 Themen-Hauptpunkte, 1 Blogbeitrag) an.

### 3. API-Zugangsdaten eintragen
Unter **Project Settings → API**: `Project URL` und `anon public` Key kopieren und in `supabase-config.js` eintragen:

```js
const SUPABASE_URL = "https://dein-projekt.supabase.co";
const SUPABASE_ANON_KEY = "dein-anon-key";
```

### 4. Speicher (Storage) für Bilder anlegen
**Storage → New bucket** → Name `bilder`, Häkchen bei **Public bucket** setzen. Damit können Admin-Uploads (Produktfotos, Themenbilder, Blogbilder) über die Website ausgeliefert werden.

### 5. Admin-Zugang anlegen
**Authentication → Users → Add user** → deine E-Mail-Adresse und ein Passwort vergeben (Häkchen bei „Auto Confirm User" setzen, damit keine Bestätigungsmail nötig ist). Mit diesen Zugangsdaten meldest du dich später unter `admin.html` an. Es müssen keine weiteren Nutzer angelegt werden — jeder eingeloggte Nutzer gilt laut den Datenbank-Regeln als Admin, daher nur vertrauenswürdige Zugänge anlegen.

### 6. Bestell-E-Mails einrichten (Shop)

Der Versand läuft über dein bestehendes Gmail-Konto per SMTP — kein zusätzliches Konto nötig.

1. **Zweistufige Bestätigung (2FA)** in deinem Google-Konto aktivieren, falls noch nicht geschehen — App-Passwörter funktionieren nur damit. Unter [myaccount.google.com/security](https://myaccount.google.com/security) einrichten.
2. Unter [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) ein neues App-Passwort erzeugen (App-Name z. B. „TMP Shop"). Google zeigt ein 16-stelliges Passwort — das brauchst du im nächsten Schritt (Leerzeichen darin einfach weglassen).
3. In Supabase unter **Edge Functions → Secrets** drei Werte hinterlegen:
   - `GMAIL_ADRESSE` — deine Gmail-Adresse, die als Absender auftritt
   - `GMAIL_APP_PASSWORT` — das erzeugte 16-stellige App-Passwort
   - `BESTELL_EMPFAENGER` — Zieladresse für Bestellungen (kann identisch mit `GMAIL_ADRESSE` sein)
4. Die Function deployen (einmalig die [Supabase CLI](https://supabase.com/docs/guides/cli) installieren):
   ```bash
   supabase login
   supabase link --project-ref DEIN-PROJEKT-REF
   supabase functions deploy bestellung-senden
   ```
5. Testbestellung im Shop auslösen — die E-Mail kommt direkt von deiner Gmail-Adresse. Gmail begrenzt den Versand auf 500 E-Mails/Tag — für den TMP-Shop mehr als ausreichend.

Damit ist alles eingerichtet — Shop, Themen und Aktuelles sind ab sofort live über `admin.html` pflegbar, ganz ohne GitHub.

## Admin-Seite benutzen

Unter `admin.html` anmelden (E-Mail/Passwort aus Schritt 5). Drei Reiter:

- **Shop-Produkte** — Name, Beschreibung, Preis, Bild, Reihenfolge, sichtbar/ausgeblendet.
- **Themen** — Hauptpunkte (Wirtschaft, Wohnen, …) anlegen; darunter direkt die zugehörigen Artikel mit Text und Bild verwalten.
- **Aktuelles** — Blogbeiträge mit Titel, Datum, Teaser, Volltext (Absätze durch eine Leerzeile trennen) und Bild.

Der „Admin"-Link steht diskret im Footer jeder Seite. Die Seite ist per `noindex`-Meta-Tag von Suchmaschinen ausgeschlossen, aber **nicht** durch ein eigenes Zugriffsrecht auf HTML-Ebene geschützt — die eigentliche Absicherung übernehmen die Supabase-Login-Pflicht und die Datenbank-Regeln (nur eingeloggte Nutzer dürfen schreiben).

## Lokal ansehen

```bash
python3 -m http.server 8000
```
und `http://localhost:8000` öffnen. Die Supabase-Anbindung funktioniert auch lokal, sobald `supabase-config.js` ausgefüllt ist.

## Deployment (GitHub Pages)

1. Repository-Einstellungen → **Pages**.
2. Branch `main`, Ordner `/ (root)` auswählen, speichern.
3. Nach 1–2 Minuten ist die Seite live. Der `supabase`-Ordner mit SQL-Datei und Edge-Function-Code kann mit hochgeladen werden — er wird von GitHub Pages einfach ignoriert (keine `.html`-Datei), schadet also nicht.

## Vor der Veröffentlichung noch offen

- **`impressum.html`** / **`datenschutz.html`** — Platzhalter in eckigen Klammern ausfüllen, ggf. rechtlich prüfen lassen.
- **E-Mail-Adressen** — `kontakt@tmp-partei.de` (Kontakt- und Mitgliedsseite) ersetzen.
- **`supabase-config.js`** — echte Projekt-URL und Key eintragen (siehe oben).
- **Gmail-App-Passwort** — falls sich die Bestell-Mails nicht senden lassen, prüfen ob 2FA aktiv ist und das App-Passwort korrekt (ohne Leerzeichen) hinterlegt wurde.

## Offene Ideen für den weiteren Ausbau

- Vollständiges Wahlprogramm als PDF zusätzlich zu den Themen-Artikeln verlinken
- Bestellstatus (offen/versendet) direkt im Admin-Bereich pflegen, inklusive Liste aller eingegangenen Bestellungen
- Echter Bezahlvorgang (z. B. Stripe Payment Links) statt reiner Bestell-Benachrichtigung
- Jotform- oder Supabase-Formular für einen direkt online ausfüllbaren Mitgliedsantrag
- Mobile Navigation als ausklappbares Menü
- Eigene Domain statt `github.io`-Adresse

## Lizenz / Kontakt

Interne Projektseite von TMP. Fragen zur Website an [kontakt@tmp-partei.de](mailto:kontakt@tmp-partei.de).
