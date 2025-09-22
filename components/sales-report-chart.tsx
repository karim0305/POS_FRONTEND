"use client"
 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportsApi } from "@/lib/api/apis"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Mock sales data




interface SalesReportChartProps {
  period: string
}




export function SalesReportChart({ period }: SalesReportChartProps) {

  
 const [salesData, setsalesData] = useState<{ name: string; total: number }[]>([])
 const [dailySalesData, setDailySalesData] = useState([])

  useEffect(() => {
    fetch(ReportsApi.weaklyReport) // your API endpoint
      .then(res => res.json())
      .then(data => setDailySalesData(data))
  }, [])


  const [Data, setData] = useState<{ name: string; total: number }[]>([])
const fetchOrdersCustomers = async () => {
  try {
    const res = await fetch(ReportsApi.countmonthlyorder)
    if (!res.ok) throw new Error("Failed to fetch data")
    const result = await res.json()
    setData(result.sales ?? [])
  } catch (error) {
    console.error("Error fetching orders & customers:", error)
  }
}
  const fetchMonthlySales = async () => {
    try {
      const res = await fetch(ReportsApi.getMonthlySale)
      if (!res.ok) throw new Error("Failed to fetch monthly sales")
      const result = await res.json()
    console

      // result.sales already in { name: "Sep", total: 432 } format
      setsalesData(result.sales ?? [])
    } catch (error) {
      console.error("Error fetching monthly sales:", error)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
     fetchOrdersCustomers()
  }, [])
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={salesData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip formatter={(value) => [`Rs.${value}`, "Revenue"]} />
    <Area
      type="monotone"
      dataKey="total"   // 👈 yahan "revenue" ki jagah "total"
      stroke="hsl(var(--primary))"
      fill="hsl(var(--primary))"
      fillOpacity={0.3}
    />
  </AreaChart>
</ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders & Customers</CardTitle>
        </CardHeader>
        <CardContent>
         <ResponsiveContainer width="100%" height={300}>
  <LineChart data={Data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} name="Orders" />
    <Line type="monotone" dataKey="customers" stroke="hsl(var(--secondary))" strokeWidth={2} name="Customers" />
  </LineChart>
</ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Daily Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "sales" ? `$${value}` : value,
                name === "sales" ? "Sales" : "Transactions",
              ]}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" name="sales" />
            <Bar dataKey="transactions" fill="hsl(var(--secondary))" name="transactions" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </div>
  )
}
