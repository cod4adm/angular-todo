import {TaskDAO} from '../interfaces/TaskDAO';
import {Category} from '../../../model/Category';
import {Priority} from '../../../model/Prioryty';
import {Observable, of} from 'rxjs';
import { Task } from 'src/app/model/Task';
import {TestData} from '../../TestData';

export class TaskDAOArray implements TaskDAO{
  add(task: Task): Observable<Task> {
    if (task.id == null || task.id === 0) {
      task.id = this.getLastIdTask();
    }
    TestData.tasks.push(task);
    return of(task);
  }

  getLastIdTask(): number {
    return Math.max.apply(Math, TestData.tasks.map(task => task.id)) + 1;
  }

  delete(id: number): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id === id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1);
    return of(taskTmp);
  }

  get(id: number): Observable<Task> {
    return of(TestData.tasks.find(task => task.id === id));
  }

  getAll(): Observable<Task[]> {
    return of(TestData.tasks);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, true, null).length);
  }

  getTotalCount(): Observable<number> {
    return of(TestData.tasks.length);
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, null, null).length);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, false, null).length);
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTasks(category, searchText, status, priority));
  }

  private searchTasks(category: Category, searchText: string, status: boolean, priority: Priority): Task[] {
    let allTasks = TestData.tasks;
    if (status != null) {
      allTasks = allTasks.filter(task => task.completed === status);
    }
    if (category != null) {
      allTasks = allTasks.filter(task => task.category === category);
    }
    if (priority != null) {
      allTasks = allTasks.filter(task => task.priority === priority);
    }
    if (searchText != null) {
      allTasks = allTasks.filter(task => task.title.toLowerCase().includes(searchText.toLowerCase()));
    }
    return allTasks;
  }

  update(task: Task): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id === task.id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);
    return of(task);
  }
}
