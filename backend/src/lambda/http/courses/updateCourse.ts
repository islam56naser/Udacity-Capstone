import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateCourseRequest } from '../../../requests/UpdateCourseRequest'
import { updateCourse } from '../../../businessLayer/course'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const courseId = event.pathParameters.courseId
  const updatedCourse: UpdateCourseRequest = JSON.parse(event.body)
  let statusCode = 200
  try {
    await updateCourse(updatedCourse, courseId)
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
