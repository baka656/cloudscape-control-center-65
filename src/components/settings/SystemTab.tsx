
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function SystemTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure system-wide settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Configuration</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="api_url">API Endpoint URL</Label>
            <Input id="api_url" defaultValue="https://api.example.com/v1" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api_key">API Key</Label>
            <Input id="api_key" type="password" value="************************" />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">AI Validation</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable AI Pre-validation</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to analyze submissions before human review
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">AI Confidence Threshold</Label>
              <p className="text-sm text-muted-foreground">
                Minimum confidence score for AI to auto-approve (70%)
              </p>
            </div>
            <Input className="w-24" type="number" min="0" max="100" defaultValue="70" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto bg-primary">Apply Changes</Button>
      </CardFooter>
    </Card>
  );
}
