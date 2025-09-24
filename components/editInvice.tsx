"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { productApi, SaleApi } from "@/lib/api/apis"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface SaleEditProps {
  open: boolean
  saleId: string | null
  close: () => void
}

export function EditInvoiceDialog({ open, saleId, close }: SaleEditProps) {
  const [formData, setFormData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [payment, setPayment] = useState<number>(0)

  // Fetch sale by ID
  const GetHistory = async () => {
    if (!saleId) return
    try {
      const res = await fetch(SaleApi.getSaleById(saleId))
      const data = await res.json()

      setFormData({
        ...data,
        items: (data.items || []).map((item: any) => ({
          ...item,
          product: typeof item.product === "object" ? item.product._id : item.product,
        })),
      })
      setPayment(data.PayAmmount || 0)
    } catch (err) {
      console.error("❌ Failed to fetch sale:", err)
      toast.error("Could not load sale data")
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(productApi.getProducts)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("❌ Failed to fetch products:", err)
      toast.error("⚠️ Could not load products")
    }
  }

  // Run when dialog opens
  useEffect(() => {
    if (open) {
      GetHistory()
      fetchProducts()
    }
  }, [open, saleId])

  // Total calculation
  const total = formData?.items?.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0) * (item.price || 0),
    0
  ) || 0

  // Sync total with payment
  

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto set price if product changed
    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value)
      if (selectedProduct) newItems[index].price = selectedProduct.price || 0
      if (!newItems[index].quantity) newItems[index].quantity = 1
    }

    setFormData({ ...formData, items: newItems })
  }

  // Add new item row
  const addNewItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { product: "", quantity: 1, price: 0 }],
    })
  }


const handleSave = async () => {
  if (!formData) return

  try {
    const payload = {
      ...formData,
      total: total, // 👈 grand total overwrite
      PayAmmount: payment, // 👈 payment overwrite
    }

    const res = await fetch(SaleApi.update(saleId as any), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json() // parse backend response

    if (!res.ok) {
      toast.error(`⚠️ ${data.message || "Failed to update sale"}`)
      return
    }

    toast.success(`✅ ${data.message || "Sale updated successfully!"}`)
    close()
  } catch (err: any) {
    console.error("❌ Error updating sale:", err)
    toast.error(`⚠️ ${err.message || "Failed to update sale"}`)
  }
}



  if (!formData) return null



  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sale</DialogTitle>
        </DialogHeader>

        {/* Sale Details */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice</Label>
              <Input value={formData.Invoice} disabled />
            </div>
            <div>
              <Label>Customer</Label>
              <Input value={formData.customer?.name || formData.customer} disabled />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sale Items */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Sale Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 font-semibold border-b pb-1">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3">Total</div>
            </div>

          {formData.items?.map((item: any, index: number) => (
  <div key={index} className="grid grid-cols-12 gap-2 items-center">
    {/* Product */}
    <div className="col-span-5">
      <Select
        value={item.product}
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

    {/* Quantity */}
    <div className="col-span-2">
      <Input
        type="number"
        value={item.quantity}
        className="h-12 text-center"
        onChange={(e) =>
          handleItemChange(index, "quantity", Number(e.target.value))
        }
      />
    </div>

    {/* Price */}
    <div className="col-span-2">
      <Input
        type="number"
        value={item.price}
        className="h-12 text-center"
        onChange={(e) =>
          handleItemChange(index, "price", Number(e.target.value))
        }
      />
    </div>

    {/* Total */}
    <div className="col-span-2">
      <Input
        value={((item.quantity || 0) * (item.price || 0)).toFixed(2)}
        disabled
      />
    </div>

    {/* Delete button */}
   <div className="col-span-1 flex justify-center">
  <Button
    variant="destructive"
    size="icon" // small square icon button
    onClick={() => {
      const newItems = [...formData.items]
      newItems.splice(index, 1)
      setFormData({ ...formData, items: newItems })
    }}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
  </div>
))}


            {/* Add new item button */}
            <div className="pt-2">
              <Button type="button" onClick={addNewItem}>
                + Add Product
              </Button>
            </div>

            {/* Total + Payment */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <Label>Payment</Label>
                <Input
                  type="number"
                  value={payment}
                  onChange={(e) => setPayment(Number(e.target.value))}
                />
              </div>
              <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
