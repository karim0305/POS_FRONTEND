"use client"

import type React from "react"
import { toast } from "react-toastify";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { productApi, purchaseApi, SupplierApi } from "@/lib/api/apis"

interface CreatePurchaseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  RecallFetchdata:()=>void
}

interface OrderItem {
  id: string
  name: string
  product: string
  quantity: number
  unitPrice: number
  productId?: string // ✅ Added to hold actual Product._id
}

export function CreatePurchaseOrderDialog({ open, onOpenChange ,RecallFetchdata }: CreatePurchaseOrderDialogProps) {
  const [formData, setFormData] = useState({
    supplier: "",
    expectedDelivery: "",
    notes: "",
    payAmount: 0,
  })



  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [mockSuppliert , setmockSupplier] = useState<any[]>([])
  useEffect(() => {
    fetchData();
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
  try {
    const res = await fetch(SupplierApi.getSuppliers); // ✅ sahi endpoint lagao
    const result = await res.json();

    console.log("Supplier API result:", result);

    // agar suppliers array hai to set karo
    if (Array.isArray(result.data)) {
      setmockSupplier(result.data);
    } else {
      setmockSupplier([]); // fallback
    }
  } catch (error) {
    console.error("Error fetching supplier:", error);
    setmockSupplier([]);
  }
};


  const fetchData = async () => {
    const res = await fetch(productApi.getProducts);
    const data = await res.json();
    setProducts(data);
    console.log(data);
  };
  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      product: "",
      quantity: 1,
      unitPrice: 0,
      name: ""
    }
    setOrderItems([...orderItems, newItem])
  }

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const getTotal = () => {
    return orderItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🛑 Validation: Supplier required
  if (!formData.supplier || formData.supplier === "no-supplier") {
    toast.error("❌ Please select a supplier (or register one first)!");
    return;
  }

  // 🛑 Validation: Items array empty
  if (orderItems.length === 0) {
    toast.error("❌ Please add at least one item!");
    return;
  }

  // 🛑 Validation for each item
  for (const [index, item] of orderItems.entries()) {
    if (!item.productId || item.productId === "no-product") {
      toast.error(`❌ Please select a product for item ${index + 1}`);
      return;
    }
    if (!item.quantity || item.quantity <= 0) {
      toast.error(`❌ Please enter quantity for item ${index + 1}`);
      return;
    }
    if (!item.unitPrice || item.unitPrice <= 0) {
      toast.error(`❌ Please enter price for item ${index + 1}`);
      return;
    }
  }

  const payload = {
    orderId: `ORD-${Date.now()}`,
    supplier: formData.supplier,
    expectedDelivery: new Date(formData.expectedDelivery),
    notes: formData.notes,
    payAmount: formData.payAmount,
    items: orderItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.unitPrice,
      unit: item.quantity,
    })),
    total: orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ),
  };

  try {
    const res = await fetch(purchaseApi.addOrder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "❌ Failed to add Order");
      return;
    }
    RecallFetchdata();
    toast.success(result.message || "✅ Order added successfully!");

    onOpenChange(false);
    setFormData({ supplier: "", expectedDelivery: "", notes: "", payAmount: 0 });
    setOrderItems([]);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    toast.error("❌ Something went wrong while creating the order!");
  }
};




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
{
  mockSuppliert && mockSuppliert.length > 0 ? (
    mockSuppliert.map((s) => (
      <SelectItem key={s._id} value={s._id}>
        {s.companyName}
      </SelectItem>
    ))
  ) : (
    <SelectItem disabled value="no-supplier">No Supplier</SelectItem>
  )
}
                     
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                  <Input
                    id="expectedDelivery"
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or special instructions"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  {/* Product */}
                  <div className="col-span-5 space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateOrderItem(item.id, "productId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateOrderItem(item.id, "quantity", Number(e.target.value) || 1)
                      }
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateOrderItem(item.id, "unitPrice", Number(e.target.value) || 0)
                      }
                    />
                  </div>

                  {/* Total */}
                  <div className="col-span-2 space-y-2">
                    <Label>Total</Label>
                    <div className="h-10 flex items-center font-medium">
                      Rs.{(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove button */}
                  <div className="col-span-1">
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeOrderItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Total row */}
              <div className="flex justify-between items-center pt-4 border-t">
 <div className="flex items-center gap-2">
  <label className="text-lg font-bold">Pay Amount:</label>
  <input
    type="number"
    value={formData.payAmount}
    onChange={(e) =>
      setFormData({ ...formData, payAmount: Number(e.target.value) || 0 })
    }
    className="border rounded px-2 py-1 w-32 text-right font-mono"
    placeholder="0.00"
  />
</div>
  <div className="text-right">
    <div className="text-lg font-bold">
      Total: Rs.{getTotal().toFixed(2)}
    </div>
  </div>
</div>

            </CardContent>
          </Card>


          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Purchase Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
