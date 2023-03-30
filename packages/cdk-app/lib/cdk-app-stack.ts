import path from 'node:path';
import {
  Stack,
  type StackProps,
  aws_iam as iam,
  aws_apigateway as apigateway,
  aws_lambda as lambda,
  Duration,
} from 'aws-cdk-lib';
import {
  // type ICommandHooks,
  NodejsFunction,
  OutputFormat,
  type NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { type Construct } from 'constructs';

const esmBanner =
  'import { createRequire as topLevelCreateRequire } from "module"; import url from "url"; const require = topLevelCreateRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));';

const esmLambdaBundlingOptions = {
  sourceMap: true,
  minify: true,
  format: OutputFormat.ESM,
  tsconfig: path.join(__dirname, '../../server-app/tsconfig.json'),
  banner: esmBanner,
  externalModules: ['@aws-sdk/*'],
} satisfies NodejsFunctionProps['bundling'];

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const roleForBackendLambda = new iam.Role(this, 'BackendLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const lambdaApiBackend = new NodejsFunction(this, 'ApiBackendLambda', {
      entry: path.join(__dirname, '../../server-app/lambda.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      bundling: esmLambdaBundlingOptions,
      timeout: Duration.seconds(30),
      memorySize: 512,
      role: roleForBackendLambda,
    });

    const api = new apigateway.RestApi(this, 'webapi', {
      restApiName: 'webapi',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const apiMain = api.root
      .addResource('{proxy+}')
      .addMethod('ANY', new apigateway.LambdaIntegration(lambdaApiBackend));

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
