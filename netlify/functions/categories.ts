import { Handler } from '@netlify/functions';
import { adminDb } from '../../src/lib/firebase/admin';

export const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      const snapshot = await adminDb.collection('categories').get();
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        statusCode: 200,
        body: JSON.stringify(categories),
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
