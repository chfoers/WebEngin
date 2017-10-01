import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService, Contact } from '../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  notification = { error: '' };
  contact: Contact = { ownerId: '', contactId: '', name: '', email: ''};
  isNew = true;


  constructor(private router: Router, private route: ActivatedRoute,  public contactService: ContactService) { 
    
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.contact.contactId = params['contactId'];
        this.loadContact();
      }
    );
  }

  loadContact() {
    this.notification.error = '';
    if(this.contact.contactId != 'newContact'){
      this.isNew = false;
      this.contactService.getContact(this.contact.contactId).subscribe(
        answer => { 
          this.contact.email = answer[0].email;
          this.contact.name = answer[0].name;
        },
        error => { this.notification.error = error; }
      );
    } else {
      this.isNew = true;
    }
  }

 addContact() {
    this.notification.error = '';
    this.contactService.addContact(this.contact.email).subscribe(
      data => { this.router.navigateByUrl('contact/index');  },
      error => { this.notification.error = error; }
    );
  }

  removeContact() {
    this.notification.error = '';
    this.contactService.removeContact(this.contact.contactId).subscribe(
      data => { this.router.navigateByUrl('contact/index'); },
      error => { this.notification.error = error; }
    );
  }
}
