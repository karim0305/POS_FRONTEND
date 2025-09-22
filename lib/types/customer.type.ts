// Interface for a single sales transaction
export interface SalesTransaction {
  _id?: string;
  invoiceNo: string;
  AmmountType: "Cash" | "Card" | "Online" | string; // can extend as needed
  paidAmount: number;
  date: string; // ISO string (e.g. "2025-09-14T10:00:00.000Z")
}

// Interface for Customer
export interface Customer {
  _id?: string;
  name: string;
  contact: string;
  email:string;
  customerType: "Regular" | "Premium" | "VIP" | string; // dropdown values
  totalSpent: number;
  loyaltyPoints: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | string;
  lastPurchase: string | null; // null allowed if no purchase yet
  salestransection: SalesTransaction[];
  createdAt?: string;
  updatedAt?: string;
  totalPaidAmount?:number;
  remaining?: number;
}
