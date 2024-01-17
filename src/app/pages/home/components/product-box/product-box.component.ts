import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html'

})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  // This input receives the input product from the 
 @Input() product: Product | undefined;
@Output() addToCart = new EventEmitter();
  

  onAddToCart ():void {
    this.addToCart.emit(this.product);
    console.log(this.product);
  }
}