"use client"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { AddProductDialog } from "@/components/add-product-dialog"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { DeleteProductDialog } from "@/components/delete-product-dialog"
import { productApi } from "@/lib/api/apis"
import { ViewProductDialog } from "./view-product-dialog"

// Mock product data



 
export function ProductsTable() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showviewD1ialgo, setviewDialog] =useState(false)
  const [query, setQuery] = useState("")


  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (status === "low_stock" || stock < 20) {
      return <Badge variant="secondary">Low Stock</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
  }

   const fetchData = async () => {
      const res = await fetch(productApi.getProducts);
      const data = await res.json();
      setProducts(data);
      console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleview=(product:any)=>{
     setSelectedProduct(product)
    setviewDialog(true)
  }
  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setShowEditDialog(true)
  }

  const handleDelete = (product: any) => {
    setSelectedProduct(product)
    setShowDeleteDialog(true)
  }
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if(e.target.value === ""){
      fetchData();
    }else{
      const filtered = products.filter(product => product.name.toLowerCase().includes(e.target.value.toLowerCase()) || product.sku.toLowerCase().includes(e.target.value.toLowerCase()) || product.category.toLowerCase().includes(e.target.value.toLowerCase()));
      setProducts(filtered);
    } 
  }

  return (
    <>
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground">Manage your inventory and product catalog</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
           placeholder="Search products..." 
           className="pl-10 md:w-80"
           onChange={onchange}
           value={query}
            />
        </div>
        {/* <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button> */}
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      
    </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                 <TableCell>
  <div className="flex items-center gap-3">
    <img
      src={product.images?.length ? product.images[0] : "/placeholder.svg"}
      alt={product.name}
      className="h-10 w-10 rounded-md object-cover"
    />
    <div>
      <div className="font-medium">{product.name}</div>
    </div>
  </div>
</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rs.{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={()=>handleview(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
      <AddProductDialog open={showAddDialog} onOpenChange={setShowAddDialog} RecallFetch = {fetchData} />
      <ViewProductDialog 
  product={selectedProduct} 
  open={showviewD1ialgo} 
  onOpenChange={setviewDialog} 
/>
      <EditProductDialog product={selectedProduct} open={showEditDialog} onOpenChange={setShowEditDialog} getmethod={fetchData}  />

      <DeleteProductDialog product={selectedProduct} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} getmethod={fetchData} />
    </>
  )
}
