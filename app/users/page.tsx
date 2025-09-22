import { DashboardLayout } from "@/components/dashboard-layout"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage staff accounts, roles, and permissions</p>
        </div>
        <UserManagement />
      </div>
    </DashboardLayout>
  )
}
