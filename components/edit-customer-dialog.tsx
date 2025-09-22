"use client"

import type React from "react"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CustomerApi } from "@/lib/api/apis"
import { Customer } from "@/lib/types/customer.type"

interface EditCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onUpdated: () => void // refresh callback
}

export function EditCustomerDialog({ open, onOpenChange, customer, onUpdated }: EditCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    customerType: "Regular",
    loyaltyPoints: 0,
    tier: "Bronze",
  })

  // prefill form when dialog opens
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        contact: customer.contact,
        email: customer.email || "",
        customerType: customer.customerType || "Regular",
        loyaltyPoints: customer.loyaltyPoints || 0,
        tier: customer.tier || "Bronze",
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer?._id) return

    try {
      const res = await fetch(CustomerApi.UpdateCustomer(customer._id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok || data.success === false) {
        toast.error(data.message || "❌ Failed to update customer")
        return
      }

      toast.success(data.message || "✅ Customer updated successfully!")
      onOpenChange(false)
      onUpdated()
    } catch (error: any) {
      console.error("❌ Error updating customer:", error)
      toast.error(error.message || "❌ Failed to update customer. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
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

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
