"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SupplierApi } from "@/lib/api/apis"
import type { Supplier } from "../lib/types/supplier.type" // 👈 apni interface wali file ka path use karna

interface AddSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  RecalFetchSupplier:()=>void
}

export function AddUSupplierDialog({ open, onOpenChange, RecalFetchSupplier }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    fullName: "",
    cnic: "",
    phone: "",
    email: "",
    address: "",
    companyName: "",
    supplyItems: [],
    status: "Active",
    openingBalance: 0,
    totalCredit: 0,
    totalDebit: 0,
    currentBalance: 0,
    gstNumber: "",
    bankDetails: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   if (!(formData.companyName ?? "").trim()) {
  toast.error("❌ Company name is required")
  return
}

    try {
      const res = await fetch(SupplierApi.addSupplier, {
        method: "POST",
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
        toast.error(result.message || "❌ Failed to add supplier")
        return
      }
      RecalFetchSupplier();
      toast.success(result.message || "✅ Supplier added successfully!")
      onOpenChange(false)

      // Reset form
      setFormData({
        fullName: "",
        cnic: "",
        phone: "",
        email: "",
        address: "",
        companyName: "",
        supplyItems: [],
        status: "Active",
        openingBalance: 0,
        totalCredit: 0,
        totalDebit: 0,
        currentBalance: 0,
        gstNumber: "",
        bankDetails: "",
      })
    } catch (err) {
      console.error(err)
      toast.error("⚠️ Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter supplier name"
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
              placeholder="xxxxx-xxxxxxx-x"
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
              placeholder="+92-300-xxxxxxx"
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
              placeholder="supplier@example.com"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter supplier address"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName || ""}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="ABC Traders"
            />
          </div>

          {/* Supply Items */}
          <div className="space-y-2">
            <Label htmlFor="supplyItems">Supply Items (comma separated)</Label>
            <Input
              id="supplyItems"
              value={formData.supplyItems?.join(", ") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  supplyItems: e.target.value.split(",").map((i) => i.trim()),
                })
              }
              placeholder="Product 1, Product 2"
            />
          </div>

          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber || ""}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              placeholder="07XXXXXXXXXX"
            />
          </div>

          {/* Bank Details */}
          <div className="space-y-2">
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Input
              id="bankDetails"
              value={formData.bankDetails || ""}
              onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
              placeholder="HBL Bank - 1234567890"
            />
          </div>

          {/* Opening Balance */}
       

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
            <Button type="submit">Add Supplier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
