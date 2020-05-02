import { CoursesAccess } from '../dataLayer/coursesAccess'
import { CourseItem } from '../models/CourseItem'
import { CreateCourseRequest } from '../requests/CreateCourseRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { UpdateCourseRequest } from '../requests/UpdateCourseRequest'
import { AppError } from '../errors/appError'

const courseAccess = new CoursesAccess()
const logger = createLogger('Courses')

export async function getCourses(userId: string): Promise<CourseItem[]> {
  logger.info('Getting all courses for user: ', { userId })

  return courseAccess.getCourses(userId)
}

export async function createCourse(courseRequest: CreateCourseRequest, userId: string): Promise<CourseItem> {
  logger.info('Creating course', { courseRequest, userId });
  const courseId = uuid.v4()
  const course = {
    ...courseRequest,
    createdAt: (new Date()).toISOString(),
    userId,
    courseId,
  }
  return courseAccess.createCourse(course)
}

export async function updateCourse(courseRequest: UpdateCourseRequest, courseId: string): Promise<void> {
  logger.info('Update course', { courseId, courseRequest })
  const toBeUpdatedCourse = await courseAccess.getCourse(courseId)
  if (!toBeUpdatedCourse) {
    logger.info('Course not found', { courseId })
    throw new AppError('Not found', 404)
  }
  logger.info('Course Found', { toBeUpdatedCourse })
  await courseAccess.updateCourse(courseRequest, toBeUpdatedCourse)
}


export async function deleteCourse(courseId: string): Promise<void> {
  logger.info('Deleting course', { courseId });
  const toBeDeletedCourse = await courseAccess.getCourse(courseId)
  if (!toBeDeletedCourse) {
    logger.info('Course not found', { courseId })
    throw new AppError('Not found', 404)
  }
  logger.info('Course Found', { toBeDeletedCourse })
  await courseAccess.deleteCourse(toBeDeletedCourse)

}

export async function generateUploadUrl(courseId: string): Promise<string> {
  logger.info('Generating course url', { courseId });
  return courseAccess.generateUploadUrl(courseId)
}


