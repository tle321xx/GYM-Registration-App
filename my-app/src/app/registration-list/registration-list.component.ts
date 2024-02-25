import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrl: './registration-list.component.scss',
})
export class RegistrationListComponent implements OnInit {
  public dataSource!: MatTableDataSource<User>;
  public users!: User[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquiryDate',
    'action',
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private confirm: NgConfirmService,
    private toastService: NgToastService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.api.getRegisterUser().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id: number) {
    // inject router: Router before code below this
    this.router.navigate(['update', id]);
  }

  delete(id: number) {
    this.confirm.showConfirm(
      'Are you sure to delete?',
      () => {
        this.api.deleteRegisterUser(id).subscribe((res) => {
          this.toastService.success({
            detail: 'Success',
            summary: 'Enquiry Added',
            duration: 3000,
          });
          this.getUsers();
        });
      },
      () => {}
    );
  }
}
