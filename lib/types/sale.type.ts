export interface SaleItem {
  product: string;   // Product ka ObjectId (string type)
  quantity: number;
  price: number;
}
type CustomerType = 
  | {name: string; _id: string }  // agar populate hua ho
  | string;   

export interface Sale {
  _id: string;
  Invoice: string;
  customer: CustomerType;
  items: SaleItem[];
  total: number;
  status: "PENDING" | "COMPLETED";
  date: string;       // ISO date string
}