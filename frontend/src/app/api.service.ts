import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Course, CreateCourseRequest } from './courses/models/Course';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getCourses$(): Observable<Course[]> {
    return this.http.get<any>(`${environment.apiUrl}/courses`).pipe(map(value => value.items));
  }

  deleteCourse$(courseId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/courses/${courseId}`);
  }

  addCourse$(course: CreateCourseRequest, image: File): Observable<any> {
    return this.http.post<{item: Course}>(`${environment.apiUrl}/courses`, course).pipe(
      map(res => res.item),
      switchMap((res) => this.uploadCourseImage(res.courseId, image))
    );
  }

  uploadCourseImage(courseId: string, image: File): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/courses/${courseId}/attachment`, {}).pipe(
      switchMap((res) => this.putImageIntobucket(res.uploadUrl, image))
    );
  }

  putImageIntobucket(url: string, image: File): Observable<any> {
    const headers = new HttpHeaders().set('skip-auth-header', 'true');
    return this.http.put(url, image, { headers });
  }

  editCourse$(courseId: string, course: CreateCourseRequest, image: File): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/courses/${courseId}`, course).pipe(
      switchMap((res) => image ? this.uploadCourseImage(courseId, image) : of(res))
    );
  }

}
