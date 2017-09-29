import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';                 
import { CommonModule }                             from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { UserService } from './shared/services/user.service';
import { User_TodoService } from './shared/services/user_todo.service';
import { TodoService } from './shared/services/todo.service';
import { ContactService} from './shared/services/contact.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdInputModule, MdTextareaAutosize } from '@angular/material';
import { MatGridListModule} from '@angular/material';
import { MatSelectModule} from '@angular/material';
import { RegistrationComponent } from './registration/registration.component';
import { LogoutComponent } from './logout/logout.component';
import { TodoComponent } from './todo/todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TestComponent } from './test/test.component';
import { ContactListComponent } from './contact-list/contact-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    LogoutComponent,
    TodoComponent,
    TodoListComponent,
    ContactsComponent,
    TestComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    MdInputModule,
    MatGridListModule,
    MatSelectModule,
    FormsModule,
    HttpModule
  ],
  providers: [UserService, TodoService, ContactService, User_TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
