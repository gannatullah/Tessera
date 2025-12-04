import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerForm: FormGroup=new FormGroup({
     
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      }

  );
  
    login(){
      console.log(this.registerForm);
      if(this.registerForm.invalid){
        this.registerForm.markAllAsTouched();
      }
      else{
        this.registerForm.reset();
      }
    }
}
