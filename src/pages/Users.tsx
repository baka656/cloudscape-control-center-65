
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, UserCog, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock users data
const users = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2023-04-12 09:35"
  },
  {
    id: "U002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Tech Validator",
    status: "Active",
    lastLogin: "2023-04-11 16:22"
  },
  {
    id: "U003",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Tech Validator",
    status: "Active",
    lastLogin: "2023-04-10 14:15"
  },
  {
    id: "U004",
    name: "Jessica Wilson",
    email: "jessica.wilson@example.com",
    role: "Administrator",
    status: "Inactive",
    lastLogin: "2023-03-25 11:30"
  },
  {
    id: "U005",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Tech Validator",
    status: "Active",
    lastLogin: "2023-04-12 08:17"
  },
];

const statusColors = {
  "Active": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Inactive": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  "Locked": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function Users() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage system users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.role === "Administrator" ? (
                          <UserCog className="h-4 w-4 mr-2 text-primary" />
                        ) : null}
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[user.status as keyof typeof statusColors]
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          {user.status === "Active" ? (
                            <DropdownMenuItem>Deactivate</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Activate</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div>Showing 5 of 12 users</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
