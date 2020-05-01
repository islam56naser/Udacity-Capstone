import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteCourse } from '../../../businessLayer/course'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const courseId = event.pathParameters.courseId
  let statusCode = 200
  try {
    await deleteCourse(courseId)
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
