import { Component } from '@angular/core';
import { HttpProviderService } from '../Service/http-provider.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent {
  taskId: any;
  task: any = {}; // Object to hold task details

  constructor(private httpService: HttpProviderService,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) {
    this.taskId = this.route.snapshot.params['taskId'];
  }

  ngOnInit(): void {
    this.httpService.getTaskDetailById(this.taskId).subscribe((response: any) => {
      if (response.success && response.data.length > 0) {
        this.task = response.data[0];
        this.formatDueDate()
      } else {
        this.toasterService.error('Task not found', 'Error');
      }
    });
  }

  formatDueDate() {
    this.task.dueDate = this.formatDate(this.task.due_date.date)
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Convert date to yyyy-mm-dd format
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
