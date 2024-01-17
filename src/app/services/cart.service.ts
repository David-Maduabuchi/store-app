import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
 
  // The new Behavior Subject automatically pushes new objects into the items array.
  cart = new BehaviorSubject<Cart>({ items: [] });
  constructor(private _snackBar: MatSnackBar, private http: HttpClient, private authService: AuthService) {}

  addToCart = (item: CartItem): void => {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);

    // if (itemInCart) {
    //   itemInCart.quantity++;
    // } else {
    //   items.push(item);
    // }
    // this.cart.next({ items });
    // this._snackBar.open("1 item added to cart", "ok", { duration: 300 });

    // Trial

    // This nests the imported user id.
    const user_id = this.authService.getUserId();
    this.http.post('http://localhost:3000/store-api/add', {
      item, 
     user_id
    }).subscribe(
      (response) => {
        console.log("1 ITEM SENT TO SERVER ", response);
        this.cart.next({items});
        this._snackBar.open("1 item added to cart, ", 'ok', {duration: 400});
      }
    )
    // End of Trial
  };


  //Reduce Quamtity button, It relates with the removefromCart Function
  removeQuantity = (item: CartItem): void => {
    let itemForRemoval: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    if (itemForRemoval) {
      filteredItems = this.onremoveFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open("1 item removed from the Cart", "Ok", {
      duration: 3000,
    });
  };

  getTotal = (items: Array<CartItem>): number => {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  };

  clearCart = (): void => {
    this.cart.next({ items: [] });
    this._snackBar.open("Cart is Cleared", "Ok", { duration: 3000 });
  };

  onremoveFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open("One Item removed from Cart", "ok", {
        duration: 3000,
      });
    }

    return filteredItems;
  }
}
