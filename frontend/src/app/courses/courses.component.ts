import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Course } from './models/Course';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  isLoading = false;
  constructor(
    public apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.apiService.getCourses$().subscribe(
      (data) => {
        this.isLoading = false;
        this.courses = data;
      },
      (err) => {
        this.isLoading = false;
        alert(err.error.message);
      },
    );
  }

  onEditCourseClick(course: Course) {
    this.router.navigate(['./edit'], { relativeTo: this.route, queryParams: { course: JSON.stringify(course) } });
  }

  deleteCourse(courseId: string) {
    const toBeDeleted = this.courses.find(course => course.courseId === courseId);
    const result = confirm(`Are you sure you want to delete the course '${toBeDeleted.name}' ?`);
    if (result) {
      this.isLoading = true;
      this.apiService.deleteCourse$(courseId).subscribe(
        () => {
          this.isLoading = false;
          this.courses = this.courses.filter(course => course.courseId !== courseId);
        },
        (err) => {
          this.isLoading = false;
          alert(err);
        }
      );
    }
  }

}
