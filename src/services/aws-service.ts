
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
    
    // Dynamically import Amplify Storage to ensure it's available
    const { uploadData } = await import('@aws-amplify/storage');
    
    console.log('Uploading self-assessment file...');
    
    // Upload self-assessment file
    const selfAssessmentKey = `self-assessment/${Date.now()}-${selfAssessment.name}`;
    await uploadData({
      key: selfAssessmentKey,
      data: selfAssessment,
      options: {
        contentType: selfAssessment.type
      }
    }).result;

    // Upload additional files
    const additionalFilesKeys = [];
    for (const file of additionalFiles) {
      const fileKey = `additional-docs/${Date.now()}-${file.name}`;
      await uploadData({
        key: fileKey,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;
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
    // Using fetch with no-cors mode as fallback
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      mode: 'cors', // Try with cors first
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      // If regular fetch fails, try using Amplify API
      const { post } = await import('@aws-amplify/api');
      const result = await post({
        apiName: 'SubmissionAPI',
        path: '/submissions', 
        options: {
          body: submissionData
        }
      });
      
      return { success: true, id: submissionData.id };
    }
    
    const result = await response.json();
    return { success: true, id: submissionData.id };
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    
    try {
      // Last resort fallback using no-cors mode
      await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // Use no-cors as a last resort
        body: JSON.stringify(submissionData)
      });
      
      return { success: true, id: submissionData.id };
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      throw new Error('Failed to save submission data');
    }
  }
};

// Invoke Lambda function through API Gateway
export const invokeSubmissionProcessing = async (submissionData: SubmissionRecord) => {
  try {
    // Try first with fetch
    try {
      const response = await fetch(`${awsConfig.api.invokeUrl}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (fetchError) {
      console.error("Error with fetch, trying Amplify API:", fetchError);
      
      // Try using Amplify API
      const { post } = await import('@aws-amplify/api');
      
      const result = await post({
        apiName: 'SubmissionAPI',
        path: '/process',
        options: {
          body: submissionData
        }
      });
      
      return result;
    }
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    
    // Last resort fallback
    try {
      await fetch(`${awsConfig.api.invokeUrl}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // Use no-cors as a last resort
        body: JSON.stringify(submissionData)
      });
      
      return { success: true };
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      throw new Error('Failed to start submission processing');
    }
  }
};

// Get submission details from DynamoDB via API Gateway
export const getSubmissionDetails = async (submissionId: string): Promise<SubmissionRecord | null> => {
  try {
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions/${submissionId}`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch submission details');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching submission details:", error);
    
    try {
      // Try using Amplify API as fallback
      const { get } = await import('@aws-amplify/api');
      const result = await get({
        apiName: 'SubmissionAPI',
        path: `/submissions/${submissionId}`
      });
      return result;
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      throw new Error('Failed to fetch submission details');
    }
  }
};

// Get all submissions via API Gateway
export const getAllSubmissions = async (): Promise<SubmissionRecord[]> => {
  try {
    const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching submissions:", error);
    
    try {
      // Try using Amplify API as fallback
      const { get } = await import('@aws-amplify/api');
      const result = await get({
        apiName: 'SubmissionAPI',
        path: '/submissions'
      });
      return result;
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      throw new Error('Failed to fetch submissions');
    }
  }
};
