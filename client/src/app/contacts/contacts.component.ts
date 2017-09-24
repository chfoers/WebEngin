import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, Contact } from '../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  notification = { error: '' };
  contactEmail = '';


  constructor(private router: Router, public contactService: ContactService) { 
    
  }

  ngOnInit() {
    this.notification.error = '';
  }

 addContact() {
    this.notification.error = '';
    this.contactService.addContact(this.contactEmail).subscribe(
      data => { this.router.navigateByUrl('contact/index');  },
      error => { this.notification.error = error; }
    );
  }

}
