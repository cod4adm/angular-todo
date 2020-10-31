import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Task} from 'src/app/model/Task';
import {DataHandlerService} from '../../services/data-handler.service';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Prioryty';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {OperType} from '../OperType';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {
  categories: Category[];
  priorities: Priority[];
  dialogTitle: string;
  task: Task;
  tmpTitle: string;
  tpmCategory: Category;
  tmpPriority: Priority;
  tmpDate: Date;
  operType: OperType;

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string],
    private dataHandlerService: DataHandlerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    // @ts-ignore
    this.operType = this.data[2];

    this.tmpTitle = this.task.title;
    this.tpmCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;

    this.dataHandlerService.getAllCategories().subscribe(items => this.categories = items);
    this.dataHandlerService.getAllPriorities().subscribe(items => this.priorities = items);
  }

  onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.category = this.tpmCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;
    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите дествие',
        message: `Вы действительно хотите удалить задачу ${this.task.title}?`
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }

  complete(): void {
    this.dialogRef.close('complete');
  }

  activate(): void {
    this.dialogRef.close('activate');
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  canActivateDisactivate(): boolean {
    return this.operType === OperType.EDIT;
  }
}
