"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { productApi } from "@/lib/api/apis"
import { toast } from "react-toastify"

interface DeleteProductDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
  getmethod: () => void
}


export function DeleteProductDialog({ product, open, onOpenChange, getmethod }: DeleteProductDialogProps) {
  const handleDelete = async () => {
    if (!product?._id) return;

    try {
      const res = await fetch(productApi.deleteProduct(product._id), {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "❌ Failed to delete product");
        return;
      }

      toast.success(result.message || "✅ Product deleted successfully!");
      getmethod(); // Refresh the product list
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong. Please try again.");
    }
  }
  if (!product) return null


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
