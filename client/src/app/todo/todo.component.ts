import { Component } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent{
  todo: Todo = { title: '', text: '', id: '', owner: ''}
  isNew = true;

  constructor(private todoService: TodoService, private route: ActivatedRoute, private router: Router, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.todo.id = params['todoId'];
        this.loadTodo();
      }
    );
  }

  loadTodo() {
    if(this.todo.id != 'newTodo'){
      this.isNew = false;
      this.todoService.getTodo(this.todo.id).subscribe(
        answer => { 
          this.todo.text = answer.text;
          this.todo.title = answer.title;
        },
        error => { this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        }); }
      );
    } else {
      this.isNew = true;
    }
  } 

  addTodo() { 
    this.todoService.addTodo(this.todo).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }

  updateTodo(){
    this.todoService.updateTodo(this.todo.id, this.todo).subscribe(
      data => {
        answer => { 
          this.todo = answer;
        }
        this.router.navigateByUrl('todo/index');
      },     
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }

  removeTodo() {
    this.todoService.removeTodo(this.todo.id).subscribe(
      data => { this.router.navigateByUrl('todo/index'); },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }
}
