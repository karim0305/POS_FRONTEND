"use client"

import type React from "react"
import { toast } from "react-toastify"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CustomerApi } from "@/lib/api/apis"

interface AddCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated:()=>void

}

export function AddCustomerDialog({ open, onOpenChange,onUpdated }: AddCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // 👈 email field added
    contact: "",
    customerType: "Regular",
    totalSpent: 0,
    loyaltyPoints: 0,
    tier: "Bronze",
    lastPurchase: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(CustomerApi.addCustomer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log("📌 API Response:", data)

      if (!res.ok || data.success === false) {
        toast.error(data.message || "❌ Failed to add customer")
        return
      }
      onUpdated();
      toast.success(data.message || "✅ Customer added successfully!")

      // Close dialog
      onOpenChange(false)

      // Reset form
      setFormData({
        name: "",
        email: "",
        contact: "",
        customerType: "Regular",
        totalSpent: 0,
        loyaltyPoints: 0,
        tier: "Bronze",
        lastPurchase: "",
      })
    } catch (error: any) {
      console.error("❌ Error adding customer:", error)
      toast.error(error.message || "❌ Failed to add customer. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">Full Name</Label>
            <Input
              id="customer-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="customer-contact">Phone Number</Label>
            <Input
              id="customer-contact"
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Customer Type */}
          <div className="space-y-2">
            <Label>Customer Type</Label>
            <Select
              value={formData.customerType}
              onValueChange={(value) => setFormData({ ...formData, customerType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loyalty Points */}
          <div className="space-y-2">
            <Label htmlFor="customer-loyalty">Loyalty Points</Label>
            <Input
              id="customer-loyalty"
              type="number"
              value={formData.loyaltyPoints}
              onChange={(e) =>
                setFormData({ ...formData, loyaltyPoints: Number(e.target.value) })
              }
              placeholder="Enter loyalty points"
            />
          </div>

          {/* Tier */}
          <div className="space-y-2">
            <Label>Tier</Label>
            <Select
              value={formData.tier}
              onValueChange={(value) => setFormData({ ...formData, tier: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bronze">Bronze</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Customer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
