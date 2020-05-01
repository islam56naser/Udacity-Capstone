import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteTopic } from '../../../businessLayer/topic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const topicId = event.pathParameters.topicId
  let statusCode = 200
  try {
    await deleteTopic(topicId)
  } catch (error) {
    statusCode = error.statusCode || 500
  } finally {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }

  
}
