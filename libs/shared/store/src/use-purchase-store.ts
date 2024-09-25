import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

interface PurchaseStore {
  productId: string | null | undefined;
  courseId: string | null | undefined;
  type: 'payed' | 'free' | null;
  setProductId: (productId: string | null | undefined) => void;
  setCourseId: (courseId: string | null | undefined) => void;
  setType: (type: 'payed' | 'free' | null) => void;
}

type ProductPersist = (
  config: (set: any, get: any, api: any) => PurchaseStore,
  options: PersistOptions<PurchaseStore>,
) => (set: any, get: any, api: any) => PurchaseStore;

export const usePurchaseStore = create<PurchaseStore>(
  (persist as ProductPersist)(
    (set, get): PurchaseStore => ({
      productId: null,
      type: null,
      courseId: null,
      setProductId: productId => set({ productId }),
      setCourseId: courseId => set({ courseId }),
      setType: type => set({ type }),
    }),
    {
      name: 'purchase-intend', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default usePurchaseStore;
