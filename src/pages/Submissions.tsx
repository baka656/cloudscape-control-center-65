
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, ExternalLink, MoreHorizontal } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewSubmissionModal, SubmissionFormData } from "@/components/submissions/NewSubmissionModal";
import { useToast } from "@/components/ui/use-toast";
import { 
  createBucketAndUploadFiles, 
  saveSubmissionToDynamoDB, 
  invokeSubmissionProcessing,
  getAllSubmissions,
  SubmissionRecord 
} from "@/services/aws-service";

// Status colors for UI
const statusColors = {
  "Pending": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  "In Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "AI Validation": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Human Validation": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400", 
  "Approved": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Rejected": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function Submissions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Fetch submissions from DynamoDB
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const fetchedSubmissions = await getAllSubmissions();
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load submissions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load submissions on component mount
  useEffect(() => {
    fetchSubmissions();
    
    // Set up a polling interval to refresh submissions
    const intervalId = setInterval(fetchSubmissions, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(sub => 
    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.validationType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleNewSubmission = async (data: SubmissionFormData) => {
    try {
      
      // Create S3 bucket and upload files
      await createBucketAndUploadFiles(
        data.salesforceId,
        data.selfAssessment as File,
        data.additionalFiles
      );
      
      // Create submission record
      const submissionRecord: SubmissionRecord = {
        partnerName: data.partnerName,
        id: data.salesforceId,
        validationType: data.validationType,
        competencyCategory: data.competencyCategory,
        status: "Pending",
        submittedAt: new Date().toISOString().split('T')[0]
      };

      console.log("Submission record", submissionRecord)
      
      // Save to DynamoDB
      await saveSubmissionToDynamoDB(submissionRecord);
      
      // Invoke Lambda function through API Gateway
      await invokeSubmissionProcessing(submissionRecord);
      
      // Update local state with new submission
      setSubmissions(prev => [submissionRecord, ...prev]);
      
      // Show success notification
      toast({
        title: "Submission Created",
        description: `Application ${data.salesforceId} has been created successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating submission:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to create submission. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Submissions</h1>
          <p className="text-muted-foreground">
            View and process partner application submissions
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Submission
        </Button>
      </div>
      
      <NewSubmissionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewSubmission}
      />

      <Card>
        <CardHeader>
          <CardTitle>Submissions Management</CardTitle>
          <CardDescription>
            Track and manage application submissions through the validation process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading submissions...
                    </TableCell>
                  </TableRow>
                ) : filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.id}</TableCell>
                      <TableCell>{submission.partnerName}</TableCell>
                      <TableCell>{submission.validationType}{submission.competencyCategory ? `: ${submission.competencyCategory.split(':')[1]}` : ''}</TableCell>
                      <TableCell>{submission.submittedAt}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[submission.status as keyof typeof statusColors]
                        }`}>
                          {submission.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" className="mr-2">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Process Submission</DropdownMenuItem>
                              <DropdownMenuItem>View AI Results</DropdownMenuItem>
                              <DropdownMenuItem>Human Validation</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div>Showing {filteredSubmissions.length} of {submissions.length} submissions</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
