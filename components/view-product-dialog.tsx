"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ViewProductDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewProductDialog({ product, open, onOpenChange }: ViewProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    barcode: "",
    images: [] as string[],
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        description: product.description || "",
        barcode: product.barcode || "",
        images: product.images || [],
      })
      setCurrentIndex(0) // reset when product changes
    }
  }, [product])

  if (!product) return null

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === formData.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? formData.images.length - 1 : prev - 1
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogClose asChild>
  <Button variant="ghost" size="icon" className="absolute right-2 top-2">
    ✕
  </Button>
</DialogClose>
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card Design */}
          <Card className="p-4 shadow-md rounded-2xl">
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <Label>SKU</Label>
                <p className="font-medium">{formData.sku}</p>
              </div>

              <div>
                <Label>Category</Label>
                <p className="font-medium">{formData.category}</p>
              </div>
              <div>
                <Label>Barcode</Label>
                <p className="font-medium">{formData.barcode}</p>
              </div>

              <div>
                <Label>Price (Rs)</Label>
                <p className="font-medium">{formData.price}</p>
              </div>
              <div>
                <Label>Stock Quantity</Label>
                <p className="font-medium">{formData.stock}</p>
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <p className="text-muted-foreground">{formData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Image Slider */}
          {formData.images.length > 0 && (
            <div>
              <Label>Product Images</Label>
              <div className="relative mt-3 w-full h-72 flex items-center justify-center bg-gray-100 rounded-xl shadow-md overflow-hidden">
                <img
                  src={`http://localhost:3010${formData.images[currentIndex]}`}
                  alt={`product-${currentIndex}`}
                  className="w-full h-full object-contain"
                />

                {/* Prev Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-3 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-3 flex gap-2">
                  {formData.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${
                        idx === currentIndex ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
