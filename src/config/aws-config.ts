
// AWS Configuration
export const awsConfig = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  // These values will be replaced by environment variables in AWS Amplify
  s3: {
    bucket: process.env.REACT_APP_S3_BUCKET || 'partner-competency-self-assessment-files',
  },
  api: {
    invokeUrl: process.env.REACT_APP_API_GATEWAY_URL || 'https://swiozvzqs6.execute-api.us-east-1.amazonaws.com/prod/submissions',
  },
  dynamoDb: {
    tableName: process.env.REACT_APP_DYNAMODB_TABLE || 'submissions-table',
  }
};

// Updated Amplify configuration compatible with Amplify Gen 2
export const amplifyConfig = {
  Auth: {
    Cognito: {
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || 'us-east-1:c269a361-7c13-4f7b-9f41-8b7f78db1281',
      allowGuestAccess: true,
      region: awsConfig.region,
    }
  },
  Storage: {
    S3: {
      bucket: awsConfig.s3.bucket,
      region: awsConfig.region,
    }
  },
  API: {
    REST: {
      SubmissionAPI: {
        endpoint: awsConfig.api.invokeUrl,
        region: awsConfig.region,
      }
    }
  }
};
