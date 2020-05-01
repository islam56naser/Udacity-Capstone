import { Component, OnInit } from '@angular/core';
import { CreateCourseRequest, Course } from '../courses/models/Course';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  isLoading = false;
  file: File;
  private courseId: string;
  public oldFileName: string;
  public course: CreateCourseRequest = {
    name: '',
    description: ''
  };

  get fileValid() {
    return this.file || this.courseId;
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(map => {
      const course = map.get('course');
      if (course) {
        const courseObject = JSON.parse(course) as Course;
        this.courseId = courseObject.courseId;
        this.oldFileName = 'image';
        this.course = {
          name: courseObject.name,
          description: courseObject.description
        };
      }
    });
  }

  onSubmit() {
    if (this.courseId) {
      this.editCourse();
    } else {
      this.addNewCourse();
    }
  }

  addNewCourse() {
    this.isLoading = true;
    this.apiService.addCourse$(this.course, this.file).subscribe(
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

  editCourse() {
    this.isLoading = true;
    this.apiService.editCourse$(this.courseId, this.course, this.file).subscribe(
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
    console.log('ffdjkfkjhdkf', file);
    this.file = file;
  }
}
