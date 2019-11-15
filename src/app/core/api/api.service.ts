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
  private configurationApi = () => `${this.getServerUrl()}/configuration`;
  private startApi = () => `${this.getServerUrl()}/start-agent`;
  private stopApi = () => `${this.getServerUrl()}/stop-agent`;

  constructor(private http: HttpClient) {}

  public postConfiguration(configs: ConfigurationModel): Observable<any> {
    return this.http.post(this.configurationApi(), configs);
  }

  public getConfiguration(): Observable<ConfigurationModel> {
    return this.http.get<ConfigurationModel>(this.configurationApi());
  }

  public startEmailScheduling(): Observable<any> {
    return this.http.get(this.startApi()).pipe(
      map(r => true),
      catchError(e => new BehaviorSubject(false))
    );
  }

  public stopEmailScheduling(): Observable<any> {
    return this.http.get(this.stopApi()).pipe(
      map(r => true),
      catchError(e => new BehaviorSubject(false))
    );
  }

  private getServerUrl(): string {
    return environment.apiUrl;
  }
}
