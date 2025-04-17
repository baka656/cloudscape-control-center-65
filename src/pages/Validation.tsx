import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, CheckCircle, XCircle, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SubmissionWithValidation, getAllSubmissions, getSubmissionDetails, SubmissionRecord, ControlAssessment, getValidationOutput, updateSubmissionStatus } from "@/services/aws-service";


const getStatusBadgeColor = (status: string) => {
  const colors = {
    'AI Validation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20',
    'Human Validation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20',
    'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/20',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function Validation() {
  const [submissions, setSubmissions] = useState<SubmissionWithValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Add this
  const [currentTab, setCurrentTab] = useState('current');
  const { toast } = useToast();

  // Filter function
  const filteredSubmissions = submissions.filter(submission => 
    submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.validationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.competencyCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchSubmissionsWithValidation = async () => {
    try {
      setLoading(true);
      
      // Get all submissions
      const allSubmissions = await getAllSubmissions();
      
      // Get validation output for each submission
      const submissionsWithValidation = await Promise.all(
        allSubmissions.map(async (submission) => {
          try {
            // Only try to fetch validation if status is appropriate
            if (!['AI Validation', 'Human Validation'].includes(submission.applicationStatus)) {
              return {
                ...submission,
                validationOutput: [],
                averageConfidenceScore: 0,
                controlsNeedingVerification: []
              };
            }
  
            const validationOutput = await getValidationOutput(submission.id);
            
            // If no validation output, return submission with empty values
            if (!validationOutput || !Array.isArray(validationOutput)) {
              console.log(`No validation output for ${submission.id}`);
              return {
                ...submission,
                validationOutput: [],
                averageConfidenceScore: 0,
                controlsNeedingVerification: []
              };
            }
            
            console.log("Validation output of ", submission.id, validationOutput);
            
            // Calculate average confidence score
            const averageConfidenceScore = validationOutput.reduce(
              (sum, control) => sum + (control.ConfidenceScore || 0), 
              0
            ) / validationOutput.length;
            
            console.log("Average confidence score of ", submission.id, averageConfidenceScore);
            
            // Filter controls needing verification (confidence < 80%)
            const controlsNeedingVerification = validationOutput.filter(
              control => (control.ConfidenceScore || 0) < 80
            );
            
            console.log("Controls needing verification of ", submission.id, 
              controlsNeedingVerification.map(c => ({
                id: c.ControlID,
                score: c.ConfidenceScore
              }))
            );
            
            return {
              ...submission,
              validationOutput,
              averageConfidenceScore,
              controlsNeedingVerification
            };
          } catch (error) {
            console.error(`Error processing submission ${submission.id}:`, error);
            // Return submission with empty validation data on error
            return {
              ...submission,
              validationOutput: [],
              averageConfidenceScore: 0,
              controlsNeedingVerification: []
            };
          }
        })
      );
      
      // Filter out any failed processing
      const validSubmissions = submissionsWithValidation.filter(sub => 
        sub && typeof sub === 'object'
      );
      
      setSubmissions(validSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load submissions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  // const fetchSubmissionsWithValidation = async () => {
  //   try {
  //     setLoading(true);
      
  //     // Get all submissions
  //     const allSubmissions = await getAllSubmissions();
      
  //     // Get validation output for each submission
  //     const submissionsWithValidation = await Promise.all(
  //       allSubmissions.map(async (submission) => {
  //         try {
  //           const validationOutput = await getValidationOutput(submission.id);
            
  //           console.log("Validation output of ", submission.id, validationOutput)
  //           // Calculate average confidence score
  //           const averageConfidenceScore = validationOutput.length > 0
  //             ? validationOutput.reduce((sum, control) => sum + control.ConfidenceScore, 0) / validationOutput.length
  //             : 0;
  //           console.log("Average confidence score of ", submission.id, averageConfidenceScore)
  //           // Filter controls needing verification (confidence < 80%)
  //           const controlsNeedingVerification = validationOutput.filter(
  //             control => control.ConfidenceScore < 80
  //           );
  //           console.log("Controls needing verification of ", submission.id, controlsNeedingVerification)
  //           return {
  //             ...submission,
  //             validationOutput,
  //             averageConfidenceScore,
  //             controlsNeedingVerification
  //           };
  //         } catch (error) {
  //           console.error(`Error processing submission ${submission.id}:`, error);
  //           return submission;
  //         }
  //       })
  //     );
      
  //     setSubmissions(submissionsWithValidation);
  //   } catch (error) {
  //     console.error('Error fetching submissions:', error);
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to load submissions. Please try again.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchSubmissionsWithValidation();
    const intervalId = setInterval(fetchSubmissionsWithValidation, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleControlVerification = async (
    submissionId: string,
    controlId: string,
    action: 'approve' | 'reject',
    notes: string
  ) => {
    try {
      // Update submission in state
      setSubmissions(prev => prev.map(sub => {
        if (sub.id === submissionId && sub.validationOutput) {
          const updatedValidationOutput = sub.validationOutput.map(control => {
            if (control.ControlID === controlId) {
              return {
                ...control,
                ControlPassFail: action === 'approve' ? 'pass' : 'fail',
                ControlPassFailReason: notes
              };
            }
            return control;
          });

          return {
            ...sub,
            validationOutput: updatedValidationOutput
          };
        }
        return sub;
      }));

      // Update in DynamoDB
      await updateSubmissionStatus(submissionId, 'Human Validation', [{
        controlId,
        status: action === 'approve' ? 'pass' : 'fail',
        notes
      }]);

      toast({
        title: 'Control Updated',
        description: `Control ${controlId} has been ${action}ed.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating control:', error);
      toast({
        title: 'Error',
        description: 'Failed to update control. Please try again.',
        variant: 'destructive',
      });
    }
  };
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={fetchSubmissionsWithValidation} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
  
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">
            Pending Verification ({filteredSubmissions.filter(s => s.status === 'AI Validation').length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({filteredSubmissions.filter(s => s.status === 'Human Validation').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filteredSubmissions.filter(s => ['Approved', 'Rejected'].includes(s.status)).length})
          </TabsTrigger>
        </TabsList>
  
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Submissions Requiring Verification</CardTitle>
              <CardDescription>
                Review AI validation results and verify controls with low confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No submissions found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSubmissions
                    .filter(sub => sub.status === 'AI Validation')
                    .map(submission => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {submission.partnerName} ({submission.id})
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {submission.validationType}
                              {submission.competencyCategory ? 
                                `: ${submission.competencyCategory}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              AI Confidence Score: {
                                submission.averageConfidenceScore?.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {submission.controlsNeedingVerification?.length || 0} controls need review
                            </p>
                          </div>
                        </div>
  
                        {submission.controlsNeedingVerification?.map(control => (
                          <div key={control.ControlID} 
                               className="border rounded-md p-4 mt-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {control.ControlID}: {control.ControlTitle}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Confidence Score: {control.ConfidenceScore}%
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleControlVerification(
                                    submission.id,
                                    control.ControlID,
                                    'reject',
                                    ''
                                  )}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleControlVerification(
                                    submission.id,
                                    control.ControlID,
                                    'approve',
                                    ''
                                  )}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                {control.ControlPassFailReason}
                              </p>
                            </div>
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">
                                Verification Notes
                              </h5>
                              <Textarea
                                placeholder="Add verification notes..."
                                className="min-h-[100px]"
                                onChange={(e) => {
                                  // Handle notes change
                                }}
                              />
                            </div>
                          </div>
                        ))}
  
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => updateSubmissionStatus(
                              submission.id,
                              'Rejected'
                            )}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Application
                          </Button>
                          <Button
                            className="bg-primary"
                            onClick={() => updateSubmissionStatus(
                              submission.id,
                              'Approved'
                            )}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Application
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
  
        <TabsContent value="in-progress">
  <Card>
    <CardHeader>
      <CardTitle>In Progress Validations</CardTitle>
      <CardDescription>
        Submissions currently under human verification
      </CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions
            .filter(sub => sub.status === 'Human Validation')
            .map(submission => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {submission.partnerName} ({submission.id})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {submission.validationType}
                      {submission.competencyCategory ? 
                        `: ${submission.competencyCategory}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Validation Progress
                    </p>
                    <Progress 
                      value={
                        submission.validationOutput 
                          ? (submission.validationOutput.filter(
                              c => c.ControlPassFail !== 'pending'
                            ).length / submission.validationOutput.length) * 100
                          : 0
                      } 
                      className="w-[200px] mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {submission.controlsNeedingVerification?.map(control => (
                    <div key={control.ControlID} 
                         className={`border rounded-md p-4 ${
                           control.ControlPassFail !== 'pending' 
                             ? 'bg-muted/50' : ''
                         }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {control.ControlID}: {control.ControlTitle}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Confidence: {control.ConfidenceScore}%
                            </span>
                            {control.ControlPassFail !== 'pending' && (
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                control.ControlPassFail === 'pass' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {control.ControlPassFail === 'pass' 
                                  ? 'Approved' 
                                  : 'Rejected'}
                              </span>
                            )}
                          </div>
                        </div>
                        {control.ControlPassFail === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleControlVerification(
                                submission.id,
                                control.ControlID,
                                'reject',
                                ''
                              )}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleControlVerification(
                                submission.id,
                                control.ControlID,
                                'approve',
                                ''
                              )}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {control.ControlPassFailReason}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-1">
                            Verification Notes
                          </h5>
                          <Textarea
                            placeholder="Add verification notes..."
                            className="min-h-[100px]"
                            value={control.ControlPassFailReason}
                            onChange={(e) => {
                              // Handle notes change
                            }}
                            disabled={control.ControlPassFail !== 'pending'}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <Button variant="outline" onClick={() => fetchSubmissionsWithValidation()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => updateSubmissionStatus(
                        submission.id,
                        'Rejected'
                      )}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      className="bg-primary"
                      onClick={() => updateSubmissionStatus(
                        submission.id,
                        'Approved'
                      )}
                      disabled={
                        submission.validationOutput?.some(
                          c => c.ControlPassFail === 'pending'
                        )
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="completed">
  <Card>
    <CardHeader>
      <CardTitle>Completed Validations</CardTitle>
      <CardDescription>
        History of validated submissions
      </CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions
            .filter(sub => ['Approved', 'Rejected'].includes(sub.status))
            .map(submission => (
              <div key={submission.id} 
                   className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">
                    {submission.partnerName} ({submission.id})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {submission.validationType}
                    {submission.competencyCategory ? 
                      `: ${submission.competencyCategory}` : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      getStatusBadgeColor(submission.status)
                    }`}>
                      {submission.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average AI Confidence: {
                        submission.averageConfidenceScore?.toFixed(1)
                      }%
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Handle viewing details
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
        
      </Tabs>
    </div>
  );

// export default function Validation() {
//   const [currentSubmission, setCurrentSubmission] = useState<SubmissionRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const { toast } = useToast();

//   // Fetch current submission and control data
//   const fetchCurrentSubmission = async () => {
//     try {
//       // This is a mock implementation. In production, we would fetch from DynamoDB
//       setRefreshing(true);
      
//       // Mock submission with controls requiring human validation
//       const mockSubmission: SubmissionRecord = {
//         id: "APP-2023-0139",
//         partnerName: "DataSync Partners",
//         salesforceId: "SF12345",
//         validationType: "Gen AI Competency",
//         competencyCategory: "Foundation Models (FMs) and Application Development: Foundation Models",
//         status: "Human Validation",
//         submittedAt: "2023-04-08",
//         controls: [
//           {
//             controlId: "TC003",
//             status: "pending",
//             confidenceScore: 68,
//             notes: "",
//             aiAnalysis: "The submission implements basic input validation, but lacks comprehensive validation for all edge cases. Evidence found in code samples on pages 14-16, but validation logic appears incomplete."
//           },
//           {
//             controlId: "TC005",
//             status: "pending",
//             confidenceScore: 72,
//             notes: "",
//             aiAnalysis: "Documentation mentions bias detection but technical implementation details are vague. Referenced tools exist but evidence of integration is inconclusive from provided materials."
//           },
//           {
//             controlId: "TC007",
//             status: "pending",
//             confidenceScore: 75,
//             notes: "",
//             aiAnalysis: "Model monitoring is mentioned in the architecture diagram, but no detailed information about implementation or alert mechanisms is provided."
//           }
//         ]
//       };
      
//       setCurrentSubmission(mockSubmission);
//     } catch (error) {
//       console.error("Error fetching validation data:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load validation data. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchCurrentSubmission();
    
//     // Set up polling interval for updates
//     const intervalId = setInterval(fetchCurrentSubmission, 60000); // every minute
    
//     return () => clearInterval(intervalId);
//   }, []);
  
//   const handleControlAction = (controlId: string, action: 'approve' | 'reject') => {
//     if (!currentSubmission || !currentSubmission.controls) return;
    
//     // Update the control status locally
//     setCurrentSubmission(prev => {
//       if (!prev || !prev.controls) return prev;
      
//       const updatedControls = prev.controls.map(control => {
//         if (control.controlId === controlId) {
//           return {
//             ...control,
//             status: action === 'approve' ? 'pass' : 'fail' as 'pass' | 'fail'
//           };
//         }
//         return control;
//       });
      
//       return {
//         ...prev,
//         controls: updatedControls
//       };
//     });
    
//     // Show feedback
//     toast({
//       title: action === 'approve' ? "Control Approved" : "Control Rejected",
//       description: `Control ${controlId} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
//       variant: "default",
//     });
    
//     // In a real implementation, we would save this to DynamoDB
//   };
  
//   const handleControlNoteChange = (controlId: string, notes: string) => {
//     if (!currentSubmission || !currentSubmission.controls) return;
    
//     setCurrentSubmission(prev => {
//       if (!prev || !prev.controls) return prev;
      
//       const updatedControls = prev.controls.map(control => {
//         if (control.controlId === controlId) {
//           return {
//             ...control,
//             notes
//           };
//         }
//         return control;
//       });
      
//       return {
//         ...prev,
//         controls: updatedControls
//       };
//     });
//   };
  
//   const completeValidation = () => {
//     // In a real implementation, we would update DynamoDB and call the Lambda function
//     toast({
//       title: "Validation Complete",
//       description: "The validation has been completed successfully.",
//       variant: "default",
//     });
//   };
  
//   // Calculate validation progress
//   const calculateProgress = () => {
//     if (!currentSubmission || !currentSubmission.controls) return 0;
    
//     const completedControls = currentSubmission.controls.filter(
//       control => control.status === 'pass' || control.status === 'fail'
//     ).length;
    
//     return (completedControls / currentSubmission.controls.length) * 100;
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Human-in-the-Loop Validation</h1>
//         <p className="text-muted-foreground">
//           Review AI validation results and provide human verification
//         </p>
//       </div>

//       <div className="flex items-center space-x-2 mb-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search submissions..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Button variant="outline" onClick={fetchCurrentSubmission} disabled={refreshing}>
//           {refreshing ? (
//             <>
//               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//               Refreshing...
//             </>
//           ) : (
//             <>
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </>
//           )}
//         </Button>
//         <Button className="bg-primary">Assign To Me</Button>
//       </div>

//       <Tabs defaultValue="current" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="current">Current (1)</TabsTrigger>
//           <TabsTrigger value="queue">Queue (4)</TabsTrigger>
//           <TabsTrigger value="completed">Completed</TabsTrigger>
//         </TabsList>
//         <TabsContent value="current">
//           {loading ? (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center justify-center h-40">
//                   <p className="text-muted-foreground">Loading validation data...</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : currentSubmission ? (
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <CardTitle>{currentSubmission.id}: {currentSubmission.partnerName}</CardTitle>
//                     <CardDescription>
//                       {currentSubmission.validationType}
//                       {currentSubmission.competencyCategory ? `: ${currentSubmission.competencyCategory.split(':')[1]}` : ''}
//                     </CardDescription>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-muted-foreground">Average AI Confidence:</span>
//                     <span className="text-sm font-medium">
//                       {currentSubmission.controls ? 
//                         Math.round(
//                           currentSubmission.controls.reduce((sum, control) => sum + control.confidenceScore, 0) / 
//                           currentSubmission.controls.length
//                         ) : 0}%
//                     </span>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <h3 className="font-medium">AI Validation Progress</h3>
//                       <span className="text-sm text-muted-foreground">
//                         {calculateProgress() === 100 ? 'All controls reviewed' : 'Controls pending review'}
//                       </span>
//                     </div>
//                     <Progress value={calculateProgress()} className="h-2" />
//                   </div>

//                   <div className="space-y-4">
//                     <h3 className="font-medium">Controls Requiring Human Verification</h3>
                    
//                     {currentSubmission.controls && currentSubmission.controls.map(control => (
//                       <div key={control.controlId} className="rounded-md border p-4 space-y-4">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <div className="flex items-center space-x-2">
//                               <AlertTriangle className="h-5 w-5 text-amber-500" />
//                               <h4 className="font-medium">{control.controlId}: Input Validation</h4>
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               AI confidence score: {control.confidenceScore}%
//                             </p>
//                           </div>
//                           <div className="flex space-x-2">
//                             <Button 
//                               variant={control.status === 'fail' ? "default" : "outline"} 
//                               size="sm" 
//                               className={control.status === 'fail' ? "bg-destructive text-destructive-foreground h-8" : "h-8"}
//                               onClick={() => handleControlAction(control.controlId, 'reject')}
//                             >
//                               <ThumbsDown className="h-4 w-4 mr-1" />
//                               Reject
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               className={control.status === 'pass' ? "h-8 bg-green-600" : "h-8 bg-primary"}
//                               onClick={() => handleControlAction(control.controlId, 'approve')}
//                             >
//                               <ThumbsUp className="h-4 w-4 mr-1" />
//                               Approve
//                             </Button>
//                           </div>
//                         </div>
                        
//                         <div className="grid grid-cols-2 gap-4 pt-2 border-t">
//                           <div>
//                             <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
//                             <div className="text-sm p-3 bg-muted rounded-md">
//                               <p>{control.aiAnalysis}</p>
//                             </div>
//                           </div>
//                           <div>
//                             <h5 className="text-sm font-medium mb-1">Human Verification</h5>
//                             <div className="border rounded-md p-3">
//                               <Textarea 
//                                 className="w-full min-h-[100px] text-sm bg-transparent resize-none focus:outline-none" 
//                                 placeholder="Add your verification notes here..."
//                                 value={control.notes}
//                                 onChange={(e) => handleControlNoteChange(control.controlId, e.target.value)}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="border-t px-6 py-4">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex space-x-2">
//                     <Button variant="outline">
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject Application
//                     </Button>
//                     <Button variant="outline">Request More Info</Button>
//                   </div>
//                   <Button 
//                     className="bg-primary"
//                     onClick={completeValidation}
//                     disabled={!currentSubmission.controls || 
//                       currentSubmission.controls.some(control => control.status === 'pending')}
//                   >
//                     <CheckCircle className="h-4 w-4 mr-2" />
//                     Complete Validation
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           ) : (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex flex-col items-center justify-center h-40">
//                   <p className="text-muted-foreground">No validation tasks currently assigned</p>
//                   <Button className="mt-4 bg-primary">Assign From Queue</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>
//         <TabsContent value="queue">
//           <Card>
//             <CardHeader>
//               <CardTitle>Validation Queue</CardTitle>
//               <CardDescription>
//                 Applications waiting for human validation review
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
//                   <div>
//                     <h3 className="font-medium">APP-2023-0140: CloudNova Ltd</h3>
//                     <p className="text-sm text-muted-foreground">Generative Image Creator</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="text-right">
//                       <p className="text-sm font-medium">4 controls need review</p>
//                       <p className="text-xs text-muted-foreground">AI Confidence: 65%</p>
//                     </div>
//                     <Button size="sm" className="bg-primary">Assign</Button>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
//                   <div>
//                     <h3 className="font-medium">APP-2023-0141: TechWave Inc.</h3>
//                     <p className="text-sm text-muted-foreground">NLP Assistant Pro</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="text-right">
//                       <p className="text-sm font-medium">2 controls need review</p>
//                       <p className="text-xs text-muted-foreground">AI Confidence: 82%</p>
//                     </div>
//                     <Button size="sm" className="bg-primary">Assign</Button>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
//                   <div>
//                     <h3 className="font-medium">APP-2023-0142: Acme Solutions</h3>
//                     <p className="text-sm text-muted-foreground">AI Vision Analyzer</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="text-right">
//                       <p className="text-sm font-medium">5 controls need review</p>
//                       <p className="text-xs text-muted-foreground">AI Confidence: 71%</p>
//                     </div>
//                     <Button size="sm" className="bg-primary">Assign</Button>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent cursor-pointer">
//                   <div>
//                     <h3 className="font-medium">APP-2023-0143: ML Experts Inc.</h3>
//                     <p className="text-sm text-muted-foreground">Forecasting Intelligence</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="text-right">
//                       <p className="text-sm font-medium">3 controls need review</p>
//                       <p className="text-xs text-muted-foreground">AI Confidence: 76%</p>
//                     </div>
//                     <Button size="sm" className="bg-primary">Assign</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="completed">
//           <Card>
//             <CardHeader>
//               <CardTitle>Completed Validations</CardTitle>
//               <CardDescription>
//                 History of applications you have validated
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-center h-40 text-muted-foreground">
//                 <p>Completed validations will appear here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
}
