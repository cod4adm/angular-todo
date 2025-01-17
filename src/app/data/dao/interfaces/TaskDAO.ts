import {CommonDAO} from './CommonDAO';
import {Task} from '../../../model/Task';
import {Category} from '../../../model/Category';
import {Priority} from '../../../model/Prioryty';
import {Observable} from 'rxjs';

export interface TaskDAO extends CommonDAO<Task> {
  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]>;
  getCompletedCountInCategory(category: Category): Observable<number>;
  getUncompletedCountInCategory(category: Category): Observable<number>;
  getTotalCountInCategory(category: Category): Observable<number>;
  getTotalCount(): Observable<number>;
}
