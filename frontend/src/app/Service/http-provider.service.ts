import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {
  private apiUrl = "http://163.53.177.63:8016/api/";

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any> {
    return this.http.get(this.apiUrl + "tasks");
  }

  deleteTaskById(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + `tasks/${id}/delete`, {});
  }

  getTaskDetailById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + `tasks/show/${id}`);
  }

  createTask(taskData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers };
    const body = JSON.stringify(taskData);
    return this.http.post(this.apiUrl + 'tasks/create', body, options);
  }

  updateTask(id: number, taskData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers };
    const body = JSON.stringify(taskData);
    return this.http.post(this.apiUrl + `tasks/${id}/edit`, body, options);
  }

  completedTask(id: number): Observable<any> {
    return this.http.get(this.apiUrl + `tasks/${id}/completed`);
  }
}
