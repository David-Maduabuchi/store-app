import { Component, OnInit } from "@angular/core";
import { Cart } from "./models/cart.model";
import { CartService } from "./services/cart.service";
import { AuthService } from "./auth/auth.service";
// Thr router outlet enables the router to perform its duty.
@Component({
  selector: "app-root",
  template: ` 
  <app-header [cart]="cart"></app-header>
  <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  cart: Cart = { items: []}
  constructor(private cartService: CartService, private authService: AuthService) {
    
  }
  ngOnInit(): void {
    const authToken = this.authService.getAuthToken();
    if(authToken) {
      this.authService.isAuthenticated = true;
    }
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart
    })
  }
}
