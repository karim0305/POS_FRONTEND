import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductsTable } from "@/components/products-table"
import { ProductsHeader } from "@/components/products-header"

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* <ProductsHeader /> */}
        <ProductsTable />
      </div>
    </DashboardLayout>
  )
}
