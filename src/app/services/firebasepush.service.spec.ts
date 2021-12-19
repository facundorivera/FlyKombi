import { TestBed } from '@angular/core/testing';

import { FirebasepushService } from './firebasepush.service';

describe('FirebasepushService', () => {
  let service: FirebasepushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebasepushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
