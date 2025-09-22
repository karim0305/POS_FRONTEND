"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { ReportsApi } from "@/lib/api/apis"

export function InventoryReportTable() {
  const [inventoryData, setInventoryData] = useState<any[]>([])

  const fetchdata = async () => {
    try {
      const res = await fetch(ReportsApi.InventoryReport)
      const result = await res.json()

      console.log("Inventory Report result:", result)

      if (Array.isArray(result)) {
        setInventoryData(result)
      } else {
        setInventoryData([])
      }
    } catch (error) {
      console.error("Error fetching inventory report:", error)
      setInventoryData([])
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

  const getStatusBadge = (status: string, currentStock: number, reorderLevel: number) => {
    if (status === "out_of_stock" || currentStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (status === "low_stock" || currentStock <= reorderLevel) {
      return <Badge variant="secondary">Low Stock</Badge>
    }
    if (status === "overstocked") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Overstocked</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
  }

  const getTurnoverIcon = (rate: number) => {
    if (rate > 10) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getStockAlerts = () => {
    return inventoryData.filter((item) => item.currentStock <= item.reorderLevel || item.currentStock === 0).length
  }

  // ✅ Summary Calculations
  const totalProducts = inventoryData.length
  const stockAlerts = getStockAlerts()
  const avgTurnover =
    inventoryData.length > 0
      ? (inventoryData.reduce((sum, item) => sum + Number(item.turnoverRate), 0) / inventoryData.length).toFixed(1)
      : 0
  const totalStockValue = inventoryData.reduce(
    (sum, item) => sum + (item.currentStock * (item.price ?? 0)),
    0
  )

  return (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockAlerts}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTurnover}</div>
            <p className="text-xs text-muted-foreground">Times per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalStockValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Turnover Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.currentStock}
                      {item.currentStock <= item.reorderLevel && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTurnoverIcon(item.turnoverRate)}
                      {item.turnoverRate}x
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status, item.currentStock, item.reorderLevel)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
