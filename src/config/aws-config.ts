
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

// Updated Amplify configuration with correct types
export const amplifyConfig = {
  Auth: {
    // Using Cognito Identity is optional but helpful for S3/API permissions
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || 'us-east-1:1234abcd-1234-5678-abcd-1234567890ab',
    region: awsConfig.region
  },
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
