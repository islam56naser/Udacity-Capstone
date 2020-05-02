import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTopicRequest, Topic } from '../courses/models/Topic';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent {
  isLoading = false;
  file: File;
  private topicId: string;
  public oldFileName: string;
  public topic: CreateTopicRequest = {
    name: '',
    description: ''
  };

  get fileValid() {
    return this.file || this.topicId;
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(map => {
      const topic = map.get('topic');
      if (topic) {
        const topicObject = JSON.parse(topic) as Topic;
        this.topicId = topicObject.topicId;
        this.oldFileName = 'image';
        this.topic = {
          name: topicObject.name,
          description: topicObject.description
        };
      }
    });
  }

  onSubmit() {
    if (this.topicId) {
      this.editTopic();
    } else {
      this.addNewTopic();
    }
  }

  addNewTopic() {
    this.isLoading = true;
    this.apiService.addCourse$(this.topic, this.file).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (err) => {
        this.isLoading = false;
        alert(err.error.message);
      }
    );
  }

  editTopic() {
    this.isLoading = true;
    this.apiService.editCourse$(this.topicId, this.topic, this.file).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (err) => {
        this.isLoading = false;
        alert(err.error.message);
      }
    );
  }

  onFileChanged(file: File) {
    this.file = file;
  }
}
