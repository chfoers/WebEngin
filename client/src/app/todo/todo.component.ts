import { Component } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent{
  todo: Todo = { title: '', text: '', id: '', owner: ''}
  notification = { error: ''};
  newElement = true;

  constructor(private todoService: TodoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.todo.id = params['todoId'];
        this.loadTodo();
      }
    );
  }

  loadTodo() {
    this.notification.error = '';
    if(this.todo.id != 'newTodo'){
      this.newElement = false;
      this.todoService.getTodo(this.todo.id).subscribe(
        answer => { 
          this.todo.text = answer.text;
          this.todo.title = answer.title;
        },
        error => { this.notification.error = error; }
      );
    }
    else {
      this.newElement = true;
    }
  }

  removeTodo() {
    this.notification.error = '';
    this.todoService.removeTodo(this.todo.id).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => { this.notification.error = error; }
    );
  }

  addTodo() {
    this.notification.error = ''; 
    this.todoService.addTodo(this.todo).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => { this.notification.error = error; }
    );
  }

  updateTodo(){
    this.notification.error = ''; 
    this.todoService.updateTodo(this.todo.id, this.todo).subscribe(
      data => {
        answer => { 
          this.todo = answer;
        }
        this.router.navigateByUrl('todo/index');
      },     
      error => { this.notification.error = error; }
    );
  }
}
