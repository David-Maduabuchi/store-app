import { Component } from '@angular/core';
import { LoginRegisterInterface } from '../../models/Auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: "./register.component.css"
})
export class RegisterComponent {
  constructor(private authService: AuthService) {
    
  }
  form: LoginRegisterInterface = {
    email: '',
    password: '',
    username: '',
    confirm_password: '',
  } 

  passwordValidationCheck = () => {
    if(this.form.password === this.form.confirm_password) {
      return true;
    } else {
      return false;
    }
  }
  submit() {
    if(this.form.password === this.form.confirm_password) {
          this.authService.register(this.form)
    }
  }
  
  isLoadingFn = () => {
    return this.authService.isLoading;
  }

  errTxt = () => {
    return this.authService.errorMessageRegister;
  }
  redirect = (): void => {
    this.authService.redirectToLogin();
  }
}
