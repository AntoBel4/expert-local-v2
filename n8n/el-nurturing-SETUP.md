# EL — Nurturing Prospects Froids — Guide de Setup

## Vue d'ensemble

Deux workflows n8n indépendants :
- **Workflow 1** `el-nurturing-import-j0.json` — Import CSV → filtre score ≥ 5 → dédup Notion → Brevo J0
- **Workflow 2** `el-nurturing-relances-quotidiennes.json` — Tourne chaque jour à 9h → envoie J+2 et J+5 automatiquement

Séquence : **J0 · J+2 · J+5**
Expéditeur : **no-reply@expert-local.fr**
Seuil : **score ≥ 5** (priorité haute 🔥 + priorité moyenne ⚡)

---

## Étape 1 — Créer la base Notion "Prospects Froids"

1. Dans Notion, créer une **nouvelle base de données pleine page**
2. Nom : `Prospects Froids Expert-Local`
3. Copier l'ID de la base (dans l'URL : `notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
4. Remplacer `A_REMPLIR_NOTION_DB_PROSPECTS` dans les deux workflows JSON

### Propriétés à créer (dans l'ordre)

| Nom exact | Type | Valeurs Select |
|---|---|---|
| `Nom Commerce` | **Title** (défaut) | — |
| `Email` | **Email** | — |
| `Téléphone` | **Phone Number** | — |
| `Score` | **Number** | Format : Nombre |
| `Score Label` | **Select** | 🔥 Priorité haute · ⚡ Priorité moyenne · 👀 À surveiller · ❄️ Peu prioritaire |
| `Commune` | **Rich Text** | — |
| `Activité` | **Rich Text** | — |
| `Note Google` | **Number** | Format : Nombre |
| `Nb Avis` | **Number** | Format : Nombre |
| `Site Web` | **URL** | — |
| `Google Maps URL` | **URL** | — |
| `Source` | **Select** | webapp_prospection · formulaire_site |
| `Statut` | **Select** | J0 - En cours · **J0 - Envoyé** · **J2 - Envoyé** · Séquence terminée · Pas d'email · Intéressé · À rappeler |
| `Date Import` | **Date** | — |
| `Date J0` | **Date** | — |
| `Date J2 Due` | **Date** | — |
| `Date J5 Due` | **Date** | — |
| `Notes` | **Rich Text** | — |

> ⚠️ Les noms de propriétés doivent être **exactement** ceux ci-dessus (accents inclus).

---

## Étape 2 — Configurer Brevo

### 2a — Valider l'expéditeur no-reply@expert-local.fr

1. Brevo → **Expéditeurs & IP** → Ajouter un expéditeur
2. Nom affiché : `Antoine — Expert Local`
3. Email : `no-reply@expert-local.fr`
4. Valider via DNS (ajouter l'enregistrement SPF/DKIM indiqué par Brevo)
5. Attendre la validation (5 à 30 min)

> Note : `contact@expert-local.fr` est déjà validé DKIM. Si `no-reply` pose problème, utiliser `contact@expert-local.fr` provisoirement en attendant.

### 2b — Créer les 3 templates transactionnels

#### Template 5 — J0 (premier contact)

- **Nom** : `EL - Prospection - J0 - Analyse Google`
- **Sujet** : `{{params.NOM_COMMERCE}} : j'ai analysé votre fiche Google`
- **Corps (HTML à personnaliser)** :

```html
<p>Bonjour,</p>

<p>Je me permets de vous contacter suite à une analyse des fiches Google des
{{params.ACTIVITE}} de {{params.COMMUNE}}.</p>

<p>J'ai regardé votre fiche <strong>{{params.NOM_COMMERCE}}</strong> et j'ai
relevé quelques points qui méritent attention :</p>

<ul>
  <li>Note actuelle : <strong>{{params.NOTE_GOOGLE}}/5</strong>
      avec <strong>{{params.NB_AVIS}} avis</strong></li>
  <li>Score de vulnérabilité concurrentielle : <strong>{{params.SCORE}}/10</strong></li>
</ul>

<p>En 2026, les commerces avec moins de visibilité Google perdent en moyenne
18 clients par mois face à leurs concurrents mieux notés.</p>

<p>Je propose un <strong>diagnostic gratuit personnalisé</strong> — 60 secondes,
sans engagement — qui vous donnera vos 3 actions prioritaires.</p>

<p><a href="https://expert-local.fr/#diagnostic" style="background:#E67E22;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
Recevoir mon diagnostic gratuit →</a></p>

<p>Cordialement,<br>Antoine Estarellas<br>Expert Local — Visibilité Google locale</p>
```

#### Template 6 — J+2 (relance 1)

- **Nom** : `EL - Prospection - J2 - Relance`
- **Sujet** : `Avez-vous eu le temps de jeter un œil ?`
- **Corps** :

```html
<p>Bonjour,</p>

<p>Je me permets de revenir vers vous concernant <strong>{{params.NOM_COMMERCE}}</strong>.</p>

<p>Mon message de l'avant-hier est peut-être passé inaperçu. En 2 minutes,
vous pouvez savoir exactement ce qui freine votre visibilité Google
face à vos concurrents de {{params.COMMUNE}}.</p>

<p><a href="https://expert-local.fr/#diagnostic">Diagnostic gratuit — 60 secondes →</a></p>

<p>Cordialement,<br>Antoine</p>
```

#### Template 7 — J+5 (relance finale)

- **Nom** : `EL - Prospection - J5 - Final`
- **Sujet** : `Dernière chance — diagnostic offert pour {{params.NOM_COMMERCE}}`
- **Corps** :

```html
<p>Bonjour,</p>

<p>C'est mon dernier message concernant <strong>{{params.NOM_COMMERCE}}</strong>.</p>

<p>Si ce n'est pas le bon moment, je comprends tout à fait. Mais sachez que
le diagnostic gratuit reste disponible dès que vous le souhaitez :</p>

<p><a href="https://expert-local.fr/#diagnostic">expert-local.fr/#diagnostic</a></p>

<p>Bonne continuation,<br>Antoine</p>
```

### 2c — Récupérer les IDs de templates

Après création : Brevo → **Templates** → noter les IDs (3 chiffres)
Remplacer dans les workflows : `A_REMPLIR_TEMPLATE_J0`, `A_REMPLIR_TEMPLATE_J2`, `A_REMPLIR_TEMPLATE_J5`

### 2d — Récupérer la clé API Brevo

Brevo → **SMTP & API** → **Clés API** → copier la clé
Remplacer `A_REMPLIR_BREVO_API_KEY` dans les deux workflows

---

## Étape 3 — Importer les workflows dans n8n

1. n8n → **Workflows** → **Import** → sélectionner `el-nurturing-import-j0.json`
2. Répéter pour `el-nurturing-relances-quotidiennes.json`
3. Dans chaque workflow, vérifier que les credentials Notion `FJbYvS2QHuscfm50` sont bien sélectionnés (les mêmes que post-achat)

---

## Étape 4 — Activer le Workflow 2

Le Workflow 2 (relances quotidiennes) doit être **activé en production**.
Le Workflow 1 reste en mode webhook (actif automatiquement dès activation).

---

## Étape 5 — Déclencher une première importation

### Option A — Depuis la webapp (JSON)

Appeler le webhook avec les prospects filtrés :

```bash
curl -X POST https://prospect.estarellas.online/webhook/el-nurturing-import \
  -H "Content-Type: application/json" \
  -d '{
    "prospects": [
      {
        "nom_entreprise": "GOHON ENERGIES",
        "commune": "Chartres",
        "email": "contact@gohonchauffage.fr",
        "telephone": "0237216097",
        "score_priorite": 8,
        "score_label": "🔥 Priorité haute",
        "note_google": 3.0,
        "nb_avis": 16,
        "activite": "Plombier",
        "site_web": "http://www.gohonchauffage.fr/"
      }
    ]
  }'
```

### Option B — Depuis un CSV exporté

```bash
CSV_CONTENT=$(cat prospects_plombier_Chartres.csv)

curl -X POST https://prospect.estarellas.online/webhook/el-nurturing-import \
  -H "Content-Type: application/json" \
  -d "{\"csv_content\": \"$CSV_CONTENT\"}"
```

---

## Récapitulatif des placeholders à remplir

| Placeholder | À remplacer par |
|---|---|
| `A_REMPLIR_NOTION_DB_PROSPECTS` | ID de la nouvelle base Notion |
| `A_REMPLIR_BREVO_API_KEY` | Clé API Brevo |
| `A_REMPLIR_TEMPLATE_J0` | ID template Brevo J0 |
| `A_REMPLIR_TEMPLATE_J2` | ID template Brevo J+2 |
| `A_REMPLIR_TEMPLATE_J5` | ID template Brevo J+5 |

---

## Architecture des statuts Notion

```
Import CSV
    ↓
[Pas d'email]      — Aucun email trouvé, à contacter par téléphone
[J0 - En cours]    — Notion créé, Brevo en cours d'envoi
[J0 - Envoyé]      — J0 envoyé, attente J+2
[J2 - Envoyé]      — J+2 envoyé, attente J+5
[Séquence terminée] — J+5 envoyé, séquence complète
[Intéressé]        — À passer manuellement si réponse positive
[À rappeler]       — À passer manuellement si demande de rappel
```

---

## Règles de déduplication

Le Workflow 1 vérifie si le **Nom Commerce** existe déjà dans la base avant création.
→ Un même commerce ne sera jamais importé deux fois, même entre deux exports CSV.

Pour forcer un réimport : supprimer la fiche dans Notion ou changer le statut manuellement.
