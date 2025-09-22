"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, Users, UserCheck, Clock } from "lucide-react"
import { AddUserDialog } from "@/components/add-user-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { UserApi } from "@/lib/api/apis"
import { User } from "@/lib/types/user.type"
import { toast } from "react-toastify"

// Mock users data
// const mockUsers = [
//   {
//     id: "1",
//     name: "John Smith",
//     email: "john.smith@company.com",
//     role: "admin",
//     status: "active",
//     lastLogin: "2024-01-15 14:30",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "2",
//     name: "Sarah Johnson",
//     email: "sarah.johnson@company.com",
//     role: "manager",
//     status: "active",
//     lastLogin: "2024-01-15 12:15",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "3",
//     name: "Mike Davis",
//     email: "mike.davis@company.com",
//     role: "cashier",
//     status: "active",
//     lastLogin: "2024-01-15 09:45",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "4",
//     name: "Emily Brown",
//     email: "emily.brown@company.com",
//     role: "cashier",
//     status: "inactive",
//     lastLogin: "2024-01-10 16:20",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "5",
//     name: "David Wilson",
//     email: "david.wilson@company.com",
//     role: "inventory",
//     status: "active",
//     lastLogin: "2024-01-15 11:30",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]
    
export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [mockUsers, setMockUsers] = useState<User[]>([]) // Initialize with an empty array


   const fetchUser = async () => {
        const res = await fetch(UserApi.getUsers);
        const data = await res.json();
       setMockUsers(data);
        console.log(data);
    };
  
    useEffect(() => {
      fetchUser();
    }, []);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>
      case "cashier":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Cashier</Badge>
      case "inventory":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Inventory</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }


  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(UserApi.deleteUser(id), {
          method: "DELETE",
        })
        if (res.ok) {
          // Remove the deleted user from the state
          setMockUsers((prevUsers) => prevUsers.filter((user) => user._id !== id))
          toast.success("User deleted successfully")
        } else {
          toast.error("Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("An error occurred while deleting the user")
      }
    }
  }

  const getActiveUsers = () => mockUsers.filter((user) => user.status === "active").length
  const getTotalUsers = () => mockUsers.length
  const getAdminUsers = () => mockUsers.filter((user) => user.role === "admin").length

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalUsers()}</div>
            <p className="text-xs text-muted-foreground">Registered staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveUsers()}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAdminUsers()}</div>
            <p className="text-xs text-muted-foreground">Admin privileges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Currently logged in</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
     <CardHeader>
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {/* Title */}
    <CardTitle className="text-lg sm:text-xl">Staff Members</CardTitle>

    {/* Search + Button wrapper */}
    <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-2 sm:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  </div>
</CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.fullName || "/placeholder.svg"} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.fullName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem> */}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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

      <AddUserDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      <EditUserDialog user={selectedUser} open={showEditDialog} onOpenChange={setShowEditDialog} />
    </div>
  )
}
