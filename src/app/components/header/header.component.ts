import { Component, Input } from "@angular/core";
import { Cart, CartItem } from "../../models/cart.model";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  constructor(private cartService: CartService, private authService: AuthService) {}
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  isAuthenticated =  () => {
    return this.authService.isAuthenticated;
  }

  logOutFn = () => {
    return this.authService.logOut();
  }

  @Input()
  get cart(): Cart {
    return this._cart;
  }
  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  getTotal = (items: Array<CartItem>): number => {
    return this.cartService.getTotal(items);
  };

  onClearCart() {
    return this.cartService.clearCart();
  }
}
