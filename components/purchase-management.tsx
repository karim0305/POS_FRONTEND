"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Truck, Package } from "lucide-react"
import { CreatePurchaseOrderDialog } from "@/components/create-purchase-order-dialog"
import { productApi, purchaseApi } from "@/lib/api/apis"
import { PurchaseType } from "@/lib/types/Purchase.type"
import { ViewPurchaseOrderDialog } from "./ViewPurchaseOrderDialog"
import { UpdatePurchaseOrderDialog } from "./UpdatePurchaseOrderDialog"





export function PurchaseManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [mockPurchaseOrders, setMockPurchaseOrders] = useState<PurchaseType[]>([])
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setViewDialogOpen(true)
  }
  const handleEdit = (order: any) => {
    setSelectedOrder(order)
    setUpdateDialogOpen(true)
  }

  const fetchData = async () => {
    const res = await fetch(purchaseApi.getOrders);
    const data = await res.json();

    const parsedData = data.map((order: any) => ({
      ...order,
      date: new Date(order.date), // string → Date
      expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery) : undefined,
    }));

    setMockPurchaseOrders(parsedData);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(productApi.getProducts)
      const data = await res.json()
      setProducts(data)
    }
    fetchProducts()
    fetchData();
  }, []);

const filteredOrders = mockPurchaseOrders.filter((order) => {
  const supplierName =
    typeof order.supplier === "string"
      ? order.supplier
      : order.supplier?.companyName ?? "";

  return (
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPendingTotal = () => {
    return mockPurchaseOrders
      .filter((order) => order.status === "pending")
      .reduce((total, order) => total + order.total, 0)
  }

  const getMonthlyTotal = () => {
    return mockPurchaseOrders
      .filter((order) => order.date.toISOString().startsWith("2024-01"))
      .reduce((total, order) => total + order.total, 0)
  }

  return (
    <div className="space-y-6">
      {/* Purchase Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPurchaseOrders.filter((order) => order.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">${getPendingTotal().toFixed(2)} value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPurchaseOrders.filter((order) => order.status === "shipped").length}
            </div>
            <p className="text-xs text-muted-foreground">Orders shipped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getMonthlyTotal().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(mockPurchaseOrders.map((order) => order.supplier)).size}</div>
            <p className="text-xs text-muted-foreground">Active suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
<CardHeader>
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {/* Title */}
    <CardTitle className="text-lg sm:text-xl">Purchase Orders</CardTitle>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Button - full width on mobile */}
      <Button 
        onClick={() => setShowCreateDialog(true)} 
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Purchase Order
      </Button>
    </div>
  </div>
</CardHeader>


        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                  <TableCell className="font-medium">
  {order.supplier?.
companyName ?? "N/A"}
</TableCell>
                  <TableCell>{order.date.toISOString().split("T")[0]}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.expectedDelivery ? order.expectedDelivery.toISOString() : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" >
                        <DropdownMenuItem onClick={() => handleView(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {["pending", "shipped"].includes(order.status) && (
  <DropdownMenuItem onClick={() => handleEdit(order)}>
    <Edit className="mr-2 h-4 w-4" />
    Edit Order
  </DropdownMenuItem>
)}
                        {/* {order.status === "shipped" && (
                          <DropdownMenuItem>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark as Delivered
                          </DropdownMenuItem>
                        )} */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreatePurchaseOrderDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} RecallFetchdata ={fetchData}/>
      <ViewPurchaseOrderDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        order={selectedOrder}
      />


      <UpdatePurchaseOrderDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        order={selectedOrder}
        products={products}
        onUpdated={fetchData}
      />
    </div>
  )
}
