import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpProviderService } from '../Service/http-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  taskId: any;
  taskForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService
  ) {
    this.taskId = this.route.snapshot.params['taskId'];
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
    });

    this.httpService.getTaskDetailById(this.taskId).subscribe((response: any) => {
      if (response.success && response.data.length > 0) {
        const task = response.data[0];
        this.patchTaskForm(task);
      } else {
        this.toasterService.error('Task not found', 'Error');
      }
    });
  }

  onSubmit() {
    this.taskForm.markAllAsTouched()
    if (this.taskForm.valid) {
      const payload = this.taskForm.value;
      this.httpService.updateTask(this.taskId, payload).subscribe((res) => {
        this.toasterService.success('Task updated successfully!', 'Success');
        this.router.navigate(['/home']);
      }, error => {
        this.toasterService.error('Error while updating task', 'Error');
      });
    } else {
      this.toasterService.error('Invalid form!', 'Error');
    }
  }

  patchTaskForm(task: any): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: this.formatDate(task.due_date.date) // Format the due date
    });
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