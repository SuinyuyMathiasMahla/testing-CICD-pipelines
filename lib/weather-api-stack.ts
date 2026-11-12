import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, ShellStep, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';

export class WeatherApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub('<github-name>/<repo-name>', '<branch-name>'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    // Add test/dev stage
    const devStage = pipeline.addStage(
      new PipelineStage(this, 'PipelineDevStage', {
        stageName: 'dev',
      })
    );

    // Add production stage
    const prodStage = pipeline.addStage(
      new PipelineStage(this, 'PipelineProdStage', {
        stageName: 'prod',
      })
    );
  }
}