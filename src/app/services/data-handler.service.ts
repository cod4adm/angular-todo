import { Injectable } from '@angular/core';
import {Task} from '../model/Task';
import {Observable} from 'rxjs';
import {TaskDAOArray} from '../data/dao/implements/TaskDAOArray';
import {Category} from '../model/Category';
import {CategoryDAOArray} from '../data/dao/implements/CategoryDAOArray';
import {Priority} from '../model/Prioryty';
import {PriorityDAOArray} from '../data/dao/implements/PriorityDAOArray';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  private taskDaoArray = new TaskDAOArray();
  private categoriesDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor() {
  }

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  searchTasks(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.taskDaoArray.delete(id);
  }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoriesDaoArray.getAll();
  }

  deleteCategory(id: number): Observable<Category> {
    return this.categoriesDaoArray.delete(id);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoriesDaoArray.update(category);
  }

  addCategory(title: string): Observable<Category> {
    return this.categoriesDaoArray.add(new Category(null, title));
  }

  searchCategories(title: string): Observable<Category[]> {
    return this.categoriesDaoArray.search(title);
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getTotalCountInCategory(category);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getCompletedCountInCategory(category);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(category);
  }

  getUncompletedTotalCount(): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(null);
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.priorityDaoArray.getAll();
  }

  addPriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.add(priority);
  }

  deletePriority(id: number): Observable<Priority> {
    return this.priorityDaoArray.delete(id);
  }

  updatePriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.update(priority);
  }
}
