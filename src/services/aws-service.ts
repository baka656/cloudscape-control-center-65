
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
  id: string;
  partnerName: string;
  validationType: string;
  competencyCategory?: string;
  status: 'Pending' | 'In Review' | 'AI Validation' | 'Human Validation' | 'Approved' | 'Rejected';
  submittedAt: string;
  controls?: ControlAssessment[];
}

// Upload files to S3 bucket
export const createBucketAndUploadFiles = async (
  salesforceId: string,
  selfAssessment: File,
  additionalFiles: File[]
) => {
  try {
    const bucketName = `${salesforceId}`;
    console.log('Uploading files to S3...', bucketName);
    
    // // Upload self-assessment file
    // const selfAssessmentKey = `self-assessment/${selfAssessment.name}`;
    // console.log('Uploading self-assessment file:', selfAssessmentKey);
    
    await uploadData({
      path: `${salesforceId}/${salesforceId}.xlsx`,
      data: selfAssessment,
      options: {
        contentType: 'xlsx',
        accessLevel: 'guest'
      }
    });

    //Upload additional files
    const additionalFilesKeys = [];
    for (const file of additionalFiles) {
      const fileKey = `${salesforceId}/${file.name}`;
      await uploadData({
        path: fileKey,
        data: file,
        options: {
          contentType: file.type,
          accessLevel: 'guest'
        }
      });
      additionalFilesKeys.push(fileKey);
    }
    console.log('Files uploaded successfully', additionalFilesKeys);
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Submission saved in DynamoDB", result);
    
    return { success: true, id: submissionData.id, response: result };
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    throw error;
  }
};

// Invoke Lambda function through API Gateway
export const invokeSubmissionProcessing = async (submissionData: SubmissionRecord) => {
  try {
    console.log('Invoking submission processing:', submissionData);
    const response = await fetch('https://j3rjmmfkh6.execute-api.us-east-1.amazonaws.com/default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    
    console.log("Sent the submission to lambda", response)
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
        'Content-Type': 'application/json'
      }
    });
    // if (!response.ok) {
    //   if (response.status === 404) {
    //     throw new Error('Submission not found');
    //   }
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    const data = await response.json();
    console.log("One Submission retrieved from dynamodb", data)
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
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Raw DynamoDB response:', data);

    // Transform DynamoDB format to plain objects
    const transformedItems = data.Items.map(item => ({
      id: item.id.S,
      partnerName: item.partnerName.S,
      validationType: item.validationType.S,
      competencyCategory: item.competencyCategory?.S,
      status: item.status.S,
      submittedAt: item.submittedAt.S
    }));

    console.log('Transformed submissions:', transformedItems);
    return transformedItems;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};
