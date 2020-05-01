export class Course {
  name: string;
  description: string;
  createdAt: string;
  userId: string;
  courseId: string;
  attachmentUrl: string;
}

export class CreateCourseRequest {
  name: string;
  description: string;
}
