import { Component } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent{
  todo: Todo = { title: '', text: ''}
  notification = { error: ''};
  todoId = '';

  constructor(private todoService: TodoService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.todoId = params['todoId'];
        this.loadTodo();
      }
    );
  }

  loadTodo() {
    this.notification.error = '';
    this.todoService.getTodo(this.todoId).subscribe(
      answer => { 
        this.todo = answer;
      },
      error => { this.notification.error = error; }
    );
  }

  addTodo() {
    this.notification.error = ''; 
    this.todoService.addTodo(this.todo).subscribe(
      data => { },
      error => { this.notification.error = error; }
    );
  }
}
