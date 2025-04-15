
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ValidationControl } from "@/types/validation-control";
import { ControlsSearch } from "@/components/controls/ControlsSearch";
import { ControlsTable } from "@/components/controls/ControlsTable";

// Validation controls data
const validationControls: ValidationControl[] = [
  {
    id: "TC001",
    title: "Pipeline Encryption",
    description: "Data must be encrypted during transit in ML pipelines",
    evidenceExpected: "Encryption implementation details and security audit results",
    acceptableExamples: "SSL/TLS implementation with strong cipher suites",
    badExamples: "Unencrypted data transmission",
    implementationSuggestions: "Use industry-standard encryption protocols",
    evidenceTypes: ["Documentation", "Security Audit"],
    category: "Security",
  },
  {
    id: "TC002",
    title: "Model Drift Monitoring",
    description: "Monitoring for model performance degradation over time",
    evidenceExpected: "Regular monitoring reports and drift detection system",
    acceptableExamples: "Automated drift detection with alerts",
    badExamples: "Manual checks only",
    implementationSuggestions: "Set up automated monitoring",
    evidenceTypes: ["Monitoring Data", "Alert Logs"],
    category: "Reliability",
  }
];

export default function Controls() {
  const [filteredControls, setFilteredControls] = React.useState(validationControls);

  const handleSearch = (searchTerm: string) => {
    const filtered = validationControls.filter(
      control =>
        control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredControls(filtered);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Validation Controls</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Control
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlsSearch onSearch={handleSearch} />
          <ControlsTable controls={filteredControls} />
        </CardContent>
      </Card>
    </div>
  );
}
