import { DashboardLayout } from "@/components/dashboard-layout"
import { SalesInterface } from "@/components/sales-interface"

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
          <p className="text-muted-foreground">Process sales transactions and manage orders</p>
        </div>
        <SalesInterface />
      </div>
    </DashboardLayout>
  )
}
