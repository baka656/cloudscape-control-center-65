
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock calibration guides data
const calibrationGuides = [
  {
    id: "CG001",
    name: "AI Input Data Quality Standards",
    version: "1.2.0",
    updatedAt: "2023-03-15",
    category: "Data Quality",
  },
  {
    id: "CG002",
    name: "Model Explainability Requirements",
    version: "2.0.1",
    updatedAt: "2023-02-28",
    category: "Transparency",
  },
  {
    id: "CG003",
    name: "Bias Detection & Mitigation",
    version: "1.5.3",
    updatedAt: "2023-01-20",
    category: "Ethics",
  },
  {
    id: "CG004",
    name: "Continuous Monitoring Standards",
    version: "1.1.0",
    updatedAt: "2022-12-05",
    category: "Reliability",
  },
  {
    id: "CG005",
    name: "Security Controls for AI Systems",
    version: "3.0.2",
    updatedAt: "2023-04-01",
    category: "Security",
  },
];

export default function CalibrationGuides() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calibration Guides</h1>
          <p className="text-muted-foreground">
            Manage calibration guidelines for validation standards
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Guide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guides Management</CardTitle>
          <CardDescription>
            Add, view, or download calibration guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search guides..."
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
                  <TableHead>Guide Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calibrationGuides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.id}</TableCell>
                    <TableCell>{guide.name}</TableCell>
                    <TableCell>{guide.version}</TableCell>
                    <TableCell>{guide.updatedAt}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {guide.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
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
            <div>Showing 5 of 12 guides</div>
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
