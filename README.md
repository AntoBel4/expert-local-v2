# Expert-Local.fr v2 — Visibilité Locale

Système commercial automatisé pour commerçants et artisans locaux.  
Funnel complet : Diagnostic gratuit → Kit Express 49€ → Pack PRO 179€ → VIP 497€/mois.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Astro (SSG) + Vanilla CSS |
| Hébergement | Netlify |
| Paiement | Stripe Checkout + Webhooks |
| Automatisations | n8n (self-hosted) |
| Email | Brevo API |
| CRM | Notion |
| Scraping | Apify |
| IA | Gemini API |

## Structure du repo

```
expert-local-v2/
├── src/
│   ├── layouts/         → BaseLayout (SEO, Header, Footer)
│   ├── pages/           → Pages Astro (index, légales, funnel)
│   ├── components/      → Composants réutilisables (Hero, Form, etc.)
│   ├── styles/          → Design System CSS (global.css)
│   └── scripts/         → JS client (formulaire, checkout, animations)
├── public/              → Assets statiques (images, favicon, robots.txt)
├── n8n/                 → Workflows n8n exportés (JSON)
├── emails/              → Templates emails HTML (Brevo)
├── docs/                → Documentation technique
├── netlify.toml         → Configuration déploiement + headers sécurité
└── .env.example         → Variables d'environnement documentées
```

## Démarrage rapide

```bash
# Prérequis : Node.js >= 18

# Installation
npm install

# Développement local (http://localhost:4321)
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

## Phases de reconstruction

| Phase | Contenu | Statut |
|---|---|---|
| **A** | Fondations (Astro, Design System, Layout, Légales) | ✅ Terminée |
| **B** | Acquisition (Landing page, SEO local) | ⬜ Prochaine |
| **C** | Capture → n8n (Formulaire → Webhook) | ⬜ |
| **D** | Monétisation (Stripe, Checkout, Upsell) | ⬜ |
| **E** | Espace Client (Kit 49€, Order Bump) | ⬜ |
| **F** | Automatisation (n8n Webhooks, Brevo, Relances) | ⬜ |
| **G** | Documentation complète | ⬜ |

## ⚠️ Pages légales — Validation requise

Les pages CGV, Mentions Légales et Politique de Confidentialité sont des **versions provisoires**.

**Avant toute mise en ligne publique, les éléments suivants doivent être complétés :**

- Numéro SIRET de Studio Estarellas
- Adresse du siège social
- Validation juridique du contenu des CGV (droit de rétractation, clause de responsabilité)

> Ces pages affichent un bandeau d'avertissement visible tant qu'elles n'ont pas été finalisées.

## Contact

Studio Estarellas — contact.expertlocal@gmail.com
