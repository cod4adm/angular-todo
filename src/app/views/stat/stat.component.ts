import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {
  @Input()
  totalTasksInCategory: number;
  @Input()
  completeTasksInCategory: number;
  @Input()
  uncompleteTasksInCategory: number;
  @Input()
  showStat: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
