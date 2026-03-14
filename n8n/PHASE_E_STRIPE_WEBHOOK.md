# Phase E1 - Branchement Stripe vers n8n

Ce document détaille la procédure stricte pour brancher de manière sécurisée les paiements Stripe vers l'automatisation n8n, sans introduire de complexité inutile. Ceci constitue le socle de la Phase E.

## Aperçu de l'Architecture V1

- **Déclencheur** : Un achat validé sur le compte Stripe (via une Checkout Session générée par le site).
- **Événement unique écouté** : `checkout.session.completed` (fiabilité maximale).
- **Point de réception** : Un nœud **Webhook** n8n public.
- **Sécurité** : Contrôle cryptographique strict via l'Authentification Webhook Stripe native dans n8n en utilisant la signature secrète (`whsec_...`).

## Protocole de mise en place (Socle E1)

### Étape 1 : Création du Endpoint n8n stable
1. Dans n8n, créer un nouveau fichier de workflow pour la Phase E.
2. Ajouter le nœud **Webhook** et le configurer pour la "Production" (URL stable, pas d'URL Test temporaire).
3. Configurer le nœud :
   - *HTTP Method* : `POST`
   - *Path* : `stripe-post-achat`
   - *Respond* : `Immediately` avec un code `200` et un body vide (Stripe exige une réponse rapide).
4. **Sécurité :** Sous l'onglet Authentification de ce nœud, sélectionner **Stripe**. 
   - Vous devrez créer des Credentials (identifiants) dans n8n de type *Stripe Webhook API*.
   - Laisser le champ `Secret` vide pour le moment.
5. Copier l'**URL du Webhook de Production** générée par n8n (ex: `https://votre-n8n.com/webhook/stripe-post-achat`). **Il s'agit d'un endpoint actif et durable, qui sera utilisé même pour les tests Stripe en mode test.**
6. **Activer le workflow** dans n8n (le passer en "Active") pour que le webhook de production écoute en permanence.

### Étape 2 : Configuration côté Stripe
1. Se connecter au Dashboard Stripe (en mode **Test** pour commencer).
2. Naviguer vers Développeurs > Webhooks > **Ajouter un endpoint**.
3. **Endpoint URL** : Coller l'URL publique et stable du Webhook de Production n8n.
4. **Événements à écouter** : Sélectionner uniquement `checkout.session.completed`.
5. Cliquer sur "Ajouter", et Stripe affichera le **Secret de signature** (commençant par `whsec_...`).

### Étape 3 : Bouclage de la sécurité
1. Copier le Secret `whsec_...` depuis Stripe.
2. Retourner dans n8n, dans les Credentials *Stripe Webhook API* créés à l'Étape 1.
3. Coller ce Secret. Sauvegarder.
   > *Note : Cette étape assure que n8n rejettera automatiquement toute requête HTTP vers cette URL qui ne provient pas légitimement de Stripe.*

## Séparation des Environnements et Variables

**Important :** Il faut strictement séparer les variables propres au projet Astro/Netlify et les variables propres à n8n.

### Variables n8n (à configurer dans l'instance n8n uniquement)
- **`STRIPE_WEBHOOK_SECRET`** (`whsec_...`) : Fourni par Stripe à la création du webhook. **Ce secret ne doit JAMAIS être ajouté au projet Astro/Netlify.** Il appartient exclusivement à n8n pour valider la signature de Stripe.
- **`STRIPE_SECRET_KEY`** (`sk_test_...` / `sk_live_...`) : Utilisée par le nœud HTTP n8n pour lire les détails de la session.
- **`NOTION_API_KEY`** et **`BREVO_API_KEY`** : Utilisées pour le post-achat.

### Variables Astro/Netlify (déjà en place, inchangées)
- Le projet web a uniquement besoin de la clé publique Stripe (`pk_...`) et de la clé secrète (`sk_...`) pour *créer* le paiement (Phase D2).
- Il n'a aucune connaissance du `STRIPE_WEBHOOK_SECRET` ni de l'URL du webhook post-achat.

## Consignes pour la suite (Phase E2)

L'implémentation métier et le routage interviendront au sein de ce même workflow n8n activé en Phase E2, selon la logique validée :
- Un nœud API Stripe pour récupérer l'objet session frais (`GET /sessions/`).
- Un Switch basé sur les métadonnées (`type_achat`).
- Un verrouillage d'idempotence via Notion.

Aucun développement supplémentaire sur le code Astro / Netlify n'est requis.
