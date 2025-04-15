
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, ExternalLink, MoreHorizontal } from "lucide-react";
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

// Mock submissions data
const submissions = [
  {
    id: "APP-2023-0142",
    partner: "Acme Solutions",
    product: "AI Vision Analyzer",
    submittedAt: "2023-04-12",
    status: "Pending",
  },
  {
    id: "APP-2023-0141",
    partner: "TechWave Inc.",
    product: "NLP Assistant Pro",
    submittedAt: "2023-04-10",
    status: "In Review",
  },
  {
    id: "APP-2023-0140",
    partner: "CloudNova Ltd",
    product: "Generative Image Creator",
    submittedAt: "2023-04-09",
    status: "AI Validation",
  },
  {
    id: "APP-2023-0139",
    partner: "DataSync Partners",
    product: "Intelligent Data Pipeline",
    submittedAt: "2023-04-08",
    status: "Human Validation",
  },
  {
    id: "APP-2023-0138",
    partner: "FutureAI Systems",
    product: "Predictive Analytics Suite",
    submittedAt: "2023-04-07",
    status: "Approved",
  },
];

const statusColors = {
  "Pending": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  "In Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "AI Validation": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Human Validation": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400", 
  "Approved": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Rejected": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function Submissions() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Submissions</h1>
          <p className="text-muted-foreground">
            View and process partner application submissions
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Submission
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions Management</CardTitle>
          <CardDescription>
            Track and manage application submissions through the validation process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>{submission.partner}</TableCell>
                    <TableCell>{submission.product}</TableCell>
                    <TableCell>{submission.submittedAt}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[submission.status as keyof typeof statusColors]
                      }`}>
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="mr-2">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Process Submission</DropdownMenuItem>
                            <DropdownMenuItem>View AI Results</DropdownMenuItem>
                            <DropdownMenuItem>Human Validation</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div>Showing 5 of 24 submissions</div>
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
