"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardApi } from "@/lib/api/apis";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { useEffect, useState } from "react";

export function DashboardStats() {
  const [profit, setProfit] = useState<number | null>(null);
  const [totalsale, setTotalSale] = useState<number | null>(null);

const fetchProfit = async () => {
  try {
    const res = await fetch(dashboardApi.getProfit);
    const data = await res.json();

    // Backend ka response { profit, totalSale, totalPurchase } hai
    setProfit(data.profit ?? 0);
    setTotalSale(data.totalSale ?? 0);
  } catch (error) {
    console.error("Error fetching profit:", error);
  }
};
 

  useEffect(() => {
    fetchProfit();
  }, []); // ✅ only run once (no infinite loop)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      
      {/* Total Revenue (Dynamic from API) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {profit !== null ? `$${profit.toLocaleString()}` : "Loading..."}
          </div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>

      {/* Sales (Dummy) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalsale}</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>

      {/* Products (Dummy) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>

      {/* Active Customers (Dummy) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>

    </div>
  )
}
