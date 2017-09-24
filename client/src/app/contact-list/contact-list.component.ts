import { Component, OnInit } from '@angular/core';
import { ContactService, Contact } from '../shared/services/contact.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactList: Contact[] = [];
  notification = { error: '' };

  constructor(public contactService: ContactService) { }

   ngOnInit() {
      this.notification.error = '';
      this.loadContacts();
    }

  loadContacts(){
    this.contactService.getContacts().subscribe(
      data => {this.contactList = data ; console.log(data)},
      error => {this.notification.error = error}
    );
  }

}
