import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsAnalytics } from "@/components/reports-analytics"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <ReportsAnalytics />
      </div>
    </DashboardLayout>
  )
}
