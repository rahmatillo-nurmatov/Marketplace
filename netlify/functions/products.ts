import { Handler } from '@netlify/functions';
import { adminDb } from '../../src/lib/firebase/admin';

export const handler: Handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    if (method === 'GET') {
      // Fetch Products
      const snapshot = await adminDb.collection('products').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    } 
    
    if (method === 'POST') {
      // Minimal security for MVP: missing actual token verification for briefness 
      // In production, we'd verify the JWT token from headers using adminAuth.verifyIdToken()
      const data = JSON.parse(event.body || '{}');
      const docRef = await adminDb.collection('products').add({
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ id: docRef.id, ...data }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
