"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { dashboardApi } from "@/lib/api/apis"

export function SalesChart() {
  const [data, setData] = useState<{ name: string; total: number }[]>([])

  const fetchMonthlySales = async () => {
    try {
      const res = await fetch(dashboardApi.getMonthlySale)
      if (!res.ok) throw new Error("Failed to fetch monthly sales")
      const result = await res.json()

      // result.sales already in { name: "Sep", total: 432 } format
      setData(result.sales ?? [])
    } catch (error) {
      console.error("Error fetching monthly sales:", error)
    }
  }

  useEffect(() => {
    fetchMonthlySales()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
