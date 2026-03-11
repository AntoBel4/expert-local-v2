export async function handler(event, context) {
  // N'accepter que les requêtes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // L'URL du webhook n8n est récupérée depuis l'environnement Netlify
    // Plus besoin qu'elle soit PUBLIC_
    const webhookUrl = process.env.PUBLIC_N8N_WEBHOOK_DIAGNOSTIC;

    if (!webhookUrl) {
      console.error("Variable N8N_WEBHOOK manquante côté serveur");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configuration webhook manquante sur le serveur" }),
      };
    }

    console.log("Relais vers n8n en cours...", payload.email);

    // Appel server-to-server vers n8n (contourne les CORS navigateur)
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`Erreur webhook n8n (${n8nResponse.status}):`, errorText);
      return {
        statusCode: n8nResponse.status,
        body: JSON.stringify({ error: `Le webhook distant a répondu avec une erreur ${n8nResponse.status}` }),
      };
    }

    const n8nData = await n8nResponse.text();
    console.log("Succès n8n:", n8nData);

    // Répondre au client avec succès
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Diagnostic envoyé", data: n8nData }),
    };

  } catch (error) {
    console.error("Erreur interne Catch Function Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Une erreur interne inattendue est survenue" }),
    };
  }
}
