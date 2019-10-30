import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationModel } from 'src/app/configuration/configuration.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private configurationApi = (host: string) => `${host}/configuration`;

  constructor(private http: HttpClient) {}

  public postConfiguration(configs: ConfigurationModel): Observable<any> {
    return this.http.post(
      this.configurationApi(environment.serverUrl),
      configs
    );
  }
}
