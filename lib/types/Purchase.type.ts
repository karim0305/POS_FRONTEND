type Supplier = 
  | string
  | {
      _id: string
     
      fullName?: string
      email?: string
      phone?: string
    }

export enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export interface PurchaseType {
  _id: string
  orderId: string
  supplier: Supplier // 👈 ab string bhi chalega aur object bhi
  date: Date
   companyName?: string
  items: {
    product: string
    quantity: number
    price: number
  }[]
  total: number
  expectedDelivery?: Date
  status: OrderStatus
  createdAt?: Date
  updatedAt?: Date
}
