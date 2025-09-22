"use client"
import { toast } from "react-toastify";
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productApi } from "@/lib/api/apis";

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  RecallFetch: ()=>void
}

export function AddProductDialog({ open, onOpenChange,RecallFetch }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    barcode: "",
    images: [] as File[], // store files instead of strings
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files),
      })
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("sku", formData.sku);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("barcode", formData.barcode);

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    try {
      const res = await fetch(productApi.addProduct, {
        method: "POST",
        body: data,
      });

      const result = await res.json(); // ✅ parse backend JSON

      if (!res.ok) {
        toast.error(result.message || "❌ Failed to add product");
        return;
      }
      RecallFetch();
      toast.success(result.message || "✅ Product added successfully!");

      // Reset form and close modal
      onOpenChange(false);
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        barcode: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong. Please try again.");
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          {/* Category + Barcode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Enter barcode"
              />
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div> */}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Multiple Images */}
          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="w-20 h-20 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
