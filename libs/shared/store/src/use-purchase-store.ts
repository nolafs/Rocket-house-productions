import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

interface PurchaseStore {
  productId: string | null | undefined;
  courseId: string | null | undefined;
  type: 'payed' | 'free' | null;
  timestamp: number | null; // To store the timestamp for expiration
  setProductId: (productId: string | null | undefined) => void;
  setCourseId: (courseId: string | null | undefined) => void;
  setType: (type: 'payed' | 'free' | null) => void;
  clearData: () => void; // Function to clear the store
}

type ProductPersist = (
  config: (set: any, get: any, api: any) => PurchaseStore,
  options: PersistOptions<PurchaseStore>,
) => (set: any, get: any, api: any) => PurchaseStore;

// Custom middleware to handle expiration
const expireMiddleware =
  (
    config: (set: any, get: any, api: any) => PurchaseStore,
    expirationTime = 60000, // Default expiration time in milliseconds (e.g., 60 seconds)
  ) =>
  (set: any, get: any, api: any) => {
    return config(
      (args: any) => {
        const state = get();
        const currentTime = Date.now();

        // Check if data has expired
        if (state.timestamp && currentTime - state.timestamp > expirationTime) {
          set({
            productId: null,
            courseId: null,
            type: null,
            timestamp: null,
          });
          // Optionally, remove persisted data from sessionStorage
          sessionStorage.removeItem('purchase-intend');
        } else {
          set({ ...args, timestamp: currentTime });
        }
      },
      get,
      api,
    );
  };

export const usePurchaseStore = create<PurchaseStore>(
  (persist as ProductPersist)(
    expireMiddleware(
      (set, get): PurchaseStore => ({
        productId: null,
        type: null,
        courseId: null,
        timestamp: null, // Initialize timestamp as null
        setProductId: productId => set({ productId }),
        setCourseId: courseId => set({ courseId }),
        setType: type => set({ type }),
        clearData: () => set({ productId: null, courseId: null, type: null, timestamp: null }), // Function to clear the store
      }),
      60000, // Set expiration time (e.g., 60 seconds)
    ),
    {
      name: 'purchase-intend', // Name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default usePurchaseStore;
