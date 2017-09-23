import { Component, OnInit } from '@angular/core';

import { ContactService, Contact } from '../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  notification = { error: '' };
  contactEmail = '';


  constructor(public contactService: ContactService) { 
    
  }

  ngOnInit() {
    this.notification.error = '';
  }

 addContact() {
    this.notification.error = '';
    this.contactService.addContact(this.contactEmail).subscribe(
      data => {}, //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      error => { this.notification.error = error; }
    );
  }
}
