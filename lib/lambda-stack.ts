import { Stack } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps & { stageName?: string }) {
    super(scope, id, props);

    const table: dynamodb.Table = new dynamodb.Table(
      this,
      `${props?.stageName || 'Dev'}CdkTypescriptWeatherTable`,
      {
        tableName: `${props?.stageName || 'dev'}weatherApiTable`,
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const weatherApi: apigw.RestApi = new apigw.RestApi(
      this,
      `weather_rest_api`,
      {
        restApiName: `${props?.stageName || 'dev'} Weather Rest Api`,
        description: "This service saves weather data.",
      } as apigw.RestApiProps
    );

    const createWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "CreateWeatherLambdaFunction",
      {
        functionName: `${props?.stageName || 'dev'}-cdk-typescript-create`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "createWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props?.stageName || 'dev',
        },
      }
    );

    const deleteWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "DeleteWeatherLambdaFunction",
      {
        functionName: `${props?.stageName || 'dev'}-cdk-typescript-delete`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "deleteWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props?.stageName || 'dev',
        },
      }
    );

    const updateWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "UpdateWeatherLambdaFunction",
      {
        functionName: `${props?.stageName || 'dev'}-cdk-typescript-update`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "updateWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props?.stageName || 'dev',
        },
      }
    );

    const listWeathersLambda: lambda.Function = new lambda.Function(
      this,
      "ListWeathersLambdaFunction",
      {
        functionName: `${props?.stageName || 'dev'}-cdk-typescript-list`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "listWeathers.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props?.stageName || 'dev',
        },
      }
    );

    const getWeatherLambda: lambda.Function = new lambda.Function(
      this,
      "GetWeatherLambdaFunction",
      {
        functionName: `${props?.stageName || 'dev'}-cdk-typescript-get`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: "getWeather.lambdaHandler",
        code: lambda.Code.fromAsset("src"),
        environment: {
          TABLE_NAME: table.tableName,
          STAGE_NAME: props?.stageName || 'dev',
        },
      }
    );

    table.grantWriteData(createWeatherLambda);
    table.grantWriteData(deleteWeatherLambda);
    table.grantWriteData(updateWeatherLambda);
    table.grantReadData(listWeathersLambda);
    table.grantReadData(getWeatherLambda);

    const root = weatherApi.root;
    root.addResource("create-weather").addMethod("POST", new apigw.LambdaIntegration(createWeatherLambda));
    root.addResource("delete-weather").addMethod("DELETE", new apigw.LambdaIntegration(deleteWeatherLambda));
    root.addResource("update-weather").addMethod("PUT", new apigw.LambdaIntegration(updateWeatherLambda));
    root.addResource("list-weathers").addMethod("GET", new apigw.LambdaIntegration(listWeathersLambda));
    root.addResource("get-weather").addMethod("GET", new apigw.LambdaIntegration(getWeatherLambda));
  }
}
