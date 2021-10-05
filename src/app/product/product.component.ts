import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../model/Product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] | undefined;
  processValidation = false;
  product = new Product();
  productIdToUpdate = -1;

  productForm = new FormGroup({
    productId: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    quantityOnHand: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  })


  constructor(public productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getProducts().subscribe(res => this.products = res);
  }

  //user defined validators
  hasSpecialChar(input: FormControl) {
    const hasSpecial =
      input.value.indexOf('P') >= 0;
    return hasSpecial ? null : { needSpecial: true };
  }

  onProductFormSubmit() {
    if (this.productForm.invalid) {
      this.processValidation = true
      console.log("Invalid form")
      return;
    }
    else {
      console.log(this.productForm.value);
      this.product = this.makeProduct();

      //save product
      if(this.productIdToUpdate== -1 )
      {
        this.productService.saveProduct(this.product).subscribe({
          next: n => this.refreshProduct()
        });
        this.resetForm();
      }
            //update product
      else
      {
        this.productService.updateProduct(this.product).subscribe({
          next: n => this.refreshProduct()
        });
        this.productIdToUpdate = -1
        this.resetForm();
      }

    }
  }

  resetForm(){
    this.productForm.reset();
  }

  makeProduct() {
    console.log(this.productForm.value)
    let pId: number = this.productForm.get('productId')!.value;
    let pName: string = this.productForm.get('productName')!.value.trim();
    let qoh: number = this.productForm.get('quantityOnHand')!.value
    let pr: number = this.productForm.get('price')!.value

    let product: Product = {
      productId: pId,
      productName: pName,
      quantityOnHand: qoh,
      price: pr
    }
    return product;
  }

  refreshProduct() {
    this.productService.getProducts().subscribe(res => this.products = res);
  }

  deleteProduct(productId: number) {
    console.log(productId + " to delete in product component")
    this.productService.deleteProduct(productId).subscribe({
      next: n => this.refreshProduct()
    });
  }

  editProduct(productId: number) {
    console.log(productId + " to edit in product component")
    this.productIdToUpdate = productId

    this.productService.getProduct(productId).subscribe(product => {
      this.productForm.setValue({
        productId: product.productId,
        productName: product.productName,
        quantityOnHand: product.quantityOnHand,
        price: product.price
      })
    });
  }
}
