import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentSales } from "@/components/recent-sales"
import { SalesChart } from "@/components/sales-chart"
import { useEffect, useState } from "react";
import Cookies from "js-cookie"


export default function DashboardPage() {
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <SalesChart />
          <RecentSales />
        </div>
      </div>
    </DashboardLayout>
  )
}
