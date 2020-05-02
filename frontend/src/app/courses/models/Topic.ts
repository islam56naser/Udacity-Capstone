export class Topic {
  name: string;
  description: string;
  createdAt: string;
  courseId: string;
  topicId: string;
  attachmentUrl: string;
}

export class CreateTopicRequest {
  name: string;
  description: string;
}
