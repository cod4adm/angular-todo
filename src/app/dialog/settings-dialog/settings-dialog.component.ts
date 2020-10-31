import { Component, OnInit } from '@angular/core';
import {Priority} from '../../model/Prioryty';
import {MatDialogRef} from '@angular/material/dialog';
import {DataHandlerService} from '../../services/data-handler.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  priorities: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dataHandlerService: DataHandlerService
  ) { }

  ngOnInit(): void {
    this.dataHandlerService.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  onClose() {
  this.dialogRef.close(false);
  }

  onAddPriority(priority: Priority) {
    this.dataHandlerService.addPriority(priority).subscribe();
  }

  onDeletePriority(priority: Priority) {
    this.dataHandlerService.deletePriority(priority.id).subscribe();
  }

  onUpdatePriority(priority: Priority) {
    this.dataHandlerService.updatePriority(priority).subscribe();
  }
}
