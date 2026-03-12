# HANDOFF CLAUDE — Expert-Local v2

## 1. Objectif
Ce projet vise à reconstruire proprement le funnel Expert-Local.fr autour de :
- une landing page moderne,
- un diagnostic gratuit,
- un checkout Stripe,
- un order bump,
- un upsell PRO,
- un workflow post-achat n8n,
- une base Notion CRM dédiée,
- des emails transactionnels via Brevo.

## 2. Repo de référence
Repo GitHub source de vérité :
- `expert-local-v2`

Le repo a été poussé depuis le poste local portable après plusieurs phases de travail avec Antigravity et des corrections manuelles supervisées.

## 3. État des phases
### Phase A
Validée et figée.

### Phase B
Validée et figée.

### Phase C
Validée et figée.
Décision importante :
- le front ne parle pas directement à n8n
- un proxy Netlify Function a été retenu
- variable côté serveur :
  - `N8N_WEBHOOK_DIAGNOSTIC_URL`

Commit clé :
- `f14faa0` — `Phase C : proxy n8n server-side via Netlify Function`

### Phase D2
Validée et figée.
Le checkout Stripe fonctionne en test pour :
- Kit seul
- Kit + bump
- PRO avec FLASH30

Commit clé :
- `6e60795` — `Phase D2 : Stripe checkout Kit, bump et PRO`

### Phase E1
Validée.
Documentation webhook Stripe → n8n préparée.

### Phase E2
Un workflow n8n compatible `n8n 2.4.6` a été importé manuellement dans l’instance n8n.
Il n’est pas encore entièrement configuré / validé de bout en bout.
Le repo ne doit pas être considéré comme preuve que tout E2 est terminé côté n8n.

## 4. Docs existantes à lire en priorité
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/ENV-VARIABLES.md`
- `docs/STRIPE-SETUP.md`
- `docs/N8N-SETUP.md`
- `docs/NOTION-SCHEMA.md`

## 5. État réel du système
### Front / Astro
Le front ne doit pas être modifié sans nécessité explicite.
Les phases A à D2 sont considérées stables.

### Stripe
Le checkout test fonctionne.
Logique métier validée :

Kit seul :
- `type_achat = kit_seul`
- `order_bump_inclus = false`

Kit + bump :
- `type_achat = kit_et_bump`
- `order_bump_inclus = true`

PRO :
- `type_achat = pack_pro`
- `upgrade_from = direct` (ou autre valeur transmise)
- `coupon_applique = FLASH30` ou `aucun`

Webhook Stripe n8n :
- `https://prospect.estarellas.online/webhook/stripe-post-achat`

### n8n
Un workflow compatible a été importé manuellement dans n8n, car l’import du JSON initial échouait sur `n8n 2.4.6`.
Le début du workflow a déjà été validé :
- webhook Stripe reçu,
- `GET Stripe Session` fonctionne,
- `Check Paid` fonctionne.

Le point de blocage/chantier actuel est la finalisation de :
- la recherche Notion,
- la création Notion,
- les envois Brevo,
- les tests end-to-end.

### Notion
Nouvelle base CRM dédiée créée :
- `b7518473a44c49169f0b3fd8e91c4aca`

Cette base doit être utilisée pour le funnel site web / clients.
Ne pas réutiliser l’ancienne base de prospection froide pour ce workflow.

## 6. Ce qui a été fait manuellement hors repo
- import manuel d’un workflow n8n compatible `2.4.6`
- configuration Stripe Webhook credential dans n8n
- création / validation du webhook Stripe côté Stripe
- création de la nouvelle base Notion CRM
- corrections manuelles de plusieurs nœuds n8n pendant les tests

## 7. Problèmes rencontrés
- Antigravity a planté plusieurs fois
- une partie du travail a dû être reprise manuellement
- l’import JSON n8n initial n’était pas compatible avec `n8n 2.4.6`
- certains placeholders du workflow importé ont dû être configurés manuellement
- la base Notion initiale n’était pas adaptée au post-achat site web

## 8. Règles importantes
- ne pas mettre de secrets dans le repo
- ne pas modifier le front Astro sans nécessité claire
- ne pas envoyer d’emails de production sans validation explicite
- ne pas supposer que toute la documentation est parfaitement à jour sans audit croisé avec le réel
- privilégier la robustesse et la simplicité à l’élégance

## 9. Ce qu’il reste à faire maintenant
Priorité immédiate :
1. auditer le workflow n8n E2 réellement importé
2. vérifier la structure réelle de la base Notion cible
3. finaliser le nœud `Search Session in Notion`
4. finaliser les nœuds `Create Notion`
5. finaliser les nœuds Brevo
6. tester les 3 cas :
   - Kit seul
   - Kit + bump
   - PRO
7. confirmer l’idempotence avec `Session ID`

## 10. Ce qu’il ne faut pas faire maintenant
- ne pas toucher au VIP
- ne pas lancer de refonte du front
- ne pas créer de nouvelles bases Notion inutiles
- ne pas réécrire tout le repo
- ne pas régénérer un nouveau workflow n8n sans raison

## 11. Attente vis-à-vis de Claude
Claude doit :
- auditer le repo réel,
- auditer le workflow n8n réel importé,
- auditer la base Notion réelle,
- recouper docs / code / n8n / Notion,
- finaliser proprement la Phase E,
- sans modifier le repo GitHub dans cette étape sauf demande explicite.
