/*
  # Flohmärkte Tabelle erstellen

  ## Überblick
  Erstellt die Haupttabelle für den Flohmarkt-Kalender.

  ## Neue Tabellen
  - `flohmärkte`
    - `id` (uuid, primary key)
    - `titel` (text) - Name des Flohmarkts
    - `typ` (text) - Art: Flohmarkt, Fetzenmarkt, Hausflohmarkt, Antikmarkt
    - `datum` (date) - Datum der Veranstaltung
    - `uhrzeit_start` (time) - Startzeit
    - `uhrzeit_ende` (time) - Endzeit
    - `adresse` (text) - Straße und Hausnummer
    - `stadt` (text) - Stadt/Gemeinde
    - `beschreibung` (text) - Beschreibungstext
    - `kontakt` (text, nullable) - Kontaktinformationen
    - `lat` (float8) - Breitengrad für Karte
    - `lng` (float8) - Längengrad für Karte
    - `freigegeben` (boolean) - Moderationsfreigabe
    - `erstellt_am` (timestamptz) - Erstellungszeitpunkt

  ## Sicherheit
  - RLS aktiviert
  - Öffentlich freigegebene Märkte sind lesbar
  - Eintragen ist ohne Login möglich (mit Moderationspflicht)

  ## Seed-Daten
  - 15 Beispiel-Flohmärkte in der Steiermark, April–Juni 2026
*/

CREATE TABLE IF NOT EXISTS flohmärkte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel text NOT NULL,
  typ text NOT NULL CHECK (typ IN ('Flohmarkt', 'Fetzenmarkt', 'Hausflohmarkt', 'Antikmarkt')),
  datum date NOT NULL,
  uhrzeit_start time NOT NULL DEFAULT '08:00',
  uhrzeit_ende time NOT NULL DEFAULT '14:00',
  adresse text NOT NULL DEFAULT '',
  stadt text NOT NULL DEFAULT '',
  beschreibung text NOT NULL DEFAULT '',
  kontakt text,
  lat float8 NOT NULL DEFAULT 0,
  lng float8 NOT NULL DEFAULT 0,
  freigegeben boolean NOT NULL DEFAULT true,
  erstellt_am timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE flohmärkte ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freigegebene Märkte sind öffentlich lesbar"
  ON flohmärkte FOR SELECT
  USING (freigegeben = true);

CREATE POLICY "Jeder kann einen Markt eintragen"
  ON flohmärkte FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_flohmärkte_datum ON flohmärkte (datum);
CREATE INDEX IF NOT EXISTS idx_flohmärkte_freigegeben ON flohmärkte (freigegeben);

INSERT INTO flohmärkte (titel, typ, datum, uhrzeit_start, uhrzeit_ende, adresse, stadt, beschreibung, kontakt, lat, lng) VALUES
  ('Großer Frühlingsflohmarkt Graz', 'Flohmarkt', '2026-04-19', '08:00', '14:00', 'Hauptplatz 1', 'Graz', 'Der größte Flohmarkt im Herzen von Graz! Hunderte Verkäufer bieten Kleidung, Möbel, Bücher, Schmuck und allerhand Kuriositäten an. Ideal für Schnäppchenjäger und Sammler.', 'flohmärkte-graz@example.at', 47.0707, 15.4395),
  ('Flohmarkt Leibnitz', 'Flohmarkt', '2026-04-26', '09:00', '15:00', 'Marktplatz 3', 'Leibnitz', 'Gemütlicher Flohmarkt im Zentrum von Leibnitz mit regionalen Anbietern. Von Kleidung über Spielzeug bis hin zu Antiquitäten ist alles dabei.', 'info@leibnitz-markt.at', 46.7823, 15.5396),
  ('Antikmarkt Leoben', 'Antikmarkt', '2026-05-02', '10:00', '17:00', 'Kaiser-Franz-Josef-Straße 12', 'Leoben', 'Exklusiver Antikmarkt mit ausgesuchten Stücken aus vergangenen Jahrzehnten. Porzellan, Silber, alte Gemälde und nostalgische Möbel warten auf neue Besitzer.', 'antik@leoben-markt.at', 47.3867, 15.0911),
  ('Hausflohmarkt Familie Müller', 'Hausflohmarkt', '2026-04-25', '08:00', '13:00', 'Gartenstraße 7', 'Voitsberg', 'Privater Hausflohmarkt mit vielen Haushaltswaren, Gartengeräten, Kleidung (Größen 36-44) und Kindersachen. Barzahlung bevorzugt.', '+43 664 123 4567', 47.0452, 15.1472),
  ('Fetzenmarkt Hartberg', 'Fetzenmarkt', '2026-05-09', '07:00', '13:00', 'Stadtpark Allee', 'Hartberg', 'Traditioneller Fetzenmarkt in Hartberg mit über 80 Ständen. Günstige Kleidung, Stoffe und Textilien für die ganze Familie. Auch Second-Hand-Designermode zu finden!', 'fetzen@hartberg.steiermark.at', 47.2837, 15.9750),
  ('Stadtflohmarkt Bruck an der Mur', 'Flohmarkt', '2026-05-10', '08:00', '14:00', 'Koloman-Wallisch-Platz', 'Bruck an der Mur', 'Beliebter Stadtflohmarkt an der Mur mit tollem Ambiente. Viele lokale Händler und Privatpersonen bieten ihre Schätze an. Kulinarik vor Ort verfügbar.', 'stadtflohmarkt@bruckmur.at', 47.4103, 15.2703),
  ('Flohmarkt Kapfenberg', 'Flohmarkt', '2026-05-16', '09:00', '15:00', 'Marktgasse 1', 'Kapfenberg', 'Monatlicher Flohmarkt in der Innenstadt von Kapfenberg. Immer neue Überraschungen – von Vintage-Schallplatten bis zu modernen Gebrauchtwaren.', 'kapfenberg@flohmarkt.at', 47.4429, 15.2919),
  ('Antikmarkt Judenburg', 'Antikmarkt', '2026-05-17', '10:00', '18:00', 'Herrengasse 5', 'Judenburg', 'Stöbern in der Geschichte: Antikmarkt mit Raritäten aus der Region. Alte Landkarten, Bücher, Porzellan und Dekorationsobjekte aus vergangenen Jahrhunderten.', 'antik.judenburg@example.at', 47.1688, 14.6611),
  ('Frühjahrsflohmarkt Weiz', 'Flohmarkt', '2026-05-23', '08:00', '14:00', 'Birkfelder Straße 2', 'Weiz', 'Der Frühjahrsflohmarkt in Weiz lockt mit einem breiten Angebot: Elektronikartikel, Sportgeräte, Bücher und Kindersachen zu fairen Preisen.', 'flohmarkt.weiz@gmx.at', 47.2167, 15.6167),
  ('Hausflohmarkt Reiter', 'Hausflohmarkt', '2026-05-24', '08:00', '12:00', 'Bergstraße 22', 'Knittelfeld', 'Wir räumen aus! Hausrat, Werkzeug, Gartengeräte, Bücher und einiges mehr. Alles gut erhalten. Keine Voranmeldung nötig, einfach vorbeikommen!', '+43 676 987 6543', 47.2167, 14.8333),
  ('Fetzenmarkt Feldbach', 'Fetzenmarkt', '2026-05-30', '08:00', '13:00', 'Ringstraße 10', 'Feldbach', 'Riesen-Fetzenmarkt im Feldbacher Stadtpark. Kleidung für alle Altersgruppen zu Bestpreisen. Ideal zum Upcycling und für Kostümsuche. Kaffee & Kuchen vor Ort.', 'stadtamt@feldbach.gv.at', 46.9529, 15.8892),
  ('Flohmarkt Deutschlandsberg', 'Flohmarkt', '2026-05-31', '09:00', '15:00', 'Hauptstraße 45', 'Deutschlandsberg', 'Charmanter Flohmarkt in der malerischen Stadtgemeinde Deutschlandsberg. Viele lokale Familien bieten Spielzeug, Kleidung und Haushaltswaren an. Kinderfreundlich!', 'markt@deutschlandsberg.at', 46.8167, 15.2167),
  ('Antikmarkt Murau', 'Antikmarkt', '2026-06-06', '10:00', '17:00', 'Schillerstraße 3', 'Murau', 'Romantischer Antikmarkt in der Holzstadt Murau. In historischer Kulisse werden Möbel, Keramik, alte Werkzeuge und regionale Kunstgegenstände angeboten.', 'tourismus@murau.at', 47.1081, 14.1736),
  ('Flohmarkt Fürstenfeld', 'Flohmarkt', '2026-06-07', '08:00', '14:00', 'Grazer Straße 8', 'Fürstenfeld', 'Großer Flohmarkt im Osten der Steiermark. Über 100 Standplätze mit allem was das Herz begehrt. Besonders gutes Angebot an Vintage-Kleidung und Retro-Elektronik.', 'info@fuerstenfeld-markt.at', 47.0500, 16.0833),
  ('Sommerflohmarkt Bad Aussee', 'Flohmarkt', '2026-06-13', '09:00', '16:00', 'Kurhausplatz 1', 'Bad Aussee', 'Sommerlicher Flohmarkt im Salzkammergut-Juwel Bad Aussee. Regionaler Schmuck, Trachtenmode und Kuriositäten in wunderschöner Naturkulisse. Perfekt als Ausflugsziel!', 'tourismus@badaussee.at', 47.6099, 13.7827);
