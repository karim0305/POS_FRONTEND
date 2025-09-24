"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Receipt, RefreshCw, Pencil } from "lucide-react"
import { SaleApi } from "@/lib/api/apis"
import { Sale } from "@/lib/types/sale.type"
import { SaleViewDialog } from "./ViewInvice"
import InvoicePreview from "./InvoicePreview"
import { EditInvoiceDialog } from "./editInvice"


export function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mockSales, setMockSales] = useState<Sale[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [open, setOpen] = useState(false);

    const [showInvoice, setShowInvoice] = useState(false);
    const [latestSale, setLatestSale] = useState<any>(null);
    const [todayStats, setTodayStats] = useState({
  totalSales: 0,
  avgSales: 0,
  totalItems: 0,
  invoices: 0,
});
    const [showedit, setShowEdit] = useState(false);


  useEffect(() => {
    GetHistory();
    TodayStats();
  }, [])
  const GetHistory = async () => {
    const res = await fetch(SaleApi.SaleHistory);
    const data = await res.json();
    setMockSales(data);
    console.log(data);
  };


  const TodayStats = async () => {
  try {
    const res = await fetch(SaleApi.todaystats);
    const data = await res.json();
    setTodayStats(data);
    console.log("Today Stats:", data);
  } catch (err) {
    console.error("Error fetching today stats:", err);
  }
};


  const handleRefund = async (id: string) => {
    try {
      const res = await fetch(SaleApi.RefundSale(id), {
        method: "PATCH", // 👈 yahan PATCH hona chahiye, POST nahi
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "❌ Refund failed");
        return;
      }

      toast.success("✅ Sale refunded successfully!");
      console.log("Refund Response:", data);
    } catch (error) {
      console.error("Refund error:", error);
      toast.error("⚠️ Something went wrong while refunding");
    }
  };


  const ViewDetails = async (id: string) => {
    const res = await fetch(SaleApi.getSaleById(id));
    const data = await res.json();
    setSales([data]);
    setOpen(true);
    console.log(data);
  }
  const handlePrint = async (id: string) => {
  

    setLatestSale(id)
    setShowInvoice(true)


  }

  const closedial = () => {
    setOpen(false);
  }

const filteredSales = mockSales.filter((sale) => {
  // Remove the "Inv_No:" prefix and extra spaces
  const invoiceNumber = sale.Invoice?.replace("Inv_No:", "").trim() || "";

  return invoiceNumber.includes(searchTerm.trim());
});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "REFUNDED":
        return <Badge variant="destructive">Refunded</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }


  const getTodayTotal = () => {
    const today = "2024-01-15"
    return mockSales
      .filter((sale) => sale.date === today && sale.status === "COMPLETED")
      .reduce((total, sale) => total + sale.total, 0)
  }

  const getTodayTransactions = () => {
    const today = "2024-01-15"
    return mockSales.filter((sale) => sale.date === today).length
  }




const [selectedSale, setSelectedSale] = useState<any | null>(null)

const handleUpdate = (id: string) => {
  setSelectedSale(id)   // ✅ sirf id set karo
  setShowEdit(true)
}

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
   <div className="grid gap-4 md:grid-cols-3">
  {/* Total Sales */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
      <Receipt className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">Rs.{todayStats?.totalSales ? todayStats.totalSales.toFixed(2) : "0.00"}</div>
      <p className="text-xs text-muted-foreground">{todayStats?.invoices ? todayStats.invoices : 0} transactions</p>
    </CardContent>
  </Card>

  {/* Average Sale */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
      <Receipt className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        Rs.{todayStats.avgSales.toFixed(2)}
      </div>
      <p className="text-xs text-muted-foreground">Per transaction</p>
    </CardContent>
  </Card>

  {/* Items Sold */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
      <Receipt className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{todayStats.totalItems}</div>
      <p className="text-xs text-muted-foreground">Today</p>
    </CardContent>
  </Card>
</div>


      {/* Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales History</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Invice No</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>

                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale, index) => (

                <TableRow key={sale._id}>
                  <TableCell className="font-mono text-sm text-center">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.Invoice}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm"> <div className="text-sm text-muted-foreground">  {new Date(sale.date).toLocaleString()}</div></TableCell>
                  <TableCell>
                    {typeof sale.customer === "string"
                      ? sale.customer
                      : sale.customer?.name || "N/A"}
                  </TableCell>
                  <TableCell>{sale.items.length}</TableCell>

                  <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>

                  
                 <TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {/* Always show View */}
      <DropdownMenuItem onClick={() => ViewDetails(sale._id)}>
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>

      {sale.status === "COMPLETED" && (
        <>
          <DropdownMenuItem onClick={() => handlePrint(sale._id)}>
            <Receipt className="mr-2 h-4 w-4" />
            Print Receipt
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive"
            onClick={() => handleRefund(sale._id)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Refund
          </DropdownMenuItem>
        </>
      )}

      {sale.status === "PENDING" && (
        <DropdownMenuItem
          className="text-success"
          onClick={() => handleUpdate(sale._id)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Update Bill
        </DropdownMenuItem>
      )}

      {/* REFUNDED → sirf View (already handled above) */}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>




                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <SaleViewDialog open={open} sales={sales[0]} close={closedial} />
     
      {showInvoice && latestSale && (
        <InvoicePreview
          saleId={latestSale}
          onClose={() => {
            setShowInvoice(false);
            setLatestSale(null);
          }}
        />
      )}

  {/* <EditInvoiceDialog 
  open={showedit} 
  sales={selectedSale} 
  close={() => setShowEdit(false)} 
/> */}



<EditInvoiceDialog 
  open={showedit} 
  saleId={selectedSale}   // ✅ sirf id bhejo
  close={() => setShowEdit(false)} 
/>

    </div>
  )
}
