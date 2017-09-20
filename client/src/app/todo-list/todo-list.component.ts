import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { NgIf, NgFor } from '@angular/common'

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  notification = { error: '' };
  test: "hallo";

  constructor(public todoService: TodoService) { }
  
    ngOnInit() {
      this.notification.error = '';
      this.loadTodos();
    }
  
    loadTodos() {
      this.todoService.getTodos().subscribe(
        todos => { this.todos = todos; },
        error => { this.notification.error = error; }
      );
    }

}
