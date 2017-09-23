import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  notification = { error: '' };


  constructor() { 
    
  }

  ngOnInit() {
    this.notification.error = '';
  }

}
