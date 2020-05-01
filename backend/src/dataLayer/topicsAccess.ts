import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)


import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TopicItem } from '../models/TopicItem'
import { UpdateTopicRequest } from '../requests/UpdateTopicRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('Topic Access')

export class TopicsAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly topicsTable = process.env.TOPICS_TABLE,
    private readonly topicsBucket = process.env.TOPICS_S3_BUCKET,
    private readonly topicsIndex = process.env.TOPICS_ID_INDEX,
    private readonly urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
  ) {

  }

  async getTopics(courseId: string): Promise<TopicItem[]> {
    const result = await this.docClient.query({
      TableName: this.topicsTable,
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      },
    }).promise()
    const items = result.Items as TopicItem[]
    return items.map(item => ({
      ...item,
      attachmentUrl: this.getSignedUrl(item.topicId)
    })) 
  }

  async createTopic(topic: TopicItem): Promise<TopicItem> {
    topic.attachmentUrl = `https://${this.topicsBucket}.s3.amazonaws.com/${topic.topicId}`;
    await this.docClient.put({
      TableName: this.topicsTable,
      Item: topic
    }).promise()
    return topic
  }

  async deleteTopic(topic: TopicItem): Promise<void> {
    await Promise.all([
      this.docClient.delete({
        TableName: this.topicsTable,
        Key: {
          courseId: topic.courseId,
          createdAt: topic.createdAt
        }
      }).promise(),
      this.s3.deleteObject({
        Bucket: this.topicsBucket,
        Key: topic.topicId,
      }).promise()
    ])
  }

  async updateTopic(updatedTopic: UpdateTopicRequest, topic: TopicItem): Promise<void> {
    await this.docClient.update({
      TableName: this.topicsTable,
      Key: {
        courseId: topic.courseId,
        createdAt: topic.createdAt
      },
      UpdateExpression: 'set description = :description, #n = :name',
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedTopic.name,
        ':description': updatedTopic.description
      },
    }).promise()

  }

  async getTopic(topicId: string): Promise<TopicItem> {
    const result = await this.docClient.query({
      TableName: this.topicsTable,
      IndexName: this.topicsIndex,
      KeyConditionExpression: 'topicId = :topicId',
      ExpressionAttributeValues: {
        ':topicId': topicId
      }
    }).promise()
    const topic = result.Items[0] as TopicItem
    topic.attachmentUrl = this.getSignedUrl(topicId)
    return topic
  }

  async generateUploadUrl(topicId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.topicsBucket,
      Key: topicId,
      Expires: this.urlExpiration
    })
    return uploadUrl
  }

  private getSignedUrl(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.topicsBucket,
      Key: key,
      Expires: this.urlExpiration
    });
  }


}
function createDynamoDBClient() {
  logger.info("Creating Topics DynamoDB Client...");
  return new XAWS.DynamoDB.DocumentClient();
}