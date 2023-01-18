import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DataExpense,
  Expense,
  ExpenseResp,
} from '../interfaces/expense.interface';
import { tokenHeader } from '../utils/getConfig';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private http: HttpClient) {}

  /**
   * It returns an observable of an array of ExpenseResp objects
   * @returns An observable of an array of ExpenseResp objects.
   */
  getAllExpenses(offset: number): Observable<ExpenseResp> {
    const params = new HttpParams().set('limit', 5).set('offset', offset);

    return this.http.get<ExpenseResp>(`${base_url}/expenses`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  /**
   * It returns an observable of an array of ExpenseResp objects
   * @returns An observable of an array of ExpenseResp objects.
   */
  getAllExpensesByType(
    term: string,
    offset: number,
    limit: number = 5
  ): Observable<ExpenseResp> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ExpenseResp>(`${base_url}/expenses/type/${term}`, {
      headers: tokenHeader.headers,
      params,
    });
  }

  /**
   * This function takes an id as a parameter and returns an observable of type ExpenseResp
   * @param {string} id - The id of the expense you want to get.
   * @returns Observable<ExpenseResp>
   */
  getExpensesById(id: string): Observable<DataExpense> {
    return this.http.get<DataExpense>(`${base_url}/expenses/${id}`, {
      headers: tokenHeader.headers,
    });
  }

  /**
   * It takes an expense object, and returns an observable of type ExpenseResp
   * @param {Expense} expense - Expense - this is the expense object that we are sending to the
   * backend.
   * @returns Observable<ExpenseResp>
   */
  createExpense(expense: Expense): Observable<DataExpense> {
    return this.http.post<DataExpense>(`${base_url}/expenses`, expense, {
      headers: tokenHeader.headers,
    });
  }

  /**
   * This function takes an expense object and an id string as arguments and returns an observable of
   * type ExpenseResp
   * @param {Expense} expense - Expense - this is the expense object that we want to update.
   * @param {string} id - The id of the expense you want to update.
   * @returns Observable<ExpenseResp>
   */
  updateExpense(expense: Expense, id: string): Observable<DataExpense> {
    return this.http.patch<DataExpense>(`${base_url}/expenses/${id}`, expense, {
      headers: tokenHeader.headers,
    });
  }

  /**
   * It takes an id as a parameter, and then it makes a delete request to the backend, passing the id
   * as a parameter
   * @param {string} id - The id of the expense to be deleted.
   * @returns Observable<any>
   */
  deleteExpense(id: string): Observable<any> {
    return this.http.delete<any>(`${base_url}/expenses/${id}`, {
      headers: tokenHeader.headers,
    });
  }

  createExpensePerLot(lotId: string, expenseId: string) {
    return this.http.post(
      `${base_url}/expenses-per-lots`,
      {
        lotId,
        expenseId,
      },
      {
        headers: tokenHeader.headers,
      }
    );
  }

  deleteExpensePerLot(lotId: string) {
    return this.http.delete(`${base_url}/expenses-per-lots/${lotId}`, {
      headers: tokenHeader.headers,
    });
  }
}
