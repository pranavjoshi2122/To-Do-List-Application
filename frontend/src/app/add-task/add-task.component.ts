import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpProviderService } from '../Service/http-provider.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpService : HttpProviderService,
    private toasterService : ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  onSubmit() {
    this.taskForm.markAllAsTouched()
    if (this.taskForm.valid) {
      let payload = this.taskForm.value
      payload.completed = false
      this.httpService.createTask((payload)).subscribe((res)=>{
        this.toasterService.success('Task Added Successfully!', 'Success');
        this.taskForm.reset()
        this.router.navigate(['/home']);
      },error =>{
        this.toasterService.error('Error while creating task',"Error")
      })
    } else {
      this.toasterService.error('Invalid Form!', 'Error');
    }
  }
}
