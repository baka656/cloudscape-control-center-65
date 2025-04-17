
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
    const bucketName = `${salesforceId.toLowerCase()}`;
    console.log('Uploading files to S3...', bucketName);
    
    // Upload self-assessment file
    const selfAssessmentKey = `self-assessment/${selfAssessment.name}`;
    console.log('Uploading self-assessment file:', selfAssessmentKey);
    
    await uploadData({
      path: `partner-competency-self-assessment-files/${salesforceId}`,
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
    const response = await fetch('https://swiozvzqs6.execute-api.us-east-1.amazonaws.com/prod/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(submissionData)
    });
    
    return { success: true, id: submissionData.id, response };
  } catch (apiError) {
    console.error("Error with Amplify API, falling back to fetch:", apiError);
  }
};

// Invoke Lambda function through API Gateway
export const invokeSubmissionProcessing = async (submissionData: SubmissionRecord) => {
  try {
    console.log('Invoking submission processing:', submissionData);
    const response = await fetch('https://j3rjmmfkh6.execute-api.us-east-1.amazonaws.com/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(submissionData)
    });
    
    return { success: true, response };
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
  }
};

// Get submission details from DynamoDB via API Gateway
export const getSubmissionDetails = async (submissionId: string): Promise<SubmissionRecord | null> => {
  try {
    console.log('Getting submission details:', submissionId);
    const response = await fetch(`https://swiozvzqs6.execute-api.us-east-1.amazonaws.com/prod/submissions/${submissionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Submission not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Submission data", data)
    return data.body as SubmissionRecord;
    } catch (error) {
    console.error("Error fetching submission details:", error);
  }
};

// Get all submissions via API Gateway
export const getAllSubmissions = async (): Promise<SubmissionRecord[]> => {
  try {
    console.log('Getting all submissions');
    const response = await fetch('https://swiozvzqs6.execute-api.us-east-1.amazonaws.com/prod/submissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    // Check if response.body is an array
    const submissions = response.body;
    if (Array.isArray(submissions)) {
      return submissions as SubmissionRecord[];
    } else {
      console.warn('API returned non-array response:', submissions);
      return [];
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};
