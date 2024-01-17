import { outputAst } from "@angular/compiler";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { StoreService } from "../../../../services/store.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categoriesSubscription: Subscription | undefined;
  //so this holds the filtered compionents on our website
  categories: Array<string> | undefined;

  

  // Now,, we want to trap the catrgory we select.
  onShowCategory = (category: string): void => {
    this.showCategory.emit(category);
  };
  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getAllCategories()
    .subscribe((response) => {
      this.categories =  response;
    })
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
