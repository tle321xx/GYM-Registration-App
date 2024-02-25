import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  public userId!: number;
  public userDetails!: User;

  constructor(private activatedRoute : ActivatedRoute, private api : ApiService){}

  ngOnInit(): void {
      this.activatedRoute.params.subscribe(val => {
        this.userId = val['id'];
        this.fetchUserDetails(this.userId)
      })
  }

  fetchUserDetails(userId: number){
    this.api.getRegisterUserId(userId)
    .subscribe({
      next: (res ) => {
        this.userDetails = res as User;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
