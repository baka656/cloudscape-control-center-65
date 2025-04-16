
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to VOTER</CardTitle>
          <CardDescription>Validation Of TEch Reviews - Partner Competency Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This platform helps manage and validate partner competency assessments using AWS services and AI-driven analysis.
            </p>
            <p>
              From here, you can manage submissions, perform validations, view reports, and configure system settings.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Link to="/submissions">
            <Button variant="default">View Submissions</Button>
          </Link>
          <Link to="/validation">
            <Button variant="outline">Validation Portal</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
