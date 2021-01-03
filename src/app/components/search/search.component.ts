import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  inputUser = '';

  @Output() userResearch: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  searchValue() {
    this.userResearch.emit(this.inputUser);
  }
}
