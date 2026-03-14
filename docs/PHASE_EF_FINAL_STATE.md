# PHASE_EF_FINAL_STATE — Expert-Local v2

## 1. Objet du document
Ce document fige l’état réel validé des phases E et F du projet Expert-Local v2 après configuration manuelle dans n8n, Notion, Brevo et Stripe.

Il sert de référence opérationnelle pour :
- reprise du projet sur une autre machine,
- audit par Claude / Antigravity,
- maintenance,
- sécurisation avant lancement.

---

## 2. Résumé exécutif
Le cœur transactionnel du funnel est désormais validé pour les 3 parcours :
- Kit 49 €
- Kit + Bump
- PRO

La chaîne suivante fonctionne :
- landing page
- checkout Stripe
- webhook n8n
- récupération session Stripe
- contrôle `payment_status`
- création fiche Notion
- envoi email Brevo

La logique est validée en conditions réelles de test.

---

## 3. Repo de référence
Repo GitHub :
- `expert-local-v2`

Le front Astro reste la source de vérité pour :
- la landing
- le checkout Stripe
- les webhooks front → n8n côté diagnostic

Le workflow post-achat n8n a été finalisé en partie manuellement dans l’instance n8n.

---

## 4. Phases validées
### Phase A
Validée et figée.

### Phase B
Validée et figée.

### Phase C
Validée et figée.

Commit clé :
- `f14faa0` — `Phase C : proxy n8n server-side via Netlify Function`

### Phase D2
Validée et figée.

Commit clé :
- `6e60795` — `Phase D2 : Stripe checkout Kit, bump et PRO`

### Phase E
Validée fonctionnellement.
Le workflow post-achat n8n est configuré et testé.

### Phase F
Validée fonctionnellement pour la V1 transactionnelle.
Les templates Brevo sont créés, testés et reliés au workflow.

---

## 5. Métadonnées Stripe réellement utilisées
### Kit seul
- `type_achat = kit_seul`
- `order_bump_inclus = false`

### Kit + bump
- `type_achat = kit_et_bump`
- `order_bump_inclus = true`

### PRO
- `type_achat = pack_pro`
- `upgrade_from = direct` (ou autre valeur transmise)
- `coupon_applique = FLASH30` ou `aucun`

---

## 6. Webhook Stripe / n8n
Webhook de production utilisé :
- `https://prospect.estarellas.online/webhook/stripe-post-achat`

Événement Stripe écouté :
- `checkout.session.completed`

Le workflow post-achat utilise :
- récupération de la session Stripe complète,
- `expand[]=line_items`,
- contrôle `payment_status === "paid"`,
- contrôle d’idempotence par `Session ID`.

---

## 7. Base Notion cible
Base CRM dédiée utilisée :
- `b7518473a44c49169f0b3fd8e91c4aca`

Nom fonctionnel :
- `Pipeline Clients Expert-Local`

Cette base est distincte de la base de prospection froide.

### Rôle
Elle sert à enregistrer :
- les clients issus du site,
- les achats,
- les statuts client,
- l’idempotence post-achat,
- le suivi opérationnel.

---

## 8. Templates Brevo validés
### Kit
- Nom : `EL - TX - Kit - Confirmation V1`
- Template ID : `1`

### Kit + Bump
- Nom : `EL - TX - Kit+Bump - Confirmation V1`
- Template ID : `2`

### PRO
- Nom : `EL - TX - PRO - Onboarding V1`
- Template ID : `3`

### Expéditeur validé
- `Antoine d'Expert-Local.fr <contact@expert-local.fr>`

DKIM et DMARC :
- validés

---

## 9. Workflow n8n post-achat — état réel
Le workflow n8n a été importé puis corrigé manuellement.

### Logique validée
1. Webhook Stripe
2. GET Stripe Session
3. Check Paid
4. Search Session in Notion
5. Check Idempotence
6. Routage :
   - Kit seul
   - Kit + Bump
   - PRO
7. Create Notion correspondant
8. Send Brevo correspondant

### Point important
Le workflow n8n ne doit pas être considéré comme “sorti du JSON prêt à l’emploi”.
Plusieurs corrections ont été faites manuellement dans l’éditeur n8n.

---

## 10. Corrections manuelles importantes effectuées
### n8n — Stripe
- configuration du webhook Stripe dans n8n
- configuration de l’authentification webhook
- validation du GET Stripe Session
- validation du check `payment_status`

### n8n — Notion
- remplacement de l’ancienne base cible
- branchement sur la nouvelle base CRM
- correction du nœud `Search Session in Notion`
- correction des bodies JSON des nœuds de création Notion
- validation en exécution réelle

### n8n — Brevo
- création d’une nouvelle clé API dédiée
- configuration manuelle des 3 nœuds `Send Brevo`
- correction d’une erreur de méthode HTTP (`GET` → `POST`)
- correction de la récupération de l’email destinataire :
  - utilisation de `{{$('GET Stripe Session').item.json.customer_details.email}}`
- validation des 3 emails en réel

### Brevo
- validation de l’expéditeur `contact@expert-local.fr`
- création des 3 templates transactionnels
- tests email réussis
- rotation de clé API effectuée

---

## 11. Produit / livraison V1 retenus
### Kit 49 €
Le cœur du produit est :
- un QR code stylisé personnalisé,
- accompagné d’une méthode / masterclass / supports.

### Livraison V1 retenue
- accès immédiat au contenu existant
- QR code personnalisé préparé manuellement après commande
- si le lien Google Maps manque, il est demandé au client

### Kit + Bump
- même logique que le Kit
- avec contenus avancés / scripts supplémentaires
- lien bump encore améliorable si besoin

### PRO
- confirmation + onboarding
- accompagnement humain
- pas de promesse de livraison automatique complète

---

## 12. Ce qui est validé
### Parcours Kit
- paiement Stripe : OK
- webhook n8n : OK
- création Notion : OK
- email Brevo : OK

### Parcours Kit + Bump
- paiement Stripe : OK
- webhook n8n : OK
- création Notion : OK
- email Brevo : OK

### Parcours PRO
- paiement Stripe : OK
- webhook n8n : OK
- création Notion : OK
- email Brevo : OK

---

## 13. Ce qui reste manuel
### QR code personnalisé
Le QR code personnalisé n’est pas encore généré automatiquement.
Pour la V1 :
- préparation manuelle
- envoi manuel ensuite si nécessaire

### Livraison du bump
Le support du bump peut encore être amélioré / finalisé.

### PRO
Le suivi reste humain / local / visio selon le cas.

---

## 14. Risques résiduels
### Risque principal
Le risque n’est plus technique mais produit / promesse :
- amélioration du contenu réel du kit,
- clarté de la livraison du QR code,
- finition du bump,
- cadrage exact du PRO.

### Risques secondaires
- perte de configuration manuelle si pas d’export n8n à jour,
- oubli d’une correction manuelle non documentée,
- réutilisation accidentelle d’anciens credentials cassés.

---

## 15. Ce qu’il reste à faire avant / autour du lancement

### Priorité haute
- conserver le JSON final exporté du workflow n8n
- pousser la doc et l’export sur GitHub
- figer la promesse produit V1
- vérifier les liens finaux du kit / bump
- formaliser le process manuel QR code
- vérifier cohérence CGV / mentions / promesse commerciale
- réintégrer le diagnostic gratuit depuis le site dans le système final
- reconnecter le workflow n8n de diagnostic gratuit au funnel global
- réintégrer la logique de campagne email / nurturing Brevo déclenchée après diagnostic
- vérifier la cohérence entre :
  - prospects issus du diagnostic gratuit,
  - prospects issus de l’app de prospection,
  - clients issus du checkout Stripe

### Priorité moyenne
- améliorer la qualité perçue du kit
- améliorer la livraison du bump
- consolider la doc globale du repo
- clarifier la circulation de la donnée entre :
  - base prospects,
  - base clients,
  - campagne Brevo,
  - tunnel payant

### Après lancement
- automatisation du QR code
- intégration complète et élégante de l’application de prospection
- réflexion plus avancée sur scoring / segmentation / relances automatiques
- réflexion PRO / VIP approfondie
- éventuel espace client

---

## 16. Règles importantes
- ne pas mettre de secrets dans le repo
- ne pas modifier le front Astro sans nécessité claire
- ne pas casser les parcours validés
- ne pas réimporter un ancien workflow n8n par erreur
- toujours tester après modification des nœuds critiques

---

## 17. Fichiers de référence à relire
- `docs/HANDOFF_CLAUDE.md`
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/ENV-VARIABLES.md`
- `docs/STRIPE-SETUP.md`
- `docs/N8N-SETUP.md`
- `docs/NOTION-SCHEMA.md`

---

## 18. Conclusion
À la date de ce document, le cœur transactionnel Expert-Local v2 est fonctionnel et validé en test réel.

Le projet n’est pas “fini” au sens global, mais il est désormais dans un état suffisamment solide pour :
- lancer,
- documenter,
- améliorer ensuite sans repartir de zéro.
