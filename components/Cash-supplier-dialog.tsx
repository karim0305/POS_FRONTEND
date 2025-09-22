"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SupplierApi } from "@/lib/api/apis"
import type { Supplier } from "../lib/types/supplier.type"

interface CashSupplierDialogProps {
  Sup: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
   RecalFetchSupplier:()=>void
}

export function CashSupplierDialog({ Sup, open, onOpenChange,RecalFetchSupplier }: CashSupplierDialogProps) {
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [amountType, setAmountType] = useState<"Bill" | "Payment">("Bill")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!Sup?._id) {
      toast.error("❌ Supplier not found")
      return
    }

    const newTransaction = {
      OrderNo: `ORD-${Date.now()}`, // Auto-generate OrderNo
      TransectionDate: new Date().toISOString(),
      AmountType: amountType,
      paidAmount: Number(paidAmount),
    }

    try {
      const res = await fetch(SupplierApi.HanCash(Sup._id), {
        method: "PATCH", // 👈 ya backend pe jo bhi route ho
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction: newTransaction }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "❌ Failed to add transaction")
        return
      }
      RecalFetchSupplier();
      toast.success(result.message || "✅ Transaction added successfully!")
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error("⚠️ Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Type */}
          <div className="space-y-2">
            <Label>Amount Type</Label>
            <Select value={amountType} onValueChange={(v) => setAmountType(v as "Bill" | "Payment")}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bill">Bill</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paid Amount */}
          <div className="space-y-2">
            <Label htmlFor="paidAmount">Paid Amount</Label>
            <Input
              id="paidAmount"
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
