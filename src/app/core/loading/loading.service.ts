import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject$ = new BehaviorSubject(false);

  constructor() {}

  public setLoading(loading: boolean): void {
    this.isLoadingSubject$.next(loading);
  }

  public loadingChange(): Observable<boolean> {
    return this.isLoadingSubject$.asObservable();
  }
}
