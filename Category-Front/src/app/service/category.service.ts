
import { Injectable, inject, WritableSignal, signal, computed } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Category } from './model/category.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categories';

  private add$: WritableSignal<State<Category, HttpErrorResponse>> =
    signal(State.Builder<Category, HttpErrorResponse>().forInit().build());
  addCat = computed(() => this.add$());

  private getAll$: WritableSignal<State<Category[], HttpErrorResponse>> =
    signal(State.Builder<Category[], HttpErrorResponse>().forInit().build());
  getAllCat = computed(() => this.getAll$());

  add(category: Category): void {
    const formData = new FormData();
    formData.append('name', category.name!);
    formData.append('parentCategory', category.parentCategory ? JSON.stringify(category.parentCategory) : '');

    this.http.post<Category>(`${this.apiUrl}/create`, formData).subscribe({
      next: savedCategory => this.add$.set(State.Builder<Category, HttpErrorResponse>().forSuccess(savedCategory).build()),
      error: err => this.add$.set(State.Builder<Category, HttpErrorResponse>().forError(err).build()),
    });
  }


  reset(): void {
    this.add$.set(State.Builder<Category, HttpErrorResponse>().forInit().build());
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/AllCategorie`).pipe(
      tap((categories) => {
        this.getAll$.set(State.Builder<Category[], HttpErrorResponse>().forSuccess(categories).build());
      })
    );
  }


  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCategory(url: string): Observable<Category> {
    return this.http.put<Category>(url, {});
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getCategoriesWithFilters(params: {
    name?: string;
    isRoot?: boolean;
    createdAfter?: string;
    createdBefore?: string;
    startDate?: string;
    endDate?: string;
    childCategoryCount?: number;
    sortBy?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    // Ajout de la sérialisation des paramètres pour éviter tout problème de typage
    const httpParams = new HttpParams({ fromObject: params as any });

    // Appel API avec les paramètres
    return this.http.get(`${this.apiUrl}/rechBIen`, { params: httpParams });
  }


}
