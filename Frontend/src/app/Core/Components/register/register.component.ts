import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { count } from 'console';
import { first } from 'rxjs';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup=new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl(),
    mobileNumber: new FormControl(),
    dateOfBirth: new FormControl(),
    country: new FormControl(),
    city: new FormControl(),
    nationality: new FormControl()

  });

  register(){
    console.log(this.registerForm);
  }


}
