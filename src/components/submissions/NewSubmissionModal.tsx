
import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createBucketAndUploadFiles, saveSubmissionToDynamoDB, invokeSubmissionProcessing } from "@/services/aws-service";

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmissionFormData) => void;
}

export interface SubmissionFormData {
  partnerName: string;
  salesforceId: string;
  validationType: string;
  competencyCategory?: string;
  selfAssessment: File | null;
  additionalFiles: File[];
}

export function NewSubmissionModal({ isOpen, onClose, onSubmit }: NewSubmissionModalProps) {
  const [partnerName, setPartnerName] = useState("");
  const [salesforceId, setSalesforceId] = useState("");
  const [validationType, setValidationType] = useState("");
  const [competencyCategory, setCompetencyCategory] = useState("");
  const [selfAssessment, setSelfAssessment] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationTypes = ["Gen AI Competency"];
  
  const competencyCategories = [
    "Generative AI applications: Horizontal applications",
    "Generative AI applications: Vertical-specific applications",
    "Foundation Models (FMs) and Application Development: Foundation Models",
    "Foundation Models (FMs) and Application Development: FMOPs Tools and Platforms",
    "Foundation Models (FMs) and Application Development: FM-based app development tools and platforms",
    "Infrastructure and Data: Purpose-built AI Hardware",
    "Infrastructure and Data: Data tools and Platforms: Vector Databases",
    "Infrastructure and Data: Data tools and Platforms: Synthetic Data Generation"
  ];

  const resetForm = () => {
    setPartnerName("");
    setSalesforceId("");
    setValidationType("");
    setCompetencyCategory("");
    setSelfAssessment(null);
    setAdditionalFiles([]);
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!partnerName.trim()) {
      errors.partnerName = "Partner name is required";
    }
    
    if (!salesforceId.trim()) {
      errors.salesforceId = "Salesforce ID is required";
    }
    
    if (!validationType) {
      errors.validationType = "Validation type is required";
    }
    
    if (validationType === "Gen AI Competency" && !competencyCategory) {
      errors.competencyCategory = "Competency category is required for Gen AI Competency";
    }
    
    if (!selfAssessment) {
      errors.selfAssessment = "Self-assessment file is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Call AWS services here to create bucket and upload files
        // This will be replaced with actual implementation
        if (selfAssessment) {
          // Process the submission with AWS services
          onSubmit({
            partnerName,
            salesforceId,
            validationType,
            competencyCategory: validationType === "Gen AI Competency" ? competencyCategory : undefined,
            selfAssessment,
            additionalFiles
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error
      } finally {
        setIsSubmitting(false);
        handleClose();
      }
    }
  };

  const handleSelfAssessmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfAssessment(e.target.files[0]);
      // Clear the error if it exists
      if (formErrors.selfAssessment) {
        const { selfAssessment, ...rest } = formErrors;
        setFormErrors(rest);
      }
    }
  };

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAdditionalFiles([...additionalFiles, ...newFiles]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(additionalFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Application Submission</DialogTitle>
            <DialogDescription>
              Submit a new partner application for validation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="partnerName" className="text-right">
                Partner Name
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter partner company name"
                  className={formErrors.partnerName ? "border-destructive" : ""}
                />
                {formErrors.partnerName && (
                  <p className="text-destructive text-xs mt-1">{formErrors.partnerName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salesforceId" className="text-right">
                Salesforce ID
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="salesforceId"
                  value={salesforceId}
                  onChange={(e) => setSalesforceId(e.target.value)}
                  placeholder="Enter Salesforce ID"
                  className={formErrors.salesforceId ? "border-destructive" : ""}
                />
                {formErrors.salesforceId && (
                  <p className="text-destructive text-xs mt-1">{formErrors.salesforceId}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validationType" className="text-right">
                Validation Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="col-span-3">
                <Select
                  value={validationType}
                  onValueChange={(value) => {
                    setValidationType(value);
                    // Reset competency category if not Gen AI Competency
                    if (value !== "Gen AI Competency") {
                      setCompetencyCategory("");
                    }
                  }}
                >
                  <SelectTrigger id="validationType" className={formErrors.validationType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select validation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {validationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.validationType && (
                  <p className="text-destructive text-xs mt-1">{formErrors.validationType}</p>
                )}
              </div>
            </div>
            
            {validationType === "Gen AI Competency" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="competencyCategory" className="text-right">
                  Competency Category
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="col-span-3">
                  <Select
                    value={competencyCategory}
                    onValueChange={setCompetencyCategory}
                  >
                    <SelectTrigger 
                      id="competencyCategory" 
                      className={formErrors.competencyCategory ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select competency category" />
                    </SelectTrigger>
                    <SelectContent>
                      {competencyCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.competencyCategory && (
                    <p className="text-destructive text-xs mt-1">{formErrors.competencyCategory}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="selfAssessment" className="text-right pt-2">
                Self Assessment
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="col-span-3">
                <div className={`border rounded-md p-4 ${formErrors.selfAssessment ? "border-destructive" : ""}`}>
                  {selfAssessment ? (
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{selfAssessment.name}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelfAssessment(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Label
                        htmlFor="selfAssessment"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FileUp className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">Upload Excel Sheet</span>
                        <span className="text-xs text-muted-foreground">Required</span>
                      </Label>
                      <Input
                        type="file"
                        id="selfAssessment"
                        onChange={handleSelfAssessmentChange}
                        className="hidden"
                        accept=".xlsx,.xls"
                      />
                    </div>
                  )}
                </div>
                {formErrors.selfAssessment && (
                  <p className="text-destructive text-xs mt-1">{formErrors.selfAssessment}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="additionalFiles" className="text-right pt-2">
                Additional Documents
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-4">
                  <div className="space-y-2">
                    {additionalFiles.length > 0 && (
                      <div className="space-y-2">
                        {additionalFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="text-sm">{file.name}</div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdditionalFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Label
                      htmlFor="additionalFiles"
                      className="flex flex-col items-center justify-center cursor-pointer py-2"
                    >
                      <FileUp className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">Upload Additional Files</span>
                      <span className="text-xs text-muted-foreground">Optional</span>
                    </Label>
                    <Input
                      type="file"
                      id="additionalFiles"
                      onChange={handleAdditionalFilesChange}
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Alert variant="default" className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Self-assessment Excel sheet is required. Additional supporting documents are optional.
            </AlertDescription>
          </Alert>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
