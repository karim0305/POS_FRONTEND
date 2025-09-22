import { DashboardLayout } from "@/components/dashboard-layout"
import { SupplyManagement } from "@/components/supply-management"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-muted-foreground">Manage Supply Items Personal Information</p>
        </div>
        <SupplyManagement />
      </div>
    </DashboardLayout>
  )
}
