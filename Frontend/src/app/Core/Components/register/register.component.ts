import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
//control names must match the json keys in backend
  registerForm: FormGroup=new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
    mobileNumber: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    nationality: new FormControl(null, [Validators.required])
  },{validators:this.validateConfirmPassword}
);

  register(){
    console.log(this.registerForm);
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }
    else{
      this.registerForm.reset();
    }
  }

  validateConfirmPassword(form:AbstractControl){
    const password=form.get('password')?.value;
    const confirmPassword=form.get('confirmPassword')?.value;
    if(password==confirmPassword){
      return null;
  }
  else{
    return {passwordMismatch:true};
  }
}


}
