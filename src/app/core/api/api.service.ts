import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationModel } from 'src/app/configuration/configuration.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private configurationApi = (host: string) => `${host}/configuration`;
  private statusApi = (host: string) => `${host}/status`;

  constructor(private http: HttpClient) {}

  public postConfiguration(configs: ConfigurationModel): Observable<any> {
    return this.http.post(
      this.configurationApi(environment.serverUrl),
      configs
    );
  }

  public getStatus(): Observable<boolean> {
    return this.http.get(this.statusApi(environment.serverUrl)).pipe(
      map(r => true),
      catchError(e => new BehaviorSubject(false))
    );
  }
}
