import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService, Todo } from '../shared/services/todo.service';
import { ContactService, User } from '../shared/services/contact.service';
import { UserService } from '../shared/services/user.service';
import { User_TodoService, User_Todo } from '../shared/services/user_todo.service';
import { NgIf, NgFor } from '@angular/common';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})



export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  contactList: User[] = [];
  me: User;
  user_todo: User_Todo = {todoId: '', userId: ''};

  constructor(private router: Router, public todoService: TodoService, public contactService: ContactService, public userService: UserService, public user_todoService: User_TodoService, public snackBar: MdSnackBar) { 

  }
  

    ngOnInit() {
      this.loadMe();
      this.loadTodos();
      this.loadContacts();
    }
  
    loadTodos() {
      this.todoService.getTodos().subscribe(
        todos => { 
          this.todos = todos;
                    todos.forEach(todo => {
                      todo.owner = this.me.userId;
                    }); 
                  },
                  error => { this.snackBar.open(error, 'Schließen', {
                    duration: 5000,
                  }); }
      );
    }

    removeTodo(todoId: string) {
      this.todoService.removeTodo(todoId).subscribe(
        data => { 
          this.router.navigateByUrl('todo/index'); 
          this.loadTodos();      
        },
        error => { this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        }); }
      );
    }

    loadContacts(){
      this.contactService.getContacts().subscribe(
        data => {this.contactList = data; },
        error => { this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        }); }
      );
    }

    loadMe(){
      this.userService.getMe().subscribe(
        data => {this.me = data; },
        error => { this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        }); }
      );
    }

    update(){
    this.todos.forEach(todo => {
      if (todo.owner != this.me.userId){
        this.user_todo.todoId = todo.id
        this.user_todo.userId = todo.owner
        this.user_todoService.updateUserTodo(this.user_todo).subscribe(
          todos => { this.todos = todos;
                    todos.forEach(todo => {
                      todo.owner = this.me.userId;
                    }); 
                  },
                  error => { this.snackBar.open(error, 'Schließen', {
                    duration: 5000,
                  }); }
        );
      }
    });
  }
}
