import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student.service';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';

  genderList: Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          if(this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
            this.isNewStudent = true;
            this.header = 'Add New Student';
            this.setImage();
          } else {
            this.isNewStudent = false;
            this.header = 'Edit Student';
            this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                this.student = successResponse;
                this.setImage();
              },
              (errorResponse) => {
                this.setImage();
              }
            );
          }

          this.genderService.getGenderList()
          .subscribe(
            (successResponse) => {
              this.genderList = successResponse;
            }
          );
        }
      }
    );
  }

  onUpdate(): void {

    if(this.studentDetailsForm?.form.valid) {
      this.studentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Student updated successfully', undefined, {
            duration: 2000
          });
        },
        (errorResponse) => {
          // log it
          console.log(errorResponse);
        }
      );
    }
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse) => {
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);


      },
      (errorResponse) => {
        //log
      }
    );
  }

  onAdd(): void{

    if(this.studentDetailsForm?.form.valid) {
      //submit form to api
      this.studentService.addStudent(this.student)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Student added successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 2000);

        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
    }


  }

  uploadImage(event: any): void {
    if(this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage()
          this.snackbar.open('Profile Image Updated', undefined, {
            duration: 2000
          });
        },
        (errorResponse) => {

        }
      );

    }
  }

  private setImage(): void {
    if(this.student.profileImageUrl)
    {
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }
}
