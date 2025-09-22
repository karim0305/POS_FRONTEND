"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface SaleViewProps {
  open: boolean
  sales: any
  close: () => void
}

export function SaleViewDialog({ open, sales, close }: SaleViewProps) {
  if (!sales) return null

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Sale</DialogTitle>
        </DialogHeader>

        {/* Sale Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Invoice</Label>
                <div className="font-medium">{sales.Invoice}</div>
              </div>
              <div className="space-y-1">
                <Label>Customer</Label>
                <div className="font-medium">{sales.customer}</div>
              </div>
              <div className="space-y-1">
                <Label>Date</Label>
                <div className="font-medium">
                  {sales.date ? new Date(sales.date).toLocaleString() : "—"}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <div className="font-medium capitalize">{sales.status}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sale Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sale Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sales.items?.map((item: any, index: number) => (
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
                <div className="text-lg font-bold">Total: ${sales.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={close}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
