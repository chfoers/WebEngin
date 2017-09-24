import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { TodoService, User_Todo, Todo } from '../shared/services/todo.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  user_todo: User_Todo = { userId: '', todoId: ''}

  constructor(private router: Router, private todoService: TodoService) { }
  
    todoToUser() {
      this.todoService.todoToUser(this.user_todo).subscribe(
        data => { this.router.navigateByUrl('logout'); },
        error => {  }
      );
    }

}
