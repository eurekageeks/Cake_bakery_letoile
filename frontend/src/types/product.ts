export type CakeFlavour =
  | 'Belgian Chocolate'
  | 'Red Velvet'
  | 'Classic Black Forest'
  | 'Lotus Biscoff'
  | 'Blueberry Cheesecake'
  | 'Vanilla Bean'
  | 'Butterscotch Crunch'
  | 'Fresh Pineapple'
  | 'Ferrero Rocher'
  | 'Pistachio Rose';

export type CakeWeight = '0.5 KG' | '1.0 KG' | '1.5 KG' | '2.0 KG' | 'Custom';

export type CakeOccasion =
  | 'Birthday'
  | 'Anniversary'
  | 'Wedding'
  | 'Baby Shower'
  | 'Congratulations'
  | "Valentine's"
  | 'Festivals'
  | 'Party';

export type CakeCategory =
  | 'Birthday Cakes'
  | 'Chocolate Cakes'
  | 'Photo Cakes'
  | 'Designer Cakes'
  | 'Bento Cakes'
  | 'Cheesecakes'
  | 'Cupcakes'
  | 'Eggless Cakes'
  | 'Sugar-Free Cakes';

export interface ProductVariant {
  id: string;
  flavour: CakeFlavour;
  weight: CakeWeight;
  eggless: boolean;
  price: number;
  discount_price?: number;
  sku: string;
  stock: number;
  is_active: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: 'Candles' | 'Cake Knife' | 'Greeting Card' | 'Flowers' | 'Chocolates' | 'Party Accessories';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  base_price: number;
  discount_price?: number;
  discount_percent?: number;
  category: CakeCategory;
  occasion?: CakeOccasion;
  rating: number;
  review_count: number;
  featured: boolean;
  best_seller: boolean;
  customizable: boolean;
  eggless_available: boolean;
  sugar_free_available: boolean;
  preparation_time_hours: number;
  image_url: string;
  gallery_images?: string[];
  variants?: ProductVariant[];
  ingredients?: string[];
  allergens?: string[];
  storage_instructions?: string;
}
