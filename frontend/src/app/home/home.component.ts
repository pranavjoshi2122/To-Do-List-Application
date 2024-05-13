import { Component, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../Service/http-provider.service';

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})

export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  closeResult = '';
  tasksList: any = [];
  @ViewChild('DeleteModal') deleteModal: any;
  modalRef: NgbModalRef | undefined;
  deleteTaskId: any = '';
  constructor(
    private router: Router,
    private httpProvider: HttpProviderService,
    private modalService: NgbModal,
    private toasterService: ToastrService
  ) {
  }

  ngOnInit() {
    this.getAllTasks();
  }
  async getAllTasks() {
    this.httpProvider.getAllTasks().subscribe((data: any) => {
      if (data != null && data.data != null) {
        var resultData = data.data;
        if (resultData) {
          this.tasksList = resultData[0];
          this.sortTaskByStatus()
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.tasksList = [];
            }
          }
        }
      });
  }

  AddTask() {
    this.router.navigate(['add']);
  }

  openModal(id: any) {
    this.deleteTaskId = id
    this.modalRef = this.modalService.open(this.deleteModal);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  deleteTask() {
    this.closeModal()
    this.httpProvider.deleteTaskById(this.deleteTaskId).subscribe((res) => {
      this.toasterService.success('Task Deleted Successfully!', 'Success')
      this.getAllTasks()
    })
  }

  onSwitchChange(id: any) {
    this.httpProvider.completedTask(id).subscribe((res) => {
      this.toasterService.success('Task Status Change !', 'Success')
      this.getAllTasks()
    }, error => {
      this.toasterService.error('Error while changing status .')
    })
  }

  sortTaskByStatus() {
    this.tasksList.sort((a: any, b: any) => {
      if (a.completed === b.completed) {
        return 0;
      } else if (a.completed && !b.completed) {
        return 1;
      } else {
        return -1;
      }
    })
  }
}