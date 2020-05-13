import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationModel } from 'src/app/configuration/configuration.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExecutionStatus } from 'src/app/core/api/execution-status.model';
import { ApiResponse } from 'src/app/core/api/api-response.model';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private configurationApi = () => `${this.getServerUrl()}/app-configuration`;
  private executionStatus = () => `${this.getServerUrl()}/app-management/execution-status`;
  private startApi = () => `${this.getServerUrl()}/app-management/start-scheduler`;
  private stopApi = () => `${this.getServerUrl()}/app-management/stop-scheduler`;

  constructor(private http: HttpClient) {}

  public postConfiguration(configs: ConfigurationModel): Observable<any> {
    return this.http.post(this.configurationApi(), configs);
  }

  public getConfiguration(): Observable<ConfigurationModel> {
    return this.http.get<ConfigurationModel>(this.configurationApi());
  }

  public getExecutionStatus(): Observable<ApiResponse<ExecutionStatus>> {
    return this.http.get<ApiResponse<ExecutionStatus>>(this.executionStatus());
  }

  public startEmailScheduling(): Observable<any> {
    return this.http.post(this.startApi(), {}).pipe(
      map((r) => true),
      catchError((e) => new BehaviorSubject(false))
    );
  }

  public stopEmailScheduling(): Observable<any> {
    return this.http.post(this.stopApi(), {}).pipe(
      map((r) => true),
      catchError((e) => new BehaviorSubject(false))
    );
  }

  private getServerUrl(): string {
    return environment.apiUrl;
  }
}
