import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../shared/services/todo.service';
import { ContactService, User } from '../shared/services/contact.service';
import { NgIf, NgFor } from '@angular/common'

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  contactList: User[] = [];
  notification = { error: '' };

  constructor(public todoService: TodoService, public contactService: ContactService) { }
  
    ngOnInit() {
      this.notification.error = '';
      this.loadTodos();
      this.loadContacts();
    }
  
    loadTodos() {
      this.todoService.getTodos().subscribe(
        todos => { this.todos = todos; },
        error => { this.notification.error = error; }
      );
    }

    loadContacts(){
      this.contactService.getContacts().subscribe(
        data => {this.contactList = data; },
        error => {this.notification.error = error}
      );
    }
}
