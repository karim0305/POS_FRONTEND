"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ReportsApi } from "@/lib/api/apis"

// Mock product performance data
const productSalesData = [
  { name: "Wireless Headphones", sales: 1250, revenue: 124750, units: 125 },
  { name: "Coffee Mug", sales: 890, revenue: 11557, units: 890 },
  { name: "Desk Lamp", sales: 650, revenue: 22737.5, units: 65 },
  { name: "Phone Case", sales: 420, revenue: 8379, units: 420 },
  { name: "Notebook", sales: 380, revenue: 2276.2, units: 380 },
]


const topProducts = [
  { name: "Wireless Headphones", revenue: 124750, growth: 15.2 },
  { name: "Desk Lamp", revenue: 22737.5, growth: 8.7 },
  { name: "Coffee Mug", revenue: 11557, growth: -2.1 },
  { name: "Phone Case", revenue: 8379, growth: 12.3 },
  { name: "Notebook", revenue: 2276.2, growth: -5.4 },
]

interface ProductPerformanceChartProps {
  period: string
}

export function ProductPerformanceChart({ period }: ProductPerformanceChartProps) {

  const [productSalesData, setProductSalesData] = useState([])
  const [categoryData, setcategoryData]  = useState<Category[]>([]);
  const GetProductbyReport = () => {
    fetch(ReportsApi.byProductReport) // 👈 Your NestJS API
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Product Sales API Response:", data) // 👈 log here
        setProductSalesData(data)
      })
      .catch((err) => console.error("❌ Error fetching product sales:", err))
  }

    const fetchCategoryData = async () => {
      try {
        const res = await fetch(ReportsApi.categorybyReport);
        const data = await res.json();

        // Backend data ko format karna (colors assign)
        const colors = [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ];

        const formatted = data.map((item:any, index:any) => ({
          ...item,
          color: colors[index % colors.length], // auto color assign
        }));

        setcategoryData(formatted);
      } catch (error) {
        console.error("❌ Error fetching category report:", error);
      }
    };

   




  useEffect(() => {
    GetProductbyReport();
     fetchCategoryData();

  }, [])



const total = categoryData.reduce((sum, item) => sum + item.value, 0);

const chartData = categoryData.map((item) => ({
  ...item,
  percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
}));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Product Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSalesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

     <Card>
  <CardHeader>
    <CardTitle>Sales by Category</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${percent}%`}
          labelLine={false} // cleaner labels
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `$${value.toFixed(2)}`, // revenue with 2 decimals
            "Revenue",
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">Revenue: ${product.revenue.toLocaleString()}</div>
                  </div>
                </div>
                <Badge variant={product.growth > 0 ? "default" : "destructive"}>
                  {product.growth > 0 ? "+" : ""}
                  {product.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
