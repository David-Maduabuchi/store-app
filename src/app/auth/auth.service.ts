import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LoginRegisterInterface, ServerResponse } from "../models/Auth.model";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  private readonly JWT_STORAGE_KEY = "auth_Token";
  private readonly JWT_STORAGE_ID = "user_id";

  currentUserid: string|null = localStorage.getItem(this.JWT_STORAGE_ID);
  isAuthenticated: boolean = false;
  errorMessageLogin: string | undefined;
  errorMessageRegister: string | undefined;
  isLoading: boolean = false;

  // this is used to stoore the login token gotten from the server.
  setAuthToken = (token: string,): void => {
    localStorage.setItem(this.JWT_STORAGE_KEY, token);
  };

  // Used in the appcomponentTs to grant user access if the storage token exists
  getAuthToken = (): string | null => {
    return localStorage.getItem(this.JWT_STORAGE_KEY);
  };
  // Get locallyStoredUserId
  getUserId = ():number|null => {
    const user_id = localStorage.getItem(this.JWT_STORAGE_ID)
    return user_id ? parseInt(user_id, 10) : null;
  }
  
  // this clears the localStorage
  clearAuthToken = (): void => {
    localStorage.removeItem(this.JWT_STORAGE_KEY);
    localStorage.removeItem(this.JWT_STORAGE_ID)
  };

  register = (form: LoginRegisterInterface) => {
    this.isLoading = true;
    this.http
      .post<ServerResponse>("http://localhost:3000/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      })
      .pipe(
        catchError((error) => {
          // Handle the error here
          console.log("Error during registration:", error.error);
          this.errorMessageLogin = error.error;
          this.errorMessageRegister = error.error;
          this.isAuthenticated = false;
          this.isLoading = false;
          // You can return an observable to replace the error with a default value or other action
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.user.id) {
          localStorage.setItem(this.JWT_STORAGE_ID, res.user.id.toString());
          this.isAuthenticated = true;
          this.isLoading = false;
          this.setAuthToken(res.token)
          this.router.navigate([""]).then(() => {
            window.location.reload()
          });
        } else {
          this.isAuthenticated = false;
          this.isLoading = false;
        }
      });
  };

  logOut = () => {
    this.isAuthenticated = false;
    this.clearAuthToken();
    window.location.reload();
  };

  //Redirections Sections
  redirectToRegister = (): void => {
    this.router.navigate(["register"])
  }
  redirectToLogin  =(): void => {
    this.router.navigate(["login"])
  }

  login = (form: LoginRegisterInterface) => {
    this.isLoading = true;
    this.http
      .post<ServerResponse>("http://localhost:3000/signin", {
        email: form.email,
        password: form.password,
      })
      .pipe(
        catchError((error) => {
          // Handle the error here
          console.log("Error during login:", error.error);
          this.errorMessageLogin = error.error;
          this.errorMessageRegister;
          this.isAuthenticated = false;
          this.isLoading = false;
          // You can return an observable to replace the error with a default value or other action
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && res.user.id) {
          //this is the server response section Amy.
          localStorage.setItem(this.JWT_STORAGE_ID, res.user.id.toString());
          this.isAuthenticated = true;
          this.isLoading = false;
          this.setAuthToken(res.token);
          this.router.navigate([""]).then(() => {
            window.location.reload();
          })
        } else {
          this.isAuthenticated = false;
          this.isLoading = false;
        }
      });
     
  };
}
