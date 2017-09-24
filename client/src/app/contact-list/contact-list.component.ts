import { Component, OnInit } from '@angular/core';
import { ContactService, User } from '../shared/services/contact.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactList: User[] = [];
  notification = { error: '' };

  constructor(public contactService: ContactService) { }

   ngOnInit() {
      this.notification.error = '';
      this.loadContacts();
    }

  loadContacts(){
    this.contactService.getContacts().subscribe(
      data => {this.contactList = data; console.log(this.contactList)},
      error => {this.notification.error = error}
    );
  }

}
