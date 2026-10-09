'use client';

import React, { createContext, useContext, useState } from 'react';

interface CartContextType {
  items: any[];
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  total: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items] = useState<any[]>([]);
  const [total] = useState(0);

  return (
    <CartContext.Provider value={{ items, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);

