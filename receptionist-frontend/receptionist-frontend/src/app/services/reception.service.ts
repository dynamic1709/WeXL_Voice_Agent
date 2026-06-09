import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

  private baseUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  getAllPatients() {
    return this.http.get(`${this.baseUrl}/patients`);
  }

  addPatient(data: any) {
    return this.http.post(`${this.baseUrl}/patients`, data);
  }
}
