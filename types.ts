
export enum Language {
  EN = 'en',
  KH = 'kh',
  CN = 'cn'
}

export enum Currency {
  USD = 'USD',
  KHR = 'KHR',
  CNY = 'CNY'
}

export type ThemeColor = 'black' | 'red' | 'blue' | 'gold';
export type HeroVariant = 'luxury' | 'minimal' | 'flashSale' | 'tech';

export type ProductCategory = 'Men' | 'Women' | 'Kids' | 'Custom' | 'Bulk';
export type ProductSubCategory = 'Clothing' | 'Shoes' | 'Accessories' | 'Everyday Items';

export interface Product {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  price: number; 
  typicalPrice?: number;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  itemType: string;
  image: string;
  images?: string[]; 
  hoverImage?: string;
  colors: string[];
  sizes: string[];
  stock: number;
  brand: string;
  rating: number;
  reviews: number;
  material: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isActive?: boolean; 
  features?: Record<Language, string[]>;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'user';
  isActive: boolean;
  joinDate: string;
}

export type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  customPrompt?: string; 
  customImageUrl?: string; 
}

export type ViewState = 'home' | 'search' | 'cart' | 'account' | 'admin' | 'checkout' | 'wishlist' | 'tracking' | 'flashSale';

// Admin Specific View States
export type AdminViewState = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'login';

// Fixed TranslationStrings interface: added missing properties to match TRANSLATIONS in constants.tsx
export interface TranslationStrings {
  heroTitle: string;
  heroSub: string;
  ctaShopNow: string;
  categories: string;
  featuredProducts: string;
  addToCart: string;
  checkout: string;
  cartEmpty: string;
  total: string;
  paymentMethod: string;
  adminTitle: string;
  searchPlaceholder: string;
  howItWorks: string;
  benefits: string;
  faq: string;
  bulkSavings: string;
  testimonials: string;
  customDesignCta: string;
  promptAssistantTitle: string;
  promptAssistantSub: string;
  trackOrderTitle: string;
  trackOrderSub: string;
  trackPlaceholder: string;
  trackCta: string;
  flashSaleTitle: string;
  flashSaleSub: string;
  endsIn: string;
  accountLabel: string;
  loginLabel: string;
  registerLabel: string;
  personalInfoLabel: string;
  orderHistoryLabel: string;
  logoutLabel: string;
  emailPhoneLabel: string;
  passwordLabel: string;
  forgotPasswordLabel: string;
  confirmPasswordLabel: string;
  alreadyHaveAccountLabel: string;
  fullNameLabel: string;
  addressLabel: string;
  editInfoLabel: string;
  orderNumberLabel: string;
  dateLabel: string;
  statusLabel: string;
  totalPriceLabel: string;
  viewDetailsLabel: string;
  statusPending: string;
  statusShipping: string;
  statusCompleted: string;
  statusCancelled: string;
  adminLogin: string;
  adminLogout: string;
  productManagement: string;
  orderManagement: string;
  userManagement: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  allOrders: string;
  revenue: string;
  topProducts: string;
}
