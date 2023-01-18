import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataExpense, ExpenseResp } from 'src/app/interfaces/expense.interface';
import { DataLot, Lot, LotResp } from 'src/app/interfaces/lot.interface';
import { ExpensesService } from 'src/app/services/expenses.service';
import { LotService } from 'src/app/services/lot.service';
import { generateRandomString } from 'src/app/utils/getCode';

@Component({
  selector: 'app-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.css'],
})
export class LotsComponent implements OnInit {
  public formSubmitted: boolean = false;
  public showAlertSuccess: boolean = false;
  public showAlertError: boolean = false;
  public messageAlert: string = '';
  public lots: DataLot[] = [];
  public expenses: DataExpense[] = [];
  public lot!: DataLot;

  public term: string = '';
  public term2: string = '';

  public page!: number;
  public currentPage: number = 0;
  public currentPageSearch: number = 0;
  public showPagination: boolean = true;
  public type!: string;

  public lotForm = this.fb.group({
    id: '',
    code: ['', [Validators.required]],
    quantityLiters: [0, [Validators.required, Validators.min(0)]],
    discount: [0, Validators.required],
    discountReason: [''],
    typeLot: ['', [Validators.required]],
    costLiter: [0, [Validators.required, Validators.min(0)]],
    reusedBottles: [0, Validators.required],
    lotTotalCost: [0, [Validators.required, Validators.min(0)]],
  });

  public expenseLotForm = this.fb.group({
    expense: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private lotService: LotService,
    private expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    this.getAllLots();
  }

  /**
   * The function getAllLots() calls the getLots() function from the lotService.ts file, which returns
   * an observable. The observable is then subscribed to, and the next function is called, which sets
   * the lots variable to the response from the getLots() function
   */
  getAllLots() {
    this.currentPageSearch = 0;
    this.showPagination = true;
    this.lotService.getLots(this.currentPage).subscribe({
      next: (resp) => {
        this.page = resp.page;
        this.lots = resp.dataLots;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function getAllExpenses() is called when the user selects a lot from the dropdown menu. The
   * function then calls the getAllExpensesOperational() function from the expensesService.ts file. The
   * getAllExpensesOperational() function returns an observable of type ExpenseResp[]. The
   * getAllExpenses() function subscribes to the observable and assigns the value to the expenses
   * variable
   * @param {LotResp} lotSelected - LotResp
   */
  getAllExpenses(lotSelected: DataLot) {
    this.expensesService
      .getAllExpensesByType('operativos', 0, 1000000)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.getLot(lotSelected.id);
          this.expenses = resp.dataExpense;
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });

    this.selectLot(lotSelected);
  }

  /**
   * It gets all lots by term
   * @param {string} type - string - The type of search to be performed.
   * @returns the lots that match the search term.
   */
  getAllLotsByTerm(type: string) {
    this.currentPage = 0;
    this.showPagination = false;
    if (type === 'code') {
      this.lotService
        .getLotsByTerm(type, this.term, this.currentPageSearch)
        .subscribe({
          next: (resp) => {
            this.type = 'code';
            this.page = resp.page;
            this.lots = resp.dataLots;
          },
          error: ({ error }) => {
            this.handlingError(error);
          },
        });
    }

    if (type === 'typeLot') {
      if (this.term2.length === 0) return;

      if (this.term2 === 'todos') {
        return this.getAllLots();
      }

      this.lotService
        .getLotsByTerm(type, this.term2, this.currentPageSearch)
        .subscribe({
          next: (resp) => {
            this.type = 'typeLot';
            this.page = resp.page;
            this.lots = resp.dataLots;
          },
          error: ({ error }) => {
            this.handlingError(error);
          },
        });
    }
  }

  /**
   * The function back() is called when the user clicks the back button. It checks if the current page
   * is less than or equal to 0, and if it is, it returns. If it isn't, it subtracts 5 from the current
   * page and calls the getAllLots() function
   * @returns The current page number is being returned.
   */
  back() {
    if (this.currentPage <= 0) return;
    this.currentPage = this.currentPage - 5;
    this.getAllLots();
  }

  /**
   * The function checks if the current page is greater than or equal to the page multiplied by 2. If
   * it is, it returns. If it isn't, it adds 5 to the current page and calls the getAllLots() function
   * @returns The current page number.
   */
  next() {
    console.log(this.currentPage);
    if (this.currentPage >= this.page * 2) return;
    this.currentPage = this.currentPage + 5;
    this.getAllLots();
  }

  /**
   * This function is called when the user clicks the back button on the search page. It checks to see
   * if the current page is less than or equal to 0, and if it is, it returns. If it isn't, it
   * subtracts 5 from the current page and calls the getAllLotsByTerm function
   * @returns The current page number is being returned.
   */
  backSearch() {
    if (this.currentPageSearch <= 0) return;
    this.currentPageSearch = this.currentPageSearch - 5;
    this.getAllLotsByTerm(this.type);
  }

  /**
   * The function is called when the user clicks the next button on the search page. It checks if the
   * current page is greater than or equal to the total number of pages. If it is, it returns. If it
   * isn't, it increments the current page by 5 and calls the getAllLotsByTerm function
   * @returns the current page number.
   */
  nextSearch() {
    console.log(this.currentPageSearch);
    if (this.currentPageSearch >= this.page * 2) return;
    this.currentPageSearch = this.currentPageSearch + 5;
    this.getAllLotsByTerm(this.type);
  }

  /**
   * If the form is valid, then either create a new lot or update an existing one
   * @returns the value of the form.
   */
  submit() {
    this.formSubmitted = true;

    if (this.lotForm.invalid) {
      this.alertVerifyForm('El formulario no es correcto');
      return;
    }

    if (this.lotForm.value.id?.length === 0) {
      delete this.lotForm.value.id;
      this.createLot();
    } else {
      const id = this.lotForm.value.id;
      delete this.lotForm.value.id;
      this.updateLot(id as string);
    }

    this.deselectLot();
  }

  /**
   * The function takes a lotSelected object as a parameter and sets the form values to the values of
   * the lotSelected object
   * @param {LotResp} lotSelected - LotResp
   */
  selectLot(lotSelected: DataLot) {
    this.lotForm.setValue({
      id: lotSelected.id,
      code: lotSelected.code,
      quantityLiters: lotSelected.quantityLiters,
      discount: lotSelected.discount,
      discountReason: lotSelected.discountReason,
      typeLot: lotSelected.typeLot,
      costLiter: lotSelected.costLiter,
      reusedBottles: lotSelected.reusedBottles,
      lotTotalCost: lotSelected.lotTotalCost,
    });
  }

  /**
   * The function deselectLot() is used to reset the form to its default values
   */
  deselectLot() {
    this.lotForm.setValue({
      id: '',
      code: '',
      quantityLiters: 0,
      discount: 0,
      discountReason: '',
      typeLot: '',
      costLiter: 0,
      reusedBottles: 0,
      lotTotalCost: 0,
    });

    this.formSubmitted = false;
  }

  /**
   * The function createLot() is a function that creates a lot, it receives the lotForm.value as Lot,
   * and then it subscribes to the next and error functions
   */
  createLot() {
    this.lotService.createLot(this.lotForm.value as Lot).subscribe({
      next: (resp) => {
        console.log(resp);
        this.getAllLots();
        this.alertSuccessForm('Lote creado con exito!');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function updateLot() is a method of the class LotComponent. It takes an id of type string as a
   * parameter. It calls the method updateLot() of the service LotService, passing the value of the
   * form lotForm and the id as parameters. It subscribes to the observable returned by the service,
   * and if the observable returns a response, it calls the method getAllLots() of the class
   * LotComponent, and calls the method alertSuccessForm() of the class LotComponent, passing the
   * string 'Lote actualizado correctamente' as a parameter. If the observable returns an error, it
   * calls the method handlingError() of the class LotComponent, passing the error as a parameter
   * @param {string} id - string
   */
  updateLot(id: string) {
    this.lotService
      .updateLot(this.lotForm.value as Lot, id as string)
      .subscribe({
        next: (resp) => {
          this.getAllLots();
          this.alertSuccessForm('Lote actualizado correctamente');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The function deleteLot() is a method of the class LotComponent. It takes an id of type string as a
   * parameter. It calls the deleteLot() method of the lotService service, which takes an id of type
   * string as a parameter. The deleteLot() method of the lotService service returns an Observable of
   * type Lot. The deleteLot() method of the LotComponent class subscribes to the Observable returned
   * by the deleteLot() method of the lotService service. If the Observable returns a value, the next()
   * function is called, which calls the getAllLots() method of the LotComponent class, which calls the
   * getAllLots() method of the lotService service, which returns an Observable of type Lot[]. The
   * getAllLots() method of the LotComponent class subscribes to the Observable returned by the
   * getAllLots() method of the lotService service. If the Observable returns a value, the next()
   * function is called, which assigns
   * @param {string} id - string
   */
  deleteLot(id: string) {
    this.lotService.deleteLot(id).subscribe({
      next: (resp) => {
        this.getAllLots();
        this.alertSuccessForm('Lote eliminado correctamente');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * It takes the id of the lot and the expense from the form and sends it to the backend to create a
   * new expense for the lot
   */
  addExpensePerLot() {
    this.expensesService
      .createExpensePerLot(
        this.lotForm.value.id as string,
        this.expenseLotForm.value.expense as string
      )
      .subscribe({
        next: (resp) => {
          this.getLot(this.lotForm.value.id as string);
        },
        error: ({ error }) => {
          console.log(error);
          this.handlingError(error);
        },
      });
  }

  /**
   * The function gets a lot by id and subscribes to the observable returned by the service
   * @param {string} id - string - the id of the lot to be retrieved
   */
  getLot(id: string) {
    this.lotService.getLot(id).subscribe({
      next: (resp) => {
        this.lot = resp;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function deleteExpensePerLot() is a function that deletes an expense per lot
   * @param {string} id - string
   */
  deleteExpensePerLot(id: string) {
    this.expensesService.deleteExpensePerLot(id).subscribe({
      next: (resp) => {
        this.alertSuccessForm('Gasto del lote eliminado con exito!');
        this.getLot(this.lotForm.value.id as string);
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * If the field is invalid and the form has been submitted, return true. Otherwise, return false
   * @param {string} field - The name of the field you want to check.
   * @returns A boolean value.
   */
  invalidFields(field: string): boolean {
    if (this.lotForm.get(field)?.invalid && this.formSubmitted) {
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
