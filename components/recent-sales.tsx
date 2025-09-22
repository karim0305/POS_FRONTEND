"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { dashboardApi } from "@/lib/api/apis"

export function RecentSales() {
  const [sales, setSales] = useState<any[]>([])

  const fetchRecentSales = async () => {
    try {
      const res = await fetch(dashboardApi.getRecentCustomer, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch recent sales")
      }

      const data = await res.json()
      setSales(data.sales ?? [])
    } catch (error) {
      console.error("Error fetching recent sales:", error)
    }
  }

  useEffect(() => {
    fetchRecentSales()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.length > 0 ? (
            sales.map((sale, index) => (
              <div key={index} className="flex items-center">
                {/* Avatar initials from customer name */}
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {sale.customer
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.customer || "Unknown Customer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto font-medium text-green-600">
                  +${sale.total}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent sales</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
