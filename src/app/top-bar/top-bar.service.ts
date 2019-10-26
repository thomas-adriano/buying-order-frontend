import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {
  private showSaveSubject = new BehaviorSubject(false);
  private saveClickSubject = new Subject<void>();

  constructor() {}

  public showSave(): void {
    this.showSaveSubject.next(true);
  }

  public hideSave(): void {
    this.showSaveSubject.next(false);
  }

  public saveVisibilityChange(): Observable<boolean> {
    return this.showSaveSubject.asObservable();
  }

  public saveClick(): Observable<void> {
    return this.saveClickSubject.asObservable();
  }

  public clickSave(): void {
    return this.saveClickSubject.next();
  }
}
