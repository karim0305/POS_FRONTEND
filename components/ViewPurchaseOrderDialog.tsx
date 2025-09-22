"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ViewPurchaseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any // Replace with proper type (PurchaseOrderDto)
}

export function ViewPurchaseOrderDialog({ open, onOpenChange, order }: ViewPurchaseOrderDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Purchase Order</DialogTitle>
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
                <div className="font-medium">{order.orderId}</div>
              </div>
              <div className="space-y-1">
                <Label>Supplier</Label>
                <div className="font-medium">  {order.supplier?.
companyName ?? "N/A"}</div>
              </div>
              <div className="space-y-1">
                <Label>Expected Delivery</Label>
                <div className="font-medium">
                  {order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : "—"}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <div className="font-medium capitalize">{order.status || "pending"}</div>
              </div>
            </div>
            {order.notes && (
              <div className="space-y-1">
                <Label>Notes</Label>
                <div className="font-medium">{order.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                {/* Product */}
                <div className="col-span-5 space-y-1">
                  <Label>Product</Label>
                  <div className="font-medium">{item.product?.name || item.product}</div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 space-y-1">
                  <Label>Quantity</Label>
                  <div className="font-medium">{item.quantity}</div>
                </div>

                {/* Unit Price */}
                <div className="col-span-2 space-y-1">
                  <Label>Unit Price</Label>
                  <div className="font-medium">${item.price.toFixed(2)}</div>
                </div>

                {/* Total */}
                <div className="col-span-2 space-y-1">
                  <Label>Total</Label>
                  <div className="font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <div className="text-lg font-bold">Total: ${order.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
