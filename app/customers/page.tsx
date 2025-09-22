import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerManagement } from "@/components/customer-management"

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and purchase history</p>
        </div>
        <CustomerManagement />
      </div>
    </DashboardLayout>
  )
}
