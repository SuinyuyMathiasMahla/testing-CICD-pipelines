import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, ShellStep, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';

export class WeatherApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a new CodePipeline that pulls from GitHub and runs
    // npm ci, npm run build, npx cdk synth
    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub('SuinyuyMathiasMahla/testing-CICD-pipelines', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    // Add test/dev stage
    pipeline.addStage(
      new PipelineStage(this, 'PipelineDevStage', {
        stageName: 'dev',
      })
    );

    // Add production stage
    pipeline.addStage(
      new PipelineStage(this, 'PipelineProdStage', {
        stageName: 'prod',
      })
    );
  }
}