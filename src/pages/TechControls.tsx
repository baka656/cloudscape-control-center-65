
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileEdit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock control data
const techControls = [
  {
    id: "TC001",
    name: "Pipeline Encryption",
    description: "Data must be encrypted during transit in ML pipelines",
    category: "Security",
    criticality: "High",
  },
  {
    id: "TC002",
    name: "Model Drift Monitoring",
    description: "Monitoring for model performance degradation over time",
    category: "Reliability",
    criticality: "Medium",
  },
  {
    id: "TC003",
    name: "Input Validation",
    description: "Validate all input data for format and range",
    category: "Data Quality",
    criticality: "High",
  },
  {
    id: "TC004",
    name: "Explainability Features",
    description: "Ability to explain model decisions to end-users",
    category: "Transparency",
    criticality: "Medium",
  },
  {
    id: "TC005",
    name: "Bias Detection",
    description: "Automated detection of bias in training data",
    category: "Ethics",
    criticality: "High",
  },
];

export default function TechControls() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Validation Controls</h1>
          <p className="text-muted-foreground">
            Manage technical validation criteria for AI applications
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Control
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controls Management</CardTitle>
          <CardDescription>
            Add, edit, or remove technical validation controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search controls..."
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
                  <TableHead>Control Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techControls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="font-medium">{control.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{control.name}</div>
                      <div className="text-sm text-muted-foreground">{control.description}</div>
                    </TableCell>
                    <TableCell>{control.category}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        control.criticality === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : control.criticality === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      }`}>
                        {control.criticality}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
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
            <div>Showing 5 of 15 controls</div>
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
