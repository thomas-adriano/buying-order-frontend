import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {
  private enableSaveSubject = new BehaviorSubject(false);
  private saveClickSubject = new Subject<void>();

  constructor() {}

  public enableSave(): void {
    this.enableSaveSubject.next(true);
  }

  public disableSave(): void {
    this.enableSaveSubject.next(false);
  }

  public saveEnabledChange(): Observable<boolean> {
    return this.enableSaveSubject.asObservable();
  }

  public saveClick(): Observable<void> {
    return this.saveClickSubject.asObservable();
  }

  public clickSave(): void {
    return this.saveClickSubject.next();
  }
}
