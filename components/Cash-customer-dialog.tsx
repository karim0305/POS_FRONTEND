"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomerApi } from "@/lib/api/apis"
import type { Customer } from "@/lib/types/customer.type"

interface CashCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
 customerId: string | null
  onUpdated: () => void // refresh callback
}

export function CashCustomerDialog({ customerId, open, onOpenChange, onUpdated }: CashCustomerDialogProps) {
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [amountType, setAmountType] = useState<"Cash" | "Card">("Cash")

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log(customerId)

  if (!customerId) {
    toast.error("❌ Customer not found")
    return
  }

  const newTransaction = {
    invoiceNo: `Inv_No:-${Date.now()}`,
    AmmountType: amountType,
    status: "COMPLETED",
    paidAmount: Number(paidAmount),
    date: new Date().toISOString(),
  }

  try {
    const res = await fetch(CustomerApi.HanCash(customerId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction: newTransaction }),
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(result.message || "❌ Failed to add transaction")
      return
    }

    toast.success(result.message || "✅ Transaction added successfully!")
    onUpdated()
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
          <DialogTitle>Add Customer Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Type */}
          <div className="space-y-2">
            <Label>Amount Type</Label>
            <Select value={amountType} onValueChange={(v) => setAmountType(v as "Cash" | "Card")}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
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
