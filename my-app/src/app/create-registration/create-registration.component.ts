import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrl: './create-registration.component.scss',
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  public genders: string[] = ['Male', 'Female'];
  public importantLists: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public canSubmit :boolean = false

  // create reactive form
  public registerForm!: FormGroup;

  public userIdToUpdate!: number;

  public isUpdateActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private toastService: NgToastService
  ) {}

  // initialize the form
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      bmi: [''],
      bmiResult: [''],
      gender: ['', Validators.required],
      requireTrainer: ['', Validators.required],
      package: ['', Validators.required],
      important: ['', Validators.required],
      haveGymBefore: ['', Validators.required],
      enquiryDate: ['', Validators.required],
    });

    // เรามีการดัก error ให้ user กรอก weight before height
    // หลังจากที่ user กรอก height ไปแล้วให้ทำการเรียกใช้ function พร้อมส่ง para ที่กรอกมาไป
    this.registerForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });

    // โค้ดส่วนนี้เอาไว้ใช้ตอน user คลิกปุ่ม update
    // ตอนกดปุ่มนั้น function edit มันส่งไปแค่ให้เราไป path update พร้อมส่งเลขไอดีของคนที่กดส่งไป
    this.activatedRoute.params.subscribe((val) => {
      this.userIdToUpdate = val['id'];
      if (this.userIdToUpdate !== undefined) {
        this.api.getRegisterUserId(this.userIdToUpdate).subscribe({
          next:(res) => {
            this.isUpdateActive = true;
            this.fillFormToUpdate(res as User);
          },
          error:(error) => {
            console.error(error);
          }
        });
      }
    });
  }

  submit() {
    // console.log(this.registerForm.value);
    // inject api before type below
    this.api.postRegistration(this.registerForm.value).subscribe((res) => {
      this.toastService.success({
        detail: 'Success',
        summary: 'Enquiry Added',
        duration: 3000,
      });
      this.registerForm.reset();
    });
  }

  // สร้างหลังเราสามาถ set existing value in the form
  update() {
    // นำช้อมูลที่แก้ไขส่งไปที่ api 
    this.api
      .updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toastService.success({
          detail: 'Success',
          summary: 'Enquiry Updated',
          duration: 3000,
        });
        this.registerForm.reset();
        // inject router before code below this
        this.router.navigate(['list'])
      });
  }

  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue('Underweight');
        break;
      case bmi >= 18.5 && bmi <= 25:
        this.registerForm.controls['bmiResult'].patchValue('Normal');
        break;
      case bmi >= 25 && bmi <= 30:
        this.registerForm.controls['bmiResult'].patchValue('Overweight');
        break;
      default:
        this.registerForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate,
    });
  }
}
