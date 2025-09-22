"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CustomerApi } from "@/lib/api/apis"
import { Star } from "lucide-react"

interface AdjustPointsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string | null
  onUpdated: () => void
}

export function AdjustPointsDialog({ open, onOpenChange, customerId, onUpdated }: AdjustPointsDialogProps) {
  const [selectedStars, setSelectedStars] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleStarClick = (star: number) => {
    setSelectedStars(star)
  }

  const handleSave = async () => {
    if (!customerId) return
    setLoading(true)
    try {
      const res = await fetch(CustomerApi.UpdateCustomer(customerId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loyaltyPoints: selectedStars * 10 }), // 👈 1 star = 10 points (customizable)
      })

      const data = await res.json()
      if (!res.ok || data.success === false) {
        toast.error(data.message || "❌ Failed to adjust points")
        return
      }

      toast.success("✅ Points updated successfully!")
      onOpenChange(false)
      onUpdated()
    } catch (err: any) {
      toast.error(err.message || "❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust Loyalty Points</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center space-x-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer ${
                star <= selectedStars ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || selectedStars === 0}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
