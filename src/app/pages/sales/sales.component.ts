import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientResp, DataClient } from 'src/app/interfaces/client.interface';
import { DataLot, LotResp } from 'src/app/interfaces/lot.interface';
import { ProductDetail } from 'src/app/interfaces/product.interface';
import { DataSale, Sale } from 'src/app/interfaces/sales.interface';
import { ClientService } from 'src/app/services/client.service';
import { LotService } from 'src/app/services/lot.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  public formSubmitted: boolean = false;
  public showAlertSuccess: boolean = false;
  public showAlertError: boolean = false;
  public messageAlert: string = '';
  public lots: DataLot[] = [];
  public clients: DataClient[] = [];
  public products: ProductDetail[] = [];
  public sales: DataSale[] = [];

  public page!: number;
  public currentPage: number = 0;
  public currentPageSearch: number = 0;

  public showPagination: boolean = true;

  public type!: string;

  public term: string = '';
  public term2: string = '';

  public salesForm = this.fb.group({
    id: '',
    clientId: ['', Validators.required],
    productId: ['', Validators.required],
    lotId: ['', Validators.required],
    quantity: [0, Validators.required],
    totalPrice: [0, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private clientService: ClientService,
    private lotService: LotService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.getLots();
    this.getProducts();
    this.getSales();
  }

  /**
   * The function calls the getProducts() method of the productService, which returns an observable.
   * The observable is subscribed to, and the next and error functions are defined. The next function
   * sets the products property of the component to the response from the server. The error function
   * calls the handlingError() function, which is defined in the base class
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
   * The function getClients() is a function that calls the getClients() function from the
   * clientService.ts file. The getClients() function from the clientService.ts file returns an
   * observable. The getClients() function from the client.component.ts file subscribes to the
   * observable returned by the getClients() function from the clientService.ts file. The getClients()
   * function from the client.component.ts file then assigns the value returned by the getClients()
   * function from the clientService.ts file to the clients variable
   */
  getClients() {
    this.clientService.getClients(0, 100000000).subscribe({
      next: (resp) => {
        this.clients = resp.dataClients;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function calls the getSales() function from the saleService, which returns an observable. The
   * observable is subscribed to, and the next and error functions are defined. The next function sets
   * the sales variable to the response from the observable. The error function calls the
   * handlingError() function, which is defined in the base component class
   */
  getSales() {
    this.currentPageSearch = 0;
    this.saleService.getSales(this.currentPage).subscribe({
      next: (resp) => {
        this.showPagination = true;
        this.page = resp.page;
        this.sales = resp.dataSale;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function getLots() is a function that is called when the component is initialized. It calls the
   * getLots() function in the lotService.ts file, which makes a GET request to the API. The response is
   * then stored in the lots variable
   */
  getLots() {
    this.lotService.getLots(0, 10000000000).subscribe({
      next: (resp) => {
        this.lots = resp.dataLots;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * It gets the sales by term, and if the type is product, it gets the sales by term and the term2,
   * and if the type is client, it gets the sales by term and the term
   * @param {string} type - string - The type of search you want to do.
   */
  getSalesByTerm(type: string) {
    this.currentPage = 0;
    if (type === 'product') {
      this.type = 'product';
      if (this.term2.length === 0) return;
      if (this.term2 === 'todos') return this.getSales();
      this.saleService
        .getSaleByTerm(type, this.term2, this.currentPageSearch)
        .subscribe({
          next: (resp) => {
            this.showPagination = false;
            this.page = resp.page;
            this.sales = resp.dataSale;
          },
          error: ({ error }) => {
            this.handlingError(error);
          },
        });
    }

    if (type === 'client') {
      this.type = 'client';
      if (this.term.length === 0) return;
      this.saleService
        .getSaleByTerm(type, this.term, this.currentPageSearch)
        .subscribe({
          next: (resp) => {
            this.showPagination = false;
            this.page = resp.page;
            this.sales = resp.dataSale;
          },
          error: ({ error }) => {
            this.handlingError(error);
          },
        });
    }
  }

  /**
   * If the form is valid, then either create a new sale or update an existing one
   * @returns the value of the form.
   */
  submit() {
    this.formSubmitted = true;

    if (this.salesForm.invalid) {
      this.alertVerifyForm('El formulario no es correcto');
      return;
    }

    if (this.salesForm.value.id?.length === 0) {
      delete this.salesForm.value.id;
      this.createSale();
    } else {
      const id = this.salesForm.value.id;
      delete this.salesForm.value.id;
      this.updateSale(id as string);
    }

    this.deselectSale();
  }

  /**
   * The function creates a sale by calling the createSale() method of the saleService, which returns
   * an observable. The observable is subscribed to, and the next() and error() functions are called
   * depending on the response
   */
  createSale() {
    this.saleService.createSale(this.salesForm.value as Sale).subscribe({
      next: (resp) => {
        this.getSales();
        this.alertSuccessForm('La venta ha sido creada con exito!');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function updateSale() is a method of the class SalesComponent. It takes an id of type string
   * as a parameter. It calls the updateSale() method of the saleService object, passing the value of
   * the salesForm object and the id as parameters. It subscribes to the observable returned by the
   * updateSale() method of the saleService object. If the observable returns a value, the function
   * calls the getSales() method of the SalesComponent class and the alertSuccessForm() method of the
   * SalesComponent class, passing a string as a parameter. If the observable returns an error, the
   * function calls the handlingError() method of the SalesComponent class, passing the error as a
   * parameter
   * @param {string} id - string
   */
  updateSale(id: string) {
    this.saleService.updateSale(this.salesForm.value as Sale, id).subscribe({
      next: (resp) => {
        this.getSales();
        this.alertSuccessForm('La venta ha sido actualizada con exito');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function takes a SalesResp object as a parameter and sets the values of the form fields to the
   * values of the properties of the SalesResp object
   * @param {SalesResp} sale - SalesResp - this is the object that is passed to the function.
   */
  selectSale(sale: DataSale) {
    this.salesForm.setValue({
      id: sale.id,
      clientId: sale.client.id,
      productId: sale.product.id,
      lotId: sale.lot.id,
      quantity: sale.quantity,
      totalPrice: sale.totalPrice,
    });
  }

  /**
   * It sets the form's value to an empty object, and sets the formSubmitted variable to false
   */
  deselectSale() {
    this.salesForm.setValue({
      id: '',
      clientId: '',
      productId: '',
      lotId: '',
      quantity: 0,
      totalPrice: 0,
    });

    this.formSubmitted = false;
  }

  /**
   * The function deleteSale() is a function that deletes a sale from the database
   * @param {string} id - string
   */
  deleteSale(id: string) {
    this.saleService.deleteSale(id).subscribe({
      next: (resp) => {
        this.getSales();
        this.alertSuccessForm('La venta ha sido eliminada con exito!');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  calculatePrice() {
    const product = this.products.find(
      (product) => product.id === this.salesForm.value.productId
    );

    const totalPrice = product?.price! * this.salesForm.value.quantity!;

    this.salesForm.patchValue({
      totalPrice,
    });
  }

  /**
   * If the current page is less than or equal to 0, return. Otherwise, subtract 5 from the current
   * page and call the getSales() function
   * @returns The current page is being returned.
   */
  back() {
    if (this.currentPage <= 0) return;
    this.currentPage = this.currentPage - 5;
    this.getSales();
  }

  /**
   * If the current page is greater than or equal to the page times 2, return. Otherwise, add 5 to the
   * current page and call the getSales function
   * @returns The current page number.
   */
  next() {
    console.log(this.currentPage);
    if (this.currentPage >= this.page * 2) return;
    this.currentPage = this.currentPage + 5;
    this.getSales();
  }

  /**
   * This function is called when the user clicks the back button on the search page. It checks to see
   * if the current page is less than or equal to 0, and if it is, it returns. If it isn't, it
   * subtracts 5 from the current page and calls the getSalesByTerm function
   * @returns The current page number is being returned.
   */
  backSearch() {
    if (this.currentPageSearch <= 0) return;
    this.currentPageSearch = this.currentPageSearch - 5;
    this.getSalesByTerm(this.type);
  }

  /**
   * If the current page is greater than or equal to the page times 2, return. Otherwise, add 5 to the
   * current page and get the sales by term
   * @returns The current page number is being returned.
   */
  nextSearch() {
    console.log(this.currentPageSearch);
    if (this.currentPageSearch >= this.page * 2) return;
    this.currentPageSearch = this.currentPageSearch + 5;
    this.getSalesByTerm(this.type);
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
   * @param {string} msg - string - The message you want to display in the alert.
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
