import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactListComponent } from './contact-list/contact-list.component';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'todo/todoId/:todoId', component: TodoComponent },
  { path: 'todo/index', component: TodoListComponent },
  { path: 'contact/contactId/:contactId', component: ContactsComponent },
  { path: 'contact/index', component: ContactListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }