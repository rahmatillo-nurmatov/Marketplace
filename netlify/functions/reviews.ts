import { Handler } from '@netlify/functions';
import { adminDb } from '../../src/lib/firebase/admin';

export const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body || '{}');
      const docRef = await adminDb.collection('reviews').add({
        ...data,
        createdAt: Date.now()
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ id: docRef.id, ...data }),
      };
    }

    if (event.httpMethod === 'GET') {
      const productId = event.queryStringParameters?.productId;
      if (!productId) return { statusCode: 400, body: 'Missing productId' };
      
      const snapshot = await adminDb.collection('reviews').where('productId', '==', productId).get();
      const reviews = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      return {
        statusCode: 200,
        body: JSON.stringify(reviews),
      };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
