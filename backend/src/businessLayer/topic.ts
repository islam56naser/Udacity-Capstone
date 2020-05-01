import { TopicsAccess } from '../dataLayer/topicsAccess'
import { TopicItem } from '../models/TopicItem'
import { CreateTopicRequest } from '../requests/CreateTopicRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { UpdateTopicRequest } from '../requests/UpdateTopicRequest'
import { AppError } from '../errors/appError'

const topicAccess = new TopicsAccess()
const logger = createLogger('Topics')

export async function getTopics(courseId: string): Promise<TopicItem[]> {
  logger.info('Getting all topics for user: ', { courseId })

  return topicAccess.getTopics(courseId)
}

export async function createTopic(topicRequest: CreateTopicRequest, courseId: string): Promise<TopicItem> {
  logger.info('Creating topic', { topicRequest, courseId });
  const topicId = uuid.v4()
  const topic = {
    ...topicRequest,
    createdAt: (new Date()).toISOString(),
    courseId,
    topicId,
  }
  return topicAccess.createTopic(topic)
}

export async function updateTopic(topicRequest: UpdateTopicRequest, topicId: string): Promise<void> {
  logger.info('Update topic', { topicId, topicRequest })
  const toBeUpdatedTopic = await topicAccess.getTopic(topicId)
  if (!toBeUpdatedTopic) {
    logger.info('Topic not found', { topicId })
    throw new AppError('Not found', 404)
  }
  logger.info('Topic Found', { toBeUpdatedTopic })
  await topicAccess.updateTopic(topicRequest, toBeUpdatedTopic)
}


export async function deleteTopic(topicId: string): Promise<void> {
  logger.info('Deleting topic', { topicId });
  const toBeDeletedTopic = await topicAccess.getTopic(topicId)
  if (!toBeDeletedTopic) {
    logger.info('Topic not found', { topicId })
    throw new AppError('Not found', 404)
  }
  logger.info('Topic Found', { toBeDeletedTopic })
  await topicAccess.deleteTopic(toBeDeletedTopic)

}

export async function generateUploadUrl(topicId: string): Promise<string> {
  logger.info('Generating topic url', { topicId });
  return topicAccess.generateUploadUrl(topicId)
}


