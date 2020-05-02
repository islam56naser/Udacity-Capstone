import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { CoursesComponent } from './courses/courses.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { CourseTopicsComponent } from './course-topics/course-topics.component';
import { AddTopicComponent } from './add-topic/add-topic.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courses',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CoursesComponent,
      },
      {
        path: 'add',
        component: AddCourseComponent,
      },
      {
        path: 'edit',
        component: AddCourseComponent,
      },
      {
        path: ':courseId/topics',
        component: CourseTopicsComponent,
      },
      {
        path: ':courseId/topics/add',
        component: AddTopicComponent,
      },
      {
        path: ':courseId/topics/edit',
        component: AddTopicComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
