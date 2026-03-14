# Phase E2 - Reconstruction Manuelle Assistée (n8n 2.4.6)

Suite à une erreur d'import JSON (`could not find property option`), voici la procédure de reconstruction manuelle pas-à-pas pour garantir une compatibilité totale avec votre version de n8n.

## Architecture globale
Le workflow est composé de 9 nœuds :
1. Webhook (Stripe)
2. HTTP Request (GET Stripe Session)
3. If (Check Paid)
4. Notion (Search Idempotence)
5. If (Check Doublon)
6. Switch (Routage métier)
7. Notion (Création Kit / Kit+Bump / PRO)
8. Brevo (Envoi Mail Kit / Kit+Bump / PRO)

---

## Étape 1 : Le déclencheur Stripe
**Nœud : Webhook**
- **Authentication** : Aucune (pour l'instant, le temps de valider le flux) ou `Stripe Webhook API` si déjà configurée.
- **HTTP Method** : `POST`
- **Path** : `stripe-post-achat`
- **Respond Mode** : `Immediately`
- *Aucune autre option avancée.*

## Étape 2 : Récupération Session Stripe
**Nœud : HTTP Request**
- **Authentication** : `Predefined Credential Type` -> `Stripe API`
- **Request Method** : `GET`
- **URL** : `https://api.stripe.com/v1/checkout/sessions/{{ $json.body.data.object.id }}?expand[]=line_items`
- *Ce nœud rapatrira l'objet de session complet et certifié par Stripe.*

## Étape 3 : Contrôle de paiement
**Nœud : If**
- **Condition** : `String`
- **Value 1** : `{{ $json.payment_status }}` (depuis la sortie du nœud HTTP Request)
- **Operation** : `Equal`
- **Value 2** : `paid`
- *La branche `true` continuera vers l'étape 4. La branche `false` s'arrête.*

## Étape 4 : Idempotence Notion (Recherche)
**Nœud : Notion**
- **Credential** : `Notion API`
- **Resource** : `Database Page`
- **Operation** : `Get Many` (ou `Get All`)
- **Database ID** : `[ID de votre Base Notion]`
- **Filter** : `Match Any Filter` -> `Session ID` (Rich Text) `Equals` `{{ $json.id }}` (l'ID de la session Stripe depuis le nœud HTTP).

## Étape 5 : Contrôle anti-doublon
**Nœud : If**
- **Condition** : `Boolean`
- **Value 1** : `{{ $json.length == 0 }}` (vérifie si Notion n'a rien trouvé)
- **Operation** : `Equal`
- **Value 2** : `true`
- *La branche `true` (aucun doublon) continue vers le Switch.*

## Étape 6 : Routage métier
**Nœud : Switch**
- **Input Value** : `{{ $('HTTP Request').item.json.metadata.type_achat }}`
- **Routing Rules** :
  1. `Equal` -> `kit_seul` (va vers sortie 0)
  2. `Equal` -> `kit_et_bump` (va vers sortie 1)
  3. `Equal` -> `pack_pro` (va vers sortie 2)
- *Fallback : Ne rien faire.*

## Étape 7 : Branches de création Notion (x3)
**Nœuds : Notion (à créer 3 fois, un par sortie du Switch)**
- **Resource** : `Database Page`
- **Operation** : `Create`
- **Database ID** : `[ID de votre Base Notion]`
- **Properties** :
  - `Email` (Title) = `{{ $('HTTP Request').item.json.customer_details.email }}`
  - `Session ID` (Rich Text) = `{{ $('HTTP Request').item.json.id }}`
  - `Source` (Rich Text) = `{{ $('HTTP Request').item.json.metadata.source }}`
  - `Statut Client` (Select) = `Client Kit` (ou `Client Kit + Bump` ou `Client PRO` selon la branche)
  - *Pour la branche PRO uniquement :* `Upgrade From` = `{{ $('HTTP Request').item.json.metadata.upgrade_from }}`, `Coupon` = `{{ $('HTTP Request').item.json.metadata.coupon_applique }}`

## Étape 8 : Branches d'envoi Brevo (x3)
**Nœuds : Brevo (à brancher à la suite des 3 nœuds Notion)**
- **Resource** : `Email`
- **Operation** : `Send Template`
- **Template ID** : `[ID du template correspondant]`
- **Recipient Email** : `{{ $('HTTP Request').item.json.customer_details.email }}`

---
*Ce workflow est minimaliste, robuste, et utilise uniquement les fonctions standards (HTTP, If, Switch, Notion, Brevo) présentes dans toutes les versions récentes de n8n.*
