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
  // Liste aller Kontakte des aktuellen Users
  contactList: User[] = [];

  constructor(private router: Router, public contactService: ContactService, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.loadContacts();
  }

  // Methode zum Laden aller Kontakte des aktuellen Users
  loadContacts() {
    this.contactService.getContacts().subscribe(
      data => { this.contactList = data; },
      error => {
        this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        });
      }
    );
  }

  // Methode zum Löschen einen einzelenen Kontakts
  removeContact(contactId: string) {
    this.contactService.removeContact(contactId).subscribe(
      data => {
        this.router.navigateByUrl('contact/index');
        this.loadContacts();
      },
      error => {
        this.snackBar.open(error, 'Schließen', {
          duration: 5000,
        });
      }
    );

  }
}

