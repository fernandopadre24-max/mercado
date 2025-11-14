export interface Promotion {
  description: string;
  discountedPrice: number;
}

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  barcode: string;
  imageUrl: string;
  stock: number;
  lowStockThreshold: number;
  promotion?: Promotion;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface InstallmentDetails {
    count: number;
    value: number;
}

export interface Transaction {
  id:string;
  date: string;
  total: number;
  items: TransactionItem[];
  employeeId: string;
  customerName: string;
  employeeName: string;
  paymentMethod: 'Dinheiro' | 'PIX' | 'Cartão' | 'Boleto';
  status: 'Pago' | 'Pendente';
  boletoDueDate?: string;
  installments?: InstallmentDetails;
  cpf?: string;
  cardNumber?: string;
  bank?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  address: string;
  contact: string;
  cpf: string;
  email: string;
}

// FIX: Added missing Customer interface based on its usage in Customers.tsx.
export interface Customer {
  id: string;
  name: string;
  customerId: string;
  points: number;
  purchaseHistory?: Transaction[];
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contactPerson: string;
  phone: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  cnpj: string;
  logoUrl?: string;
}

export interface CashDrawerOperation {
  id: string;
  type: 'Sangria' | 'Suprimento';
  amount: number;
  reason: string;
  employeeId: string;
  employeeName: string;
  date: string;
}

export interface DailySale {
  date: string;
  total: number;
}

export interface SalesByPaymentMethod {
  name: string;
  value: number;
}

export interface TopSellingProduct {
  name: string;
  quantity: number;
}


export type View = 'home' | 'pos' | 'sales-history' | 'products' | 'employees' | 'suppliers' | 'reports' | 'settings';