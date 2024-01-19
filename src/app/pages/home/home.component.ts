import { Component, OnDestroy, OnInit } from "@angular/core";
import { Product } from "../../models/product.model";
import { CartService } from "../../services/cart.service";
import { Subscription } from "rxjs";
import { StoreService } from "../../services/store.service";

const ROWS_HEIGHT: {
  [id: number]: number;
} = {
  1: 400,
  2: 355,
  4: 350,
};

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css"
})
export class HomeComponent implements OnInit, OnDestroy{
  cols: number = 3;
  rowHeight = ROWS_HEIGHT[this.cols]
  category: string | undefined;
  products: Array<Product> | undefined;
  sort='desc';
  count='20';
  productsSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private storeService: StoreService) {
    
  }
  
  onItemsCountChange = (newCount: number):void => {
    this.count = newCount.toString()
    this.getProducts()
  }
  onSortChange = (newSort: string): void => {
    this.sort =  newSort;
    console.log(newSort)
    this.getProducts()
  }
  //this function holds the number of columns. -this freeecodecamp guy is smart.
  onColumnsCountChange = (colsNum: number) => {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols]
  };
  onShowCategory = (newCategory: string): void => {
    this.category = newCategory;
    this.getProducts();
  };

  onAddToCart = (product: Product): void => {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    })
  }
  ngOnInit(): void {
    this.getProducts()
  }
  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
  getProducts(): void {
   this.productsSubscription =  this.storeService.getAllProducts(this.count, this.sort, this.category)
    .subscribe((_products) => {
      this.products = _products;
        })
  }
}
