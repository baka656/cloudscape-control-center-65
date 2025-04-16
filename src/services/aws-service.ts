
import { API, Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { awsConfig } from '../config/aws-config';

// Export interfaces for TypeScript typing
export interface ControlAssessment {
  controlId: string;
  status: 'pass' | 'fail' | 'pending';
  confidenceScore: number;
  notes: string;
  aiAnalysis?: string;
}

export interface SubmissionRecord {
  id: string; // This will be the application ID
  partnerName: string;
  salesforceId: string;
  validationType: string;
  competencyCategory?: string;
  status: 'Pending' | 'In Review' | 'AI Validation' | 'Human Validation' | 'Approved' | 'Rejected';
  submittedAt: string;
  s3Bucket?: string;
  controls?: ControlAssessment[];
}

// Upload files to S3 bucket
export const createBucketAndUploadFiles = async (
  salesforceId: string,
  selfAssessment: File,
  additionalFiles: File[]
) => {
  try {
    const bucketName = `partner-submissions-${salesforceId.toLowerCase()}`;
    
    // In a production environment with AWS Amplify, we'd use:
    // Upload self-assessment file
    const selfAssessmentKey = `self-assessment/${Date.now()}-${selfAssessment.name}`;
    await Storage.put(selfAssessmentKey, selfAssessment, {
      contentType: selfAssessment.type,
      customPrefix: {
        public: ''
      }
    });

    // Upload additional files
    const additionalFilesKeys = [];
    for (const file of additionalFiles) {
      const fileKey = `additional-docs/${Date.now()}-${file.name}`;
      await Storage.put(fileKey, file, {
        contentType: file.type,
        customPrefix: {
          public: ''
        }
      });
      additionalFilesKeys.push(fileKey);
    }

    return {
      bucketName,
      selfAssessmentKey,
      additionalFilesKeys
    };
  } catch (error) {
    console.error("Error uploading files to S3:", error);
    throw new Error('Failed to upload files to S3');
  }
};

// Save submission to DynamoDB using API Gateway as a proxy
export const saveSubmissionToDynamoDB = async (submissionData: SubmissionRecord) => {
  try {
    // For demonstration purposes, we'll use the REST API endpoint
    // In production, this would be properly configured with API Gateway
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to DynamoDB');
    }
    
    const result = await response.json();
    return { success: true, id: submissionData.id };
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    throw new Error('Failed to save submission data');
  }
};

// Invoke Lambda function through API Gateway
export const invokeSubmissionProcessing = async (submissionData: SubmissionRecord) => {
  try {
    const response = await fetch(`${awsConfig.api.invokeUrl}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    throw new Error('Failed to start submission processing');
  }
};

// Get submission details from DynamoDB via API Gateway
export const getSubmissionDetails = async (submissionId: string): Promise<SubmissionRecord | null> => {
  try {
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions/${submissionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch submission details');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching submission details:", error);
    throw new Error('Failed to fetch submission details');
  }
};

// Get all submissions via API Gateway
export const getAllSubmissions = async (): Promise<SubmissionRecord[]> => {
  try {
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new Error('Failed to fetch submissions');
  }
};
