"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Shield, Users, UserCheck, Clock, Wallet, DollarSign } from "lucide-react"
import { toast } from "react-toastify"
import { SupplierApi, UserApi } from "@/lib/api/apis"
import { Supplier } from "@/lib/types/supplier.type"
import {AddUSupplierDialog} from "../components/add-supplier-dialog"
import {EditSupplierDialog} from "../components/edit-supplier-dialog"
import { CashSupplierDialog } from "./Cash-supplier-dialog"

export function SupplyManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCashDialog, setShowCashDialog] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [mockSupplier, setmockSupplier] = useState<Supplier[]>([]) // Initialize with an empty array

  const fetchSupplier = async () => {
  try {
    const res = await fetch(SupplierApi.getSuppliers); // ✅ sahi endpoint lagao
    const result = await res.json();

    console.log("Supplier API result:", result);

    // agar suppliers array hai to set karo
    if (Array.isArray(result.data)) {
      setmockSupplier(result.data);
    } else {
      setmockSupplier([]); // fallback
    }
  } catch (error) {
    console.error("Error fetching supplier:", error);
    setmockSupplier([]);
  }
};


  useEffect(() => {
    fetchSupplier()
  }, [])

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setShowEditDialog(true)
  }
 
  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        const res = await fetch(SupplierApi.deleteSupplier(id), {
          method: "DELETE",
        })
        if (res.ok) {
          setmockSupplier((prev) => prev.filter((supplier) => supplier._id !== id))
          fetchSupplier();
          toast.success("Supplier deleted successfully")

        } else {
          toast.error("Failed to delete supplier")
        }
      } catch (error) {
        console.error("Error deleting supplier:", error)
        toast.error("An error occurred while deleting the supplier")
      }
    }
  }

  const handleCash = (supplier: Supplier)=>{
    setSelectedSupplier(supplier)
    setShowCashDialog(true)
  }

  const getActiveSuppliers = () => mockSupplier.filter((s) => s.status === "Active").length
  const getTotalSuppliers = () => mockSupplier.length
  const getInactiveSuppliers = () => mockSupplier.filter((s) => s.status === "Inactive").length

  return (
    <div className="space-y-6">
      {/* Supplier Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalSuppliers()}</div>
            <p className="text-xs text-muted-foreground">Registered Suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveSuppliers()}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Suppliers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getInactiveSuppliers()}</div>
            <p className="text-xs text-muted-foreground">Marked as Inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Till To Date</p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Suppliers</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email</TableHead>
                
                <TableHead>Supply Items</TableHead>
                                <TableHead>Dabit</TableHead>

                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSupplier.map((s, index) => (
                <TableRow key={s._id ?? index}>
                   <TableCell>{s.companyName}</TableCell>
                  <TableCell>{s.fullName}</TableCell>
              
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>{s.address}</TableCell>
                  <TableCell>{s.email}</TableCell>
                 
                  <TableCell>{s.supplyItems?.join(", ")}</TableCell>
                    <TableCell>Rs.
      {s.remaining ?? 0}
    </TableCell>
<TableCell>
  <div className="flex items-center gap-2">
    {s.status === "Inactive" && (
      <>
        <span className="h-2 w-2 rounded-full bg-red-500"></span>
        <span className="text-red-500 font-medium">{s.status}</span>
      </>
    )}
    {s.status === "Active" && (
      <>
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-green-600 font-medium">{s.status}</span>
      </>
    )}
    {/* fallback for other statuses */}
    {!["Active", "Inactive"].includes(s.status) && (
      <span>{s.status}</span>
    )}
  </div>
</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(s)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Supplier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(s._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Supplier
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-success"
                          onClick={() => handleCash(s)}
                        >
                          <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                          HandCash
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
      <AddUSupplierDialog open={showAddDialog} onOpenChange={setShowAddDialog} RecalFetchSupplier = {fetchSupplier} />
      <EditSupplierDialog Sup={selectedSupplier} open={showEditDialog} onOpenChange={setShowEditDialog} RecalFetchSupplier = {fetchSupplier}  />
      <CashSupplierDialog open={showCashDialog} Sup={selectedSupplier} onOpenChange={setShowCashDialog} RecalFetchSupplier = {fetchSupplier}   />   
    </div>
  )
}
