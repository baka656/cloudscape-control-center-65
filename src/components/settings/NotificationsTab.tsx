
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Assigned Validations</Label>
              <p className="text-sm text-muted-foreground">
                When you're assigned a new validation task
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">New Submissions</Label>
              <p className="text-sm text-muted-foreground">
                When new submissions are received
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">System Updates</Label>
              <p className="text-sm text-muted-foreground">
                When system changes or updates occur
              </p>
            </div>
            <Switch />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">In-App Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable All</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all in-app notifications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto bg-primary">Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
