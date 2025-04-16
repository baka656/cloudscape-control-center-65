
// AWS Configuration
export const awsConfig = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  // These values will be replaced by environment variables in AWS Amplify
  s3: {
    bucket: process.env.REACT_APP_S3_BUCKET || 'default-bucket',
  },
  api: {
    invokeUrl: process.env.REACT_APP_API_GATEWAY_URL || 'https://example.execute-api.region.amazonaws.com/stage',
  },
  dynamoDb: {
    tableName: process.env.REACT_APP_DYNAMODB_TABLE || 'submissions-table',
  }
};

// Amplify configuration
export const amplifyConfig = {
  Auth: {
    // You will need to set this up in your Amplify project
    // identityPoolId: 'your-identity-pool-id',
    region: awsConfig.region
  },
  API: {
    endpoints: [
      {
        name: 'SubmissionAPI',
        endpoint: awsConfig.api.invokeUrl
      }
    ]
  },
  Storage: {
    AWSS3: {
      bucket: awsConfig.s3.bucket,
      region: awsConfig.region
    }
  }
};
