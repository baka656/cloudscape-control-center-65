
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full mb-6">
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
      
      <Alert variant="info" className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>AWS Configuration Required</AlertTitle>
        <AlertDescription>
          This application requires proper AWS configuration. Please ensure the following environment variables 
          are set in your AWS Amplify environment:
          <ul className="list-disc ml-6 mt-2">
            <li>REACT_APP_AWS_REGION - AWS region (e.g., us-east-1)</li>
            <li>REACT_APP_IDENTITY_POOL_ID - Cognito Identity Pool ID</li>
            <li>REACT_APP_S3_BUCKET - S3 bucket name for file storage</li>
            <li>REACT_APP_API_GATEWAY_URL - API Gateway endpoint URL</li>
            <li>REACT_APP_DYNAMODB_TABLE - DynamoDB table name</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Index;
