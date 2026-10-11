"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS, Product, Variant } from "@/data/products";

export interface CartItem {
  id: string;
  variant_id: string;
  sku: string;
  product_name: string;
  pack_size: string;
  unit: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  product_slug?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (variantId: string, qty: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "item-init-1",
      variant_id: "var-01",
      sku: "AK-ATTA-SHAR-50KG",
      product_name: "Sharbati Whole Wheat Atta",
      pack_size: "50 kg Commercial Bag",
      unit: "Bag",
      qty: 2,
      unit_price: 1850,
      subtotal: 3700,
      tax_amount: 0,
      total: 3700,
      product_slug: "sharbati-whole-wheat-atta"
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aapnokhet_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aapnokhet_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (variantId: string, qty: number) => {
    for (const p of PRODUCTS) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        const matchingSlab = v.slabs.find((s) => qty >= s.min_qty && qty <= s.max_qty);
        const unit_price = matchingSlab ? matchingSlab.slab_price : v.base_price;
        const itemSub = unit_price * qty;
        const itemTax = (itemSub * p.gst_rate) / 100;

        setItems((prev) => {
          const existing = prev.find((item) => item.variant_id === variantId);
          if (existing) {
            const newQty = existing.qty + qty;
            const newSlab = v.slabs.find((s) => newQty >= s.min_qty && newQty <= s.max_qty);
            const newUnitPrice = newSlab ? newSlab.slab_price : v.base_price;
            const newSub = newUnitPrice * newQty;
            const newTax = (newSub * p.gst_rate) / 100;

            return prev.map((item) =>
              item.variant_id === variantId
                ? {
                    ...item,
                    qty: newQty,
                    unit_price: newUnitPrice,
                    subtotal: newSub,
                    tax_amount: newTax,
                    total: newSub + newTax
                  }
                : item
            );
          }
          return [
            ...prev,
            {
              id: `item-${Date.now()}`,
              variant_id: v.id,
              sku: v.sku,
              product_name: p.name,
              pack_size: v.pack_size,
              unit: v.unit,
              qty,
              unit_price,
              subtotal: itemSub,
              tax_amount: itemTax,
              total: itemSub + itemTax,
              product_slug: p.slug
            }
          ];
        });
        setIsCartOpen(true);
        break;
      }
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const p = PRODUCTS.find((prod) =>
            prod.variants.some((v) => v.id === it.variant_id)
          );
          const v = p?.variants.find((v) => v.id === it.variant_id);
          const matchingSlab = v?.slabs.find((s) => qty >= s.min_qty && qty <= s.max_qty);
          const unit_price = matchingSlab ? matchingSlab.slab_price : (v?.base_price || it.unit_price);
          const subtotal = unit_price * qty;
          const tax_amount = ((p?.gst_rate || 0) * subtotal) / 100;
          return {
            ...it,
            qty,
            unit_price,
            subtotal,
            tax_amount,
            total: subtotal + tax_amount
          };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const taxTotal = items.reduce((acc, item) => acc + item.tax_amount, 0);
  const grandTotal = subtotal + taxTotal;
  const totalItemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeItem,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        taxTotal,
        grandTotal,
        totalItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
