import { 
  collection, 
  getCountFromServer,
  query
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const statsService = {
  async getDashboardStats() {
    const productsColl = collection(db, 'products');
    const ordersColl = collection(db, 'orders');
    const usersColl = collection(db, 'users');

    const [productsCount, ordersCount, usersCount] = await Promise.all([
      getCountFromServer(productsColl),
      getCountFromServer(ordersColl),
      getCountFromServer(usersColl)
    ]);

    return {
      products: productsCount.data().count,
      orders: ordersCount.data().count,
      users: usersCount.data().count
    };
  }
};
