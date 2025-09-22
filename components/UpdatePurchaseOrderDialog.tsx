"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { OrderStatus } from "../lib/types/Purchase.type" // 👈 apna enum import karo
import { purchaseApi } from "@/lib/api/apis";

interface UpdatePurchaseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any
  onUpdated: () => void // callback after successful update
  products: any[] // product list for dropdown
}

export function UpdatePurchaseOrderDialog({
  open,
  onOpenChange,
  order,
  onUpdated,
  products,
}: UpdatePurchaseOrderDialogProps) {
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    if (order) {
     setFormData({
  ...order,
  expectedDelivery: order.expectedDelivery
    ? new Date(order.expectedDelivery).toISOString().split("T")[0]
    : "",
    payAmount: order.payAmount ?? 0,
})
    }
  }, [order])

  if (!formData) return null

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setFormData((prev: any) => ({ ...prev, items: updatedItems }))
  }

const handleSubmit = async () => {
  try {
   const cleanFormData = {
  ...formData,
  expectedDelivery: new Date(formData.expectedDelivery).toISOString(),
  supplier: formData.supplier._id ?? formData.supplier,
  items: formData.items.map((item: any) => ({
    product: item.product._id ?? item.product,
    quantity: Number(item.quantity),
    price: Number(item.price),
    total: Number(item.quantity) * Number(item.price),
  })),
  payAmount: Number(formData.payAmount) ?? 0,
  total: formData.items.reduce(
    (acc: number, i: any) => acc + i.quantity * i.price,
    0
  ), // 👈 use total instead of grandTotal
};

    const res = await fetch(purchaseApi.updateOrder(order._id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanFormData),
    });

    if (!res.ok) throw new Error("Failed to update order");
    toast.success("✅ Purchase updated successfully!");
    onUpdated();
    onOpenChange(false);
  } catch (err) {
    console.error("❌ Error updating order:", err);
  }
};



  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Purchase Order</DialogTitle>
        </DialogHeader>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Order ID</Label>
                <Input value={formData.orderId} disabled />
              </div>
              <div className="space-y-1">
                <Label>Supplier</Label>
                <Input
                  value={order.supplier?.
companyName ?? "N/A"}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Expected Delivery</Label>
                <Input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => handleChange("expectedDelivery", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.items?.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5 space-y-1">
                  <Label>Product</Label>
                  <Select
                    value={item.product?._id || item.product}
                    onValueChange={(value) => handleItemChange(index, "product", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value) || 1)
                    }
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label>Total</Label>
                  <div className="h-10 flex items-center font-medium">
                    Rs.{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
 
            {/* Total */}
            {/* Total & Pay Amount */}
<div className="flex justify-between items-center pt-4 border-t">
  <div className="flex items-center gap-2">
    <Label className="text-lg font-bold">Pay Amount:</Label>
    <Input
      type="number"
      value={formData.payAmount}
      onChange={(e) => handleChange("payAmount", Number(e.target.value) || 0)}
      className="border rounded px-2 py-1 w-32 text-right font-mono"
      placeholder="0.00"
    />
  </div>
  <div className="text-right">
    <div className="text-lg font-bold">
      Total: Rs.
      {formData.items
        .reduce((acc: number, i: any) => acc + i.quantity * i.price, 0)
        .toFixed(2)}
    </div>
  </div>
</div>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Update Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
