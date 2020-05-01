import * as AWS from 'aws-sdk'
const AWSXRay =  require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)


import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CourseItem } from '../models/CourseItem'
import { UpdateCourseRequest } from '../requests/UpdateCourseRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('Course Access')

export class CoursesAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly coursesTable = process.env.COURSES_TABLE,
    private readonly coursesBucket = process.env.COURSES_S3_BUCKET,
    private readonly coursesIndex = process.env.COURSES_ID_INDEX,
    private readonly urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
  ) {

  }

  async getCourses(userId: string): Promise<CourseItem[]> {
    const result = await this.docClient.query({
      TableName: this.coursesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
    }).promise()

    const items = result.Items
    return items as CourseItem[]
  }

  async createCourse(course: CourseItem): Promise<CourseItem> {
    course.attachmentUrl = `https://${this.coursesBucket}.s3.amazonaws.com/${course.courseId}`;
    await this.docClient.put({
      TableName: this.coursesTable,
      Item: course
    }).promise()
    return course
  }

  async deleteCourse(course: CourseItem): Promise<void> {
    await Promise.all([
      this.docClient.delete({
        TableName: this.coursesTable,
        Key: {
          userId: course.userId,
          createdAt: course.createdAt
        }      
      }).promise(),
      this.s3.deleteObject({
        Bucket: this.coursesBucket,
        Key: course.courseId,
      }).promise()
    ])
  }

  async updateCourse(updatedCourse: UpdateCourseRequest, course: CourseItem): Promise<void> {
    await this.docClient.update({
      TableName: this.coursesTable,
      Key: {
        userId: course.userId,
        createdAt: course.createdAt
      },
      UpdateExpression: 'set description = :description, #n = :name',
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedCourse.name,
        ':description': updatedCourse.description
      },
    }).promise()

  }

  async getCourse(courseId: string): Promise<CourseItem> {
    const result = await this.docClient.query({
      TableName: this.coursesTable,
      IndexName: this.coursesIndex,
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    }).promise()
    return result.Items[0] as CourseItem
  }

  async generateUploadUrl(courseId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.coursesBucket,
      Key: courseId,
      Expires: this.urlExpiration
    })
    return uploadUrl
  }

}
function createDynamoDBClient() {
  logger.info("Creating Courses DynamoDB Client...");
  return new XAWS.DynamoDB.DocumentClient();
 }