import {Component, input, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Category} from "../../service/model/category.model";

@Component({
  selector: 'app-liste-category',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './liste-category.component.html',
  styleUrl: './liste-category.component.scss'
})
export class ListeCategoryComponent implements OnInit {
  cat = input.required<Category>();
  ngOnInit(): void{

  }
}
