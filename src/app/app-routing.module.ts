import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { CartComponent } from "./pages/cart/cart.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    loadChildren: () =>
    import("./lazy-loading/lazy-loading.module").then(
      (m) => m.LazyLoadingModule
    ),
  },
  {
    path: "cart",
    component: CartComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "register",
    component: RegisterComponent,
  },

  // The path below sets the home compoomemt to the default path
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
