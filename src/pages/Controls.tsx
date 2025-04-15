
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileEdit, Eye, Trash2 } from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Unified validation controls data structure
const validationControls = [
  {
    id: "TC001",
    title: "Pipeline Encryption",
    description: "Data must be encrypted during transit in ML pipelines",
    evidenceExpected: "Encryption implementation details and security audit results",
    acceptableExamples: "SSL/TLS implementation with strong cipher suites, Key rotation policies",
    badExamples: "Unencrypted data transmission, Weak encryption algorithms",
    implementationSuggestions: "Use industry-standard encryption protocols, Implement proper key management",
    evidenceTypes: ["Documentation", "Security Audit", "Code Review"],
    category: "Security",
  },
  {
    id: "TC002",
    title: "Model Drift Monitoring",
    description: "Monitoring for model performance degradation over time",
    evidenceExpected: "Regular monitoring reports and drift detection system",
    acceptableExamples: "Automated drift detection with alerts, Performance metric tracking",
    badExamples: "Manual checks only, No baseline metrics",
    implementationSuggestions: "Set up automated monitoring, Define clear drift thresholds",
    evidenceTypes: ["Monitoring Data", "Alert Logs", "Performance Reports"],
    category: "Reliability",
  }
];

export default function Controls() {
  const [expandedControl, setExpandedControl] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validation Controls</h1>
          <p className="text-muted-foreground">
            Manage and monitor AI system validation controls
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Control
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Control Details</CardTitle>
          <CardDescription>
            View and manage validation controls for AI systems
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationControls.map((control) => (
                  <React.Fragment key={control.id}>
                    <TableRow>
                      <TableCell className="font-medium">{control.id}</TableCell>
                      <TableCell>
                        <Collapsible
                          open={expandedControl === control.id}
                          onOpenChange={() => setExpandedControl(expandedControl === control.id ? null : control.id)}
                        >
                          <CollapsibleTrigger className="font-medium hover:underline">
                            {control.title}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4 pt-4">
                            <div>
                              <h4 className="text-sm font-semibold">Description</h4>
                              <p className="text-sm text-muted-foreground">{control.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Evidence Expected</h4>
                              <p className="text-sm text-muted-foreground">{control.evidenceExpected}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Acceptable Examples</h4>
                              <p className="text-sm text-muted-foreground">{control.acceptableExamples}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Bad Examples</h4>
                              <p className="text-sm text-muted-foreground">{control.badExamples}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Implementation Suggestions</h4>
                              <p className="text-sm text-muted-foreground">{control.implementationSuggestions}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Evidence Types</h4>
                              <div className="flex gap-2 mt-1">
                                {control.evidenceTypes.map((type) => (
                                  <span
                                    key={type}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {control.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
