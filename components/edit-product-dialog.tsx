"use client"

import type React from "react"
import { toast } from "react-toastify";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { id } from "date-fns/locale"
import { productApi } from "@/lib/api/apis";


interface EditProductDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
   getmethod: () => void
}

export function EditProductDialog({ product, open, onOpenChange, getmethod }: EditProductDialogProps) {
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

  useEffect(() => {
    if (product) {
      console.log(product._id)
      console.log(product.category)

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category.toLowerCase() || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        description: product.description || "",
        barcode: product.barcode || "",
        images: [] as File[], // Reset images to empty array
      })
    }
  }, [product])

 const handleupdate = async (e: React.FormEvent) => {
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
    const res = await fetch(`${productApi.updateProduct(product._id)}`, {
      method: "PATCH", // or PATCH, depending on your backend
      body: data,
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "❌ Failed to update product");
      return;
    }
      getmethod(); // Refresh the product list
    toast.success(result.message || "✅ Product updated successfully!");

    // Close modal
    onOpenChange(false);
  } catch (err) {
    console.error(err);
    toast.error("⚠️ Something went wrong. Please try again.");
  }
};


  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle> Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleupdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              
              <Label htmlFor="edit-name">Product Name</Label>
              
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
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
              <Label htmlFor="edit-barcode">Barcode</Label>
              <Input
                id="edit-barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Enter barcode"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (Rs)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div> */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
           <div className="space-y-2">
  <Label htmlFor="images">Product Images</Label>
  <Input
    id="images"
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files.length > 0) {
        setFormData({
          ...formData,
          images: [...formData.images, ...Array.from(e.target.files)],
        });
      }
    }}
  />

 {/* Display existing images from the product */}
{product.images?.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2">
    {product.images.map((imgUrl: string, idx: number) => (
      <div key={`existing-${idx}`} className="w-20 h-20 border rounded overflow-hidden">
        <img
          src={imgUrl} // 👈 Cloudinary URL directly use
          alt={`existing-${idx}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
)}


  {/* Display newly selected files */}
  {formData.images.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.images.map((file, idx) => (
        <div key={`new-${idx}`} className="w-20 h-20 border rounded overflow-hidden">
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


          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
