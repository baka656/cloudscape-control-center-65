
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Ticket } from "lucide-react";

export function IntegrationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          SIM Tickets Integration
        </CardTitle>
        <CardDescription>
          Configure your SIM Tickets (Remedy) integration settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable SIM Tickets Integration</Label>
              <p className="text-sm text-muted-foreground">
                Connect to your SIM Tickets system for automated ticket management
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sim_api_url">API Endpoint URL</Label>
              <Input
                id="sim_api_url"
                placeholder="https://your-sim-instance.com/api/v1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sim_username">Username</Label>
              <Input
                id="sim_username"
                placeholder="API Username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sim_api_key">API Key</Label>
              <Input
                id="sim_api_key"
                type="password"
                placeholder="Enter your API key"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sim_default_template">Default Ticket Template</Label>
              <Input
                id="sim_default_template"
                placeholder="Template ID or Name"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto bg-primary">Save Integration Settings</Button>
      </CardFooter>
    </Card>
  );
}
