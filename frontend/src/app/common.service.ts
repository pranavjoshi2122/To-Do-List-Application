import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiUrl = "http://localhost:8000/api/";

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any> {
    return this.http.get(this.apiUrl + "tasks");
  }

  deleteTaskById(id: number): Observable<any> {
    return this.http.post(this.apiUrl + `tasks/${id}/delete`, {});
  }

  getTaskDetailById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + `tasks/show/${id}`);
  }

  createTask(taskData: any): Observable<any> {
    return this.http.post(this.apiUrl + "tasks/create", taskData);
  }

  completedTask(id: number): Observable<any> {
    return this.http.get(this.apiUrl + `tasks/${id}/completed`);
  }
}
