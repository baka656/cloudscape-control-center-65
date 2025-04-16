
// AWS Configuration
export const awsConfig = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  // These values will be replaced by environment variables in AWS Amplify
  s3: {
    bucket: process.env.REACT_APP_S3_BUCKET || 'partner-competency-self-assessment-files',
  },
  api: {
    invokeUrl: process.env.REACT_APP_API_GATEWAY_URL || 'https://j3rjmmfkh6.execute-api.us-east-1.amazonaws.com/default',
  },
  dynamoDb: {
    tableName: process.env.REACT_APP_DYNAMODB_TABLE || 'submissions-table',
  }
};

// Updated Amplify configuration with correct types
export const amplifyConfig = {
  // Remove Auth configuration to prevent the error
  Storage: {
    AWSS3: {
      bucket: awsConfig.s3.bucket,
      region: awsConfig.region
    }
  },
  API: {
    REST: {
      SubmissionAPI: {
        endpoint: awsConfig.api.invokeUrl
      }
    }
  }
};
