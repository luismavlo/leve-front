import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Product, ProductDetail } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  public formSubmitted = false;
  public showAlertSuccess = false;
  public showAlertError = false;
  public messageAlert = '';
  public products: ProductDetail[] = [];

  public productForm = this.fb.group({
    id: '',
    title: ['', [Validators.required]],
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required]],
  });

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  /**
   * The function calls the getProducts() method of the productService, which returns an observable.
   * The observable is subscribed to, and the next() function is called when the observable returns a
   * value. The error() function is called when the observable returns an error
   */
  getProducts() {
    this.productService.getProducts().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * If the form is valid, then either create a new product or update an existing one
   * @returns the value of the productForm.value.id property.
   */
  submitForm() {
    this.formSubmitted = true;

    if (this.productForm.invalid) {
      this.alertVerifyForm('El formulario no es correcto');
      return;
    }

    if (this.productForm.value.id?.length === 0) {
      delete this.productForm.value.id;
      this.createProduct();
    } else {
      const id = this.productForm.value.id;
      delete this.productForm.value.id;
      this.updateProduct(id as string);
    }

    this.deselectProduct();
  }

  /**
   * The function creates a product using the product service, and if the product is created
   * successfully, it calls the getProducts() function to update the list of products, and it calls the
   * alertSuccessForm() function to display a success message
   */
  createProduct() {
    this.productService
      .createProduct(this.productForm.value as Product)
      .subscribe({
        next: (resp) => {
          this.getProducts();
          this.alertSuccessForm('Producto creado con exito!');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The function takes a ProductDetail object as a parameter, and then sets the values of the form
   * controls to the values of the properties of the ProductDetail object
   * @param {ProductDetail} productSelected - ProductDetail
   */
  selectProduct(productSelected: ProductDetail) {
    this.productForm.setValue({
      id: productSelected.id,
      code: productSelected.code,
      title: productSelected.title,
      description: productSelected.description,
      price: productSelected.price,
    });
  }

  /**
   * We're calling the updateProduct function from the productService, passing the productForm value as
   * a Product object and the id as a string
   * @param {string} id - string
   */
  updateProduct(id: string) {
    this.productService
      .updateProduct(this.productForm.value as Product, id as string)
      .subscribe({
        next: (resp) => {
          this.getProducts();
          this.alertSuccessForm('Producto actualizado con exito');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The function deleteProduct() is a method of the class ProductComponent. It takes an id of type
   * string as a parameter. It calls the deleteProduct() method of the ProductService class, which
   * takes an id of type string as a parameter. The deleteProduct() method of the ProductService class
   * returns an Observable of type any. The deleteProduct() method of the ProductComponent class
   * subscribes to the Observable returned by the deleteProduct() method of the ProductService class.
   * The subscribe() method takes an object as a parameter. The object has two properties: next and
   * error. The next property is a function that takes a parameter of type any. The error property is a
   * function that takes a parameter of type any. The next function calls the getProducts() method of
   * the ProductComponent class. The getProducts() method of the ProductComponent class calls the
   * getProducts() method of the ProductService class. The getProducts() method of the ProductService
   * class returns an Observable of
   * @param {string} id - string
   */
  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: (resp) => {
        this.getProducts();
        this.alertSuccessForm('Producto eliminado con exito');
      },
      error: (error) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * It sets the form to its default values
   */
  deselectProduct() {
    this.productForm.setValue({
      id: '',
      code: '',
      title: '',
      description: '',
      price: 0,
    });

    this.formSubmitted = false;
  }

  /**
   * If the field is invalid and the form has been submitted, return true. Otherwise, return false
   * @param {string} field - The name of the field to check.
   * @returns A boolean value.
   */
  invalidFields(field: string): boolean {
    if (this.productForm.get(field)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This function is used to display an error message to the user when the form is not filled out
   * correctly
   * @param {string} msg - string - The message to be displayed in the alert.
   */
  alertVerifyForm(msg: string) {
    this.showAlertError = true;
    this.messageAlert = msg;
    setTimeout(() => {
      this.showAlertError = false;
    }, 3500);
  }

  /**
   * This function is used to show a success message to the user when a form is submitted successfully
   * @param {string} msg - string - The message you want to display
   */
  alertSuccessForm(msg: string) {
    this.showAlertSuccess = true;
    this.messageAlert = msg;
    setTimeout(() => {
      this.showAlertSuccess = false;
    }, 3500);
  }

  /**
   * It takes an error object as a parameter, logs the error to the console, sets the messageAlert
   * property to the error message, and sets the showAlertError property to true
   * @param {any} error - any - The error object that is returned from the server.
   */
  handlingError(error: any) {
    console.log(error);
    let msgError = '';
    this.showAlertError = true;
    if (typeof error.message == 'string') {
      msgError = error.message;
    } else {
      error.message.forEach((msg: string) => {
        msgError += ` ${msg} and`;
      });
    }
    this.messageAlert = msgError;
    setTimeout(() => {
      this.showAlertError = false;
    }, 3500);
  }
}
