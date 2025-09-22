"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, Phone, Mail, ShoppingBag, DollarSign } from "lucide-react"

interface CustomerDetailsDialogProps {
  customer: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  if (!customer) return null

  const getTierBadge = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Platinum</Badge>
      case "gold":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Gold</Badge>
      case "silver":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Silver</Badge>
      case "bronze":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Bronze</Badge>
      default:
        return <Badge variant="outline">{tier}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                  <AvatarFallback className="text-lg">
                    {customer.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{customer.name}</h3>
                    {getTierBadge(customer.tier)}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.contact}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${customer.totalSpent?.toFixed(2) || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.salestransection?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customer.loyaltyPoints || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.salestransection?.length > 0 ? (
                  customer.salestransection.map((txn: any, index: number) => (
                    <div key={txn._id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{txn.invoiceNo}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString()} ({txn.AmmountType})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${txn.paidAmount.toFixed(2)}</div>
                        </div>
                      </div>
                      {index < customer.salestransection.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No transactions found</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
           
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
