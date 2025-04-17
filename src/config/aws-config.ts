
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

// Updated Amplify configuration compatible with Amplify Gen 2
export const amplifyConfig = {
  Auth: {
    Cognito: {
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
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
