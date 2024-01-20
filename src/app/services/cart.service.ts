import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of } from "rxjs";
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
  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  addToCart = (item: CartItem): void => {
    console.log("CART SERVICE ITEM: ", item);
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    const user_id = this.authService.getUserId();

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      items.push(item);
    }
    this.cart.next({ items });
    this._snackBar.open("1 item added to cart", "ok", { duration: 300 });

    if (user_id) {
      this.http
        .post("https://zaraki-store-api.onrender.com/store-api/cart/add", {
          item,
          user_id,
        })
        .subscribe((response) => {
          console.log('SERVER RESPONSE: ', response) 
          this.getCartItems(user_id).subscribe((_cart) => {
            this.cart.next(_cart);
          });
          this.cart.next({ items });
          this._snackBar.open("1 item added to cart, ", "ok", {
            duration: 400,
          });
        });
    } else {
      this._snackBar.open("Please Login First", "Ok", { duration: 5000 });
    }

    // End of Trial
  };

  onAddQuantity = (item: CartItem) => {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    const user_id = this.authService.getUserId();

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      items.push(item);
    }
    this.cart.next({ items });
    this._snackBar.open("1 item added to cart", "ok", { duration: 300 });

    if (user_id) {
      this.http
        .post("http://localhost:3000/store-api/cart/add-quantity", {
          item,
          user_id,
        })
        .subscribe(() => {
          this._snackBar.open("1 item added to cart, ", "ok", {
            duration: 400,
          });
        });
    } else {
      this._snackBar.open("Please Login First", "Ok", { duration: 5000 });
    }
  }

  getCartItems(userId: number | null): Observable<Cart> {
    // Assuming you have a method like this in your service
    return this.http
      .get<CartItem[]>(`https://zaraki-store-api.onrender.com/store-api/cart/${userId}`)
      .pipe(
        map((cartItems: CartItem[]) => {
          return { items: cartItems };
        }),
        catchError((error) => {
          console.error("Error fetching cart items:", error);
          return of({ items: [] }); // Return an empty cart in case of an error
        })
      );
  }

  removeQuantity = (item: CartItem): void => {
    const user_id = this.authService.getUserId(); //gets the current users id from the localstorage
    let id = item.id; //this is the id of the product

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

    //Server-side Code
    if (user_id) {
      this.http
        .post("https://zaraki-store-api.onrender.com/store-api/cart/remove", {
          id,
          user_id,
        })
        .subscribe(() => {
          console.log("one item removed")
        })
    }
  };

  getTotal = (items: Array<CartItem>): number => {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  };

  clearCart = (): void => {
    const user_id = this.authService.getUserId();
    this.cart.next({ items: [] });
    
    if (user_id) {
      this.http
        .post("https://zaraki-store-api.onrender.com/store-api/cart/delete-all", {
          user_id,
        }) .subscribe(() => {
          console.log('cart cleared')
        })
      }
    this._snackBar.open("Cart is Cleared", "Ok", { duration: 3000 });
  };

  onremoveFromCart(item: CartItem, update = true): Array<CartItem> {
    const user_id = this.authService.getUserId();
    const id = item.id;

    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open("One Item removed from Cart", "ok", {
        duration: 3000,
      });
    }
    if (user_id) {
      this.http
        .post("https://zaraki-store-api.onrender.com/store-api/cart/delete", {
          id,
          user_id,
        }) .subscribe(() => {
          console.log('single item removed from cart')
        })
    }
    return filteredItems;
  }
}
