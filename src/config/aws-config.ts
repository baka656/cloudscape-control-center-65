
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
  Storage: {
    region: awsConfig.region,
    bucket: awsConfig.s3.bucket,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '' // This is required for S3 access
  },
  API: {
    endpoints: [
      {
        name: "SubmissionAPI",
        endpoint: awsConfig.api.invokeUrl,
        custom_header: async () => {
          return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Request CORS headers
          };
        }
      }
    ]
  }
};
