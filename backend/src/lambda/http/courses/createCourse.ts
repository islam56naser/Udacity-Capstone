
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../../utils'
import { CreateCourseRequest } from '../../../requests/CreateCourseRequest'
import { createCourse } from '../../../businessLayer/course'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newCourse: CreateCourseRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const course = await createCourse(newCourse, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: course
    })
  }
}
