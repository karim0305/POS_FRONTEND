"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Banknote } from "lucide-react"

// Mock financial data
const monthlyFinancials = [
  {
    month: "January 2024",
    revenue: 45231.89,
    expenses: 28450.23,
    profit: 16781.66,
    profitMargin: 37.1,
    cashPayments: 18092.76,
    cardPayments: 27139.13,
  },
  {
    month: "December 2023",
    revenue: 42156.78,
    expenses: 26890.45,
    profit: 15266.33,
    profitMargin: 36.2,
    cashPayments: 16862.71,
    cardPayments: 25294.07,
  },
  {
    month: "November 2023",
    revenue: 38945.67,
    expenses: 25123.89,
    profit: 13821.78,
    profitMargin: 35.5,
    cashPayments: 15578.27,
    cardPayments: 23367.4,
  },
  {
    month: "October 2023",
    revenue: 41234.56,
    expenses: 27456.78,
    profit: 13777.78,
    profitMargin: 33.4,
    cashPayments: 16493.82,
    cardPayments: 24740.74,
  },
]

const expenseBreakdown = [
  { category: "Cost of Goods Sold", amount: 18450.23, percentage: 64.9 },
  { category: "Staff Salaries", amount: 6200.0, percentage: 21.8 },
  { category: "Rent & Utilities", amount: 2100.0, percentage: 7.4 },
  { category: "Marketing", amount: 800.0, percentage: 2.8 },
  { category: "Other Expenses", amount: 900.0, percentage: 3.1 },
]

interface FinancialReportTableProps {
  period: string
}

export function FinancialReportTable({ period }: FinancialReportTableProps) {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendPercentage = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return Math.abs(change).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyFinancials[0].revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(monthlyFinancials[0].revenue, monthlyFinancials[1].revenue)}
              <span className="text-green-500 ml-1">
                {getTrendPercentage(monthlyFinancials[0].revenue, monthlyFinancials[1].revenue)}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyFinancials[0].profit.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(monthlyFinancials[0].profit, monthlyFinancials[1].profit)}
              <span className="text-green-500 ml-1">
                {getTrendPercentage(monthlyFinancials[0].profit, monthlyFinancials[1].profit)}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyFinancials[0].profitMargin}%</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(monthlyFinancials[0].profitMargin, monthlyFinancials[1].profitMargin)}
              <span className="text-green-500 ml-1">
                {getTrendPercentage(monthlyFinancials[0].profitMargin, monthlyFinancials[1].profitMargin)}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyFinancials[0].expenses.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(monthlyFinancials[1].expenses, monthlyFinancials[0].expenses)}
              <span className="text-red-500 ml-1">
                {getTrendPercentage(monthlyFinancials[0].expenses, monthlyFinancials[1].expenses)}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Financial Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Profit Margin</TableHead>
                <TableHead>Cash Payments</TableHead>
                <TableHead>Card Payments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyFinancials.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell>${month.revenue.toLocaleString()}</TableCell>
                  <TableCell>${month.expenses.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-green-600">${month.profit.toLocaleString()}</TableCell>
                  <TableCell>{month.profitMargin}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Banknote className="h-4 w-4 text-green-600" />${month.cashPayments.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-blue-600" />${month.cardPayments.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown - Current Month</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseBreakdown.map((expense) => (
                <TableRow key={expense.category}>
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${expense.percentage}%` }} />
                      </div>
                      {expense.percentage}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  )
}
