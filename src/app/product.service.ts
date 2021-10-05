import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from './model/Product';
import { retry, catchError } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  //private _product_url = "http://localhost:8080/mongorest-api-0.0.1-SNAPSHOT/product";
  private _product_url = "http://localhost:9001/product";
 
 
  constructor(public _httpClient:HttpClient) { }
 
 
  getProducts() : Observable<Product []> 
  {
     return this._httpClient.get<Product []>(this._product_url)
  }
 
  deleteProduct(productId:number) 
  {
    let httpOptions =  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };

     return this._httpClient.delete(this._product_url+"/"+productId,httpOptions);  
  }
 
  saveProduct(product:Product)
  {
    let httpOptions =  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    return this._httpClient.post<Product>(this._product_url,product,httpOptions)
    .pipe(retry(5), catchError(this.handleError));
 
  }
  updateProduct(product:Product)
  {
    let httpOptions =  { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
 
    return this._httpClient.put<Product>(this._product_url,product,httpOptions)
  }
  getProduct(productId:number) 
  {
     return this._httpClient.get<Product>(this._product_url+"/"+productId)
  }
 
 
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
 
}