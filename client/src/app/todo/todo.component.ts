import { Component } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent{
  todo: Todo = { title: '', text: ''}
  notification = { error: ''};

  constructor(private router: Router, private todoService: TodoService) { }

  addTodo() {
    this.notification.error = ''; 
    this.todoService.addTodo(this.todo).subscribe(
      data => { this.router.navigateByUrl('/logout'); },
      error => { this.notification.error = error; }
    );
  }
}
