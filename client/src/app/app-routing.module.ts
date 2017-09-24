import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LogoutComponent } from './logout/logout.component';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent} from './todo-list/todo-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TestComponent } from './test/test.component';

const routes = [
      { path: '', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'todo/todoId/:todoId', component: TodoComponent },
      { path: 'todo/index', component: TodoListComponent },
      { path: 'contact/contactId/:contactId', component: ContactsComponent},
      { path: 'a', component: TestComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }