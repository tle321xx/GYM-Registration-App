import { Component } from '@angular/core';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrl: './create-registration.component.scss'
})
export class CreateRegistrationComponent {

  public packages: string[] = ["Monthly","Quarterly","Yearly"]
  public genders: string[] = ['Male','Female']
  public importantLists: string[] = [
    "Toxic Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"
  ]



}
