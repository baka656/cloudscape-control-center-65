
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AccountTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your account details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Smith" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.smith@example.com" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Administrator" disabled />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password</h3>
          <div className="grid gap-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input id="current_password" type="password" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input id="new_password" type="password" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input id="confirm_password" type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto bg-primary">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
