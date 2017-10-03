import { TestBed, inject } from '@angular/core/testing';

import { User_TodoService } from './user_todo.service';

describe('TodoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [User_TodoService]
    });
  });

  it('should be created', inject([User_TodoService], (service: User_TodoService) => {
    expect(service).toBeTruthy();
  }));
});
