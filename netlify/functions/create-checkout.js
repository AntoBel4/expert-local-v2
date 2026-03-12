import Stripe from 'stripe';

export async function handler(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Typical recent stable version
  });

  try {
    const payload = JSON.parse(event.body);
    const { plan, bump, email } = payload;
    
    // Fallback ID if no email is provided
    const fallbackId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const clientRefId = email && email.includes('@') ? email : fallbackId;

    const sessionOptions = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [],
      client_reference_id: clientRefId,
      metadata: {},
    };

    // Prefill email if provided
    if (email && email.includes('@')) {
      sessionOptions.customer_email = email;
    }

    if (plan === 'kit') {
      const wantsBump = bump === true || bump === 'true';
      
      // Kit price
      sessionOptions.line_items.push({
        price: process.env.STRIPE_PRICE_KIT_49,
        quantity: 1,
      });

      // Add bump if requested
      if (wantsBump) {
        sessionOptions.line_items.push({
          price: process.env.STRIPE_PRICE_BUMP_19,
          quantity: 1,
        });
      }

      sessionOptions.success_url = `${process.env.SITE_URL}/merci-kit?session_id={CHECKOUT_SESSION_ID}`;
      sessionOptions.cancel_url = `${process.env.SITE_URL}/#offre`; 
      
      sessionOptions.metadata = {
        type_achat: wantsBump ? 'kit_et_bump' : 'kit_seul',
        order_bump_inclus: wantsBump ? 'true' : 'false',
        source: payload.source || 'website'
      };

    } else if (plan === 'pro') {
      
      sessionOptions.line_items.push({
        price: process.env.STRIPE_PRICE_PRO_179,
        quantity: 1,
      });

      // Apply PRO discount
      if (process.env.STRIPE_COUPON_FLASH30) {
        sessionOptions.discounts = [{ coupon: process.env.STRIPE_COUPON_FLASH30 }];
      }

      sessionOptions.success_url = `${process.env.SITE_URL}/merci-pro?session_id={CHECKOUT_SESSION_ID}`;
      sessionOptions.cancel_url = `${process.env.SITE_URL}/#offre`;
      
      sessionOptions.metadata = {
        type_achat: 'pack_pro',
        upgrade_from: payload.upgrade_from || 'direct',
        coupon_applique: process.env.STRIPE_COUPON_FLASH30 ? 'FLASH30' : 'aucun',
        source: payload.source || 'website'
      };

    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Plan invalide.' }) };
    }

    // Create session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('Erreur Checkout:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Erreur lors de la création de la session Stripe' }),
    };
  }
}
