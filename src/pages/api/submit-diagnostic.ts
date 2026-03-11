// Endpoint API pour relayer le webhook et éviter les CORS
export const prerender = false; // Forcer le mode SSR sur cette route

export const POST = async ({ request }) => {
  try {
    // Récupérer le payload envoyé par le client
    const payload = await request.json();

    // L'URL du webhook n8n est définie dans les variables d'environnement serveur
    // Netlify les rend disponibles ici
    const webhookUrl = import.meta.env.PUBLIC_N8N_WEBHOOK_DIAGNOSTIC;

    if (!webhookUrl) {
      console.error('Variable N8N_WEBHOOK manquante côté serveur');
      return new Response(JSON.stringify({ error: 'Configuration webhook manquante sur le serveur' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Relais vers n8n en cours...', payload.email);

    // Faire l'appel server-to-server vers n8n (le CORS ne s'applique pas entre serveurs)
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // On peut ajouter ici un header d'autorisation plus tard si le webhook est sécurisé
      },
      body: JSON.stringify(payload)
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`Erreur webhook n8n (${n8nResponse.status}):`, errorText);
      return new Response(JSON.stringify({ error: `Le serveur distant a répondu avec une erreur ${n8nResponse.status}` }), {
        status: n8nResponse.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Le webhook n8n a répondu avec succès
    const n8nData = await n8nResponse.text();
    console.log('Succès n8n');

    // Répondre au client de manière sécurisée (same-origin, donc pas de pb CORS sur le front)
    return new Response(JSON.stringify({ success: true, message: 'Diagnostic reçu', data: n8nData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Erreur interne du relais API:', error);
    return new Response(JSON.stringify({ error: 'Une erreur interne inattendue est survenue' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
