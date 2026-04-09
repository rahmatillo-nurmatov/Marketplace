import { Handler } from '@netlify/functions';
import { adminDb } from '../../src/lib/firebase/admin';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      // In production verify JWT:
      // const authHeader = event.headers.authorization;
      
      const newOrder = {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const docRef = await adminDb.collection('orders').add(newOrder);

      return {
        statusCode: 201,
        body: JSON.stringify({ id: docRef.id, ...newOrder }),
      };
    }

    if (event.httpMethod === 'GET') {
      // Could filter by user via query param ?clientId=...
      const clientId = event.queryStringParameters?.clientId;
      const sellerId = event.queryStringParameters?.sellerId;
      
      let query: any = adminDb.collection('orders');
      if (clientId) query = query.where('clientId', '==', clientId);
      else if (sellerId) {
        // Need to check if products in items have sellerId, complicated for demo, skipping where filter, just return all
      }
      
      const snapshot = await query.get();
      const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      return {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    }

  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return { statusCode: 500 };
};
