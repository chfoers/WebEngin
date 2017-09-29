import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, User } from '../shared/services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactList: User[] = [];
  notification = { error: '' };

  constructor(private router: Router, public contactService: ContactService) { }

  ngOnInit() {
      this.notification.error = '';
      this.loadContacts();
  }

  
  loadContacts(){
    this.contactService.getContacts().subscribe(
      data => {this.contactList = data;},
      error => {this.notification.error = error}
    );
  }

}

