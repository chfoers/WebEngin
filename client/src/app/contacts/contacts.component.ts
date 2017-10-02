import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService, Contact } from '../shared/services/contact.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contact: Contact = { ownerId: '', contactId: '', name: '', email: ''};
  isNew = true;


  constructor(private router: Router, private route: ActivatedRoute,  public contactService: ContactService, public snackBar: MdSnackBar) { 
    
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
    if(this.contact.contactId != 'newContact'){
      this.isNew = false;
      this.contactService.getContact(this.contact.contactId).subscribe(
        answer => { 
          this.contact.email = answer[0].email;
          this.contact.name = answer[0].name;
        },
        error => { this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        }); }
      );
    } else {
      this.isNew = true;
    }
  }

 addContact() {
    this.contactService.addContact(this.contact.email).subscribe(
      data => { this.router.navigateByUrl('contact/index');  },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }

  removeContact() {
    this.contactService.removeContact(this.contact.contactId).subscribe(
      data => { this.router.navigateByUrl('contact/index'); },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }
}
