# 🚀 Coolify Deployment Setup für flohmarktguide

## 📋 Voraussetzungen

- [x] Coolify-Instanz läuft
- [x] GitHub-Account verbunden
- [x] Docker verfügbar
- [x] Supabase-Projekt eingerichtet

---

## 🔐 Umgebungsvariablen vorbereiten

### 1. Supabase Keys auslesen

1. Gehe zu deinem Supabase-Projekt: https://app.supabase.com
2. Klick auf **Settings** → **API**
3. Kopiere:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Site URL definieren

Wähle deine Produktions-Domain:
```
NEXT_PUBLIC_SITE_URL=https://flohmarktguide.com
```

### 3. Admin Secret generieren

```bash
# Terminal / Command Line
openssl rand -base64 32
```

Ergebnis kopieren → `ADMIN_SECRET`

---

## 🔧 Coolify Configuration

### Step 1: Neue Application erstellen

1. Coolify-Dashboard öffnen
2. **New** → **Application**
3. **Name**: `flohmarktguide`
4. **Repository**: `Elhorro/flohmarktguide`
5. **Branch**: `main`
6. **Dockerfile**: Automatisch erkannt ✓
7. **Port**: `3000`

### Step 2: Umgebungsvariablen hinzufügen

In Coolify → **Application** → **Variables** hinzufügen:

```
✓ NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIs...
✓ NEXT_PUBLIC_SITE_URL = https://flohmarktguide.com
✓ SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIs...
✓ ADMIN_SECRET = base64-generated-secret
```

**Wichtig**: Runtime-Variablen NICHT im Frontend verwenden!

### Step 3: GitHub Webhook einrichten

**Option A: Automatisch (empfohlen)**
1. Coolify → **Application** → **Webhooks**
2. "Create GitHub Webhook" klicken
3. Deploy-Token wird automatisch erstellt

**Option B: Manuell**
1. Coolify → **Application** → **Webhooks**
2. Webhook-URL kopieren
3. GitHub → **Settings** → **Webhooks** → **Add webhook**
4. Payload URL einfügen
5. **Content type**: `application/json`
6. **Events**: `Push events` ✓
7. **Active**: ✓

### Step 4: Erste Deployment starten

1. Coolify → **Application** → **Deploy**
2. Branch: `main` wählen
3. **Build & Deploy** klicken
4. Logs folgen (sollte ~3-5min dauern)

---

## ✅ Deployment verifikieren

### Logs prüfen

```bash
# In Coolify-UI:
Application → Deployments → Latest → Logs
```

Erwarteter Output:
```
compiled client and server successfully
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Health Check

URL aufrufen:
```
https://your-domain.com/
```

Sollte HTTP 200 sein ✓

---

## 🔄 Auto-Deployments testen

1. Kleine Änderung machen (z.B. README bearbeiten)
2. Commit zu `main` pushen
3. Webhook wird automatisch getriggert
4. Coolify startet neuen Deployment
5. In 2-3min live ✓

---

## 🐛 Troubleshooting

### Build Fehler: "NEXT_PUBLIC_SUPABASE_URL not set"

→ Umgebungsvariablen in Coolify fehlen  
→ **Lösung**: Variables doppelt überprüfen + Re-deploy

### Health Check schlägt fehl

→ App läuft noch nicht  
→ **Lösung**: Warte 10-15 Sekunden, dann nochmal prüfen

### GitHub Webhook triggert nicht

→ Webhook in GitHub nicht korrekt konfiguriert  
→ **Lösung**:
   1. GitHub → Settings → Webhooks → Recent Deliveries prüfen
   2. Fehler-Response lesen
   3. Webhook-URL in Coolify neu generieren

### Port wird von anderen Service genutzt

→ Port 3000 belegt  
→ **Lösung**: In Coolify anderen Port wählen (z.B. 3001)

---

## 📊 Monitoring

### CPU/Memory in Coolify überwachen

1. Coolify → **Application** → **Monitoring**
2. Graphs anschauen
3. Bei >80% CPU → Optimization nötig

### Logs regelmäßig prüfen

```bash
# Letzten 50 Zeilen anschauen
Coolify → Application → Deployments → Latest → Logs
```

---

## 🔒 Sicherheit

✓ Non-root User im Docker (uid: 1001)  
✓ `SUPABASE_SERVICE_ROLE_KEY` NUR runtime  
✓ `ADMIN_SECRET` per OpenSSL generiert  
✓ Health Checks aktiviert  
✓ Auto-Restart bei Crash

---

## 🎉 Fertig!

Dein **flohmarktguide** läuft jetzt auf Coolify! 🚀

Bei Fragen: [Coolify Docs](https://coolify.io) oder [Next.js Docs](https://nextjs.org)
