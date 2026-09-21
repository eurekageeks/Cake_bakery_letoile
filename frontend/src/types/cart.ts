import type { CakeFlavour, CakeWeight, ProductAddon } from './product';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  quantity: number;
  flavour: CakeFlavour;
  weight: CakeWeight;
  isEggless: boolean;
  customMessage?: string;
  photoUrl?: string;
  selectedAddons?: ProductAddon[];
  preparationHours: number;
}

export interface DeliveryDetails {
  pincode: string;
  date: string;
  timeSlot: string;
  instructions?: string;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon?: {
    code: string;
    discountAmount: number;
    description: string;
  };
  deliveryDetails?: DeliveryDetails;
}
