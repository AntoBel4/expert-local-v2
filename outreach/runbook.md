# Runbook — Pipeline Lead Generation Expert-Local.fr
> Généré le 2026-04-15 | Produit : expert-local.fr | ICP : Artisans Eure-et-Loir

---

## 1. RÉSUMÉ EXÉCUTIF (1 page)

### Diagnostic Landing Page — 3 Points Forts / 3 Risques

**POINTS FORTS**
1. **Proposition de valeur chiffrée et crédible** : "10 avis en 10 jours", "87% de réussite", "premiers résultats 24-48h" — des promesses concrètes qui coupent court aux objections de scepticisme.
2. **Tunnel de conversion bien structuré** : 3 offres en escalier (Diagnostic 0€ → Kit Express 49€ → Pack PRO 179€) avec CTA clairs à chaque étage. L'entrée gratuite (diagnostic 60 secondes) réduit la friction maximale.
3. **Ancrage psychologique fort** : l'urgence algorithmique 2026 (Local Ghost, fenêtre 48h, détection IA) crée un sentiment de FOMO légitime qui pousse à l'action immédiate.

**RISQUES**
1. **Absence de preuve sociale tierce** : les 4 cas réels sont auto-déclarés. Sans lien vers de vraies fiches Google Maps ou Trustpilot, un artisan méfiant ne peut pas vérifier — risque de taux de conversion faible post-clic.
2. **SEO blog insuffisant** : les articles manquent de meta description, de données structurées Schema.org et de maillage interne dense. Le trafic organique long-terme est sous-exploité.
3. **Pages villes inaccessibles** : `/chartres/`, `/dreux/` retournent 404. Des pages de destination géolocalisées manquantes = impossible de capter du trafic "avis google [ville]" depuis ces URLs.

### Plan d'Action 6 Étapes

| Étape | Action | Outil | Délai |
|-------|--------|-------|-------|
| 1 | Corriger les 404 des pages villes + ajouter meta description aux articles | Code (Astro) | Jour 1 |
| 2 | Enrichir les leads.csv avec emails réels via Apollo.io ou hunter.io | Apollo.io | Jour 1-2 |
| 3 | Importer leads.json dans n8n via webhook POST | n8n webhook | Jour 2 |
| 4 | Lancer séquence J0 cold email via Brevo | Brevo + n8n | Jour 3 |
| 5 | Qualifier les réponses + injecter prospects chauds dans Notion CRM | Notion API + n8n | En continu |
| 6 | Relances J+3, J+7, J+14 automatisées | n8n (workflow existant) | Automatique |

---

## 2. DÉFINITION ICP (Ideal Customer Profile)

### Profil Primaire
- **Qui** : Gérant artisan (1 personne = décideur)
- **Métier** : Plombier, Électricien, Couvreur, Chauffagiste, Menuisier, Peintre
- **Zone** : Eure-et-Loir (28) — Chartres, Dreux, Nogent-le-Rotrou, Châteaudun
- **Taille** : 1-10 salariés, CA 50k-500k€

### Signaux de Lead CHAUD (score > 85)
- 0 à 5 avis Google Maps
- Présent sur obat.fr, PagesJaunes, societe.com mais invisible sur Maps
- Site web existant (montre intention digitale)
- Entreprise > 1 an, < 10 ans (structure stable, pas encore digitalement mature)
- Métier à fort ticket (couvreur > plombier > électricien > peintre)

### Signaux de Lead TIÈDE (score 65-84)
- 6 à 15 avis Google avec note < 4.0 (problème qualitatif)
- Nouvelle entreprise (< 1 an) cherchant à construire sa réputation
- Artisan avec site web mais sans blog ni stratégie de contenu

### Disqualification
- Plus de 30 avis Google avec note > 4.5
- Franchise ou réseau national (Dépannage Rapide, etc.)
- Activité principale hors Eure-et-Loir

---

## 3. SÉQUENCE D'OUTREACH — TEMPLATES EMAIL

### Email J0 — Premier Contact (Segment URGENT/HAUTE)

**Objet A** : [Ville] — votre fiche Google Maps en 2026
**Objet B** : [Prénom], j'ai vérifié votre visibilité sur Google Maps
**Objet C** : 0 avis Google = combien de chantiers perdus cette semaine ?

```
Bonjour [Prénom / Monsieur/Madame],

En préparant une étude de marché sur les artisans [Métier] en Eure-et-Loir, je suis tombé sur votre entreprise [Nom entreprise] à [Ville].

Votre travail mérite d'être visible — mais votre fiche Google Maps compte actuellement [X] avis, ce qui vous pénalise sur les recherches locales de 2026.

83% des particuliers comparent les artisans sur Google Maps avant d'appeler. En dessous de 10 avis, l'algorithme de Google vous place hors du "Pack Local" (les 3 premiers résultats qui captent 70% des clics).

Je propose un diagnostic gratuit de 60 secondes pour vous montrer exactement :
- Où vous vous situez vs vos concurrents [Ville]
- Combien de leads vous perdez par semaine
- Si notre méthode s'applique à votre situation

→ Diagnostic gratuit ici : https://expert-local.fr

Pas de formulaire compliqué, pas d'engagement. Juste 60 secondes.

Cordialement,
Antoine Estarellas
Expert-Local.fr — Spécialiste Avis Google Maps Eure-et-Loir
```

---

### Email J+3 — Relance 1 (si pas de réponse)

**Objet** : Re : [Objet J0] — une question rapide

```
Bonjour [Prénom],

Je voulais juste m'assurer que mon message précédent n'était pas passé à la trappe.

Question directe : avez-vous eu le temps de vérifier votre fiche Google Maps cette semaine ?

Si votre réponse est "non", c'est souvent parce que c'est chronophage et qu'on ne sait pas par où commencer. C'est exactement pour ça que j'ai créé le diagnostic gratuit — 60 secondes, résultat immédiat.

Si votre réponse est "oui et ça me semble OK", je serais curieux de savoir : combien d'avis avez-vous en ce moment et quelle est votre note ?

→ https://expert-local.fr

Bonne journée,
Antoine
```

---

### Email J+7 — Relance 2 (Valeur ajoutée)

**Objet** : Ce que font vos concurrents [Ville] pour dominer Maps

```
Bonjour [Prénom],

Dernier message de ma part — je ne veux pas vous harceler.

Je voulais juste partager un chiffre : un [Métier] à [Ville] que j'accompagne est passé de 3,2 à 4,7 étoiles et a vu sa visibilité augmenter de +240% en 10 jours. Il capte maintenant en moyenne 2 chantiers supplémentaires par mois via Google Maps.

Pour un artisan avec un panier moyen de [500-2000€] par intervention, c'est 1000-4000€ de CA mensuel récurrent.

Si vous souhaitez voir si c'est possible pour vous, le diagnostic est toujours disponible et gratuit :
→ https://expert-local.fr

Sinon, bonne continuation pour votre activité — je reste disponible si votre situation évolue.

Antoine Estarellas
Expert-Local.fr
```

---

### Email J+14 — Relance 3 (Rupture)

**Objet** : Je ferme votre dossier [Ville]

```
Bonjour [Prénom],

Faute de retour de votre part, je vais clore votre dossier.

Je comprends que vous soyez débordé — c'est souvent le cas pour les artisans les plus compétents.

Si la question de votre visibilité Google Maps redevient d'actualité, je serai là :
→ https://expert-local.fr

À bientôt peut-être,
Antoine
```

---

### Message LinkedIn (alternative si email non trouvé)

```
Bonjour [Prénom],

Je travaille avec des artisans en Eure-et-Loir pour améliorer leur visibilité sur Google Maps.

En regardant votre fiche [Entreprise], j'ai remarqué que vous avez peu d'avis — ce qui peut vous coûter des chantiers chaque semaine.

J'ai créé un diagnostic gratuit de 60 secondes qui montre exactement votre positionnement vs vos concurrents locaux.

Intéressé ? Je peux vous envoyer le lien.

Antoine — Expert-Local.fr
```

---

## 4. MAPPING CRM NOTION

### Propriétés de la base "Prospects" dans Notion

| Propriété Notion | Type | Valeur exemple | Source dans leads.json |
|-----------------|------|----------------|----------------------|
| Nom | Titre | GOBERT ELECTRICITE GENERALE | company |
| Prénom décideur | Texte | (à compléter) | name |
| Email | Email | (à enrichir) | email |
| Téléphone | Téléphone | (à trouver) | — |
| Ville | Sélection | Chartres | city |
| Métier | Sélection | Électricien | trade |
| Avis Google | Nombre | 0 | google_reviews_count |
| Score | Nombre | 95 | score |
| Priorité | Sélection | URGENT / HAUTE / NORMALE | priority |
| Canal | Multi-sélection | cold_email, linkedin | outreach_channel |
| Statut pipeline | Sélection | Cold / Contacté / Répondu / Diagnostic / Client | — |
| Date J0 | Date | 2026-04-15 | — |
| Source | Texte | obat.fr/electricien | source |
| Tags | Multi-texte | électricien, 0-avis, chartres | crm_tags |
| Perso L1 | Texte long | ... | personalization.line1 |
| Perso L2 | Texte long | ... | personalization.line2 |
| Perso L3 | Texte long | ... | personalization.line3 |

### Statuts Pipeline
```
Cold → Contacté (J0) → Répondu → Diagnostic demandé → Diagnostic fait → Offre envoyée → Client → Perdu
```

---

## 5. PLAN D'AUTOMATISATION n8n

### Architecture globale

```
[leads.json] 
    → HTTP POST webhook n8n (trigger manuel ou cron)
    → Node: Notion "Create Page" (base Prospects)
    → Node: Attente délai J0 (immédiat)
    → Node: Brevo "Send Email" (template J0)
    → Node: Set status Notion → "Contacté"
    → Node: Wait 3 jours
    → Node: Check Notion status (si pas "Répondu")
    → Node: Brevo "Send Email" (template J+3)
    → Node: Wait 4 jours
    → [Répéter pour J+7 et J+14]
```

### Workflow n8n existant à réutiliser

Les fichiers suivants sont déjà présents dans `/n8n/` :
- `phase1-diagnostic-final-n8n246.json` — séquence post-diagnostic
- `el-nurturing-import-j0-final-n8n246.json` — import J0
- `el-nurturing-relances-quotidiennes-final-n8n246.json` — relances automatiques
- `phase-e2-post-achat-final-n8n246.json` — post-achat

**Action** : Créer un workflow d'injection leads → importer leads.json via webhook POST vers n8n, puis déclencher `el-nurturing-import-j0`.

### Webhook d'import (à créer dans n8n)

```
POST https://[votre-n8n]/webhook/leads-import
Content-Type: application/json

{
  "leads": [...] // contenu de leads.json > leads array
}
```

**Node n8n "Split In Batches"** → traite 1 lead à la fois → Notion API → Brevo → wait.

---

## 6. MÉTHODE D'ENRICHISSEMENT EMAIL

Ordre de priorité pour trouver l'email quand absent :

1. **Google Maps fiche** : souvent email affiché publiquement (gratuit)
2. **Site web de l'artisan** : page "Contact" ou mentions légales (RGPD impose l'email)
3. **societe.com** : SIREN → nom dirigeant → domaine email probable
4. **Hunter.io** : `hunter.io/domain-search?domain=[domaine]` (50 recherches/mois gratuit)
5. **Apollo.io** : recherche par nom entreprise + ville (plan gratuit limité)
6. **Pages Jaunes** : numéro de téléphone → appel pour email (si tout échoue)
7. **LinkedIn** : message direct si 0 email trouvé (template LinkedIn fourni ci-dessus)

### Format email artisan à deviner (si domaine trouvé)
```
contact@[domaine].fr
info@[domaine].fr
[prénom]@[domaine].fr
[prénom].[nom]@[domaine].fr
```

---

## 7. COMMANDES EXACTES À LANCER

### Étape 1 — Enrichir les emails (terminal)
```bash
# Avec Hunter.io API (remplacer YOUR_API_KEY)
# Pour chaque entreprise ayant un site web connu :
curl "https://api.hunter.io/v2/domain-search?domain=gazdepannage28.com&api_key=YOUR_API_KEY"
```

### Étape 2 — Importer dans Notion via API
```bash
# Créer une page par lead dans la base Notion
curl -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer YOUR_NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d @notion_payload.json
```

### Étape 3 — Déclencher le workflow n8n
```bash
# POST vers le webhook n8n d'import
curl -X POST https://[votre-n8n]/webhook/leads-import \
  -H "Content-Type: application/json" \
  -d @outreach/leads.json
```

### Étape 4 — Vérifier les pages villes (Astro)
```bash
cd /Expert-Local/expert-local-v2
npm run dev
# Vérifier que /chartres/, /dreux/, /nogent-le-roi/ répondent 200
```

---

## 8. CONFORMITÉ RGPD

Les emails professionnels d'artisans (B2B) sont autorisés en cold email sous réserve de :
- Mentionner dans chaque email comment vous avez trouvé le contact
- Inclure un lien de désinscription fonctionnel (Brevo le gère automatiquement)
- Cibler uniquement des professionnels (pas des particuliers)
- Conserver les preuves de source (obat.fr, societe.com, PagesJaunes)

**Template désinscription Brevo** : activé par défaut — vérifier dans les paramètres de template.

---

## 9. KPIs À SUIVRE

| KPI | Cible semaine 1 | Cible mois 1 |
|-----|----------------|--------------|
| Leads enrichis avec email | 10/20 | 20/20 |
| Taux d'ouverture J0 | > 35% | > 40% |
| Taux de clic J0 | > 5% | > 8% |
| Diagnostics demandés | 2-3 | 8-10 |
| Clients convertis | 0-1 | 2-4 |
| CA généré | 0-179€ | 500-1500€ |

---

*Runbook généré par Claude Code — expert-local-v2 — 2026-04-15*
