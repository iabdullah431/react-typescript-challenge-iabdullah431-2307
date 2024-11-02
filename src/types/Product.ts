export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface Root {
  cartItems: CartItem[];
  totalCost: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  imageURL: string;
  price: number;
  description: string;
}

export interface Order {
  sessionId: string;
  token: string;
}
export interface CheckoutItemDto {
  price: number;
  productId: number;
  productName: string;
  quantity: number;
  userId: number; // يجب أن يكون من نوع number
}