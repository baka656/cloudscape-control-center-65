
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, CheckCircle, XCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Validation() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Human-in-the-Loop Validation</h1>
        <p className="text-muted-foreground">
          Review AI validation results and provide human verification
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
        <Button className="bg-primary">Assign To Me</Button>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current (2)</TabsTrigger>
          <TabsTrigger value="queue">Queue (4)</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>APP-2023-0139: DataSync Partners</CardTitle>
                  <CardDescription>Intelligent Data Pipeline</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">AI Confidence:</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">AI Validation Progress</h3>
                    <span className="text-sm text-muted-foreground">14/20 controls validated</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Controls Requiring Human Verification</h3>
                  
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <h4 className="font-medium">TC003: Input Validation</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI detected potential issues with input validation implementation.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="h-8 bg-primary">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
                        <div className="text-sm p-3 bg-muted rounded-md">
                          <p>The submission implements basic input validation, but lacks comprehensive validation for all edge cases.</p>
                          <p className="mt-2">Evidence found in code samples on pages 14-16, but validation logic appears incomplete.</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">Human Verification</h5>
                        <div className="border rounded-md p-3">
                          <textarea 
                            className="w-full min-h-[100px] text-sm bg-transparent resize-none focus:outline-none" 
                            placeholder="Add your verification notes here..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <h4 className="font-medium">TC005: Bias Detection</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI unable to conclusively determine bias detection implementation.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="h-8 bg-primary">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
                        <div className="text-sm p-3 bg-muted rounded-md">
                          <p>Documentation mentions bias detection but technical implementation details are vague.</p>
                          <p className="mt-2">Referenced tools exist but evidence of integration is inconclusive from provided materials.</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">Human Verification</h5>
                        <div className="border rounded-md p-3">
                          <textarea 
                            className="w-full min-h-[100px] text-sm bg-transparent resize-none focus:outline-none" 
                            placeholder="Add your verification notes here..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button variant="outline">Request More Info</Button>
                </div>
                <Button className="bg-primary">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Validation
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Validation Queue</CardTitle>
              <CardDescription>
                Applications waiting for human validation review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
                  <div>
                    <h3 className="font-medium">APP-2023-0140: CloudNova Ltd</h3>
                    <p className="text-sm text-muted-foreground">Generative Image Creator</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">4 controls need review</p>
                      <p className="text-xs text-muted-foreground">AI Confidence: 65%</p>
                    </div>
                    <Button size="sm" className="bg-primary">Assign</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
                  <div>
                    <h3 className="font-medium">APP-2023-0141: TechWave Inc.</h3>
                    <p className="text-sm text-muted-foreground">NLP Assistant Pro</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">2 controls need review</p>
                      <p className="text-xs text-muted-foreground">AI Confidence: 82%</p>
                    </div>
                    <Button size="sm" className="bg-primary">Assign</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
                  <div>
                    <h3 className="font-medium">APP-2023-0142: Acme Solutions</h3>
                    <p className="text-sm text-muted-foreground">AI Vision Analyzer</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">5 controls need review</p>
                      <p className="text-xs text-muted-foreground">AI Confidence: 71%</p>
                    </div>
                    <Button size="sm" className="bg-primary">Assign</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
                  <div>
                    <h3 className="font-medium">APP-2023-0143: ML Experts Inc.</h3>
                    <p className="text-sm text-muted-foreground">Forecasting Intelligence</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">3 controls need review</p>
                      <p className="text-xs text-muted-foreground">AI Confidence: 76%</p>
                    </div>
                    <Button size="sm" className="bg-primary">Assign</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Validations</CardTitle>
              <CardDescription>
                History of applications you have validated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <p>Completed validations will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
