"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Star,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react"

import { AddCustomerDialog } from "@/components/add-customer-dialog"
import { CustomerDetailsDialog } from "@/components/customer-details-dialog"
import { CustomerApi } from "@/lib/api/apis"
import { Customer } from "@/lib/types/customer.type"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { AdjustPointsDialog } from "./customer-adjust-point"
import { CashCustomerDialog } from "./Cash-customer-dialog"

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [OpenCashDialog, setOpenCashDialog] = useState(false)

  // Adjust Points dialog states
  const [openPointsDialog, setOpenPointsDialog] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  // Fetch all customers
  const fetchData = async () => {
    try {
      const res = await fetch(CustomerApi.getCustomer)
      const data = await res.json()
      if (data.success) {
        setCustomers(data.data) // ✅ backend me "data" me list hai
      }
    } catch (err) {
      console.error("❌ Failed to fetch customers:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Search filter
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.includes(searchTerm) ||
      (customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
  )

  // Badge by tier
  const getTierBadge = (tier: string) => {
    switch (tier.toLowerCase()) {
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

  // Quick stats
  const getTotalCustomers = () => customers.length
  const getTotalRevenue = () => customers.reduce((total, customer) => total + (customer.totalSpent || 0), 0)
  const getAverageOrderValue = () => {
    const totalOrders = customers.reduce((total, c) => total + (c.salestransection?.length || 0), 0)
    return totalOrders > 0 ? getTotalRevenue() / totalOrders : 0
  }
  const getRepeatCustomers = () => customers.filter((c) => (c.salestransection?.length || 0) > 1).length

  return (
    <div className="space-y-6">
      {/* Customer Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalCustomers()}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {getTotalRevenue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {getAverageOrderValue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRepeatCustomers()}</div>
            <p className="text-xs text-muted-foreground">
              {getTotalCustomers() > 0 ? ((getRepeatCustomers() / getTotalCustomers()) * 100).toFixed(1) : 0}% retention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
       <CardHeader>
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {/* Title */}
    <CardTitle className="text-lg sm:text-xl">Customer Data</CardTitle>

    {/* Search + Button wrapper */}
    <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-2 sm:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </div>
  </div>
</CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Remaining</TableHead>
                
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={"/placeholder.svg"} alt={customer.name} />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{customer.contact}</TableCell>
                  <TableCell>{customer.salestransection?.length || 0}</TableCell>
                  <TableCell className="font-medium">
  Rs {customer.totalPaidAmount?.toFixed(2) || "0.00"}
</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {customer.loyaltyPoints}
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(customer.tier)}</TableCell>
               <TableCell className="text-sm text-muted-foreground">
  {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : "N/A"}
</TableCell>
<TableCell className="font-medium">
  Rs {customer.remaining?.toFixed(2) || "0.00"}
</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetailsDialog(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedCustomer(customer)
                          setShowEditDialog(true)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem  onClick={() => {
    setSelectedCustomerId(customer._id ?? null)  // 👈 set full customer
    setOpenPointsDialog(true)         // 👈 open dialog
  }}>
                          <Star className="mr-2 h-4 w-4" />
                          Adjust Points
                        </DropdownMenuItem>
                        
                        
                        <DropdownMenuItem  className="text-success" onClick={() => {
                          setSelectedCustomerId(customer._id ?? null)
                          setOpenCashDialog(true)
                        }}>
                          <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                          Cash By Hand
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddCustomerDialog open={showAddDialog} onOpenChange={setShowAddDialog} onUpdated ={fetchData}/>

      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}

      {selectedCustomer && (
        <EditCustomerDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          customer={selectedCustomer}
          onUpdated={fetchData}
        />
      )}

      <AdjustPointsDialog
        open={openPointsDialog}
        onOpenChange={setOpenPointsDialog}
        customerId={selectedCustomerId}
        onUpdated={fetchData}
      />

            <CashCustomerDialog 
             open={OpenCashDialog}
          onOpenChange={setOpenCashDialog}
         customerId={selectedCustomerId}
          onUpdated={fetchData}
            
            />   
      
    </div>
  )
}
