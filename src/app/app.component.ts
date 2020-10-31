import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {DataHandlerService} from './services/data-handler.service';
import {Category} from './model/Category';
import {Priority} from './model/Prioryty';
import {zip} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categoryMap = new Map<Category, number>();
  title = 'Todo App';
  tasks: Task[];
  categories: Category[];

  priorities: Priority[];
  totalTasksCountInCategory: number;
  completedCountInCategory: number;
  uncompletedCountInCategory: number;
  uncompletedTotalTasksCount: number;

  showStat = true;

  selectedCategory: Category = null;
  searchTaskText = '';
  searchCategoryText = '';
  statusFilter: boolean;
  priorityFilter: Priority;
  constructor(
    private dataHandlerService: DataHandlerService
  ) {
  }

  ngOnInit() {
    this.dataHandlerService.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandlerService.getAllPriorities().subscribe(priorities => this.priorities = priorities);
    this.fillCategories();
    this.onSelectCategory(null);
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.updateTasksAndStat();
  }

  onDeleteCategory(category: Category) {
    this.dataHandlerService.deleteCategory(category.id).subscribe(cat => {
      this.selectedCategory = null;
      this.categoryMap.delete(cat);
      this.onSearchCategory(this.searchCategoryText);
      this.updateTasks();
    });
  }

  onUpdateCategory(category: Category) {
    this.dataHandlerService.updateCategory(category).subscribe(() => {
      this.onSearchCategory(this.searchCategoryText);
    });
  }

  onUpdateTask(task: Task) {
    this.dataHandlerService.updateTask(task).subscribe(() => {
      this.fillCategories();
      this.updateTasksAndStat();
    });
  }

  onDeleteTask(task: Task) {
    this.dataHandlerService.deleteTask(task.id).pipe(
      concatMap(t => {
        return this.dataHandlerService.getUncompletedCountInCategory(t.category).pipe(map(count => {
          return ({t: task, count});
        }));
      })
    ).subscribe(result => {
      const t = result.t as Task;
      if (t.category) {
        this.categoryMap.set(t.category, result.count);
      }
      this.updateTasksAndStat();
    });
  }

  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasks();
  }

  updateTasks() {
    this.dataHandlerService.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onAddTask(task: Task) {
    this.dataHandlerService.addTask(task).pipe(
      concatMap(t => {
        return this.dataHandlerService.getUncompletedCountInCategory(t.category).pipe(map(count => {
          return ({t, count});
        }));
      })
    ).subscribe(result => {
      const t = result.t as Task;
      if (t.category) {
        this.categoryMap.set(t.category, result.count);
      }
      this.updateTasksAndStat();
    });
  }

  onAddCategory(title: string) {
    this.dataHandlerService.addCategory(title).subscribe(() => this.fillCategories());
    this.fillCategories();
  }

  fillCategories() {
    if (this.categoryMap) {
      this.categoryMap.clear();
    }
    this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));
    this.categories.forEach(cat => {
      this.dataHandlerService.getUncompletedCountInCategory(cat).subscribe(count => this.categoryMap.set(cat, count));
    });
  }

  onSearchCategory(title: string) {
    this.searchCategoryText = title;
    this.dataHandlerService.searchCategories(title).subscribe(categories => {
      this.categories = categories;
      this.fillCategories();
    });
  }

  updateTasksAndStat() {
    this.updateTasks();
    this.updateStat();
  }

  updateStat() {
    zip(
      this.dataHandlerService.getTotalCountInCategory(this.selectedCategory),
      this.dataHandlerService.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandlerService.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandlerService.getUncompletedTotalCount())
      .subscribe(array => {
        this.totalTasksCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3];
      });
  }

  toggleStat(showStat: boolean) {
    this.showStat = showStat;
  }
}
