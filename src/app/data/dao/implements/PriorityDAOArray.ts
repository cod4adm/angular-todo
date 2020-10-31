import {PriorityDAO} from '../interfaces/PriorityDAO';
import {Priority} from '../../../model/Prioryty';
import {Observable, of} from 'rxjs';
import {TestData} from '../../TestData';

export class PriorityDAOArray implements PriorityDAO{
  get(id: number): Observable<Priority> {
    return of(TestData.priorities.find(priority => priority.id === id));
  }

  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  add(priority: Priority): Observable<Priority> {
    if (priority.id === null || priority.id === 0) {
      priority.id = this.getLastIdPriority();
    }
    TestData.priorities.push(priority);
    return of(priority);
  }

  delete(id: number): Observable<Priority> {
    TestData.tasks.forEach(task => {
      if (task.priority && task.priority.id === id) {
        task.priority = null;
      }
    });
    const tmpPriority = TestData.priorities.find(t => t.id === id);
    TestData.priorities.splice(TestData.priorities.indexOf(tmpPriority),1);
    return of(tmpPriority);
  }

  update(priority: Priority): Observable<Priority> {
    const tmp = TestData.priorities.find(t => t.id === priority.id);
    TestData.priorities.splice(TestData.priorities.indexOf(tmp), 1, priority);
    return of(priority);
  }

  private getLastIdPriority(): number {
    return Math.max.apply(Math, TestData.priorities.map(c => c.id)) + 1;
  }
}
