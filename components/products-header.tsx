"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { AddProductDialog } from "@/components/add-product-dialog"

export function ProductsHeader() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground">Manage your inventory and product catalog</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10 md:w-80" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <AddProductDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
