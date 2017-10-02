import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, User } from '../shared/services/contact.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactList: User[] = [];

  constructor(private router: Router, public contactService: ContactService, public snackBar: MdSnackBar) { }

  ngOnInit() {
      this.loadContacts();
  }
 
  loadContacts(){
    this.contactService.getContacts().subscribe(
      data => {this.contactList = data;},
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
  }

  removeContact(contactId: string) {
    this.contactService.removeContact(contactId).subscribe(
      data => { 
        this.router.navigateByUrl('contact/index');  
        this.loadContacts(); 
      },
      error => { this.snackBar.open(error, 'Schließen', {
        duration: 5000,
      }); }
    );
   
  }
}

