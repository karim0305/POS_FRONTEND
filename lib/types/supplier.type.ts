export interface Supplier {
  // Basic Info
  _id?: string; // MongoDB ObjectId
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  address?: string;
  companyName?: string;
  remaining:string

  // Supply Details
  supplyItems: string[];
  status: 'Active' | 'Inactive' | 'Blocked';

  // Account/Financial Details
  openingBalance: number;
  totalCredit: number;
  totalDebit: number;
  currentBalance: number;

  // Transactions
  transactions: {
    date: Date;
    type: 'Credit' | 'Debit';
    amount: number;
    description?: string;
  }[];

  // Other Useful Info
  gstNumber?: string;
  bankDetails?: string;

  // Timestamps (from @Schema({ timestamps: true }))
  createdAt?: Date;
  updatedAt?: Date;
}
