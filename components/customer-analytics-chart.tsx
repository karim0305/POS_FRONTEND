"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock customer analytics data
const customerGrowthData = [
  { month: "Jan", newCustomers: 45, returningCustomers: 120, totalCustomers: 165 },
  { month: "Feb", newCustomers: 52, returningCustomers: 135, totalCustomers: 187 },
  { month: "Mar", newCustomers: 38, returningCustomers: 142, totalCustomers: 180 },
  { month: "Apr", newCustomers: 61, returningCustomers: 158, totalCustomers: 219 },
  { month: "May", newCustomers: 49, returningCustomers: 167, totalCustomers: 216 },
  { month: "Jun", newCustomers: 55, returningCustomers: 178, totalCustomers: 233 },
]

const customerSegmentData = [
  { name: "New Customers", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Regular Customers", value: 45, color: "hsl(var(--chart-2))" },
  { name: "VIP Customers", value: 20, color: "hsl(var(--chart-3))" },
]

const customerSpendingData = [
  { range: "$0-50", customers: 120 },
  { range: "$51-100", customers: 85 },
  { range: "$101-250", customers: 65 },
  { range: "$251-500", customers: 35 },
  { range: "$500+", customers: 18 },
]

interface CustomerAnalyticsChartProps {
  period: string
}

export function CustomerAnalyticsChart({ period }: CustomerAnalyticsChartProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="newCustomers"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="New Customers"
              />
              <Line
                type="monotone"
                dataKey="returningCustomers"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                name="Returning Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerSegmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {customerSegmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Customer Spending Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerSpendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Customers"]} />
              <Bar dataKey="customers" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
