"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import { SalesReportChart } from "@/components/sales-report-chart"
import { ProductPerformanceChart } from "@/components/product-performance-chart"
import { CustomerAnalyticsChart } from "@/components/customer-analytics-chart"
import { InventoryReportTable } from "@/components/inventory-report-table"
import { FinancialReportTable } from "@/components/financial-report-table"
import { ReportsApi } from "@/lib/api/apis"
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())
  const [reportPeriod, setReportPeriod] = useState("monthly")



    const [profit, setProfit] = useState<number | null>(null);
    const [totalsale, setTotalSale] = useState<number | null>(null);
    const [totalPurchase, setTotalPurchase] =useState<number | null>(null);
    const [totalCustomer, setTotalCustomer] =useState<number | null>(null);
  
  const fetchProfit = async () => {
    try {
      const res = await fetch(ReportsApi.getProfit);
      const data = await res.json();
  
      // Backend ka response { profit, totalSale, totalPurchase } hai
      console.log("Reports.....///"+data.profit)
      setProfit(data.profit ?? 0);
      setTotalSale(data.totalSale ?? 0);
      setTotalPurchase(data.totalPurchase ?? 0);
      setTotalCustomer(data.saleCount ?? 0);
    } catch (error) {
      console.error("Error fetching profit:", error);
    }
  };
  
  
    useEffect(() => {
      fetchProfit();
    }, []); // ✅ only run once (no infinite loop)
  

  // Mock KPI data
  const kpiData = {
    totalRevenue: { value: 45231.89, change: 20.1, trend: "up" },
    totalOrders: { value: 2350, change: 18.1, trend: "up" },
    avgOrderValue: { value: 19.25, change: -2.3, trend: "down" },
    customerCount: { value: 573, change: 12.5, trend: "up" },
  }

const exportReport = async (type: string) => {
  try {
    const res = await fetch(ReportsApi.byProductReport);
    const data = await res.json(); // 👈 this will be an array

    if (!Array.isArray(data)) throw new Error("Invalid report data");

    // ✅ Excel Export
    if (type === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((prod, i) => ({
          "#": i + 1,
          Product: prod.name,
          SKU: prod.sku,
          "Units Sold": prod.units,
          Revenue: prod.revenue,
          "Unique Invoices": prod.sales,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Product Report");
      XLSX.writeFile(workbook, "product-report.xlsx");
    }

    // ✅ PDF Export
   if (type === "pdf") {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("📊 Product Sales Report", 14, 15);

  const tableData = data.map((prod, i) => [
    i + 1,
    prod.name,
    prod.sku,
    prod.units,
    prod.revenue,
    prod.sales,
  ]);

  autoTable(doc, {
    head: [["#", "Product", "SKU", "Units Sold", "Revenue", "Invoices"]],
    body: tableData,
    startY: 25,
  });

  doc.save("product-report.pdf");
}
  } catch (error) {
    console.error("Error exporting report:", error);
  }
};


  const KPICard = ({ title, value, change, trend, icon: Icon, prefix = "" }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center text-xs">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{Math.abs(change)}%</span>
          <span className="text-muted-foreground ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Settings</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => exportReport("excel")}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Period</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange ? format(dateRange, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Overview */}
     {/* KPI Overview */}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <div className="rounded-2xl border p-4 shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
      <DollarSign className="h-5 w-5 text-gray-400" />
    </div>
    <p className="mt-2 text-2xl font-semibold">Rs.{(profit ?? 0).toFixed(2)}</p>
    <p className="text-sm text-green-600">+12.5% from last month</p>
  </div>

  <div className="rounded-2xl border p-4 shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">Total Sale</h3>
      <ShoppingCart className="h-5 w-5 text-gray-400" />
    </div>
    <p className="mt-2 text-2xl font-semibold">Rs.{totalsale}</p>
    <p className="text-sm text-red-600">-3.2% from last month</p>
  </div>

  <div className="rounded-2xl border p-4 shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">Total Purchased</h3>
      <TrendingUp className="h-5 w-5 text-gray-400" />
    </div>
    <p className="mt-2 text-2xl font-semibold">Rs. {totalPurchase}</p>
    <p className="text-sm text-green-600">+5.8% from last month</p>
  </div>

  <div className="rounded-2xl border p-4 shadow-sm bg-white">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
      <Users className="h-5 w-5 text-gray-400" />
    </div>
    <p className="mt-2 text-2xl font-semibold">{totalCustomer}</p>
    <p className="text-sm text-green-600">+1.1% from last month</p>
  </div>
</div>


      {/* Report Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="financial">Financial Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesReportChart period={reportPeriod} />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductPerformanceChart period={reportPeriod} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomerAnalyticsChart period={reportPeriod} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryReportTable />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialReportTable period={reportPeriod} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
