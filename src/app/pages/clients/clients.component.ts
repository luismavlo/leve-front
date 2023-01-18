import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { Client, DataClient } from '../../interfaces/client.interface';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  public formSubmitted = false;
  public showAlertSuccess = false;
  public showAlertError = false;
  public messageAlert = '';
  public clients: DataClient[] = [];
  public term: string = '';
  public page!: number;
  public currentPage: number = 0;
  public currentPageSearch: number = 0;
  public showPagination: boolean = true;

  public clientsForm = this.fb.group({
    id: '',
    name: ['', Validators.required],
    surname: ['', Validators.required],
    dni: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
  });

  constructor(private clientService: ClientService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  /**
   * The function getAllClients() is used to get all the clients from the database
   */
  getAllClients() {
    this.showPagination = true;
    this.currentPageSearch = 0;
    this.clientService.getClients(this.currentPage).subscribe({
      next: (resp) => {
        console.log(resp);
        this.page = resp.page;
        this.clients = resp.dataClients;
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * The function searchClient() is used to search for a client by a term
   */
  searchClient() {
    this.showPagination = false;
    this.currentPage = 0;
    this.clientService
      .getAllClientByTerm(this.term, this.currentPageSearch)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.page = resp.page;
          this.clients = resp.dataClients;
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The back() function is used to go back to the previous page of the pagination
   * @returns The current page is being returned.
   */
  back() {
    if (this.currentPage <= 0) return;
    this.currentPage = this.currentPage - 5;
    this.getAllClients();
  }

  /**
   * The function checks if the current page is greater than or equal to the page multiplied by 2. If
   * it is, it returns. If it isn't, it adds 5 to the current page and calls the getAllClients()
   * function
   * @returns The current page number.
   */
  next() {
    console.log(this.currentPage);
    if (this.currentPage >= this.page * 2) return;
    this.currentPage = this.currentPage + 5;
    this.getAllClients();
  }

  /**
   * The function backSearch() is used to go back to the previous page of the search results
   * @returns The currentPageSearch is being returned.
   */
  backSearch() {
    if (this.currentPageSearch <= 0) return;
    this.currentPageSearch = this.currentPageSearch - 5;
    this.searchClient();
  }

  /**
   * If the current page is greater than or equal to the page times 2, return. Otherwise, add 5 to the
   * current page and call the searchClient function
   * @returns The current page number is being returned.
   */
  nextSearch() {
    console.log(this.currentPageSearch);
    if (this.currentPageSearch >= this.page * 2) return;
    this.currentPageSearch = this.currentPageSearch + 5;
    this.searchClient();
  }

  /**
   * If the form is valid, then either create a new client or update an existing one
   * @returns the value of the form.
   */
  submit() {
    this.formSubmitted = true;

    if (this.clientsForm.invalid) {
      this.alertVerifyForm('El formulario no es correcto');
      return;
    }

    if (this.clientsForm.value.id?.length === 0) {
      delete this.clientsForm.value.id;
      this.createClient();
    } else {
      const id = this.clientsForm.value.id;
      delete this.clientsForm.value.id;
      this.updateClient(id as string);
    }

    this.deselectClient();
  }

  /**
   * The function creates a client using the client service, and if the request is successful, it calls
   * the getAllClients() function to update the list of clients, and it calls the alertSuccessForm()
   * function to show a success message
   */
  createClient() {
    this.clientService
      .createClient(this.clientsForm.value as Client)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.getAllClients();
          this.alertSuccessForm('Cliente creado con exito!');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The function receives a clientSelected object of type DataClient, and then sets the value of the
   * form to the values of the clientSelected object
   * @param {DataClient} clientSelected - DataClient
   */
  selectClient(clientSelected: DataClient) {
    this.clientsForm.setValue({
      id: clientSelected.id,
      name: clientSelected.name,
      surname: clientSelected.surname,
      dni: clientSelected.dni,
      phone: clientSelected.phone,
      email: clientSelected.email,
      address: clientSelected.address,
      city: clientSelected.city,
    });
  }

  /**
   * It sets the form to its initial state
   */
  deselectClient() {
    this.clientsForm.setValue({
      id: '',
      name: '',
      surname: '',
      dni: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    });
    this.formSubmitted = false;
  }

  /**
   * The function takes an id as a parameter, then it calls the updateClient function from the
   * clientService, passing the form value as a Client object and the id as a string
   * @param {string} id - string
   */
  updateClient(id: string) {
    this.clientService
      .updateClient(this.clientsForm.value as Client, id as string)
      .subscribe({
        next: (resp) => {
          this.getAllClients();
          this.alertSuccessForm('Cliente actualizado con exito!');
        },
        error: ({ error }) => {
          this.handlingError(error);
        },
      });
  }

  /**
   * The function deleteProduct() receives an id as a parameter, and then calls the deleteClient()
   * function from the clientService service, which in turn calls the deleteClient() function from the
   * client.service.ts file, which in turn calls the deleteClient() function from the
   * client.controller.ts file, which in turn calls the deleteClient() function from the
   * client.repository.ts file, which in turn calls the deleteClient() function from the
   * client.entity.ts file, which in turn calls the deleteClient() function from the client.entity.ts
   * file, which in turn calls the deleteClient() function from the client.entity.ts file, which in
   * turn calls the deleteClient() function from the client.entity.ts file, which in turn calls the
   * deleteClient() function from the client.entity.ts file, which in turn calls the deleteClient()
   * function from the client.entity.ts file, which in turn calls the deleteClient
   * @param {string} id - string
   */
  deleteProduct(id: string) {
    this.clientService.deleteClient(id).subscribe({
      next: (resp) => {
        this.getAllClients();
        this.alertSuccessForm('Cliente eliminado con extio!');
      },
      error: ({ error }) => {
        this.handlingError(error);
      },
    });
  }

  /**
   * If the field is invalid and the form has been submitted, return true. Otherwise, return false
   * @param {string} field - string - The name of the field you want to check.
   * @returns A boolean value.
   */
  invalidFields(field: string): boolean {
    if (this.clientsForm.get(field)?.invalid && this.formSubmitted) {
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
   * This function is used to show a success message to the user
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
