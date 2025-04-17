
import { v4 as uuidv4 } from 'uuid';
import { awsConfig } from '../config/aws-config';
import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { get, post } from 'aws-amplify/api';

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
    console.log('Uploading files to S3...');
    
    // Upload self-assessment file
    const selfAssessmentKey = `self-assessment/${Date.now()}-${selfAssessment.name}`;
    console.log('Uploading self-assessment file:', selfAssessmentKey);
    
    await uploadData({
      key: selfAssessmentKey,
      data: selfAssessment,
      options: {
        contentType: selfAssessment.type,
        accessLevel: 'guest'
      }
    });

    // Upload additional files
    const additionalFilesKeys = [];
    for (const file of additionalFiles) {
      const fileKey = `additional-docs/${Date.now()}-${file.name}`;
      await uploadData({
        key: fileKey,
        data: file,
        options: {
          contentType: file.type,
          accessLevel: 'guest'
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
    console.log('Saving submission to DynamoDB:', submissionData);
    
    // Try with Amplify API first
    try {
      const response = await post({
        apiName: 'SubmissionAPI',
        path: '/submissions',
        options: {
          body: submissionData,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      });
      
      return { success: true, id: submissionData.id, response };
    } catch (apiError) {
      console.error("Error with Amplify API, falling back to fetch:", apiError);
      
      // Fallback to fetch
      const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
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
      
      const result = await response.json();
      return { success: true, id: submissionData.id, result };
    }
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    
    // Last resort fallback using no-cors mode
    try {
      await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', 
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
    console.log('Invoking submission processing:', submissionData);
    
    // Try with Amplify API first
    try {
      const response = await post({
        apiName: 'SubmissionAPI',
        path: '/process',
        options: {
          body: submissionData,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      });
      
      return { success: true, response };
    } catch (apiError) {
      console.error("Error with Amplify API, falling back to fetch:", apiError);
      
      // Fallback to fetch
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
      
      return { success: true, result: await response.json() };
    }
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    
    // Last resort fallback
    try {
      await fetch(`${awsConfig.api.invokeUrl}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
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
    console.log('Getting submission details:', submissionId);
    
    try {
      // Try using Amplify API
      const response = await get({
        apiName: 'SubmissionAPI',
        path: `/submissions/${submissionId}`
      });
      
      return response.body as SubmissionRecord;
    } catch (apiError) {
      console.error("Error with Amplify API, falling back to fetch:", apiError);
      
      // Fallback to fetch
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
    }
  } catch (error) {
    console.error("Error fetching submission details:", error);
    throw new Error('Failed to fetch submission details');
  }
};

// Get all submissions via API Gateway
export const getAllSubmissions = async (): Promise<SubmissionRecord[]> => {
  try {
    console.log('Getting all submissions');
    
    try {
      // Try using Amplify API
      const response = await get({
        apiName: 'SubmissionAPI',
        path: '/submissions'
      });
      
      // Check if response.body is an array
      const submissions = response.body;
      if (Array.isArray(submissions)) {
        return submissions as SubmissionRecord[];
      } else {
        console.warn('API returned non-array response:', submissions);
        return [];
      }
    } catch (apiError) {
      console.error("Error with Amplify API, falling back to fetch:", apiError);
      
      // Fallback to fetch
      const response = await fetch(`${awsConfig.api.invokeUrl}/submissions`, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const result = await response.json();
      if (Array.isArray(result)) {
        return result;
      } else {
        console.warn('API returned non-array response:', result);
        return [];
      }
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};
