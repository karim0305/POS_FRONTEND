"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Minus, Trash2, ShoppingCart, Receipt } from "lucide-react"
import { SalesHistory } from "@/components/sales-history"
import { Producttype } from "@/lib/types/product.type"
import { CustomerApi, productApi, SaleApi } from "@/lib/api/apis"
import { Customer } from "@/lib/types/customer.type";
import InvoicePreview from "./InvoicePreview";

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  sku: string
  stock: number | string
  images: string[]
}

export function SalesInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [mockProducts, setMockProducts] = useState<Producttype[]>([])
  const [payAmount, setPayAmount] = useState<number>(0) // 👈 Pay Amount state
   const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
    const [showInvoice, setShowInvoice] = useState(false);
  const [latestSale, setLatestSale] = useState<any>(null);
  const [status, setStatus] = useState("COMPLETED");


  // Fetch products
  const fetchData = async () => {
    const res = await fetch(productApi.getProducts)
    const data = await res.json()
    setMockProducts(data)
  }

  const fetchCustomer = async () => {
      try {
        const res = await fetch(CustomerApi.getCustomer)
        const data = await res.json()
        if (data.success) {
          setCustomers(data.data)
          console.log(data.data); // ✅ backend me "data" me list hai
        }
      } catch (err) {
        console.error("❌ Failed to fetch customers:", err)
      }
    }
  


  useEffect(() => {
    fetchData()
    fetchCustomer();
  }, [])

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.barcode).toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add to Cart
  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item._id === product._id)

      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        const newItem: CartItem = {
          _id: product._id,
          name: product.name,
          price: Number(product.price),
          sku: product.sku,
          quantity: 1,
          stock: Number(product.stock),
          images: Array.isArray(product.images)
            ? product.images.map((img: any) =>
              typeof img === "string" ? img : img.url ?? ""
            )
            : [],
        }
        return [...prev, newItem]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id))
  }

  const getTotal = () =>
    cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0)
  const getTax = () => getTotal() * 0.08
  //const getFinalTotal = () => getTotal() + getTax()
  const getFinalTotal = () => getTotal()

  // 🟢 Whenever cart changes → reset payAmount = final total
  useEffect(() => {
    setPayAmount(getFinalTotal())
  }, [cart])

 const processPayment = async () => {
  if (cart.length === 0) {
    toast.error("Cart is empty!");
    return;
  }

  const saleData = {
    Invoice: `Inv_No: ${Date.now().toString().slice(-6)}`,
    customer: selectedCustomer,
    items: cart.map(item => ({
      product: item._id,
      quantity: item.quantity,
      price: item.price,
    })),
    total: getFinalTotal(), // 👈 keep this as calculated total
     status: status,
    PayAmmount: payAmount,   // 👈 whatever user entered
  };

  try {
    const res = await fetch(SaleApi.ProcessPayment, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || result.error || "❌ Failed to process sale");
      return;
    }

    toast.success(result.message || "✅ Sale processed successfully!");
    setCart([]);
    fetchData();
    setLatestSale(result.data?._id);
      setShowInvoice(true);
  } catch (err) {
    console.error(err);
    toast.error("⚠️ Something went wrong. Please try again.");
  }
};

  const clearCart = () => setCart([])

  if (showHistory) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowHistory(false)}>
          ← Back to POS
        </Button>
        <SalesHistory />
      </div>
    )
  }

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      fetchData();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name or barcode"
              value={searchTerm}
              onChange={onchange}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowHistory(true)}>
            View History
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: any) => (
            <Card key={product._id} className="cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden h-64">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{
                  backgroundImage: product.images?.[0]
                    ? `url(http://localhost:3010${product.images[0]})`
                    : "none",
                }}
              ></div>

              <CardContent className="p-4 relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${product.price}</span>
                    <Badge variant={Number(product.stock) > 20 ? "default" : "secondary"}>
                      {product.stock} in stock
                    </Badge>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => addToCart(product)}
                  disabled={Number(product.stock) === 0}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Current Sale</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={item._id ?? item.sku ?? index} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-transparent" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0 bg-transparent" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => removeFromCart(item._id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rs.{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (0%):</span>
                    {/* <span>Rs.{getTax().toFixed(2)}</span> */}
                     <span>Rs.{0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>Rs.{getFinalTotal().toFixed(2)}</span>
                  </div>

                  {/* 🟢 Pay Amount Field */}
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>Pay Amount:</span>
                    <Input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>


    <div className="flex justify-between items-center text-sm mt-2">
  <span>Customer:</span>
  <select
    value={selectedCustomer}
    onChange={(e) => setSelectedCustomer(e.target.value)}
    className="w-32 text-right border rounded px-2 py-1"
  >
    <option value="">Cash Customer</option>
    {customers.map((c) => (
      <option key={c._id} value={c._id}>{c.name}</option>
    ))}
  </select>
</div>

{/* 🟢 Show Status dropdown only if customer is selected */}
{selectedCustomer && (
  <div className="flex justify-between items-center text-sm mt-2">
    <span>Status:</span>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-32 text-right border rounded px-2 py-1"
    >
      <option value="COMPLETED">Completed</option>
      <option value="PENDING">Pending Bill</option>
    </select>
  </div>
)}







                </div>

                <div className="space-y-2">
                  <Button className="w-full" onClick={processPayment}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* 🧾 Invoice Modal/Preview */}
{showInvoice && latestSale && (
  <InvoicePreview
    saleId={latestSale}
    onClose={() => {
      setShowInvoice(false);
      setLatestSale(null);
    }}
  />
)}
    </div>
  )
}
