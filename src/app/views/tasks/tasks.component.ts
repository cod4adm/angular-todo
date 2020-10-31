import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../model/Task';
import {DataHandlerService} from '../../services/data-handler.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Prioryty';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  private dataSource: MatTableDataSource<Task>;

  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;

  @Output()
  updateTask = new EventEmitter<Task>();
  @Output()
  deleteTask = new EventEmitter<Task>();
  @Output()
  selectCategory = new EventEmitter<Category>();
  @Output()
  filterByTitle = new EventEmitter<string>();
  @Output()
  filterByStatus = new EventEmitter<boolean>();
  @Output()
  filterByPriority = new EventEmitter<Priority>();
  @Output()
  addTask = new EventEmitter<Task>();

  searchTaskText: string;
  selectedStatusFilter: boolean = null;
  selectedPriorityFilter: Priority = null;
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  priorities: Priority[];
  tasks: Task[];


  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }
  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }
  @Input()
  selectedCategory: Category;

  constructor(
    private dataHandlerService: DataHandlerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.onSelectCategory(null);
  }

  private getPriorityColor(task: Task): string {
    if (task.completed) {
      return '#f8f8fa';
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff';
  }

  private fillTable() {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;
    this.addTableObjects();

    // @ts-ignore
    this.dataSource.sortingDataAccessor = (task, colName) => {
      switch (colName) {
        case 'priority':
          return task.priority ? task.priority.id : null;
        case 'category':
          return task.category ? task.category.title : null;
        case 'date':
          return task.date ? task.date : null;
        case 'title':
          return task.title;
      }
    };
  }

  private addTableObjects() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openEditTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Редактирование задачи', OperType.EDIT],
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'activate') {
        task.completed = false;
        this.updateTask.emit(task);
        return;
      }
      if (result === 'complete') {
        task.completed = true;
        this.updateTask.emit(task);
        return;
      }
      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }
      if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: ${task.title}?`
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }

  onToggleStatus(task: Task): void {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  onSelectCategory(category: Category): void {
    this.selectCategory.emit(category);
  }

  onFilterByTitle() {
    this.filterByTitle.emit(this.searchTaskText);
  }

  onFilterByStatus(value: boolean) {
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  onFilterByPriority(value: Priority) {
    if (value !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = value;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

  openAddTaskDialog() {
    const task = new Task(null, '', false, null, this.selectedCategory);
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Добавление задачи', OperType.ADD]});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }
}
