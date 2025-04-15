
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ClipboardCheck, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the AWS Tech Validation Control Center
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +28% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Validation
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              -4% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Validations
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29</div>
            <p className="text-xs text-muted-foreground">
              +7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                The most recent applications submitted for validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 text-sm text-muted-foreground">
                  <div>Application ID</div>
                  <div>Partner</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 text-sm">
                  <div>APP-2023-0142</div>
                  <div>Acme Solutions</div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                    <span>Pending</span>
                  </div>
                  <div>2023-04-12</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 text-sm">
                  <div>APP-2023-0141</div>
                  <div>TechWave Inc.</div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span>Approved</span>
                  </div>
                  <div>2023-04-10</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 text-sm">
                  <div>APP-2023-0140</div>
                  <div>CloudNova Ltd</div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    <span>Failed</span>
                  </div>
                  <div>2023-04-09</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 text-sm">
                  <div>APP-2023-0139</div>
                  <div>DataSync Partners</div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span>Approved</span>
                  </div>
                  <div>2023-04-08</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Success Rate</CardTitle>
              <CardDescription>
                Percentage of applications meeting validation criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Analytics charts would be implemented here with real data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                Export and analyze validation data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Monthly Validation Summary</p>
                    <p className="text-sm text-muted-foreground">Summary of validation activities by month</p>
                  </div>
                  <button className="text-primary text-sm">Download</button>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Partner Performance</p>
                    <p className="text-sm text-muted-foreground">Validation success rate by partner</p>
                  </div>
                  <button className="text-primary text-sm">Download</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Control Compliance</p>
                    <p className="text-sm text-muted-foreground">Compliance rate for each control criteria</p>
                  </div>
                  <button className="text-primary text-sm">Download</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
