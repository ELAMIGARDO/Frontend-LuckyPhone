import type { JSONContent } from "@tiptap/react";

export interface Color {
  name: string;
  color: string;
  price?: number;
}

export interface VariantProduct {
  id: string;
  color: string;
  color_name: string;
  price: number;
  stock: number;
  storage: string;
}

export interface Product {
  id: string;        // ✅ string (UUID)
  name: string;
  brand: string;     // ✅ string (nombre de marca)
  images: string[];  // ✅ array
  slug: string;
  features: string[];
  description: JSONContent;  // ✅ objeto, no array
  created_at: string;
  variants: VariantProduct[];
}

export interface PreparedProduct {
  id: string;        // ✅
  name: string;
  brand: string;     // ✅
  images: string[];  // ✅
  slug: string;
  features: string[];
  description: JSONContent;  // ✅
  created_at: string;
  price: number;
  colors: {
    name: string;
    color: string;
  }[];
  variants: VariantProduct[];
}