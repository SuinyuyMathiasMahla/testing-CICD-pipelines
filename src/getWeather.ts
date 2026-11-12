export const lambdaHandler = async (event: any) => ({ statusCode: 200, body: JSON.stringify({ message: 'Weather fetched' }) });
