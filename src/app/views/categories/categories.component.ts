import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../services/data-handler.service';
import {Category} from '../../model/Category';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OperType} from '../../dialog/OperType';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @Input()
  categories: Category[];
  @Output()
  selectCategory = new EventEmitter<Category>();
  @Output()
  deleteCategory = new EventEmitter<Category>();
  @Output()
  updateCategory = new EventEmitter<Category>();
  @Output()
  addCategory = new EventEmitter<string>();
  @Output()
  searchCategory = new EventEmitter<string>();
  @Input()
  selectedCategory: Category;
  @Input('categoryMap')
  set setCategoryMap(categoryMap: Map<Category, number>) {
    this.selectedCategoryMap = categoryMap;
  }
  @Input()
  uncompletedTotal: number;

  indexMouseMove: number;
  searchCategoryTitle: string;
  selectedCategoryMap: Map<Category, number>;

  constructor(
    private dataHandlerService: DataHandlerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.selectedCategoryMap);
  }

  showTasksByCategory(category: Category) {
   if (this.selectedCategory === category) {
     return;
   }
   this.selectedCategory = category;
   this.selectCategory.emit(this.selectedCategory);
  }

  showEditIcon(index: number): void {
    this.indexMouseMove = index;
  }

  openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteCategory.emit(category);
        return;
      }
      if (typeof (result) === 'string') {
        category.title = result as string;
        this.updateCategory.emit(category);
        return;
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(
      EditCategoryDialogComponent, {data: ['', 'Добавление категории', OperType.ADD], width: '400px'}
      );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string);
      }
    });
  }

  search() {
    if (this.searchCategoryTitle == null) {
      return;
    }
    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
