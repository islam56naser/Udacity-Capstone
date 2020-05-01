import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTopicRequest } from '../../../requests/UpdateTopicRequest'
import { updateTopic } from '../../../businessLayer/topic'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const topicId = event.pathParameters.topicId
  const updatedTopic: UpdateTopicRequest = JSON.parse(event.body)
  let statusCode = 200
  try {
    await updateTopic(updatedTopic, topicId)
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
