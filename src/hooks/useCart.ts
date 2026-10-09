import { useCartContext } from '@/context/CartContext';

export const useCart = () => {
  const { items, total } = useCartContext();
  
  return {
    items,
    total,
  };
};

