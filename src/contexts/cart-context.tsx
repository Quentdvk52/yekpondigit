"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartAddon {
  id: string;
  name: string;
  priceXof: number;
}

export interface CartItem {
  productId: string;
  productSlug: string;
  productTitle: string;
  coverImage: string | null;
  licenseCode: "standard" | "extended";
  licenseName: string;
  unitPriceXof: number;
  addons: CartAddon[];
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  discountXof: number;
}

interface CartContextType {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, licenseCode: string) => void;
  updateLicense: (
    productId: string,
    currentLicenseCode: string,
    newLicenseCode: "standard" | "extended",
    newLicenseName: string,
    newPriceXof: number
  ) => void;
  toggleAddon: (productId: string, licenseCode: string, addon: CartAddon) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  subtotalXof: number;
  discountXof: number;
  totalXof: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "yd_cart_items_v1";
const COUPON_STORAGE_KEY = "yd_cart_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger depuis le localStorage après hydratation côté client
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error("Erreur de chargement du panier :", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sauvegarder dans le localStorage à chaque modification
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Erreur de sauvegarde du panier :", e);
    }
  }, [items, coupon, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.licenseCode === newItem.licenseCode
      );

      if (existingIndex > -1) {
        // Pour les biens logiciels numériques, la quantité reste 1 par défaut ou incrémente si précisé
        const updated = [...prev];
        const existing = updated[existingIndex]!;
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + (newItem.quantity ?? 1),
        };
        return updated;
      }

      return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
    });
  };

  const removeItem = (productId: string, licenseCode: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.licenseCode === licenseCode)));
  };

  const updateLicense = (
    productId: string,
    currentLicenseCode: string,
    newLicenseCode: "standard" | "extended",
    newLicenseName: string,
    newPriceXof: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.licenseCode === currentLicenseCode) {
          return {
            ...item,
            licenseCode: newLicenseCode,
            licenseName: newLicenseName,
            unitPriceXof: newPriceXof,
          };
        }
        return item;
      })
    );
  };

  const toggleAddon = (productId: string, licenseCode: string, addon: CartAddon) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.licenseCode === licenseCode) {
          const hasAddon = item.addons.some((a) => a.id === addon.id);
          const updatedAddons = hasAddon
            ? item.addons.filter((a) => a.id !== addon.id)
            : [...item.addons, addon];
          return { ...item, addons: updatedAddons };
        }
        return item;
      })
    );
  };

  const applyCoupon = (newCoupon: AppliedCoupon) => {
    setCoupon(newCoupon);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  // Calcul du sous-total brut (produits + options/addons)
  const subtotalXof = items.reduce((sum, item) => {
    const addonsTotal = item.addons.reduce((aSum, a) => aSum + a.priceXof, 0);
    return sum + (item.unitPriceXof + addonsTotal) * item.quantity;
  }, 0);

  // Calcul du montant de la réduction
  let calculatedDiscountXof = 0;
  if (coupon && subtotalXof > 0) {
    if (coupon.discountType === "percentage") {
      calculatedDiscountXof = Math.round((subtotalXof * coupon.value) / 100);
    } else {
      calculatedDiscountXof = Math.min(coupon.value, subtotalXof);
    }
  }

  const totalXof = Math.max(0, subtotalXof - calculatedDiscountXof);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        addItem,
        removeItem,
        updateLicense,
        toggleAddon,
        applyCoupon,
        removeCoupon,
        clearCart,
        subtotalXof,
        discountXof: calculatedDiscountXof,
        totalXof,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}
