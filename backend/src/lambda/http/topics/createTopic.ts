
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTopicRequest } from '../../../requests/CreateTopicRequest'
import { createTopic } from '../../../businessLayer/topic'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTopic: CreateTopicRequest = JSON.parse(event.body)
  const { courseId } = event.pathParameters
  const topic = await createTopic(newTopic, courseId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: topic
    })
  }
}
