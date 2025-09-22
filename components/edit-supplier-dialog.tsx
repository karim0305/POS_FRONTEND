"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SupplierApi } from "@/lib/api/apis"
import type { Supplier } from "../lib/types/supplier.type"

interface EditSupplierDialogProps {
  Sup?: Supplier | null 
  open: boolean
  onOpenChange: (open: boolean) => void
  RecalFetchSupplier:()=>void
}

export function EditSupplierDialog({ open, onOpenChange, Sup,RecalFetchSupplier }: EditSupplierDialogProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({})

  // 🔹 Pre-fill form when Sup changes
 useEffect(() => {
  if (Sup) {
    setFormData({ ...Sup })
  }
}, [Sup])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(SupplierApi.updateSupplier(Sup?._id || ""), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          openingBalance: Number(formData.openingBalance),
          totalCredit: Number(formData.totalCredit),
          totalDebit: Number(formData.totalDebit),
          currentBalance: Number(formData.currentBalance),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "❌ Failed to update supplier")
        return
      }
      RecalFetchSupplier();
      toast.success(result.message || "✅ Supplier updated successfully!")
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error("⚠️ Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          {/* CNIC */}
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC</Label>
            <Input
              id="cnic"
              value={formData.cnic || ""}
              onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName || ""}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          {/* Supply Items */}
          <div className="space-y-2">
            <Label htmlFor="supplyItems">Supply Items</Label>
            <Input
              id="supplyItems"
              value={formData.supplyItems?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  supplyItems: e.target.value.split(",").map((i) => i.trim()),
                })
              }
            />
          </div>

          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber || ""}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            />
          </div>

          {/* Bank Details */}
          <div className="space-y-2">
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Input
              id="bankDetails"
              value={formData.bankDetails || ""}
              onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
            />
          </div>

         

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || "Active"}
              onValueChange={(value) => setFormData({ ...formData, status: value as Supplier["status"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Supplier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
