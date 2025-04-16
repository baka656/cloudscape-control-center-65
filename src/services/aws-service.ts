
import AWS from 'aws-sdk';
import { awsConfig } from '../config/aws-config';

// Configure AWS
AWS.config.update({
  region: awsConfig.region,
});

// Initialize services
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

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

// Create S3 bucket and upload files
export const createBucketAndUploadFiles = async (
  salesforceId: string,
  selfAssessment: File,
  additionalFiles: File[]
) => {
  try {
    // In a real implementation, we would check if bucket exists first
    // For demo purposes, we'll assume the bucket doesn't exist
    const bucketName = `partner-submissions-${salesforceId.toLowerCase()}`;
    
    // Create bucket (this would typically be done once)
    // Note: In a real implementation, this might be handled by a backend service
    try {
      await s3.createBucket({ 
        Bucket: bucketName,
        ACL: 'private'
      }).promise();
      console.log(`Created bucket: ${bucketName}`);
    } catch (error) {
      // Bucket might already exist
      console.log("Bucket may already exist or requires specific permissions");
    }

    // Upload self-assessment file
    const selfAssessmentKey = `self-assessment/${Date.now()}-${selfAssessment.name}`;
    await s3.upload({
      Bucket: bucketName,
      Key: selfAssessmentKey,
      Body: selfAssessment,
      ContentType: selfAssessment.type
    }).promise();

    // Upload additional files
    const additionalFilesKeys = [];
    for (const file of additionalFiles) {
      const fileKey = `additional-docs/${Date.now()}-${file.name}`;
      await s3.upload({
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ContentType: file.type
      }).promise();
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

// Save submission to DynamoDB
export const saveSubmissionToDynamoDB = async (submissionData: SubmissionRecord) => {
  try {
    await dynamoDB.put({
      TableName: awsConfig.dynamoDb.tableName,
      Item: submissionData
    }).promise();
    
    return { success: true, id: submissionData.id };
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
    throw new Error('Failed to save submission data');
  }
};

// Invoke Lambda function through API Gateway
export const invokeSubmissionProcessing = async (submissionData: SubmissionRecord) => {
  try {
    const response = await fetch(awsConfig.api.invokeUrl, {
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

// Get submission details from DynamoDB
export const getSubmissionDetails = async (submissionId: string): Promise<SubmissionRecord | null> => {
  try {
    const result = await dynamoDB.get({
      TableName: awsConfig.dynamoDb.tableName,
      Key: { id: submissionId }
    }).promise();
    
    return result.Item as SubmissionRecord || null;
  } catch (error) {
    console.error("Error fetching submission details:", error);
    throw new Error('Failed to fetch submission details');
  }
};

// Get all submissions
export const getAllSubmissions = async (): Promise<SubmissionRecord[]> => {
  try {
    const result = await dynamoDB.scan({
      TableName: awsConfig.dynamoDb.tableName
    }).promise();
    
    return result.Items as SubmissionRecord[] || [];
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new Error('Failed to fetch submissions');
  }
};
