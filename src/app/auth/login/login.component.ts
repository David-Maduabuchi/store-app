import { Component } from "@angular/core";
import { AuthService } from "../auth.service";
import { LoginRegisterInterface } from "../../models/Auth.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css"
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  form: LoginRegisterInterface = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  onSubmitLogin = (): void => {
    if (this.form.email && this.form.password) {
      this.authService.login(this.form);
    }
  };
  //change button text when fetching
  isLoadingFn = () => {
    return this.authService.isLoading;
  };
  errTxt = () => {
    return this.authService.errorMessageLogin;
  };
  redirect = (): void => {
    this.authService.redirectToRegister();
  }
}
