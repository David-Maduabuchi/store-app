import { Component, OnInit } from "@angular/core";
import { Cart, CartItem } from "../../models/cart.model";
import { CartService } from "../../services/cart.service";
import { HttpClient } from "@angular/common/http";
import { loadStripe } from "@stripe/stripe-js";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService, private http: HttpClient) {}
  cart: Cart = {
    items: [
      {
        product: "https://via.placeholder.com/150",
        name: "MacBook2.0",
        price: 1500,
        quantity: 2,
        id: 1,
      },
      {
        product: "https://via.placeholder.com/150",
        name: "Laptop",
        price: 350,
        quantity: 13,
        id: 1,
      },
    ],
  };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  getTotal = (items: Array<CartItem>): number => {
    return this.cartService.getTotal(items);
  };
  
  onClearCart(): void {
    this.cartService.clearCart();
  }
  
  // Increase quantity plus sign
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onRemoveFromCart = (item: CartItem): void => {
    this.cartService.onremoveFromCart(item);
    console.log("One Item Removed ");
  };
  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }


  onCheckOut(): void {
    this.http.post('http://localhost:3000/checkout', {
      items: this.cart.items
    })
    .subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51OY4oHFpIbLv69oWFtkDLXKDxK0ivqNy9n2i7LXLcyEyimfRE2q2J6R8qc4r32WF3JDlnR90ZZVbLeYu5hENCoBx0026eGSS3V');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}