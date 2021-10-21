import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../models/ui-models/student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students : Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email', 'mobile', 'gender'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    // Fetch Students
    this.studentService.getStudent()
    .subscribe(
      (successResponse) => {
        this.students = successResponse;
        this.dataSource = new MatTableDataSource<Student>(this.students);
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

}
